import { NextRequest, NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/adminAuth'
import { verifySameOrigin } from '@/lib/csrfProtection'
import { getEvent, deleteEvent, listEventsForDate } from '@/lib/googleCalendar'
import { sendBookingCancellationEmail, BookingDetails } from '@/lib/bookingEmails'
import { BOOKING } from '@/lib/config'

export async function POST(req: NextRequest) {
  if (!BOOKING.showBookingsAdmin) {
    return NextResponse.json({ error: 'disabled' }, { status: 503 })
  }

  if (!verifySameOrigin(req)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const { authorized } = await requireAdminSession()
  if (!authorized) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const { eventId } = await req.json()

  const event = await getEvent(eventId)
  if (!event) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }

  if (!event.title.startsWith('[CONFIRMED]')) {
    return NextResponse.json({ error: 'not_confirmed' }, { status: 400 })
  }

  let details: Record<string, unknown> = {}
  try {
    if (event.description) {
      details = JSON.parse(event.description)
    }
  } catch {
    return NextResponse.json({ error: 'invalid_description' }, { status: 400 })
  }

  const bookingDetails: BookingDetails = {
    clientName: String(details.clientName ?? ''),
    clientEmail: String(details.clientEmail ?? ''),
    clientPhone: String(details.clientPhone ?? ''),
    clientNotes: details.clientNotes ? String(details.clientNotes) : undefined,
    serviceKey: String(details.serviceKey ?? ''),
    serviceName: String(details.serviceName ?? ''),
    durationMinutes: Number(details.durationMinutes ?? 0),
    sessionStart: new Date(String(details.sessionStart ?? event.start.toISOString())),
    sessionEnd: new Date(String(details.sessionEnd ?? event.end.toISOString())),
    breakStart: new Date(String(details.breakStart ?? event.end.toISOString())),
    breakEnd: new Date(String(details.breakEnd ?? event.end.toISOString())),
    eventId,
  }

  await sendBookingCancellationEmail(bookingDetails)

  // Delete the confirmed event
  await deleteEvent(eventId)

  // Find and delete the associated [BREAK] event
  const dateStr = event.start.toISOString().slice(0, 10)
  const dayEvents = await listEventsForDate(dateStr)
  for (const e of dayEvents) {
    if (e.title === '[BREAK]' && e.description) {
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
