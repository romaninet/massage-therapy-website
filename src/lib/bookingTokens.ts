import { createHmac, timingSafeEqual } from 'crypto'

function getSecret(): string {
  const secret = process.env.BOOKING_TOKEN_SECRET
  if (!secret || secret.length < 32) {
    throw new Error('BOOKING_TOKEN_SECRET env var is not set or is too short (minimum 32 characters)')
  }
  return secret
}

// Signs an eventId, returns hex HMAC-SHA256
export function signToken(eventId: string): string {
  const secret = getSecret()
  return createHmac('sha256', secret).update(eventId).digest('hex')
}

// Verifies sig is the correct HMAC for eventId. Returns true/false.
export function verifyToken(eventId: string, sig: string): boolean {
  const expected = signToken(eventId)
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  } catch {
    return false  // different lengths
  }
}
