import { Resend } from 'resend'
import { BUSINESS, BOOKING, SITE } from './config'
import { signToken } from './bookingTokens'

const FROM_ADDRESS = `Olha Shelest Massage <booking@shelestwellness.ca>`

export interface BookingDetails {
  clientName: string
  clientEmail: string
  clientPhone: string
  clientNotes?: string
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
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(d)
}

// ── Shared Resend instance ────────────────────────────────────────────────────

function getResend(): Resend {
  return new Resend(process.env.RESEND_API_KEY ?? '')
}

// ── sendBookingRequestEmail (to Olha) ─────────────────────────────────────────

export async function sendBookingRequestEmail(booking: BookingDetails): Promise<void> {
  const {
    clientName, clientEmail, clientPhone, clientNotes,
    serviceName, durationMinutes,
    sessionStart, sessionEnd,
    breakStart, breakEnd,
    eventId,
  } = booking

  const date = formatDate(sessionStart)
  const subject = `New Booking Request — ${clientName}, ${serviceName} ${durationMinutes}min, ${date}`

  const acceptUrl = `${SITE.url}/api/booking/confirm?eventId=${encodeURIComponent(eventId)}&sig=${signToken(eventId)}`
  const declineUrl = `${SITE.url}/api/booking/decline?eventId=${encodeURIComponent(eventId)}&sig=${signToken(eventId)}`

  const breakDuration = BOOKING.breakAfterSession

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><style>
  body { font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; }
  table { border-collapse: collapse; width: 100%; margin: 16px 0; }
  td { padding: 8px 12px; border: 1px solid #ddd; vertical-align: top; }
  td:first-child { font-weight: bold; width: 40%; background: #f5f5f5; }
  .btn { display: inline-block; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-weight: bold; font-size: 16px; margin: 8px; }
  .accept { background: #2D6A4F; color: #fff; }
  .decline { background: #b91c1c; color: #fff; }
  h2 { color: #2D6A4F; }
</style></head>
<body>
  <h2>New Booking Request</h2>
  <table>
    <tr><td>Client Name</td><td>${clientName}</td></tr>
    <tr><td>Phone</td><td>${clientPhone}</td></tr>
    <tr><td>Email</td><td>${clientEmail}</td></tr>
    <tr><td>Service</td><td>${serviceName}</td></tr>
    <tr><td>Duration</td><td>${durationMinutes} min</td></tr>
    <tr><td>Session Start</td><td>${formatTime(sessionStart)}</td></tr>
    <tr><td>Session End</td><td>${formatTime(sessionEnd)}</td></tr>
    <tr><td>Session Duration</td><td>${durationMinutes} min</td></tr>
    <tr><td>Break Start</td><td>${formatTime(breakStart)}</td></tr>
    <tr><td>Break End</td><td>${formatTime(breakEnd)}</td></tr>
    <tr><td>Break Duration</td><td>${breakDuration} min</td></tr>
    ${clientNotes ? `<tr><td>Client Notes</td><td>${clientNotes}</td></tr>` : ''}
  </table>
  <p style="margin-top: 24px; text-align: center;">
    <a class="btn accept" href="${acceptUrl}">Accept Booking</a>
    <a class="btn decline" href="${declineUrl}">Decline Booking</a>
  </p>
  <hr style="margin-top:32px; border:none; border-top:1px solid #eee;" />
  <p style="font-size:12px; color:#999;">Accept URL: <a href="${acceptUrl}">${acceptUrl}</a></p>
  <p style="font-size:12px; color:#999;">Decline URL: <a href="${declineUrl}">${declineUrl}</a></p>
</body>
</html>`

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
