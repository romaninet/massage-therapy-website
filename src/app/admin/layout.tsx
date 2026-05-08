import { getServerSession } from 'next-auth'
import { redirect, notFound } from 'next/navigation'
import { BOOKING } from '@/lib/config'
import { dmSans } from '@/lib/fonts'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!BOOKING.showBookingsAdmin) {
    notFound()
  }

  const session = await getServerSession()
  if (!session?.user?.email || session.user.email !== BOOKING.adminEmail) {
    redirect('/api/auth/signin?callbackUrl=/admin')
  }

  return (
    <html lang="en" className={dmSans.variable}>
      <body>{children}</body>
    </html>
  )
}
