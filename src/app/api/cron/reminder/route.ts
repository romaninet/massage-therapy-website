import { NextRequest, NextResponse } from 'next/server'
import { BOOKING, REMINDERS } from '@/lib/config'
import { listEventsForDate } from '@/lib/googleCalendar'
import { sendBookingReminderEmail, BookingDetails } from '@/lib/bookingEmails'

function getTomorrowInToronto(): string {
  const todayStr = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Toronto',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
  // en-CA produces "YYYY-MM-DD"
  const [y, m, d] = todayStr.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10)
}

export async function GET(req: NextRequest) {
  console.log('[cron/reminder] triggered', { timestamp: new Date().toISOString() })

  const secret = process.env.CRON_SECRET
  const authHeader = req.headers.get('authorization')
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!REMINDERS.enabled) {
    console.log('[cron/reminder] skipped — reminders disabled in config')
    return NextResponse.json({ skipped: 'disabled' })
  }

  const tomorrowStr = getTomorrowInToronto()
  console.log('[cron/reminder] fetching bookings for', tomorrowStr)

  const events = await listEventsForDate(tomorrowStr)

  const confirmed = events.filter(e =>
    e.title.startsWith(BOOKING.eventTitles.confirmed)
  )

  console.log(`[cron/reminder] found ${confirmed.length} confirmed booking(s) for ${tomorrowStr}`)

  let sent = 0
  const errors: string[] = []

  for (const event of confirmed) {
    let details: Record<string, unknown> = {}
    try {
      if (event.description) details = JSON.parse(event.description)
    } catch {
      errors.push(`${event.id}: failed to parse description`)
      continue
    }

    const {
      clientName, clientEmail, clientPhone,
      preferredLanguage, serviceKey, serviceName, durationMinutes,
      startTime, endTime, breakStart, breakEnd,
    } = details as Record<string, string>

    if (!clientEmail) {
      errors.push(`${event.id}: missing clientEmail`)
      continue
    }

    const booking: BookingDetails = {
      clientName: clientName ?? '',
      clientEmail,
      clientPhone: clientPhone ?? '',
      preferredLanguage: preferredLanguage ?? 'en',
      serviceKey: serviceKey ?? '',
      serviceName: serviceName ?? '',
      durationMinutes: Number(durationMinutes) || 0,
      sessionStart: startTime ? new Date(startTime) : event.start,
      sessionEnd: endTime ? new Date(endTime) : event.end,
      breakStart: breakStart ? new Date(breakStart) : event.end,
      breakEnd: breakEnd ? new Date(breakEnd) : event.end,
      eventId: event.id,
    }

    try {
      await sendBookingReminderEmail(booking)
      console.log(`[cron/reminder] sent reminder to ${clientEmail} (${event.id})`)
      sent++
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`[cron/reminder] failed to send reminder for ${event.id}:`, msg)
      errors.push(`${event.id}: ${msg}`)
    }
  }

  console.log(`[cron/reminder] done — sent: ${sent}, errors: ${errors.length}`)
  return NextResponse.json({ date: tomorrowStr, sent, errors })
}
