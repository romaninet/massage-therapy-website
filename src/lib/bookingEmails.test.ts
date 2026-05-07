import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { BookingDetails } from './bookingEmails'

// ── Mock resend ───────────────────────────────────────────────────────────────

const mockSend = vi.fn().mockResolvedValue({ error: null })

vi.mock('resend', () => {
  const ResendMock = vi.fn(function (this: unknown) {
    // @ts-expect-error dynamic property on mock instance
    ;(this as { emails: { send: typeof mockSend } }).emails = { send: mockSend }
  })
  return { Resend: ResendMock }
})

// ── Mock bookingTokens so signToken is deterministic ─────────────────────────

vi.mock('./bookingTokens', () => ({
  signToken: (eventId: string) => `mock-sig-${eventId}`,
}))

// ── Import after mocks ────────────────────────────────────────────────────────

import {
  sendBookingRequestEmail,
  sendBookingConfirmationEmail,
  sendBookingDeclineEmail,
  sendBookingCancellationEmail,
} from './bookingEmails'

// ── Fixtures ─────────────────────────────────────────────────────────────────

function makeBooking(overrides: Partial<BookingDetails> = {}): BookingDetails {
  // Session: Thursday May 14 2026, 2:00 PM – 3:00 PM (Toronto)
  const sessionStart = new Date('2026-05-14T18:00:00Z') // 18:00 UTC = 14:00 EDT
  const sessionEnd   = new Date('2026-05-14T19:00:00Z') // 19:00 UTC = 15:00 EDT
  const breakStart   = new Date('2026-05-14T19:00:00Z')
  const breakEnd     = new Date('2026-05-14T19:30:00Z')

  return {
    clientName: 'Jane Doe',
    clientEmail: 'jane@example.com',
    clientPhone: '(613) 555-1234',
    clientNotes: 'Lower back pain',
    serviceKey: 'deepTissue',
    serviceName: 'Deep Tissue Massage',
    durationMinutes: 60,
    sessionStart,
    sessionEnd,
    breakStart,
    breakEnd,
    eventId: 'evt-abc-123',
    ...overrides,
  }
}

function getLastSentEmail() {
  const calls = mockSend.mock.calls
  return calls[calls.length - 1][0] as {
    from: string
    to: string
    subject: string
    html: string
  }
}

beforeEach(() => {
  mockSend.mockClear()
})

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('sendBookingRequestEmail', () => {
  it('subject contains clientName, serviceName, duration, and date', async () => {
    const booking = makeBooking()
    await sendBookingRequestEmail(booking)
    const { subject } = getLastSentEmail()
    expect(subject).toContain('Jane Doe')
    expect(subject).toContain('Deep Tissue Massage')
    expect(subject).toContain('60min')
    expect(subject).toMatch(/May 14, 2026/)
  })

  it('body contains session start, session end, and session duration', async () => {
    const booking = makeBooking()
    await sendBookingRequestEmail(booking)
    const { html } = getLastSentEmail()
    expect(html).toContain('2:00')  // session start
    expect(html).toContain('3:00')  // session end
    expect(html).toContain('60')    // duration in minutes
  })

  it('body contains break start, break end, and break duration', async () => {
    const booking = makeBooking()
    await sendBookingRequestEmail(booking)
    const { html } = getLastSentEmail()
    expect(html).toContain('3:00')  // break start (same as session end)
    expect(html).toContain('3:30')  // break end
    expect(html).toContain('30')    // break duration (BOOKING.breakAfterSession)
  })

  it('body contains client name, phone, email, and serviceName', async () => {
    const booking = makeBooking()
    await sendBookingRequestEmail(booking)
    const { html } = getLastSentEmail()
    expect(html).toContain('Jane Doe')
    expect(html).toContain('(613) 555-1234')
    expect(html).toContain('jane@example.com')
    expect(html).toContain('Deep Tissue Massage')
  })

  it('body contains Accept URL and Decline URL with eventId', async () => {
    const booking = makeBooking()
    await sendBookingRequestEmail(booking)
    const { html } = getLastSentEmail()
    expect(html).toContain('evt-abc-123')
    expect(html).toContain('/api/booking/confirm')
    expect(html).toContain('/api/booking/decline')
    expect(html).toContain('mock-sig-evt-abc-123')
  })
})

describe('sendBookingConfirmationEmail', () => {
  it('contains date, session start/end time, and business address', async () => {
    const booking = makeBooking()
    await sendBookingConfirmationEmail(booking)
    const { html } = getLastSentEmail()
    expect(html).toMatch(/May 14, 2026/)
    expect(html).toContain('2:00')  // session start
    expect(html).toContain('3:00')  // session end
    expect(html).toContain('148 Rue Eddy')
  })
})

describe('sendBookingDeclineEmail', () => {
  it('contains booking page URL', async () => {
    const booking = makeBooking()
    await sendBookingDeclineEmail(booking)
    const { html } = getLastSentEmail()
    expect(html).toContain('/booking')
  })
})

describe('sendBookingCancellationEmail', () => {
  it('email is sent to client email address', async () => {
    const booking = makeBooking({ clientEmail: 'jane@example.com' })
    await sendBookingCancellationEmail(booking)
    const { to } = getLastSentEmail()
    expect(to).toBe('jane@example.com')
  })

  it('subject contains appointment date', async () => {
    const booking = makeBooking()
    await sendBookingCancellationEmail(booking)
    const { subject } = getLastSentEmail()
    expect(subject).toMatch(/May 14, 2026/)
  })

  it('body contains contact info for rebooking', async () => {
    const booking = makeBooking()
    await sendBookingCancellationEmail(booking)
    const { html } = getLastSentEmail()
    // BUSINESS.phone and BUSINESS.email should be in the HTML for rebooking
    expect(html).toMatch(/Phone:|Email:/)
  })
})

describe('French locale test', () => {
  it("Olha's email uses whatever serviceName is passed (French name preserved)", async () => {
    const booking = makeBooking({ serviceName: 'Massage en profondeur' })
    await sendBookingRequestEmail(booking)
    const { subject, html } = getLastSentEmail()
    expect(subject).toContain('Massage en profondeur')
    expect(html).toContain('Massage en profondeur')
  })
})
