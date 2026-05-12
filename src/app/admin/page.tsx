import { getServerSession } from 'next-auth'
import AdminDashboard from './AdminDashboard'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const session = await getServerSession()
  const email = session?.user?.email ?? ''

  return (
    <main className="min-h-screen bg-[#FAF9F5]">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <AdminDashboard email={email} />
      </div>
    </main>
  )
}
