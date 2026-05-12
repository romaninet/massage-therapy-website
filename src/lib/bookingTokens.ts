import { createHmac, timingSafeEqual } from 'crypto'

export const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000  // 7 days

function getSecret(): string {
  const secret = process.env.BOOKING_TOKEN_SECRET
  if (!secret || secret.length < 32) {
    throw new Error('BOOKING_TOKEN_SECRET env var is not set or is too short (minimum 32 characters)')
  }
  return secret
}

function hmac(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('hex')
}

// Signs an eventId. Returns "${issuedAt}.${hmac(eventId:issuedAt)}"
// The issuedAt timestamp is embedded so verifyToken can enforce expiry without a database.
export function signToken(eventId: string): string {
  const secret = getSecret()
  const issuedAt = Date.now()
  const sig = hmac(`${eventId}:${issuedAt}`, secret)
  return `${issuedAt}.${sig}`
}

// Verifies token is a valid, non-expired HMAC for eventId. Returns true/false.
export function verifyToken(eventId: string, token: string): boolean {
  const dot = token.indexOf('.')
  if (dot === -1) return false

  const issuedAt = parseInt(token.slice(0, dot), 10)
  const sig = token.slice(dot + 1)

  if (isNaN(issuedAt)) return false
  if (Date.now() - issuedAt > TOKEN_TTL_MS) return false

  const secret = getSecret()
  const expected = hmac(`${eventId}:${issuedAt}`, secret)
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  } catch {
    return false  // different lengths — tampered
  }
}
