import { getServerSession } from 'next-auth'
import { BOOKING } from './config'

export async function requireAdminSession(): Promise<{ authorized: boolean }> {
  const session = await getServerSession()
  const authorized = session?.user?.email === BOOKING.adminEmail
  return { authorized }
}
