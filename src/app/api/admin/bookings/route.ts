import { NextRequest, NextResponse } from 'next/server'
import { listEventsInRange } from '@/lib/googleCalendar'
import { BOOKING } from '@/lib/config'
import { requireAdminRead } from '@/lib/adminGuard'

export const dynamic = 'force-dynamic'

export interface BookingSummary {
  eventId: string
  status: 'pending' | 'confirmed'
  clientName: string
  clientEmail: string
  clientPhone: string
  clientNotes?: string
  serviceName: string
  durationMinutes: number
  sessionStart: string
  sessionEnd: string
  breakEnd: string
}

export async function GET(req: NextRequest) {
  const guardError = await requireAdminRead()
  if (guardError) return guardError

  const { searchParams } = new URL(req.url)
  const view = searchParams.get('view') ?? 'future'
  const dateParam = searchParams.get('date')

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let start: Date
  let end: Date

  if (view === 'past') {
    end = dateParam ? new Date(dateParam) : new Date(today)
    end.setHours(23, 59, 59, 999)
    start = new Date(end)
    start.setDate(start.getDate() - 30)
    start.setHours(0, 0, 0, 0)
  } else {
    start = today
    end = new Date(today)
    end.setDate(end.getDate() + 60)
  }

  const events = await listEventsInRange(start, end)
  const bookings: BookingSummary[] = []

  for (const event of events) {
    const isPending = event.title.startsWith(BOOKING.eventTitles.pending)
    const isConfirmed = event.title.startsWith(BOOKING.eventTitles.confirmed)

    if (view === 'future' && !isPending && !isConfirmed) continue
    if (view === 'past' && !isConfirmed) continue

    let details: Record<string, unknown> = {}
    try {
      if (event.description) details = JSON.parse(event.description)
    } catch {
      continue
    }

    bookings.push({
      eventId: event.id,
      status: isPending ? 'pending' : 'confirmed',
      clientName: String(details.clientName ?? ''),
      clientEmail: String(details.clientEmail ?? ''),
      clientPhone: String(details.clientPhone ?? ''),
      clientNotes: details.clientNotes ? String(details.clientNotes) : undefined,
      serviceName: String(details.serviceName ?? ''),
      durationMinutes: Number(details.durationMinutes ?? 0),
      sessionStart: event.start.toISOString(),
      sessionEnd: event.end.toISOString(),
      breakEnd: details.breakEnd ? String(details.breakEnd) : event.end.toISOString(),
    })
  }

  return NextResponse.json({ bookings })
}
