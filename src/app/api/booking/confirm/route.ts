import { BOOKING } from '@/lib/config'
import { listEventsForDate, getEvent, updateEvent, createEvent } from '@/lib/googleCalendar'
import { verifyToken } from '@/lib/bookingTokens'
import { sendBookingConfirmationEmail, type BookingDetails } from '@/lib/bookingEmails'

function htmlResponse(body: string, status = 200): Response {
  return new Response(body, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}

function jsonResponse(body: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function GET(request: Request) {
  if (!BOOKING.showBookingsAdmin) {
    return jsonResponse({ error: 'booking_disabled' }, 503)
  }

  const { searchParams } = new URL(request.url)
  const eventId = searchParams.get('eventId')
  const sig = searchParams.get('sig')

  if (!eventId || !sig) {
    return jsonResponse({ error: 'missing_params' }, 400)
  }

  // Verify HMAC
  if (!verifyToken(eventId, sig)) {
    return jsonResponse({ error: 'invalid_signature' }, 400)
  }

  // Get event
  const event = await getEvent(eventId)
  if (!event) {
    return jsonResponse({ error: 'event_not_found' }, 404)
  }

  // Must be PENDING
  if (!event.title.startsWith('[PENDING]')) {
    return jsonResponse({ error: 'already_handled' }, 409)
  }

  // Parse booking details from description
  let bookingData: Record<string, unknown>
  try {
    bookingData = JSON.parse(event.description ?? '{}')
  } catch {
    return jsonResponse({ error: 'invalid_event_data' }, 500)
  }

  const sessionStart = event.start
  const sessionEnd = event.end
  const durationMinutes = Number(bookingData.durationMinutes)
  const dateStr = sessionStart.toISOString().slice(0, 10)

  // Re-check slot: list events, exclude this event, check for CONFIRMED/BREAK conflicts
  const events = await listEventsForDate(dateStr)
  const otherEvents = events.filter((e) => e.id !== eventId)
  const conflictingEvents = otherEvents.filter((e) => {
    if (!e.title.startsWith('[CONFIRMED]') && !e.title.startsWith('[BREAK]')) return false
    const es = e.start.getTime()
    const ee = e.end.getTime()
    const ss = sessionStart.getTime()
    const se = sessionEnd.getTime()
    return ss < ee && se > es
  })

  if (conflictingEvents.length > 0) {
    return jsonResponse({ error: 'slot_conflict' }, 409)
  }

  // Update event to CONFIRMED
  await updateEvent(eventId, {
    title: event.title.replace('[PENDING]', '[CONFIRMED]'),
    colorId: BOOKING.calendarColors.confirmed,
  })

  // Create [BREAK] event
  const breakStart = sessionEnd
  const breakEnd = new Date(breakStart.getTime() + BOOKING.breakAfterSession * 60 * 1000)
  await createEvent({
    title: '[BREAK]',
    colorId: BOOKING.calendarColors.break,
    start: breakStart,
    end: breakEnd,
    description: JSON.stringify({ type: 'break', linkedEventId: eventId }),
  })

  // Build BookingDetails and send confirmation email
  const booking: BookingDetails = {
    clientName: String(bookingData.clientName ?? ''),
    clientEmail: String(bookingData.clientEmail ?? ''),
    clientPhone: String(bookingData.clientPhone ?? ''),
    clientNotes: bookingData.clientNotes ? String(bookingData.clientNotes) : undefined,
    serviceKey: String(bookingData.serviceKey ?? ''),
    serviceName: String(bookingData.serviceName ?? ''),
    durationMinutes,
    sessionStart,
    sessionEnd,
    breakStart,
    breakEnd,
    eventId,
  }

  await sendBookingConfirmationEmail(booking)

  const clientName = booking.clientName
  return htmlResponse(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Booking Confirmed</title></head>
<body style="font-family:Arial,sans-serif;max-width:600px;margin:40px auto;padding:0 20px;color:#333;">
  <h1 style="color:#2D6A4F;">Booking confirmed &#10003;</h1>
  <p>${clientName} has been notified.</p>
</body>
</html>`)
}
