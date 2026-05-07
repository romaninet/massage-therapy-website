import { describe, it, expect, vi, beforeEach } from 'vitest'

let showBookingsService: boolean = true

vi.mock('@/lib/config', () => ({
  get BOOKING() {
    return {
      showBookingsService,
      breakAfterSession: 30,
      slotInterval: 30,
      calendarColors: { pending: '5', confirmed: '10', break: '3' },
      availabilityEventTitle: 'available for massage',
      adminEmail: 'admin@example.com',
    }
  },
  SERVICES: [
    {
      key: 'therapeutic',
      title: { en: 'Therapeutic Massage', fr: 'Massage thérapeutique' },
      tiers: [{ duration: '60 min', price: 110 }, { duration: '90 min', price: 150 }],
    },
  ],
}))

vi.mock('@/lib/googleCalendar', () => ({
  listEventsForDate: vi.fn(),
  listEventsInRange: vi.fn(),
  createEvent: vi.fn(),
}))

vi.mock('@/lib/bookingEmails', () => ({
  sendBookingRequestEmail: vi.fn(),
  sendBookingConfirmationEmail: vi.fn(),
  sendBookingDeclineEmail: vi.fn(),
  sendBotAlertEmail: vi.fn(),
}))

vi.mock('@/lib/bookingSlots', () => ({
  getAvailableSlots: vi.fn(),
}))

import { POST } from './route'
import { listEventsForDate, listEventsInRange, createEvent } from '@/lib/googleCalendar'
import { getAvailableSlots } from '@/lib/bookingSlots'
import { sendBookingRequestEmail, sendBotAlertEmail } from '@/lib/bookingEmails'

const FUTURE_START = '2099-06-01T10:00:00.000Z'
const FUTURE_DATE = '2099-06-01'

const validBody = {
  date: FUTURE_DATE,
  service: 'therapeutic',
  duration: 60,
  startTime: FUTURE_START,
  clientName: 'Jane Doe',
  clientEmail: 'jane@example.com',
  clientPhone: '613-555-0100',
  _hp: '',
  _t: Date.now() - 10000,
}

function makeRequest(body: unknown) {
  return new Request('http://localhost/api/booking/request', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('POST /api/booking/request', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    showBookingsService = true
    vi.mocked(listEventsForDate).mockResolvedValue([])
    vi.mocked(listEventsInRange).mockResolvedValue([])
    vi.mocked(getAvailableSlots).mockReturnValue([new Date(FUTURE_START)])
    vi.mocked(createEvent).mockResolvedValue('event-123')
    vi.mocked(sendBookingRequestEmail).mockResolvedValue(undefined)
    vi.mocked(sendBotAlertEmail).mockResolvedValue(undefined)
  })

  it('1. Valid request, slot available → 200, calendar event created, email sent', async () => {
    const res = await POST(makeRequest(validBody))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.success).toBe(true)
    expect(createEvent).toHaveBeenCalledOnce()
    expect(createEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        title: expect.stringContaining('[PENDING]'),
        colorId: '5',
      }),
    )
    expect(sendBookingRequestEmail).toHaveBeenCalledOnce()
  })

  it('2. Missing clientName → 400', async () => {
    const { clientName: _, ...body } = validBody
    const res = await POST(makeRequest(body))
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('missing_fields')
  })

  it('3. Invalid service key → 400', async () => {
    const res = await POST(makeRequest({ ...validBody, service: 'nonexistent' }))
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('invalid_service')
  })

  it('4. Slot no longer available → 409 slot_taken', async () => {
    vi.mocked(getAvailableSlots).mockReturnValue([]) // no slots available

    const res = await POST(makeRequest(validBody))
    expect(res.status).toBe(409)
    const data = await res.json()
    expect(data.error).toBe('slot_taken')
  })

  it('5. Invalid email format → 400', async () => {
    const res = await POST(makeRequest({ ...validBody, clientEmail: 'not-an-email' }))
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('invalid_email')
  })

  it('6. Invalid duration for service → 400', async () => {
    const res = await POST(makeRequest({ ...validBody, duration: 45 }))
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('invalid_duration')
  })

  it('7. showBookingsService=false → 503', async () => {
    showBookingsService = false
    const res = await POST(makeRequest(validBody))
    expect(res.status).toBe(503)
  })

  it('8. Honeypot field filled → 400 bot_detected, alert email sent', async () => {
    const res = await POST(makeRequest({ ...validBody, _hp: 'http://spam.com' }))
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('bot_detected')
    expect(vi.mocked(sendBotAlertEmail).mock.calls[0]?.[0]).toBe('honeypot')
  })

  it('9. Form submitted too fast (< 4 s) → 400 bot_detected, alert email sent', async () => {
    const res = await POST(makeRequest({ ...validBody, _t: Date.now() - 1000 }))
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('bot_detected')
    expect(vi.mocked(sendBotAlertEmail).mock.calls[0]?.[0]).toBe('timing')
  })

  it('10. Same email already has 3 pending bookings → 400 too_many_pending', async () => {
    const pendingEvents = Array.from({ length: 3 }, (_, i) => ({
      id: `pending-${i}`,
      title: '[PENDING] Therapeutic Massage 60min — Jane Doe',
      start: new Date(FUTURE_START),
      end: new Date(FUTURE_START),
      description: JSON.stringify({ clientEmail: 'jane@example.com' }),
    }))
    vi.mocked(listEventsInRange).mockResolvedValue(pendingEvents)

    const res = await POST(makeRequest(validBody))
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('too_many_pending')
  })

  it('11. Same email has 2 pending bookings → allowed (below threshold)', async () => {
    const pendingEvents = Array.from({ length: 2 }, (_, i) => ({
      id: `pending-${i}`,
      title: '[PENDING] Therapeutic Massage 60min — Jane Doe',
      start: new Date(FUTURE_START),
      end: new Date(FUTURE_START),
      description: JSON.stringify({ clientEmail: 'jane@example.com' }),
    }))
    vi.mocked(listEventsInRange).mockResolvedValue(pendingEvents)

    const res = await POST(makeRequest(validBody))
    expect(res.status).toBe(200)
  })
})
