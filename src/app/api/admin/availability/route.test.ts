import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('next-auth', () => ({
  default: vi.fn(),
  getServerSession: vi.fn(),
}))

vi.mock('@/lib/googleCalendar', () => ({
  listEventsInRange: vi.fn(),
  createEvent: vi.fn(),
  getEvent: vi.fn(),
  deleteEvent: vi.fn(),
}))

vi.mock('@/lib/config', () => ({
  BOOKING: {
    showBookingsAdmin: true,
    availabilityEventTitle: 'open',
    eventTitles: {
      pending:   '[PENDING]',
      confirmed: '[CONFIRMED]',
      break:     '[BREAK]',
    },
    calendarColors: {
      availability: '2',
    },
  },
}))

vi.mock('@/lib/adminAuth', () => ({
  requireAdminSession: vi.fn(),
}))

vi.mock('@/lib/csrfProtection', () => ({
  verifySameOrigin: vi.fn(() => true),
}))

import { listEventsInRange, createEvent, getEvent, deleteEvent } from '@/lib/googleCalendar'
import { requireAdminSession } from '@/lib/adminAuth'
import { GET, POST, DELETE } from './route'

const mockListEventsInRange = vi.mocked(listEventsInRange)
const mockCreateEvent = vi.mocked(createEvent)
const mockGetEvent = vi.mocked(getEvent)
const mockDeleteEvent = vi.mocked(deleteEvent)
const mockRequireAdminSession = vi.mocked(requireAdminSession)

beforeEach(() => {
  vi.clearAllMocks()
  mockRequireAdminSession.mockResolvedValue({ authorized: true })
})

// ── GET ───────────────────────────────────────────────────────────────────────

describe('GET /api/admin/availability', () => {
  it('returns open blocks for the requested month', async () => {
    mockListEventsInRange.mockResolvedValue([
      {
        id: 'block-1',
        title: 'open',
        start: new Date('2026-05-15T13:00:00.000Z'), // 09:00 EDT
        end:   new Date('2026-05-15T21:00:00.000Z'), // 17:00 EDT
      },
    ])

    const req = new NextRequest('http://localhost/api/admin/availability?month=2026-05')
    const res = await GET(req)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.blocks).toHaveLength(1)
    expect(data.blocks[0].id).toBe('block-1')
    expect(data.blocks[0].date).toBe('2026-05-15')
  })

  it('returns bookedDates for confirmed and pending events', async () => {
    mockListEventsInRange.mockResolvedValue([
      {
        id: 'block-1',
        title: 'open',
        start: new Date('2026-05-15T13:00:00.000Z'),
        end:   new Date('2026-05-15T21:00:00.000Z'),
      },
      {
        id: 'booking-1',
        title: '[CONFIRMED] Deep Tissue — Jane Doe',
        start: new Date('2026-05-15T14:00:00.000Z'),
        end:   new Date('2026-05-15T15:00:00.000Z'),
        description: '{}',
      },
      {
        id: 'booking-2',
        title: '[PENDING] Swedish — John',
        start: new Date('2026-05-20T14:00:00.000Z'),
        end:   new Date('2026-05-20T15:00:00.000Z'),
        description: '{}',
      },
    ])

    const req = new NextRequest('http://localhost/api/admin/availability?month=2026-05')
    const res = await GET(req)
    const data = await res.json()

    expect(data.bookedDates).toContain('2026-05-15')
    expect(data.bookedDates).toContain('2026-05-20')
    expect(data.bookedDates).toHaveLength(2)
  })

  it('deduplicates bookedDates when multiple bookings fall on the same day', async () => {
    mockListEventsInRange.mockResolvedValue([
      {
        id: 'b1',
        title: '[CONFIRMED] A — Client',
        start: new Date('2026-05-15T13:00:00.000Z'),
        end:   new Date('2026-05-15T14:00:00.000Z'),
        description: '{}',
      },
      {
        id: 'b2',
        title: '[CONFIRMED] B — Client',
        start: new Date('2026-05-15T15:00:00.000Z'),
        end:   new Date('2026-05-15T16:00:00.000Z'),
        description: '{}',
      },
    ])

    const req = new NextRequest('http://localhost/api/admin/availability?month=2026-05')
    const res = await GET(req)
    const data = await res.json()

    expect(data.bookedDates).toHaveLength(1)
    expect(data.bookedDates[0]).toBe('2026-05-15')
  })

  it('does not include breaks or personal events in bookedDates', async () => {
    mockListEventsInRange.mockResolvedValue([
      {
        id: 'br-1',
        title: '[BREAK]',
        start: new Date('2026-05-15T15:00:00.000Z'),
        end:   new Date('2026-05-15T15:30:00.000Z'),
        description: JSON.stringify({ type: 'break' }),
      },
      {
        id: 'personal',
        title: 'Doctor appointment',
        start: new Date('2026-05-16T14:00:00.000Z'),
        end:   new Date('2026-05-16T15:00:00.000Z'),
      },
    ])

    const req = new NextRequest('http://localhost/api/admin/availability?month=2026-05')
    const res = await GET(req)
    const data = await res.json()

    expect(data.bookedDates).toHaveLength(0)
  })

  it('returns 401 when not authenticated', async () => {
    mockRequireAdminSession.mockResolvedValue({ authorized: false })
    const req = new NextRequest('http://localhost/api/admin/availability?month=2026-05')
    const res = await GET(req)
    expect(res.status).toBe(401)
  })
})

// ── POST ──────────────────────────────────────────────────────────────────────

