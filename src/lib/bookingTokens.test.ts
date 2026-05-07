import { describe, it, expect, beforeEach } from 'vitest'
import { signToken, verifyToken } from './bookingTokens'

describe('bookingTokens', () => {
  beforeEach(() => {
    process.env.BOOKING_TOKEN_SECRET = 'test-secret-value'
  })

  it('sign then verify same eventId → true', () => {
    const eventId = 'event-123'
    const sig = signToken(eventId)
    expect(verifyToken(eventId, sig)).toBe(true)
  })

  it('sign eventId-A, verify eventId-B → false', () => {
    const sigA = signToken('event-A')
    expect(verifyToken('event-B', sigA)).toBe(false)
  })

  it('sign then tamper last char of sig, verify → false', () => {
    const eventId = 'event-456'
    let sig = signToken(eventId)
    // Tamper last character
    sig = sig.slice(0, -1) + (sig[sig.length - 1] === 'a' ? 'b' : 'a')
    expect(verifyToken(eventId, sig)).toBe(false)
  })

  it('verifyToken with empty string sig → false (no crash)', () => {
    const eventId = 'event-789'
    expect(verifyToken(eventId, '')).toBe(false)
  })

  it('sign with secret-A, change env to secret-B, verify → false (then restore env)', () => {
    process.env.BOOKING_TOKEN_SECRET = 'secret-A'
    const eventId = 'event-999'
    const sig = signToken(eventId)

    process.env.BOOKING_TOKEN_SECRET = 'secret-B'
    expect(verifyToken(eventId, sig)).toBe(false)

    // Restore
    process.env.BOOKING_TOKEN_SECRET = 'secret-A'
    expect(verifyToken(eventId, sig)).toBe(true)
  })
})
