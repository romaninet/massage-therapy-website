import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('next-auth', () => ({
  default: vi.fn(),
  getServerSession: vi.fn(),
}))

vi.mock('@/lib/googleCalendar', () => ({
  listEventsInRange: vi.fn(),
}))

vi.mock('@/lib/config', () => ({
  BOOKING: {
    showBookingsAdmin: true,
    adminEmail: 'shelestwellness@gmail.com',
    eventTitles: {
      pending:   '[PENDING]',
      confirmed: '[CONFIRMED]',
      break:     '[BREAK]',
    },
  },
}))

vi.mock('@/lib/adminAuth', () => ({
  requireAdminSession: vi.fn(),
}))

import { listEventsInRange } from '@/lib/googleCalendar'
import { requireAdminSession } from '@/lib/adminAuth'
import { BOOKING } from '@/lib/config'
import { GET } from './route'

const mockListEventsInRange = vi.mocked(listEventsInRange)
const mockRequireAdminSession = vi.mocked(requireAdminSession)

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

beforeEach(() => {
  vi.clearAllMocks()
  mockRequireAdminSession.mockResolvedValue({ authorized: true })
})

describe('GET /api/admin/bookings', () => {
  it('returns confirmed bookings for view=future (single listEventsInRange call)', async () => {
    mockListEventsInRange.mockResolvedValue([
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
    expect(mockListEventsInRange).toHaveBeenCalledTimes(1)
    expect(data.bookings).toHaveLength(1)
    expect(data.bookings[0].clientName).toBe('Jane Doe')
    expect(data.bookings[0].status).toBe('confirmed')
  })

  it('returns pending bookings for view=future', async () => {
    mockListEventsInRange.mockResolvedValue([
      {
        id: 'evt-2',
        title: '[PENDING] Swedish Massage — John Smith',
        start: new Date('2026-05-12T10:00:00.000Z'),
        end: new Date('2026-05-12T11:00:00.000Z'),
        description: JSON.stringify({
          clientName: 'John Smith',
          clientEmail: 'john@example.com',
          clientPhone: '613-555-9999',
          serviceName: 'Swedish Massage',
          durationMinutes: 60,
        }),
      },
    ])

    const req = new NextRequest('http://localhost/api/admin/bookings?view=future')
    const res = await GET(req)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.bookings[0].status).toBe('pending')
    expect(data.bookings[0].clientName).toBe('John Smith')
  })

  it('filters out non-booking events (open blocks, breaks)', async () => {
    mockListEventsInRange.mockResolvedValue([
      {
        id: 'open-1',
        title: 'open',
        start: new Date('2026-05-10T09:00:00.000Z'),
        end: new Date('2026-05-10T17:00:00.000Z'),
      },
      {
        id: 'break-1',
        title: '[BREAK]',
        start: new Date('2026-05-10T15:00:00.000Z'),
        end: new Date('2026-05-10T15:30:00.000Z'),
        description: JSON.stringify({ type: 'break' }),
      },
      {
        id: 'evt-1',
        title: '[CONFIRMED] Deep Tissue — Jane Doe',
        start: new Date('2026-05-10T14:00:00.000Z'),
        end: new Date('2026-05-10T15:00:00.000Z'),
        description: bookingDescription,
      },
    ])

    const req = new NextRequest('http://localhost/api/admin/bookings?view=future')
    const res = await GET(req)
    const data = await res.json()

    expect(data.bookings).toHaveLength(1)
    expect(data.bookings[0].eventId).toBe('evt-1')
  })

  it('returns only confirmed bookings for view=past', async () => {
    mockListEventsInRange.mockResolvedValue([
      {
        id: 'evt-past',
        title: '[CONFIRMED] Swedish Massage — Past Client',
        start: new Date('2026-04-20T10:00:00.000Z'),
        end: new Date('2026-04-20T11:00:00.000Z'),
        description: JSON.stringify({
          clientName: 'Past Client',
          clientEmail: 'past@example.com',
          clientPhone: '613-000-0000',
          serviceName: 'Swedish Massage',
          durationMinutes: 60,
        }),
      },
      {
        id: 'evt-pending',
        title: '[PENDING] Swedish Massage — Pending Client',
        start: new Date('2026-04-21T10:00:00.000Z'),
        end: new Date('2026-04-21T11:00:00.000Z'),
        description: JSON.stringify({
          clientName: 'Pending Client',
          clientEmail: 'pend@example.com',
          clientPhone: '613-111-1111',
          serviceName: 'Swedish Massage',
          durationMinutes: 60,
        }),
      },
    ])

    const req = new NextRequest('http://localhost/api/admin/bookings?view=past')
    const res = await GET(req)
    const data = await res.json()

    expect(data.bookings).toHaveLength(1)
    expect(data.bookings[0].clientName).toBe('Past Client')
  })

  it('returns 401 when not authenticated', async () => {
    mockRequireAdminSession.mockResolvedValue({ authorized: false })
    const req = new NextRequest('http://localhost/api/admin/bookings?view=future')
    const res = await GET(req)
    expect(res.status).toBe(401)
  })

  it('returns 503 when showBookingsAdmin is false', async () => {
    const bookingMod = await import('@/lib/config')
    vi.spyOn(bookingMod, 'BOOKING', 'get').mockReturnValue({
      ...BOOKING,
      showBookingsAdmin: false,
    } as typeof BOOKING)

    const req = new NextRequest('http://localhost/api/admin/bookings?view=future')
    const res = await GET(req)
    expect(res.status).toBe(503)
  })
})
