import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { BookingDetails } from './bookingEmails'

// ── Mock resend ───────────────────────────────────────────────────────────────

const mockSend = vi.fn().mockResolvedValue({ error: null })

vi.mock('resend', () => {
  const ResendMock = vi.fn(function (this: unknown) {
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
  sendBotAlertEmail,
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
    expect(html).toContain('14:00')  // session start (24h)
    expect(html).toContain('15:00')  // session end (24h)
    expect(html).toContain('60')     // duration in minutes
  })

  it('body contains break start, break end, and break duration', async () => {
    const booking = makeBooking()
    await sendBookingRequestEmail(booking)
    const { html } = getLastSentEmail()
    expect(html).toContain('15:00')  // break start (same as session end, 24h)
    expect(html).toContain('15:30')  // break end (24h)
    expect(html).toContain('30')     // break duration (BOOKING.breakAfterSession)
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
    expect(html).toContain('14:00')  // session start (24h)
    expect(html).toContain('15:00')  // session end (24h)
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

  it('body contains booking link, phone, and email for rebooking', async () => {
    const booking = makeBooking()
    await sendBookingCancellationEmail(booking)
    const { html } = getLastSentEmail()
    expect(html).toContain('/booking')
    expect(html).toContain('Book a new appointment')
    expect(html).toContain('Phone:')
    expect(html).toContain('Email:')
    // booking link must appear before phone
    expect(html.indexOf('/booking')).toBeLessThan(html.indexOf('Phone:'))
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

  it('confirmation email subject is in French when preferredLanguage is fr', async () => {
    const booking = makeBooking({ preferredLanguage: 'fr' })
    await sendBookingConfirmationEmail(booking)
    const { subject } = getLastSentEmail()
    expect(subject).toContain('confirmé')
    expect(subject).toMatch(/mai 14, 2026|14 mai 2026/)
  })

  it('confirmation email body is in French when preferredLanguage is fr', async () => {
    const booking = makeBooking({ preferredLanguage: 'fr' })
    await sendBookingConfirmationEmail(booking)
    const { html } = getLastSentEmail()
    expect(html).toContain('Votre rendez-vous est confirmé')
    expect(html).toContain('Bonjour')
    expect(html).toContain('Durée')
    expect(html).toContain('Paiement')
  })

  it('decline email subject is in French when preferredLanguage is fr', async () => {
    const booking = makeBooking({ preferredLanguage: 'fr' })
    await sendBookingDeclineEmail(booking)
    const { subject, html } = getLastSentEmail()
    expect(subject).toContain('réservation')
    expect(html).toContain('Mise à jour')
  })

  it('cancellation email subject and body are in French when preferredLanguage is fr', async () => {
    const booking = makeBooking({ preferredLanguage: 'fr' })
    await sendBookingCancellationEmail(booking)
    const { subject, html } = getLastSentEmail()
    expect(subject).toContain('annulé')
    expect(html).toContain('Annulation de rendez-vous')
    expect(html).toContain('Réserver un nouveau rendez-vous')
    expect(html).toContain('Téléphone:')
    expect(html).toContain('Courriel:')
  })
})

describe('sendBotAlertEmail', () => {
  it('sends alert to admin email with honeypot reason', async () => {
    await sendBotAlertEmail('honeypot', '1.2.3.4')
    const { to, subject, html } = getLastSentEmail()
    expect(to).toBe('shelestwellness@gmail.com')
    expect(subject).toContain('Bot detection')
    expect(html).toContain('Honeypot')
    expect(html).toContain('1.2.3.4')
  })

  it('sends alert to admin email with timing reason', async () => {
    await sendBotAlertEmail('timing')
    const { subject, html } = getLastSentEmail()
    expect(subject).toContain('Bot detection')
    expect(html).toContain('quickly')
  })
})
