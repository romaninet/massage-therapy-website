import { NextRequest, NextResponse } from 'next/server'
import { BOOKING } from './config'
import { verifySameOrigin } from './csrfProtection'
import { requireAdminSession } from './adminAuth'

// For GET routes — no CSRF check needed
export async function requireAdminRead(): Promise<NextResponse | null> {
  if (!BOOKING.showBookingsAdmin) {
    return NextResponse.json({ error: 'disabled' }, { status: 503 })
  }
  const { authorized } = await requireAdminSession()
  if (!authorized) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  return null
}

// For POST routes — includes CSRF origin check
export async function requireAdminAccess(req: NextRequest): Promise<NextResponse | null> {
  if (!BOOKING.showBookingsAdmin) {
    return NextResponse.json({ error: 'disabled' }, { status: 503 })
  }
  if (!verifySameOrigin(req)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }
  const { authorized } = await requireAdminSession()
  if (!authorized) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  return null
}
