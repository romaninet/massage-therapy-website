// Checks that POST requests to admin routes come from the same origin.
// If the Origin header is present and doesn't match the expected host, the
// request is rejected — this blocks CSRF attacks from other sites.
// Absent Origin (server-to-server, curl) is allowed.
export function verifySameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin')
  if (!origin) return true
  const allowed = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'
  return origin === allowed
}
