import { NextRequest, NextResponse } from 'next/server'
import { getEvent, deleteEvent } from '@/lib/googleCalendar'
import { sendBookingDeclineEmail } from '@/lib/bookingEmails'
import { parseEventDescription, bookingDetailsFromEvent } from '@/lib/bookingEventParser'
import { requireAdminAccess } from '@/lib/adminGuard'
import { BOOKING } from '@/lib/config'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const guardError = await requireAdminAccess(req)
  if (guardError) return guardError

  const { eventId } = await req.json()

  const event = await getEvent(eventId)
  if (!event) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }

  if (!event.title.startsWith(BOOKING.eventTitles.pending)) {
    return NextResponse.json({ error: 'not_pending' }, { status: 400 })
  }

  let details: Record<string, unknown>
  try {
    details = parseEventDescription(event.description)
  } catch {
    return NextResponse.json({ error: 'invalid_description' }, { status: 400 })
  }

  const bookingDetails = bookingDetailsFromEvent(eventId, event, details)

  await sendBookingDeclineEmail(bookingDetails)

  await deleteEvent(eventId)

  return NextResponse.json({ success: true })
}
