import { describe, it, expect, vi, beforeEach } from 'vitest'

let showBookingsService: boolean = true

vi.mock('@/lib/config', async () => {
  const { MOCK_BOOKING_BASE, MOCK_SERVICES } = await import('@/test/mockConfig')
  return {
    get BOOKING() { return { ...MOCK_BOOKING_BASE, showBookingsService } },
    SERVICES: MOCK_SERVICES,
  }
})

vi.mock('@/lib/googleCalendar', () => ({
  listEventsForDate: vi.fn(),
}))

vi.mock('@/lib/bookingEmails', () => ({
  sendBookingRequestEmail: vi.fn(),
  sendBookingConfirmationEmail: vi.fn(),
  sendBookingDeclineEmail: vi.fn(),
}))

vi.mock('@/lib/bookingSlots', () => ({
  getAvailableSlots: vi.fn(),
}))

import { GET } from './route'
import { listEventsForDate } from '@/lib/googleCalendar'
import { getAvailableSlots } from '@/lib/bookingSlots'

const FUTURE_DATE = '2099-06-01'

describe('GET /api/booking/slots', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    showBookingsService = true
  })

  it('1. Valid params → 200 with slots array', async () => {
    const slot = new Date('2099-06-01T10:00:00.000Z')
    vi.mocked(listEventsForDate).mockResolvedValue([])
    vi.mocked(getAvailableSlots).mockReturnValue([slot])

    const req = new Request(
      `http://localhost/api/booking/slots?date=${FUTURE_DATE}&service=therapeutic&duration=60`,
    )
    const res = await GET(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.slots).toEqual([{ time: expect.any(String), iso: slot.toISOString(), available: true }])
  })

  it('2. Past date → 400', async () => {
    const req = new Request(
      'http://localhost/api/booking/slots?date=2020-01-01&service=therapeutic&duration=60',
    )
    const res = await GET(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('date_in_past')
  })

  it('3. Unknown service key → 400', async () => {
    const req = new Request(
      `http://localhost/api/booking/slots?date=${FUTURE_DATE}&service=unknown&duration=60`,
    )
    const res = await GET(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('invalid_service')
  })

  it('4. Invalid duration for service → 400', async () => {
    const req = new Request(
      `http://localhost/api/booking/slots?date=${FUTURE_DATE}&service=therapeutic&duration=45`,
    )
    const res = await GET(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('invalid_duration')
  })

  it('5. showBookingsService=false → 503', async () => {
    showBookingsService = false

    const req = new Request(
      `http://localhost/api/booking/slots?date=${FUTURE_DATE}&service=therapeutic&duration=60`,
    )
    const res = await GET(req)
    expect(res.status).toBe(503)
  })
})
