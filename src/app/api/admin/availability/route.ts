import { NextRequest, NextResponse } from 'next/server'
import { listEventsInRange } from '@/lib/googleCalendar'
import { BOOKING } from '@/lib/config'
import { requireAdminRead } from '@/lib/adminGuard'
import { torontoTime, torontoDate } from '@/lib/routeHelpers'

export const dynamic = 'force-dynamic'

export interface OpenBlock {
  id: string
  date: string    // YYYY-MM-DD in Toronto time
  startTime: string // HH:MM in Toronto time
  endTime: string   // HH:MM in Toronto time
}

export async function GET(req: NextRequest) {
  const guardError = await requireAdminRead()
  if (guardError) return guardError

  const { searchParams } = new URL(req.url)
  const month = searchParams.get('month') // YYYY-MM

  const now = new Date()
  const [year, mon] = month
    ? month.split('-').map(Number)
    : [now.getFullYear(), now.getMonth() + 1]

  const start = new Date(year, mon - 1, 1, 0, 0, 0)
  const end = new Date(year, mon, 1, 0, 0, 0)

  const events = await listEventsInRange(start, end)
  const titleMatch = BOOKING.availabilityEventTitle.toLowerCase()

  const blocks: OpenBlock[] = events
    .filter(e =>
      e.title.toLowerCase().trim() === titleMatch &&
      !isNaN(e.start.getTime()) &&
      !isNaN(e.end.getTime())
    )
    .map(e => ({
      id: e.id,
      date: torontoDate(e.start),
      startTime: torontoTime(e.start),
      endTime: torontoTime(e.end),
    }))

  return NextResponse.json({ blocks })
}
