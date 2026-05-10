import { NextRequest, NextResponse } from 'next/server'
import { getEvent, listEventsForDate, updateEvent, createEvent } from '@/lib/googleCalendar'
import { sendBookingConfirmationEmail } from '@/lib/bookingEmails'
import { parseEventDescription, bookingDetailsFromEvent } from '@/lib/bookingEventParser'
import { requireAdminAccess } from '@/lib/adminGuard'
import { BOOKING } from '@/lib/config'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const guardError = await requireAdminAccess(req)
  if (guardError) return guardError

  const { eventId } = await req.json()

  const event = await getEvent(eventId)
  if (!event) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }

  if (!event.title.startsWith(BOOKING.eventTitles.pending)) {
    return NextResponse.json({ error: 'not_pending' }, { status: 400 })
  }

  let details: Record<string, unknown>
  try {
    details = parseEventDescription(event.description)
  } catch {
    return NextResponse.json({ error: 'invalid_description' }, { status: 400 })
  }

  const sessionStart = event.start
  const sessionEnd = event.end
  const dateStr = sessionStart.toISOString().slice(0, 10)

  // Re-check for slot conflicts before confirming
  const dayEvents = await listEventsForDate(dateStr)
  const conflict = dayEvents.some((e) => {
    if (e.id === eventId) return false
    if (!e.title.startsWith(BOOKING.eventTitles.confirmed) && !e.title.startsWith(BOOKING.eventTitles.break)) return false
    return sessionStart.getTime() < e.end.getTime() && sessionEnd.getTime() > e.start.getTime()
  })

  if (conflict) {
    return NextResponse.json({ error: 'slot_conflict' }, { status: 409 })
  }

  await updateEvent(eventId, {
    title: event.title.replace(BOOKING.eventTitles.pending, BOOKING.eventTitles.confirmed),
    colorId: BOOKING.calendarColors.confirmed,
  })

  const breakStart = sessionEnd
  const breakEnd = new Date(breakStart.getTime() + BOOKING.breakAfterSession * 60 * 1000)
  await createEvent({
    title: BOOKING.eventTitles.break,
    colorId: BOOKING.calendarColors.break,
    start: breakStart,
    end: breakEnd,
    description: JSON.stringify({ type: 'break', linkedEventId: eventId }),
  })

  const bookingDetails = bookingDetailsFromEvent(eventId, event, details)
  await sendBookingConfirmationEmail(bookingDetails)

  return NextResponse.json({ success: true })
}
