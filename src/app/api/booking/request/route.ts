import { NextResponse } from 'next/server'
import { BOOKING, SERVICES } from '@/lib/config'
import { listEventsForDate, listEventsInRange, createEvent } from '@/lib/googleCalendar'
import { getAvailableSlots } from '@/lib/bookingSlots'
import { sendBookingRequestEmail, sendBotAlertEmail } from '@/lib/bookingEmails'
import { getClientIp } from '@/lib/routeHelpers'

const MAX_PENDING_PER_EMAIL = 3

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: Request) {
  if (!BOOKING.showBookingsService) {
    return NextResponse.json({ error: 'booking_disabled' }, { status: 503 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const { date, service: serviceKey, duration, startTime, clientName, clientEmail, clientPhone, clientNotes, _hp, _t } = body as {
    date?: string
    service?: string
    duration?: number
    startTime?: string
    clientName?: string
    clientEmail?: string
    clientPhone?: string
    clientNotes?: string
    _hp?: string
    _t?: number
  }

  // Bot protection: honeypot must be empty
  if (_hp) {
    const ip = getClientIp(request)
    await sendBotAlertEmail('honeypot', ip).catch(() => {})
    return NextResponse.json({ error: 'bot_detected' }, { status: 400 })
  }

  // Bot protection: form must have taken at least 4 seconds to fill
  if (!_t || Date.now() - _t < 4000) {
    const ip = getClientIp(request)
    await sendBotAlertEmail('timing', ip).catch(() => {})
    return NextResponse.json({ error: 'bot_detected' }, { status: 400 })
  }

  // Validate required fields
  if (!date || !serviceKey || !duration || !startTime || !clientName || !clientEmail || !clientPhone) {
    return NextResponse.json({ error: 'missing_fields' }, { status: 400 })
  }

  // Validate email format
  if (!isValidEmail(clientEmail)) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 400 })
  }

  if (clientNotes && clientNotes.length > 500) {
    return NextResponse.json({ error: 'notes_too_long' }, { status: 400 })
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

  // Check max pending bookings per email (prevents abuse without rate limiting)
  const now = new Date()
  const ninetyDaysOut = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000)
  const upcomingEvents = await listEventsInRange(now, ninetyDaysOut)
  const pendingCount = upcomingEvents.filter((e) => {
    if (!e.title.startsWith('[PENDING]')) return false
    try {
      const d = JSON.parse(e.description ?? '{}') as { clientEmail?: string }
      return d.clientEmail?.toLowerCase() === (clientEmail as string).toLowerCase()
    } catch {
      return false
    }
  }).length
  if (pendingCount >= MAX_PENDING_PER_EMAIL) {
    console.warn(`[booking/request] BLOCKED too_many_pending: ${clientEmail} has ${pendingCount} pending bookings (limit ${MAX_PENDING_PER_EMAIL})`)
    return NextResponse.json({ error: 'too_many_pending' }, { status: 400 })
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
