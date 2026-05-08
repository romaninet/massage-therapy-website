import { NextRequest, NextResponse } from 'next/server'
import { listEventsForDate } from '@/lib/googleCalendar'
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

function dateRange(startDate: Date, days: number): string[] {
  const dates: string[] = []
  for (let i = 0; i < days; i++) {
    const d = new Date(startDate)
    d.setDate(d.getDate() + i)
    dates.push(d.toISOString().slice(0, 10))
  }
  return dates
}

export async function GET(req: NextRequest) {
  const guardError = await requireAdminRead()
  if (guardError) return guardError

  const { searchParams } = new URL(req.url)
  const view = searchParams.get('view') ?? 'future'
  const dateParam = searchParams.get('date')

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let dates: string[]
  if (view === 'past') {
    const endDate = dateParam ? new Date(dateParam) : new Date(today)
    endDate.setHours(0, 0, 0, 0)
    const startDate = new Date(endDate)
    startDate.setDate(startDate.getDate() - 30)
    dates = dateRange(startDate, 31)
  } else {
    dates = dateRange(today, 60)
  }

  const bookings: BookingSummary[] = []

  for (const date of dates) {
    const events = await listEventsForDate(date)
    for (const event of events) {
      const isPending = event.title.startsWith('[PENDING]')
      const isConfirmed = event.title.startsWith('[CONFIRMED]')

      if (view === 'future' && !isPending && !isConfirmed) continue
      if (view === 'past' && !isConfirmed) continue

      let details: Record<string, unknown> = {}
      try {
        if (event.description) {
          details = JSON.parse(event.description)
        }
      } catch {
        // skip unparseable events
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
  }

  return NextResponse.json({ bookings })
}
