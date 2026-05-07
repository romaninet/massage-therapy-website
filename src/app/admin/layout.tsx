import { getServerSession } from 'next-auth'
import { redirect, notFound } from 'next/navigation'
import { BOOKING } from '@/lib/config'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!BOOKING.showBookingsAdmin) {
    notFound()
  }

  const session = await getServerSession()
  if (!session?.user?.email || session.user.email !== BOOKING.adminEmail) {
    redirect('/api/auth/signin')
  }

  return <>{children}</>
}
