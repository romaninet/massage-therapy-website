import { createHmac, timingSafeEqual } from 'crypto'

// Signs an eventId, returns hex HMAC-SHA256
export function signToken(eventId: string): string {
  const secret = process.env.BOOKING_TOKEN_SECRET ?? ''
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