describe('POST /api/admin/availability', () => {
  it('creates an availability block and returns 201 with the new block', async () => {
    mockCreateEvent.mockResolvedValue('new-event-id')

    const req = new NextRequest('http://localhost/api/admin/availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', origin: 'http://localhost' },
      body: JSON.stringify({ date: '2026-05-20', startTime: '09:00', endTime: '17:00' }),
    })
    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(201)
    expect(data.block.id).toBe('new-event-id')
    expect(data.block.date).toBe('2026-05-20')
    expect(data.block.startTime).toBe('09:00')
    expect(data.block.endTime).toBe('17:00')
    expect(mockCreateEvent).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'open' })
    )
  })

  it('returns 400 for invalid date format', async () => {
    const req = new NextRequest('http://localhost/api/admin/availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', origin: 'http://localhost' },
      body: JSON.stringify({ date: 'not-a-date', startTime: '09:00', endTime: '17:00' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    expect(mockCreateEvent).not.toHaveBeenCalled()
  })

  it('returns 400 when end is before start', async () => {
    const req = new NextRequest('http://localhost/api/admin/availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', origin: 'http://localhost' },
      body: JSON.stringify({ date: '2026-05-20', startTime: '17:00', endTime: '09:00' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('end_before_start')
  })

  it('returns 409 when new block overlaps an existing availability block', async () => {
    // Existing block: 09:00–17:00 EDT = 13:00–21:00 UTC
    mockListEventsInRange.mockResolvedValue([
      {
        id: 'existing-1',
        title: 'open',
        start: new Date('2026-05-20T13:00:00.000Z'), // 09:00 EDT
        end:   new Date('2026-05-20T21:00:00.000Z'), // 17:00 EDT
      },
    ])

    const req = new NextRequest('http://localhost/api/admin/availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', origin: 'http://localhost' },
      body: JSON.stringify({ date: '2026-05-20', startTime: '11:00', endTime: '13:00' }),
    })
    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(409)
    expect(data.error).toBe('overlap')
    expect(mockCreateEvent).not.toHaveBeenCalled()
  })

  it('does not return 409 when blocks are adjacent (not overlapping)', async () => {
    // Existing block ends at 12:00; new block starts at 12:00 — adjacent, no overlap
    mockListEventsInRange.mockResolvedValue([
      {
        id: 'existing-1',
        title: 'open',
        start: new Date('2026-05-20T13:00:00.000Z'), // 09:00 EDT
        end:   new Date('2026-05-20T16:00:00.000Z'), // 12:00 EDT
      },
    ])
    mockCreateEvent.mockResolvedValue('new-event-id')

    const req = new NextRequest('http://localhost/api/admin/availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', origin: 'http://localhost' },
      body: JSON.stringify({ date: '2026-05-20', startTime: '12:00', endTime: '17:00' }),
    })
    const res = await POST(req)

    expect(res.status).toBe(201)
    expect(mockCreateEvent).toHaveBeenCalled()
  })

  it('returns 401 when not authenticated', async () => {
    mockRequireAdminSession.mockResolvedValue({ authorized: false })
    const req = new NextRequest('http://localhost/api/admin/availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', origin: 'http://localhost' },
      body: JSON.stringify({ date: '2026-05-20', startTime: '09:00', endTime: '17:00' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(401)
  })
})

// ── DELETE ────────────────────────────────────────────────────────────────────

describe('DELETE /api/admin/availability', () => {
  const availabilityEvent = {
    id: 'block-1',
    title: 'open',
    start: new Date('2026-05-20T13:00:00.000Z'),
    end:   new Date('2026-05-20T21:00:00.000Z'),
  }

  it('deletes an availability block and returns 200', async () => {
    mockGetEvent.mockResolvedValue(availabilityEvent)
    mockDeleteEvent.mockResolvedValue(undefined)

    const req = new NextRequest('http://localhost/api/admin/availability', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', origin: 'http://localhost' },
      body: JSON.stringify({ id: 'block-1' }),
    })
    const res = await DELETE(req)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(mockDeleteEvent).toHaveBeenCalledWith('block-1')
  })

  it('returns 404 when block id is not found', async () => {
    mockGetEvent.mockResolvedValue(null)

    const req = new NextRequest('http://localhost/api/admin/availability', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', origin: 'http://localhost' },
      body: JSON.stringify({ id: 'nonexistent' }),
    })
    const res = await DELETE(req)
    const data = await res.json()

    expect(res.status).toBe(404)
    expect(data.error).toBe('not_found')
    expect(mockDeleteEvent).not.toHaveBeenCalled()
  })

  it('returns 400 when event is not an availability block', async () => {
    mockGetEvent.mockResolvedValue({
      id: 'booking-1',
      title: '[CONFIRMED] Deep Tissue — Jane Doe',
      start: new Date('2026-05-20T13:00:00.000Z'),
      end:   new Date('2026-05-20T14:00:00.000Z'),
    })

    const req = new NextRequest('http://localhost/api/admin/availability', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', origin: 'http://localhost' },
      body: JSON.stringify({ id: 'booking-1' }),
    })
    const res = await DELETE(req)
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.error).toBe('not_availability')
    expect(mockDeleteEvent).not.toHaveBeenCalled()
  })

  it('returns 401 when not authenticated', async () => {
    mockRequireAdminSession.mockResolvedValue({ authorized: false })

    const req = new NextRequest('http://localhost/api/admin/availability', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', origin: 'http://localhost' },
      body: JSON.stringify({ id: 'block-1' }),
    })
    const res = await DELETE(req)
    expect(res.status).toBe(401)
    expect(mockDeleteEvent).not.toHaveBeenCalled()
  })
})
