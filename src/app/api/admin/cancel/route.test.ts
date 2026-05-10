import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

let mockShowBookingsAdmin = true

vi.mock('next-auth', () => ({
  default: vi.fn(),
  getServerSession: vi.fn(),
}))

vi.mock('@/lib/googleCalendar', () => ({
  getEvent: vi.fn(),
  deleteEvent: vi.fn(),
  listEventsForDate: vi.fn(),
}))

vi.mock('@/lib/bookingEmails', () => ({
  sendBookingCancellationEmail: vi.fn(),
}))

vi.mock('@/lib/config', () => ({
  get BOOKING() {
    return {
      showBookingsAdmin: mockShowBookingsAdmin,
      adminEmail: 'shelestwellness@gmail.com',
      eventTitles: { pending: '[PENDING]', confirmed: '[CONFIRMED]', break: '[BREAK]' },
    }
  },
}))

import { getServerSession } from 'next-auth'
import { getEvent, deleteEvent, listEventsForDate } from '@/lib/googleCalendar'
import { sendBookingCancellationEmail } from '@/lib/bookingEmails'
import { POST } from './route'
import { ADMIN_SESSION, MOCK_BOOKING_DESCRIPTION, BOOKING_SESSION_START, BOOKING_SESSION_END, BOOKING_BREAK_END } from '@/test/fixtures'

const mockGetServerSession = vi.mocked(getServerSession)
const mockGetEvent = vi.mocked(getEvent)
const mockDeleteEvent = vi.mocked(deleteEvent)
const mockListEventsForDate = vi.mocked(listEventsForDate)
const mockSendCancellationEmail = vi.mocked(sendBookingCancellationEmail)

beforeEach(() => {
  vi.clearAllMocks()
  mockShowBookingsAdmin = true
})

afterEach(() => {
  mockShowBookingsAdmin = true
})

const confirmedEvent = {
  id: 'evt-confirmed',
  title: '[CONFIRMED] Deep Tissue Massage — Jane Doe',
  start: BOOKING_SESSION_START,
  end: BOOKING_SESSION_END,
  description: MOCK_BOOKING_DESCRIPTION,
}

const breakEvent = {
  id: 'evt-break',
  title: '[BREAK]',
  start: BOOKING_SESSION_END,
  end: BOOKING_BREAK_END,
  description: JSON.stringify({ linkedEventId: 'evt-confirmed' }),
}

describe('POST /api/admin/cancel', () => {
  it('cancels confirmed booking: deletes event and break, sends cancellation email', async () => {
    mockGetServerSession.mockResolvedValue(ADMIN_SESSION)
    mockGetEvent.mockResolvedValue(confirmedEvent)
    mockDeleteEvent.mockResolvedValue(undefined)
    mockListEventsForDate.mockResolvedValue([confirmedEvent, breakEvent])
    mockSendCancellationEmail.mockResolvedValue(undefined)

    const req = new NextRequest('http://localhost/api/admin/cancel', {
      method: 'POST',
      body: JSON.stringify({ eventId: 'evt-confirmed' }),
    })

    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(mockDeleteEvent).toHaveBeenCalledWith('evt-confirmed')
    expect(mockDeleteEvent).toHaveBeenCalledWith('evt-break')
    expect(mockSendCancellationEmail).toHaveBeenCalledOnce()
  })

  it('returns 401 when not authenticated', async () => {
    mockGetServerSession.mockResolvedValue(null)

    const req = new NextRequest('http://localhost/api/admin/cancel', {
      method: 'POST',
      body: JSON.stringify({ eventId: 'evt-confirmed' }),
    })

    const res = await POST(req)
    expect(res.status).toBe(401)
    expect(mockDeleteEvent).not.toHaveBeenCalled()
  })

  it('returns 403 when authenticated as non-admin', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { email: 'other@example.com' },
      expires: '',
    })

    const req = new NextRequest('http://localhost/api/admin/cancel', {
      method: 'POST',
      body: JSON.stringify({ eventId: 'evt-confirmed' }),
    })

    const res = await POST(req)
    // requireAdminSession returns unauthorized=true for non-admin, which maps to 401
    expect(res.status).toBe(401)
    expect(mockDeleteEvent).not.toHaveBeenCalled()
  })

  it('returns 404 when eventId not found', async () => {
    mockGetServerSession.mockResolvedValue(ADMIN_SESSION)
    mockGetEvent.mockResolvedValue(null)

    const req = new NextRequest('http://localhost/api/admin/cancel', {
      method: 'POST',
      body: JSON.stringify({ eventId: 'evt-missing' }),
    })

    const res = await POST(req)
    expect(res.status).toBe(404)
    expect(mockDeleteEvent).not.toHaveBeenCalled()
  })

  it('returns 503 when showBookingsAdmin=false', async () => {
    mockShowBookingsAdmin = false
    mockGetServerSession.mockResolvedValue(ADMIN_SESSION)

    const req = new NextRequest('http://localhost/api/admin/cancel', {
      method: 'POST',
      body: JSON.stringify({ eventId: 'evt-confirmed' }),
    })

    const res = await POST(req)
    expect(res.status).toBe(503)
    expect(mockDeleteEvent).not.toHaveBeenCalled()
  })

  it('returns 403 when Origin header does not match allowed origin (CSRF)', async () => {
    mockGetServerSession.mockResolvedValue(ADMIN_SESSION)

    const req = new NextRequest('http://localhost/api/admin/cancel', {
      method: 'POST',
      body: JSON.stringify({ eventId: 'evt-confirmed' }),
      headers: { Origin: 'https://evil.com' },
    })

    const res = await POST(req)
    expect(res.status).toBe(403)
    expect(mockDeleteEvent).not.toHaveBeenCalled()
  })

  it('returns 400 with not_confirmed error when event title does NOT start with [CONFIRMED]', async () => {
    mockGetServerSession.mockResolvedValue(ADMIN_SESSION)

    const pendingEvent = {
      id: 'evt-pending',
      title: '[PENDING] Deep Tissue Massage — Jane Doe',
      start: BOOKING_SESSION_START,
      end: BOOKING_SESSION_END,
      description: MOCK_BOOKING_DESCRIPTION,
    }

    mockGetEvent.mockResolvedValue(pendingEvent)

    const req = new NextRequest('http://localhost/api/admin/cancel', {
      method: 'POST',
      body: JSON.stringify({ eventId: 'evt-pending' }),
    })

    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.error).toBe('not_confirmed')
    expect(mockDeleteEvent).not.toHaveBeenCalled()
  })
})
