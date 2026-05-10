import { BOOKING } from '@/lib/config'
import { getEvent, deleteEvent } from '@/lib/googleCalendar'
import { verifyToken } from '@/lib/bookingTokens'
import { sendBookingDeclineEmail } from '@/lib/bookingEmails'
import { parseEventDescription, bookingDetailsFromEvent } from '@/lib/bookingEventParser'
import { htmlResponse, jsonResponse, confirmationPage, alreadyHandledPage, successPage } from '@/lib/routeHelpers'

export async function GET(request: Request) {
  if (!BOOKING.showBookingsAdmin) {
    return jsonResponse({ error: 'booking_disabled' }, 503)
  }

  const { searchParams } = new URL(request.url)
  const eventId = searchParams.get('eventId')
  const sig = searchParams.get('sig')
  const confirmed = searchParams.get('confirmed') === '1'

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
    return htmlResponse(alreadyHandledPage())
  }

  // Must be PENDING
  if (!event.title.startsWith('[PENDING]')) {
    return htmlResponse(alreadyHandledPage())
  }

  let bookingData: Record<string, unknown>
  try {
    bookingData = parseEventDescription(event.description)
  } catch {
    return jsonResponse({ error: 'invalid_event_data' }, 500)
  }

  // Show confirmation page before taking action
  if (!confirmed) {
    const actionUrl = `${request.url}&confirmed=1`
    const clientName = String(bookingData.clientName ?? 'this client')
    const serviceName = String(bookingData.serviceName ?? '')
    const durationMinutes = bookingData.durationMinutes ?? ''
    const startTime = event.start ? new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Toronto', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).format(event.start) : ''
    return htmlResponse(confirmationPage('decline', clientName, serviceName, durationMinutes, startTime, actionUrl))
  }

  const booking = bookingDetailsFromEvent(eventId, event, bookingData)

  await sendBookingDeclineEmail(booking)

  // Delete event
  await deleteEvent(eventId)

  return htmlResponse(successPage('decline', booking.clientName))
}
