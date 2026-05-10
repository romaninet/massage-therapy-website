import { Resend } from 'resend'
import { BUSINESS, BOOKING, SITE } from './config'
import { signToken } from './bookingTokens'

const FROM_ADDRESS = `Massage Booking Request <massage@shelestwellness.ca>`

export interface BookingDetails {
  clientName: string
  clientEmail: string
  clientPhone: string
  clientNotes?: string
  preferredLanguage?: string
  serviceKey: string
  serviceName: string
  durationMinutes: number
  sessionStart: Date
  sessionEnd: Date
  breakStart: Date
  breakEnd: Date
  eventId: string
}

// ── Formatting helpers ────────────────────────────────────────────────────────

const TZ = 'America/Toronto'

function formatDate(d: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

function formatTime(d: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(d)
}

// ── Shared Resend instance ────────────────────────────────────────────────────

function getResend(): Resend {
  return new Resend(process.env.RESEND_API_KEY ?? '')
}

// ── sendBookingRequestEmail (to Olha) ─────────────────────────────────────────

export async function sendBookingRequestEmail(booking: BookingDetails, baseUrl?: string): Promise<void> {
  const {
    clientName, clientEmail, clientPhone, clientNotes, preferredLanguage,
    serviceName, durationMinutes,
    sessionStart, sessionEnd,
    breakStart, breakEnd,
    eventId,
  } = booking

  const date = formatDate(sessionStart)
  const subject = `New Booking Request — ${clientName}, ${serviceName} ${durationMinutes}min, ${date}`

  const origin = baseUrl ?? SITE.url
  const acceptUrl = `${origin}/api/booking/confirm?eventId=${encodeURIComponent(eventId)}&sig=${signToken(eventId)}`
  const declineUrl = `${origin}/api/booking/decline?eventId=${encodeURIComponent(eventId)}&sig=${signToken(eventId)}`

  const breakDuration = BOOKING.breakAfterSession

  const html = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #FAF9F5; border: 1px solid #d4e6dc; border-radius: 8px;">
      <div style="background: #2D6A4F; padding: 24px 32px; border-radius: 6px 6px 0 0; margin: -32px -32px 32px -32px;">
        <h1 style="color: white; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;">
          New Massage Booking Request
        </h1>
        <p style="color: rgba(255,255,255,0.6); margin: 6px 0 0; font-size: 13px; font-family: sans-serif;">
          Olha Shelest — Massage Therapy
        </p>
      </div>
      <table style="width: 100%; border-collapse: collapse; font-family: sans-serif; font-size: 14px;">
        <tr>
          <td style="padding: 10px 0; color: #5a7a6a; font-weight: 600; width: 140px; vertical-align: top;">Client Name</td>
          <td style="padding: 10px 0; color: #1a2e25;">${clientName}</td>
        </tr>
        <tr style="border-top: 1px solid #e8f3ed;">
          <td style="padding: 10px 0; color: #5a7a6a; font-weight: 600; vertical-align: top;">Phone</td>
          <td style="padding: 10px 0; color: #1a2e25;">${clientPhone}</td>
        </tr>
        <tr style="border-top: 1px solid #e8f3ed;">
          <td style="padding: 10px 0; color: #5a7a6a; font-weight: 600; vertical-align: top;">Email</td>
          <td style="padding: 10px 0;"><a href="mailto:${clientEmail}" style="color: #2D6A4F;">${clientEmail}</a></td>
        </tr>
        <tr style="border-top: 1px solid #e8f3ed;">
          <td style="padding: 10px 0; color: #5a7a6a; font-weight: 600; vertical-align: top;">Service</td>
          <td style="padding: 10px 0; color: #1a2e25;">${serviceName}</td>
        </tr>
        <tr style="border-top: 1px solid #e8f3ed;">
          <td style="padding: 10px 0; color: #5a7a6a; font-weight: 600; vertical-align: top;">Duration</td>
          <td style="padding: 10px 0; color: #1a2e25;">${durationMinutes} min</td>
        </tr>
        <tr style="border-top: 1px solid #e8f3ed;">
          <td style="padding: 10px 0; color: #5a7a6a; font-weight: 600; vertical-align: top;">Date</td>
          <td style="padding: 10px 0; color: #1a2e25;">${date}</td>
        </tr>
        <tr style="border-top: 1px solid #e8f3ed;">
          <td style="padding: 10px 0; color: #5a7a6a; font-weight: 600; vertical-align: top;">Session</td>
          <td style="padding: 10px 0; color: #1a2e25;">${formatTime(sessionStart)} – ${formatTime(sessionEnd)}</td>
        </tr>
        <tr style="border-top: 1px solid #e8f3ed;">
          <td style="padding: 10px 0; color: #5a7a6a; font-weight: 600; vertical-align: top;">Break</td>
          <td style="padding: 10px 0; color: #1a2e25;">${formatTime(breakStart)} – ${formatTime(breakEnd)} (${breakDuration} min)</td>
        </tr>
        ${clientNotes ? `
        <tr style="border-top: 1px solid #e8f3ed;">
          <td style="padding: 10px 0; color: #5a7a6a; font-weight: 600; vertical-align: top;">Notes</td>
          <td style="padding: 10px 0; color: #1a2e25; white-space: pre-wrap;">${clientNotes}</td>
        </tr>` : ''}
        ${preferredLanguage ? `
        <tr style="border-top: 1px solid #e8f3ed;">
          <td style="padding: 10px 0; color: #5a7a6a; font-weight: 600; vertical-align: top;">Preferred Language</td>
          <td style="padding: 10px 0; color: #1a2e25;">${preferredLanguage === 'fr' ? 'French / Français' : 'English'}</td>
        </tr>` : ''}
      </table>
      <div style="margin-top: 24px; text-align: center;">
        <a href="${acceptUrl}" style="display: inline-block; padding: 12px 28px; background: #2D6A4F; color: #fff; text-decoration: none; font-family: sans-serif; font-size: 15px; font-weight: 600; border-radius: 4px; margin: 0 8px;">Accept Booking</a>
        <a href="${declineUrl}" style="display: inline-block; padding: 12px 28px; background: #b91c1c; color: #fff; text-decoration: none; font-family: sans-serif; font-size: 15px; font-weight: 600; border-radius: 4px; margin: 0 8px;">Decline Booking</a>
      </div>
      <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #d4e6dc; font-family: sans-serif; font-size: 12px; color: #999;">
        Sent from the booking form at ${SITE.url}
      </div>
    </div>`

  const resend = getResend()
  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to: BOOKING.adminEmail,
    subject,
    html,
  })

  if (error) throw new Error(`sendBookingRequestEmail failed: ${JSON.stringify(error)}`)
}

// ── sendBookingConfirmationEmail (to client) ──────────────────────────────────

export async function sendBookingConfirmationEmail(booking: BookingDetails): Promise<void> {
  const {
    clientName, clientEmail,
    serviceName, durationMinutes,
    sessionStart, sessionEnd,
  } = booking

  const date = formatDate(sessionStart)
  const startTime = formatTime(sessionStart)
  const endTime = formatTime(sessionEnd)
  const subject = `Your appointment is confirmed — ${date} at ${startTime}`

  const fullAddress = `${BUSINESS.address}, ${BUSINESS.city}`

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><style>
  body { font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; }
  table { border-collapse: collapse; width: 100%; margin: 16px 0; }
  td { padding: 8px 12px; border: 1px solid #ddd; vertical-align: top; }
  td:first-child { font-weight: bold; width: 40%; background: #f5f5f5; }
  h2 { color: #2D6A4F; }
  .notice { background: #f0f7f4; padding: 12px 16px; border-left: 4px solid #2D6A4F; margin: 16px 0; font-size: 14px; }
</style></head>
<body>
  <h2>Your Appointment is Confirmed</h2>
  <p>Hi ${clientName}, your massage appointment has been confirmed. Here are the details:</p>
  <table>
    <tr><td>Service</td><td>${serviceName}</td></tr>
    <tr><td>Duration</td><td>${durationMinutes} min</td></tr>
    <tr><td>Date</td><td>${date}</td></tr>
    <tr><td>Start Time</td><td>${startTime}</td></tr>
    <tr><td>End Time</td><td>${endTime}</td></tr>
    <tr><td>Location</td><td>${fullAddress}</td></tr>
  </table>
  <h3 style="color:#2D6A4F;">Payment</h3>
  <p>Payment is due at the time of your appointment. Accepted methods:</p>
  <ul>
    <li>Cash</li>
    <li>Interac e-Transfer</li>
  </ul>
  <div class="notice">
    <strong>Cancellation Policy:</strong> Please provide at least ${BOOKING.cancellationNoticeHours} hours notice if you need to cancel or reschedule.
    To cancel, contact us at <a href="tel:${BUSINESS.phoneTel}">${BUSINESS.phone}</a> or
    <a href="mailto:${BUSINESS.email}">${BUSINESS.email}</a>.
  </div>
  <p>We look forward to seeing you!</p>
  <p>— Olha Shelest<br>${BUSINESS.phone}<br><a href="mailto:${BUSINESS.email}">${BUSINESS.email}</a></p>
</body>
</html>`

  const resend = getResend()
  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to: clientEmail,
    subject,
    html,
  })

  if (error) throw new Error(`sendBookingConfirmationEmail failed: ${JSON.stringify(error)}`)
}

