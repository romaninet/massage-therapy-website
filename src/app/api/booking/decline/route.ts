import { BOOKING } from '@/lib/config'
import { getEvent, deleteEvent } from '@/lib/googleCalendar'
import { verifyToken } from '@/lib/bookingTokens'
import { sendBookingDeclineEmail, type BookingDetails } from '@/lib/bookingEmails'

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
  if (BOOKING.showBookingsService === false) {
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

  // Parse booking details
  let bookingData: Record<string, unknown>
  try {
    bookingData = JSON.parse(event.description ?? '{}')
  } catch {
    return jsonResponse({ error: 'invalid_event_data' }, 500)
  }

  // Delete event
  await deleteEvent(eventId)

  // Build BookingDetails and send decline email
  const sessionStart = event.start
  const sessionEnd = event.end
  const durationMinutes = Number(bookingData.durationMinutes)
  const breakStart = sessionEnd
  const breakEnd = new Date(breakStart.getTime() + BOOKING.breakAfterSession * 60 * 1000)

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

  await sendBookingDeclineEmail(booking)

  return htmlResponse(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Request Declined</title></head>
<body style="font-family:Arial,sans-serif;max-width:600px;margin:40px auto;padding:0 20px;color:#333;">
  <h1 style="color:#b91c1c;">Request declined</h1>
  <p>Client has been notified.</p>
</body>
</html>`)
}
