import { BOOKING } from '@/lib/config'
import { getEvent, deleteEvent } from '@/lib/googleCalendar'
import { verifyToken } from '@/lib/bookingTokens'
import { sendBookingDeclineEmail } from '@/lib/bookingEmails'
import { parseEventDescription, bookingDetailsFromEvent } from '@/lib/bookingEventParser'
import { htmlResponse, jsonResponse } from '@/lib/routeHelpers'

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

  let bookingData: Record<string, unknown>
  try {
    bookingData = parseEventDescription(event.description)
  } catch {
    return jsonResponse({ error: 'invalid_event_data' }, 500)
  }

  const booking = bookingDetailsFromEvent(eventId, event, bookingData)

  await sendBookingDeclineEmail(booking)

  // Delete event
  await deleteEvent(eventId)

  return htmlResponse(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Request Declined</title></head>
<body style="font-family:Arial,sans-serif;max-width:600px;margin:40px auto;padding:0 20px;color:#333;">
  <h1 style="color:#b91c1c;">Request declined</h1>
  <p>Client has been notified.</p>
</body>
</html>`)
}