// ── sendBookingDeclineEmail (to client) ───────────────────────────────────────

export async function sendBookingDeclineEmail(booking: BookingDetails): Promise<void> {
  const { clientName, clientEmail, sessionStart } = booking

  const date = formatDate(sessionStart)
  const subject = `Booking Request — Update`
  const bookingUrl = `${SITE.url}/booking`

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><style>
  body { font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; }
  h2 { color: #2D6A4F; }
</style></head>
<body>
  <h2>Booking Request Update</h2>
  <p>Hi ${clientName},</p>
  <p>Thank you for your booking request for <strong>${date}</strong>. Unfortunately, that time slot is no longer available.</p>
  <p>We apologize for any inconvenience. Please visit our booking page to select another available time:</p>
  <p><a href="${bookingUrl}" style="color:#2D6A4F;">${bookingUrl}</a></p>
  <p>You are also welcome to reach us directly:</p>
  <ul>
    <li>Phone: <a href="tel:${BUSINESS.phoneTel}">${BUSINESS.phone}</a></li>
    <li>Email: <a href="mailto:${BUSINESS.email}">${BUSINESS.email}</a></li>
  </ul>
  <p>We hope to find a time that works for you soon.</p>
  <p>— Olha Shelest</p>
</body>
</html>`

  const resend = getResend()
  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to: clientEmail,
    subject,
    html,
  })

  if (error) throw new Error(`sendBookingDeclineEmail failed: ${JSON.stringify(error)}`)
}

// ── sendBotAlertEmail (to Olha) ───────────────────────────────────────────────

export async function sendBotAlertEmail(reason: 'honeypot' | 'timing', clientIp?: string): Promise<void> {
  const subject = `⚠️ Bot detection alert — booking form`
  const reasonText = reason === 'honeypot'
    ? 'Honeypot field was filled in (automated form submission).'
    : 'Form submitted too quickly (< 4 s after contact step loaded).'

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"></head>
<body style="font-family:Arial,sans-serif;color:#333;max-width:600px;margin:0 auto;">
  <h2 style="color:#b91c1c;">⚠️ Bot detection alert</h2>
  <p>A booking submission was blocked because it failed the bot protection check.</p>
  <table style="border-collapse:collapse;width:100%;margin:16px 0;">
    <tr><td style="padding:8px 12px;border:1px solid #ddd;font-weight:bold;background:#f5f5f5;width:40%;">Reason</td><td style="padding:8px 12px;border:1px solid #ddd;">${reasonText}</td></tr>
    ${clientIp ? `<tr><td style="padding:8px 12px;border:1px solid #ddd;font-weight:bold;background:#f5f5f5;">IP Address</td><td style="padding:8px 12px;border:1px solid #ddd;">${clientIp}</td></tr>` : ''}
    <tr><td style="padding:8px 12px;border:1px solid #ddd;font-weight:bold;background:#f5f5f5;">Time</td><td style="padding:8px 12px;border:1px solid #ddd;">${new Date().toISOString()}</td></tr>
  </table>
  <p style="font-size:12px;color:#999;">No action required unless you see many of these. If attacks persist, enable rate limiting (see bookings_plan.md → Priority 2).</p>
</body>
</html>`

  const resend = getResend()
  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to: BOOKING.adminEmail,
    subject,
    html,
  })

  if (error) throw new Error(`sendBotAlertEmail failed: ${JSON.stringify(error)}`)
}

// ── sendBookingCancellationEmail (to client) ──────────────────────────────────

export async function sendBookingCancellationEmail(booking: BookingDetails): Promise<void> {
  const { clientName, clientEmail, sessionStart } = booking

  const date = formatDate(sessionStart)
  const subject = `Your appointment on ${date} has been cancelled`

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><style>
  body { font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; }
  h2 { color: #2D6A4F; }
</style></head>
<body>
  <h2>Appointment Cancellation</h2>
  <p>Hi ${clientName},</p>
  <p>Your massage appointment scheduled for <strong>${date}</strong> has been cancelled.</p>
  <p>We apologize for the inconvenience. To rebook, please contact us:</p>
  <ul>
    <li>Phone: <a href="tel:${BUSINESS.phoneTel}">${BUSINESS.phone}</a></li>
    <li>Email: <a href="mailto:${BUSINESS.email}">${BUSINESS.email}</a></li>
  </ul>
  <p>We look forward to seeing you at a new time.</p>
  <p>— Olha Shelest</p>
</body>
</html>`

  const resend = getResend()
  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to: clientEmail,
    subject,
    html,
  })

  if (error) throw new Error(`sendBookingCancellationEmail failed: ${JSON.stringify(error)}`)
}
