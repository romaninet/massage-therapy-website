import { getServerSession } from 'next-auth'
import AdminDashboard from './AdminDashboard'

export default async function AdminPage() {
  const session = await getServerSession()
  const email = session?.user?.email ?? ''

  return (
    <main className="min-h-screen bg-[#FAF9F5]">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-[#2D6A4F]">Booking Dashboard</h1>
          {email && (
            <span className="text-sm text-gray-500">{email}</span>
          )}
        </div>
        <AdminDashboard />
      </div>
    </main>
  )
}
