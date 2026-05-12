import { NextResponse } from 'next/server'
import { BOOKING, SERVICES } from '@/lib/config'
import { listEventsInRange } from '@/lib/googleCalendar'
import { getAvailableSlots } from '@/lib/bookingSlots'

export async function GET(request: Request) {
  if (!BOOKING.showBookingsService) {
    return NextResponse.json({ error: 'booking_disabled' }, { status: 503 })
  }

  const { searchParams } = new URL(request.url)
  const month = searchParams.get('month')
  const serviceKey = searchParams.get('service')
  const durationParam = searchParams.get('duration')

  // Validate month (YYYY-MM)
  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json({ error: 'invalid_month' }, { status: 400 })
  }
  const [year, monthNum] = month.split('-').map(Number)
  if (monthNum < 1 || monthNum > 12) {
    return NextResponse.json({ error: 'invalid_month' }, { status: 400 })
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
  const tierExists = service.tiers.some((t) => parseInt(String(t.duration), 10) === durationMinutes)
  if (!tierExists) {
    return NextResponse.json({ error: 'invalid_duration' }, { status: 400 })
  }

  // Fetch all events for the month in one Google Calendar call
  const timeMin = new Date(year, monthNum - 1, 1)
  const timeMax = new Date(year, monthNum, 1)
  const events = await listEventsInRange(timeMin, timeMax)

  // Determine which days have available slots (in-memory, no extra network calls)
  const todayStr = new Date().toISOString().slice(0, 10)
  const maxDateStr = (() => {
    const d = new Date()
    d.setFullYear(d.getFullYear() + 1)
    return d.toISOString().slice(0, 10)
  })()

  const availableDates: string[] = []
  const daysInMonth = new Date(year, monthNum, 0).getDate()

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(monthNum).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    if (dateStr < todayStr || dateStr > maxDateStr) continue
    const targetDate = new Date(`${dateStr}T00:00:00.000Z`)
    const slots = getAvailableSlots(events, durationMinutes, targetDate)
    if (slots.length > 0) availableDates.push(dateStr)
  }

  return NextResponse.json({ availableDates })
}
