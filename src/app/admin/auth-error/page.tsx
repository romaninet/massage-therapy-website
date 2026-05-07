import Link from 'next/link'

export default function AuthErrorPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <h1 className="mb-4 text-2xl font-semibold">Access Denied</h1>
      <p className="mb-8 text-gray-600">
        This area is restricted to authorized users only.
      </p>
      <Link href="/" className="text-sm underline">
        Return to home page
      </Link>
    </main>
  )
}
