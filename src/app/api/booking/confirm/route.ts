import { BOOKING } from '@/lib/config'
import { listEventsForDate, getEvent, updateEvent, createEvent } from '@/lib/googleCalendar'
import { verifyToken } from '@/lib/bookingTokens'
import { sendBookingConfirmationEmail } from '@/lib/bookingEmails'
import { parseEventDescription, bookingDetailsFromEvent } from '@/lib/bookingEventParser'
import { htmlResponse, jsonResponse, confirmationPage, successPage } from '@/lib/routeHelpers'
import { requireAdminSession } from '@/lib/adminAuth'

export async function GET(request: Request) {
  try {
    return await handleConfirm(request)
  } catch (err) {
    console.error('[booking/confirm] unhandled error:', err)
    return htmlResponse(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Error</title></head>
<body style="font-family:Arial,sans-serif;max-width:600px;margin:40px auto;padding:0 20px;color:#333;">
  <h1 style="color:#b91c1c;">Something went wrong</h1>
  <p>Could not process the booking confirmation. Please try again or use the admin dashboard.</p>
</body>
</html>`, 500)
  }
}

async function handleConfirm(request: Request): Promise<Response> {
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

  // Require admin session — redirect to login if not authenticated
  const { authorized } = await requireAdminSession()
  if (!authorized) {
    const loginUrl = new URL('/api/auth/signin', request.url)
    loginUrl.searchParams.set('callbackUrl', request.url)
    return Response.redirect(loginUrl.toString(), 302)
  }

  // Get event
  const event = await getEvent(eventId)
  if (!event) {
    return jsonResponse({ error: 'event_not_found' }, 404)
  }

  // Must be PENDING
  if (!event.title.startsWith(BOOKING.eventTitles.pending)) {
    return jsonResponse({ error: 'already_handled' }, 409)
  }

  // Show confirmation page before taking action
  if (!confirmed) {
    const confirmUrl = `${request.url}&confirmed=1`
    let bookingData: Record<string, unknown>
    try { bookingData = parseEventDescription(event.description) } catch { bookingData = {} }
    const clientName = String(bookingData.clientName ?? 'this client')
    const serviceName = String(bookingData.serviceName ?? '')
    const durationMinutes = bookingData.durationMinutes ?? ''
    const startTime = event.start ? new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Toronto', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).format(event.start) : ''
    return htmlResponse(confirmationPage('accept', clientName, serviceName, durationMinutes, startTime, confirmUrl))
  }

  let bookingData: Record<string, unknown>
  try {
    bookingData = parseEventDescription(event.description)
  } catch {
    return jsonResponse({ error: 'invalid_event_data' }, 500)
  }

  const sessionStart = event.start
  const sessionEnd = event.end
  const dateStr = sessionStart.toISOString().slice(0, 10)

  // Re-check slot: list events, exclude this event, check for CONFIRMED/BREAK conflicts
  const events = await listEventsForDate(dateStr)
  const otherEvents = events.filter((e) => e.id !== eventId)
  const conflictingEvents = otherEvents.filter((e) => {
    if (!e.title.startsWith(BOOKING.eventTitles.confirmed) && !e.title.startsWith(BOOKING.eventTitles.break)) return false
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
    title: event.title.replace(BOOKING.eventTitles.pending, BOOKING.eventTitles.confirmed),
    colorId: BOOKING.calendarColors.confirmed,
  })

  // Create break event
  const breakStart = sessionEnd
  const breakEnd = new Date(breakStart.getTime() + BOOKING.breakAfterSession * 60 * 1000)
  await createEvent({
    title: BOOKING.eventTitles.break,
    colorId: BOOKING.calendarColors.break,
    start: breakStart,
    end: breakEnd,
    description: JSON.stringify({ type: 'break', linkedEventId: eventId }),
  })

  const booking = bookingDetailsFromEvent(eventId, event, bookingData)

  await sendBookingConfirmationEmail(booking)

  const clientName = booking.clientName
  return htmlResponse(successPage('accept', clientName))
}
