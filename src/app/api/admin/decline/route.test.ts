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
}))

vi.mock('@/lib/bookingEmails', () => ({
  sendBookingDeclineEmail: vi.fn(),
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
import { getEvent, deleteEvent } from '@/lib/googleCalendar'
import { sendBookingDeclineEmail } from '@/lib/bookingEmails'
import { POST } from './route'
import { ADMIN_SESSION, MOCK_BOOKING_DESCRIPTION, BOOKING_SESSION_START, BOOKING_SESSION_END } from '@/test/fixtures'

const mockGetServerSession = vi.mocked(getServerSession)
const mockGetEvent = vi.mocked(getEvent)
const mockDeleteEvent = vi.mocked(deleteEvent)
const mockSendDeclineEmail = vi.mocked(sendBookingDeclineEmail)

beforeEach(() => {
  vi.clearAllMocks()
  mockShowBookingsAdmin = true
})

afterEach(() => {
  mockShowBookingsAdmin = true
})

const pendingEvent = {
  id: 'evt-pending',
  title: '[PENDING] Deep Tissue Massage — Jane Doe',
  start: BOOKING_SESSION_START,
  end: BOOKING_SESSION_END,
  description: MOCK_BOOKING_DESCRIPTION,
}

describe('POST /api/admin/decline', () => {
  it('declines pending booking: deletes event and sends decline email', async () => {
    mockGetServerSession.mockResolvedValue(ADMIN_SESSION)
    mockGetEvent.mockResolvedValue(pendingEvent)
    mockDeleteEvent.mockResolvedValue(undefined)
    mockSendDeclineEmail.mockResolvedValue(undefined)

    const req = new NextRequest('http://localhost/api/admin/decline', {
      method: 'POST',
      body: JSON.stringify({ eventId: 'evt-pending' }),
    })

    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(mockDeleteEvent).toHaveBeenCalledWith('evt-pending')
    expect(mockSendDeclineEmail).toHaveBeenCalledOnce()
  })

  it('returns 401 when not authenticated', async () => {
    mockGetServerSession.mockResolvedValue(null)

    const req = new NextRequest('http://localhost/api/admin/decline', {
      method: 'POST',
      body: JSON.stringify({ eventId: 'evt-pending' }),
    })

    const res = await POST(req)
    expect(res.status).toBe(401)
    expect(mockDeleteEvent).not.toHaveBeenCalled()
  })

  it('returns 404 when eventId not found', async () => {
    mockGetServerSession.mockResolvedValue(ADMIN_SESSION)
    mockGetEvent.mockResolvedValue(null)

    const req = new NextRequest('http://localhost/api/admin/decline', {
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

    const req = new NextRequest('http://localhost/api/admin/decline', {
      method: 'POST',
      body: JSON.stringify({ eventId: 'evt-pending' }),
    })

    const res = await POST(req)
    expect(res.status).toBe(503)
    expect(mockDeleteEvent).not.toHaveBeenCalled()
  })

  it('returns 403 when Origin header does not match allowed origin (CSRF)', async () => {
    mockGetServerSession.mockResolvedValue(ADMIN_SESSION)

    const req = new NextRequest('http://localhost/api/admin/decline', {
      method: 'POST',
      body: JSON.stringify({ eventId: 'evt-pending' }),
      headers: { Origin: 'https://evil.com' },
    })

    const res = await POST(req)
    expect(res.status).toBe(403)
    expect(mockDeleteEvent).not.toHaveBeenCalled()
  })

  it('returns 400 with not_pending error when event title does NOT start with [PENDING]', async () => {
    mockGetServerSession.mockResolvedValue(ADMIN_SESSION)

    const confirmedEvent = {
      id: 'evt-confirmed',
      title: '[CONFIRMED] Deep Tissue Massage — Jane Doe',
      start: BOOKING_SESSION_START,
      end: BOOKING_SESSION_END,
      description: MOCK_BOOKING_DESCRIPTION,
    }

    mockGetEvent.mockResolvedValue(confirmedEvent)

    const req = new NextRequest('http://localhost/api/admin/decline', {
      method: 'POST',
      body: JSON.stringify({ eventId: 'evt-confirmed' }),
    })

    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.error).toBe('not_pending')
    expect(mockDeleteEvent).not.toHaveBeenCalled()
  })
})
