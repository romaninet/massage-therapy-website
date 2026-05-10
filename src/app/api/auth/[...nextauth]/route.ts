import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { BOOKING } from '@/lib/config'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET ?? '',
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      if (profile?.email === BOOKING.adminEmail) return true
      console.error(
        `[ADMIN-ACCESS-DENIED] ${new Date().toISOString()} | email=${profile?.email ?? 'unknown'} | name=${profile?.name ?? 'unknown'} | sub=${profile?.sub ?? 'unknown'}`
      )
      return false
    },
    async session({ session }) {
      return session
    },
  },
  pages: {
    error: '/admin/auth-error',
  },
})

export { handler as GET, handler as POST }
