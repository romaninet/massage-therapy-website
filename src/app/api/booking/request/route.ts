import { NextResponse } from 'next/server'
import { BOOKING, SERVICES } from '@/lib/config'
import { listEventsForDate, createEvent } from '@/lib/googleCalendar'
import { getAvailableSlots } from '@/lib/bookingSlots'
import { sendBookingRequestEmail } from '@/lib/bookingEmails'

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: Request) {
  if (BOOKING.showBookingsService === false) {
    return NextResponse.json({ error: 'booking_disabled' }, { status: 503 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const { date, service: serviceKey, duration, startTime, clientName, clientEmail, clientPhone, clientNotes } = body as {
    date?: string
    service?: string
    duration?: number
    startTime?: string
    clientName?: string
    clientEmail?: string
    clientPhone?: string
    clientNotes?: string
  }

  // Validate required fields
  if (!date || !serviceKey || !duration || !startTime || !clientName || !clientEmail || !clientPhone) {
    return NextResponse.json({ error: 'missing_fields' }, { status: 400 })
  }

  // Validate email format
  if (!isValidEmail(clientEmail)) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 400 })
  }

  // Validate service
  const service = SERVICES.find((s) => s.key === serviceKey)
  if (!service) {
    return NextResponse.json({ error: 'invalid_service' }, { status: 400 })
  }

  // Validate duration against service tiers
  const durationMinutes = Number(duration)
  const tierExists = service.tiers.some((t) => parseInt(String(t.duration), 10) === durationMinutes)
  if (!tierExists) {
    return NextResponse.json({ error: 'invalid_duration' }, { status: 400 })
  }

  // Validate startTime ISO
  const sessionStart = new Date(startTime)
  if (isNaN(sessionStart.getTime())) {
    return NextResponse.json({ error: 'invalid_start_time' }, { status: 400 })
  }

  // Re-verify slot availability
  const dateStr = date as string
  const events = await listEventsForDate(dateStr)
  const targetDate = new Date(`${dateStr}T00:00:00.000Z`)
  const availableSlots = getAvailableSlots(events, durationMinutes, targetDate)
  const slotAvailable = availableSlots.some((s) => s.toISOString() === sessionStart.toISOString())
  if (!slotAvailable) {
    return NextResponse.json({ error: 'slot_taken' }, { status: 409 })
  }

  // Compute times
  const sessionEnd = new Date(sessionStart.getTime() + durationMinutes * 60 * 1000)
  const breakStart = sessionEnd
  const breakEnd = new Date(breakStart.getTime() + BOOKING.breakAfterSession * 60 * 1000)

  const serviceName = service.title.en

  // Create [PENDING] calendar event
  const description = JSON.stringify({
    serviceKey,
    serviceName,
    durationMinutes,
    startTime: sessionStart.toISOString(),
    endTime: sessionEnd.toISOString(),
    breakStart: breakStart.toISOString(),
    breakEnd: breakEnd.toISOString(),
    clientName,
    clientEmail,
    clientPhone,
    ...(clientNotes ? { clientNotes } : {}),
  })

  const eventId = await createEvent({
    title: `[PENDING] ${serviceName} ${durationMinutes}min — ${clientName}`,
    colorId: BOOKING.calendarColors.pending,
    start: sessionStart,
    end: sessionEnd,
    description,
  })

  await sendBookingRequestEmail({
    clientName,
    clientEmail,
    clientPhone,
    clientNotes,
    serviceKey,
    serviceName,
    durationMinutes,
    sessionStart,
    sessionEnd,
    breakStart,
    breakEnd,
    eventId,
  })

  return NextResponse.json({ success: true })
}
