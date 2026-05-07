import { NextResponse } from 'next/server'
import { BOOKING, SERVICES } from '@/lib/config'
import { listEventsForDate } from '@/lib/googleCalendar'
import { getAvailableSlots } from '@/lib/bookingSlots'

export async function GET(request: Request) {
  if (BOOKING.showBookingsService === false) {
    return NextResponse.json({ error: 'booking_disabled' }, { status: 503 })
  }

  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')
  const serviceKey = searchParams.get('service')
  const durationParam = searchParams.get('duration')

  // Validate date
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'invalid_date' }, { status: 400 })
  }
  const targetDate = new Date(`${date}T00:00:00.000Z`)
  if (isNaN(targetDate.getTime())) {
    return NextResponse.json({ error: 'invalid_date' }, { status: 400 })
  }
  // Not in the past (compare date strings only)
  const todayStr = new Date().toISOString().slice(0, 10)
  if (date < todayStr) {
    return NextResponse.json({ error: 'date_in_past' }, { status: 400 })
  }

  // Validate service
  const service = SERVICES.find((s) => s.key === serviceKey)
  if (!service) {
    return NextResponse.json({ error: 'invalid_service' }, { status: 400 })
  }

  // Validate duration
  const durationMinutes = Number(durationParam)
  if (!durationParam || isNaN(durationMinutes) || durationMinutes <= 0) {
    return NextResponse.json({ error: 'invalid_duration' }, { status: 400 })
  }
  // tiers.duration is like "60 min" — extract the number
  const tierExists = service.tiers.some((t) => parseInt(String(t.duration), 10) === durationMinutes)
  if (!tierExists) {
    return NextResponse.json({ error: 'invalid_duration' }, { status: 400 })
  }

  const events = await listEventsForDate(date)
  const slots = getAvailableSlots(events, durationMinutes, targetDate)

  return NextResponse.json({ slots: slots.map((s) => s.toISOString()) })
}
