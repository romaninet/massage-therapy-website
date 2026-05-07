import { describe, it, expect, vi, beforeEach } from 'vitest'

let showBookingsService: boolean = true
let showBookingsAdmin: boolean = true

vi.mock('@/lib/config', () => ({
  get BOOKING() {
    return {
      showBookingsService,
      showBookingsAdmin,
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
  getEvent: vi.fn(),
  updateEvent: vi.fn(),
  createEvent: vi.fn(),
}))

vi.mock('@/lib/bookingEmails', () => ({
  sendBookingRequestEmail: vi.fn(),
  sendBookingConfirmationEmail: vi.fn(),
  sendBookingDeclineEmail: vi.fn(),
}))

vi.mock('@/lib/bookingTokens', () => ({
  signToken: vi.fn((id: string) => `valid-sig-${id}`),
  verifyToken: vi.fn(),
}))

import { GET } from './route'
import { listEventsForDate, getEvent, updateEvent, createEvent } from '@/lib/googleCalendar'
import { sendBookingConfirmationEmail } from '@/lib/bookingEmails'
import { verifyToken } from '@/lib/bookingTokens'

const EVENT_ID = 'event-abc-123'
const SESSION_START = new Date('2099-06-01T10:00:00.000Z')
const SESSION_END = new Date('2099-06-01T11:00:00.000Z')

const pendingEventDescription = JSON.stringify({
  serviceKey: 'therapeutic',
  serviceName: 'Therapeutic Massage',
  durationMinutes: 60,
  startTime: SESSION_START.toISOString(),
  endTime: SESSION_END.toISOString(),
  breakStart: SESSION_END.toISOString(),
  breakEnd: new Date(SESSION_END.getTime() + 30 * 60 * 1000).toISOString(),
  clientName: 'Jane Doe',
  clientEmail: 'jane@example.com',
  clientPhone: '613-555-0100',
})

const pendingEvent = {
  id: EVENT_ID,
  title: `[PENDING] Therapeutic Massage 60min — Jane Doe`,
  start: SESSION_START,
  end: SESSION_END,
  description: pendingEventDescription,
}

function makeRequest(eventId: string, sig: string) {
  return new Request(
    `http://localhost/api/booking/confirm?eventId=${encodeURIComponent(eventId)}&sig=${encodeURIComponent(sig)}`,
  )
}

describe('GET /api/booking/confirm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    showBookingsService = true
    showBookingsAdmin = true
    vi.mocked(verifyToken).mockReturnValue(true)
    vi.mocked(getEvent).mockResolvedValue(pendingEvent)
    vi.mocked(listEventsForDate).mockResolvedValue([pendingEvent])
    vi.mocked(updateEvent).mockResolvedValue(undefined)
    vi.mocked(createEvent).mockResolvedValue('break-event-id')
    vi.mocked(sendBookingConfirmationEmail).mockResolvedValue(undefined)
  })

  it('1. Valid sig, no conflict → 200, event updated to CONFIRMED, break created, confirmation email sent', async () => {
    const res = await GET(makeRequest(EVENT_ID, 'valid-sig'))
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toContain('text/html')

    expect(updateEvent).toHaveBeenCalledWith(
      EVENT_ID,
      expect.objectContaining({
        title: expect.stringContaining('[CONFIRMED]'),
        colorId: '10',
      }),
    )
    expect(createEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        title: '[BREAK]',
        colorId: '3',
      }),
    )

    // Verify [BREAK] event description contains linkedEventId
    const createEventCall = vi.mocked(createEvent).mock.calls[0]?.[0]
    const breakDescription = createEventCall?.description ? JSON.parse(String(createEventCall.description)) : null
    expect(breakDescription?.linkedEventId).toBe(EVENT_ID)

    expect(sendBookingConfirmationEmail).toHaveBeenCalledOnce()
  })

  it('2. Invalid HMAC sig → 400', async () => {
    vi.mocked(verifyToken).mockReturnValue(false)
    const res = await GET(makeRequest(EVENT_ID, 'bad-sig'))
    expect(res.status).toBe(400)
    const data = JSON.parse(await res.text())
    expect(data.error).toBe('invalid_signature')
  })

  it('3. eventId not found → 404', async () => {
    vi.mocked(getEvent).mockResolvedValue(null)
    const res = await GET(makeRequest(EVENT_ID, 'valid-sig'))
    expect(res.status).toBe(404)
    const data = JSON.parse(await res.text())
    expect(data.error).toBe('event_not_found')
  })

  it('4. Event already CONFIRMED (not PENDING) → 409 already_handled', async () => {
    vi.mocked(getEvent).mockResolvedValue({
      ...pendingEvent,
      title: '[CONFIRMED] Therapeutic Massage 60min — Jane Doe',
    })
    const res = await GET(makeRequest(EVENT_ID, 'valid-sig'))
    expect(res.status).toBe(409)
    const data = JSON.parse(await res.text())
    expect(data.error).toBe('already_handled')
  })

  it('5. Slot conflict on re-check → 409 slot_conflict', async () => {
    const conflictEvent = {
      id: 'other-event',
      title: '[CONFIRMED] Deep Tissue 60min — Bob',
      start: new Date('2099-06-01T10:30:00.000Z'),
      end: new Date('2099-06-01T11:30:00.000Z'),
      description: '',
    }
    vi.mocked(listEventsForDate).mockResolvedValue([pendingEvent, conflictEvent])

    const res = await GET(makeRequest(EVENT_ID, 'valid-sig'))
    expect(res.status).toBe(409)
    const data = JSON.parse(await res.text())
    expect(data.error).toBe('slot_conflict')
  })

  it('6. Break event created with correct duration (BOOKING.breakAfterSession = 30 min)', async () => {
    await GET(makeRequest(EVENT_ID, 'valid-sig'))

    expect(createEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        title: '[BREAK]',
        start: SESSION_END,
        end: new Date(SESSION_END.getTime() + 30 * 60 * 1000),
      }),
    )
  })
})
