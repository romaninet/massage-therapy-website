import { NextRequest, NextResponse } from 'next/server'
import { BOOKING } from './config'
import { verifySameOrigin } from './csrfProtection'
import { requireAdminSession } from './adminAuth'

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
