import { NextRequest, NextResponse } from 'next/server'
import { getEvent, deleteEvent, listEventsForDate } from '@/lib/googleCalendar'
import { sendBookingCancellationEmail } from '@/lib/bookingEmails'
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

  if (!event.title.startsWith(BOOKING.eventTitles.confirmed)) {
    return NextResponse.json({ error: 'not_confirmed' }, { status: 400 })
  }

  let details: Record<string, unknown>
  try {
    details = parseEventDescription(event.description)
  } catch {
    return NextResponse.json({ error: 'invalid_description' }, { status: 400 })
  }

  const bookingDetails = bookingDetailsFromEvent(eventId, event, details)

  await sendBookingCancellationEmail(bookingDetails)

  // Delete the confirmed event
  await deleteEvent(eventId)

  // Find and delete the associated [BREAK] event
  const dateStr = event.start.toISOString().slice(0, 10)
  const dayEvents = await listEventsForDate(dateStr)
  for (const e of dayEvents) {
    if (e.title === BOOKING.eventTitles.break && e.description) {
      try {
        const breakDetails = JSON.parse(e.description)
        if (breakDetails.linkedEventId === eventId) {
          await deleteEvent(e.id)
          break
        }
      } catch {
        // skip unparseable
      }
    }
  }

  return NextResponse.json({ success: true })
}
