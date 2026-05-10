import { NextRequest, NextResponse } from 'next/server'
import { listEventsInRange, createEvent, getEvent, deleteEvent } from '@/lib/googleCalendar'
import { BOOKING } from '@/lib/config'
import { requireAdminRead, requireAdminAccess } from '@/lib/adminGuard'
import { torontoTime, torontoDate, torontoTimeToUTC } from '@/lib/routeHelpers'

export const dynamic = 'force-dynamic'

export interface OpenBlock {
  id: string
  date: string       // YYYY-MM-DD in Toronto time
  startTime: string  // HH:MM in Toronto time
  endTime: string    // HH:MM in Toronto time
}

/**
 * GET /api/admin/availability?month=YYYY-MM
 *
 * Returns all open availability blocks for the month, plus the set of dates
 * that have at least one confirmed or pending booking — so the UI can show
 * conflict indicators without a second API call.
 */
export async function GET(req: NextRequest) {
  const guardError = await requireAdminRead()
  if (guardError) return guardError

  const { searchParams } = new URL(req.url)
  const month = searchParams.get('month')

  const now = new Date()
  const [year, mon] = month
    ? month.split('-').map(Number)
    : [now.getFullYear(), now.getMonth() + 1]

  const start = new Date(year, mon - 1, 1, 0, 0, 0)
  const end   = new Date(year, mon,     1, 0, 0, 0)

  const events = await listEventsInRange(start, end)

  const titleMatch = BOOKING.availabilityEventTitle.toLowerCase()

  const blocks: OpenBlock[] = events
    .filter(e =>
      e.title.toLowerCase().trim() === titleMatch &&
      !isNaN(e.start.getTime()) &&
      !isNaN(e.end.getTime())
    )
    .map(e => ({
      id: e.id,
      date: torontoDate(e.start),
      startTime: torontoTime(e.start),
      endTime: torontoTime(e.end),
    }))

  const bookedDates = [
    ...new Set(
      events
        .filter(e =>
          e.title.startsWith(BOOKING.eventTitles.pending) ||
          e.title.startsWith(BOOKING.eventTitles.confirmed)
        )
        .map(e => torontoDate(e.start))
    ),
  ]

  return NextResponse.json({ blocks, bookedDates })
}

/**
 * POST /api/admin/availability
 * Body: { date: "YYYY-MM-DD", startTime: "HH:MM", endTime: "HH:MM" }
 *
 * Creates a new availability block in Google Calendar.
 */
export async function POST(req: NextRequest) {
  const guardError = await requireAdminAccess(req)
  if (guardError) return guardError

  const body = await req.json()
  const { date, startTime, endTime } = body as {
    date?: string
    startTime?: string
    endTime?: string
  }

  if (
    typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    typeof startTime !== 'string' || !/^\d{2}:\d{2}$/.test(startTime) ||
    typeof endTime !== 'string' || !/^\d{2}:\d{2}$/.test(endTime)
  ) {
    return NextResponse.json({ error: 'invalid_params' }, { status: 400 })
  }

  const start = torontoTimeToUTC(date, startTime)
  const end   = torontoTimeToUTC(date, endTime)

  if (end <= start) {
    return NextResponse.json({ error: 'end_before_start' }, { status: 400 })
  }

  // Check for overlap with existing availability blocks on the same day
  const dayStart = torontoTimeToUTC(date, '00:00')
  const dayEnd   = torontoTimeToUTC(date, '23:59')
  const dayEvents = await listEventsInRange(dayStart, dayEnd)
  const titleMatch = BOOKING.availabilityEventTitle.toLowerCase()
  const hasOverlap = dayEvents.some(e =>
    e.title.toLowerCase().trim() === titleMatch &&
    !isNaN(e.start.getTime()) &&
    !isNaN(e.end.getTime()) &&
    start < e.end && e.start < end
  )
  if (hasOverlap) {
    return NextResponse.json({ error: 'overlap' }, { status: 409 })
  }

  const eventId = await createEvent({
    title:   BOOKING.availabilityEventTitle,
    colorId: BOOKING.calendarColors.availability,
    start,
    end,
  })

  const block: OpenBlock = { id: eventId, date, startTime, endTime }
  return NextResponse.json({ block }, { status: 201 })
}

/**
 * DELETE /api/admin/availability
 * Body: { id: string }
 *
 * Deletes an existing availability block from Google Calendar.
 */
export async function DELETE(req: NextRequest) {
  const guardError = await requireAdminAccess(req)
  if (guardError) return guardError

  const body = await req.json()
  const { id } = body as { id?: string }

  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'invalid_params' }, { status: 400 })
  }

  const event = await getEvent(id)
  if (!event) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }

  const titleMatch = BOOKING.availabilityEventTitle.toLowerCase()
  if (event.title.toLowerCase().trim() !== titleMatch) {
    return NextResponse.json({ error: 'not_availability' }, { status: 400 })
  }

  await deleteEvent(id)
  return NextResponse.json({ success: true })
}
