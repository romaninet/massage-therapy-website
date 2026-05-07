import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Must be hoisted before imports
vi.mock('next-auth', () => ({
  default: vi.fn(),
  getServerSession: vi.fn(),
}))

vi.mock('@/lib/googleCalendar', () => ({
  listEventsForDate: vi.fn(),
}))

vi.mock('@/lib/config', () => ({
  BOOKING: {
    showBookingsAdmin: true,
    adminEmail: 'shelestwellness@gmail.com',
  },
}))

vi.mock('@/lib/adminAuth', () => ({
  requireAdminSession: vi.fn(),
}))

import { getServerSession } from 'next-auth'
import { listEventsForDate } from '@/lib/googleCalendar'
import { requireAdminSession } from '@/lib/adminAuth'
import { BOOKING } from '@/lib/config'
import { GET } from './route'

const mockGetServerSession = vi.mocked(getServerSession)
const mockListEventsForDate = vi.mocked(listEventsForDate)
const mockRequireAdminSession = vi.mocked(requireAdminSession)

beforeEach(() => {
  vi.clearAllMocks()
  // Default: authorized
  mockRequireAdminSession.mockResolvedValue({ authorized: true })
})

const bookingDescription = JSON.stringify({
  clientName: 'Jane Doe',
  clientEmail: 'jane@example.com',
  clientPhone: '613-555-1234',
  clientNotes: 'First visit',
  serviceKey: 'deepTissue',
  serviceName: 'Deep Tissue Massage',
  durationMinutes: 60,
  sessionStart: '2026-05-10T14:00:00.000Z',
  sessionEnd: '2026-05-10T15:00:00.000Z',
  breakStart: '2026-05-10T15:00:00.000Z',
  breakEnd: '2026-05-10T15:30:00.000Z',
})

describe('GET /api/admin/bookings', () => {
  it('returns bookings for authenticated admin with view=future', async () => {
    mockRequireAdminSession.mockResolvedValue({ authorized: true })
    mockListEventsForDate.mockResolvedValue([
      {
        id: 'evt-1',
        title: '[CONFIRMED] Deep Tissue Massage — Jane Doe',
        start: new Date('2026-05-10T14:00:00.000Z'),
        end: new Date('2026-05-10T15:00:00.000Z'),
        description: bookingDescription,
      },
    ])

    const req = new NextRequest('http://localhost/api/admin/bookings?view=future')
    const res = await GET(req)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.bookings).toBeInstanceOf(Array)
    expect(data.bookings[0].clientName).toBe('Jane Doe')
    expect(data.bookings[0].status).toBe('confirmed')
  })

  it('returns 401 when not authenticated', async () => {
    mockRequireAdminSession.mockResolvedValue({ authorized: false })
    mockListEventsForDate.mockResolvedValue([])

    const req = new NextRequest('http://localhost/api/admin/bookings?view=future')
    const res = await GET(req)

    expect(res.status).toBe(401)
  })

  it('returns 503 when showBookingsAdmin is false', async () => {
    // Override the BOOKING config flag
    const bookingMod = await import('@/lib/config')
    vi.spyOn(bookingMod, 'BOOKING', 'get').mockReturnValue({
      ...BOOKING,
      showBookingsAdmin: false,
    } as typeof BOOKING)

    mockRequireAdminSession.mockResolvedValue({ authorized: true })
    mockListEventsForDate.mockResolvedValue([])

    const req = new NextRequest('http://localhost/api/admin/bookings?view=future')
    const res = await GET(req)

    expect(res.status).toBe(503)
  })
})
