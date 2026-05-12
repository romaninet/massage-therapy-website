import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { signToken, verifyToken, TOKEN_TTL_MS } from './bookingTokens'

describe('bookingTokens', () => {
  beforeEach(() => {
    process.env.BOOKING_TOKEN_SECRET = 'test-secret-value-that-is-long-enough-32chars'
    vi.useRealTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('sign then verify same eventId → true', () => {
    const eventId = 'event-123'
    const token = signToken(eventId)
    expect(verifyToken(eventId, token)).toBe(true)
  })

  it('sign eventId-A, verify eventId-B → false', () => {
    const tokenA = signToken('event-A')
    expect(verifyToken('event-B', tokenA)).toBe(false)
  })

  it('sign then tamper HMAC portion → false', () => {
    const eventId = 'event-456'
    const token = signToken(eventId)
    const dot = token.indexOf('.')
    const tampered = token.slice(0, dot + 1) + (token[dot + 1] === 'a' ? 'b' : 'a') + token.slice(dot + 2)
    expect(verifyToken(eventId, tampered)).toBe(false)
  })

  it('empty string token → false (no crash)', () => {
    expect(verifyToken('event-789', '')).toBe(false)
  })

  it('token with no dot separator (malformed) → false', () => {
    expect(verifyToken('event-x', 'nodottoken')).toBe(false)
  })

  it('expired token (> 7 days old) → false', () => {
    const eventId = 'event-expire'
    const token = signToken(eventId)

    vi.useFakeTimers()
    vi.setSystemTime(Date.now() + TOKEN_TTL_MS + 1000)

    expect(verifyToken(eventId, token)).toBe(false)
  })

  it('token at exactly 7 days minus 1 second → still valid', () => {
    const eventId = 'event-fresh'
    const token = signToken(eventId)

    vi.useFakeTimers()
    vi.setSystemTime(Date.now() + TOKEN_TTL_MS - 1000)

    expect(verifyToken(eventId, token)).toBe(true)
  })

  it('sign with secret-A, change env to secret-B, verify → false (then restore env)', () => {
    process.env.BOOKING_TOKEN_SECRET = 'secret-A-that-is-long-enough-for-32-chars!!'
    const eventId = 'event-999'
    const token = signToken(eventId)

    process.env.BOOKING_TOKEN_SECRET = 'secret-B-that-is-long-enough-for-32-chars!!'
    expect(verifyToken(eventId, token)).toBe(false)

    process.env.BOOKING_TOKEN_SECRET = 'secret-A-that-is-long-enough-for-32-chars!!'
    expect(verifyToken(eventId, token)).toBe(true)
  })
})
