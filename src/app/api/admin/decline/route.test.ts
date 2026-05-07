import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

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
  BOOKING: {
    showBookingsAdmin: true,
    adminEmail: 'shelestwellness@gmail.com',
  },
}))

import { getServerSession } from 'next-auth'
import { getEvent, deleteEvent } from '@/lib/googleCalendar'
import { sendBookingDeclineEmail } from '@/lib/bookingEmails'
import { POST } from './route'

const mockGetServerSession = vi.mocked(getServerSession)
const mockGetEvent = vi.mocked(getEvent)
const mockDeleteEvent = vi.mocked(deleteEvent)
const mockSendDeclineEmail = vi.mocked(sendBookingDeclineEmail)

beforeEach(() => {
  vi.clearAllMocks()
})

const ADMIN_SESSION = { user: { email: 'shelestwellness@gmail.com' }, expires: '' }

const bookingDescription = JSON.stringify({
  clientName: 'Jane Doe',
  clientEmail: 'jane@example.com',
  clientPhone: '613-555-1234',
  serviceKey: 'deepTissue',
  serviceName: 'Deep Tissue Massage',
  durationMinutes: 60,
  sessionStart: '2026-05-10T14:00:00.000Z',
  sessionEnd: '2026-05-10T15:00:00.000Z',
  breakStart: '2026-05-10T15:00:00.000Z',
  breakEnd: '2026-05-10T15:30:00.000Z',
})

const pendingEvent = {
  id: 'evt-pending',
  title: '[PENDING] Deep Tissue Massage — Jane Doe',
  start: new Date('2026-05-10T14:00:00.000Z'),
  end: new Date('2026-05-10T15:00:00.000Z'),
  description: bookingDescription,
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
})
