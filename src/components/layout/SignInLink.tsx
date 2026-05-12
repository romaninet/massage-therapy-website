'use client'

import { useState, useEffect } from 'react'

export function SignInLink() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  return (
    <a
      href="/api/auth/signin?callbackUrl=/admin"
      rel="nofollow noreferrer"
      className="hover:text-white/60 transition-colors underline underline-offset-4"
    >
      Sign in
    </a>
  )
}
