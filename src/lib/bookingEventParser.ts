import { BOOKING } from './config'
import type { BookingDetails } from './bookingEmails'
import type { CalendarEvent } from './googleCalendar'

export function parseEventDescription(description: string | undefined): Record<string, unknown> {
  try {
    return description ? JSON.parse(description) : {}
  } catch {
    throw new Error('invalid_event_data')
  }
}

export function bookingDetailsFromEvent(
  eventId: string,
  event: CalendarEvent,
  data: Record<string, unknown>
): BookingDetails {
  const sessionStart = data.sessionStart ? new Date(String(data.sessionStart)) : event.start
  const sessionEnd = data.sessionEnd ? new Date(String(data.sessionEnd)) : event.end
  const breakStart = data.breakStart ? new Date(String(data.breakStart)) : sessionEnd
  const breakEnd = data.breakEnd
    ? new Date(String(data.breakEnd))
    : new Date(sessionEnd.getTime() + BOOKING.breakAfterSession * 60 * 1000)

  return {
    clientName: String(data.clientName ?? ''),
    clientEmail: String(data.clientEmail ?? ''),
    clientPhone: String(data.clientPhone ?? ''),
    clientNotes: data.clientNotes ? String(data.clientNotes) : undefined,
    serviceKey: String(data.serviceKey ?? ''),
    serviceName: String(data.serviceName ?? ''),
    durationMinutes: Number(data.durationMinutes ?? 0),
    sessionStart,
    sessionEnd,
    breakStart,
    breakEnd,
    eventId,
  }
}
