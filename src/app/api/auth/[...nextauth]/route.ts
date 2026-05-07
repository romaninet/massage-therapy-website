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
      return profile?.email === BOOKING.adminEmail
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
