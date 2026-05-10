const TORONTO_TZ = 'America/Toronto'

/**
 * Converts a YYYY-MM-DD date string + HH:MM time string (Toronto local time)
 * to a UTC Date object, correctly handling EDT/EST daylight-saving transitions.
 */
export function torontoTimeToUTC(dateStr: string, timeStr: string): Date {
  // Probe noon UTC on the date — always lands on the same Toronto calendar day
  const probeUTC = new Date(`${dateStr}T12:00:00Z`)
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TORONTO_TZ,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(probeUTC)
  const offsetHours   = parseInt(parts.find(p => p.type === 'hour')!.value,   10)
  const offsetMinutes = parseInt(parts.find(p => p.type === 'minute')!.value, 10)
  // Toronto midnight in UTC = probe minus (hours:minutes past midnight in Toronto)
  const midnightUTC = probeUTC.getTime() - (offsetHours * 60 + offsetMinutes) * 60_000
  const [h, m] = timeStr.split(':').map(Number)
  return new Date(midnightUTC + (h * 60 + m) * 60_000)
}

export function torontoTime(d: Date): string {
  return d.toLocaleTimeString('en-CA', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: TORONTO_TZ,
  })
}

export function torontoDate(d: Date): string {
  return d.toLocaleDateString('en-CA', { timeZone: TORONTO_TZ })
}

const PAGE_SHELL = (title: string, body: string) => `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head>
<body style="font-family:Georgia,serif;background:#FAF9F5;margin:0;padding:40px 20px;color:#1a2e25;">
  <div style="max-width:520px;margin:0 auto;background:#fff;border:1px solid #d4e6dc;border-radius:8px;overflow:hidden;">
    ${body}
  </div>
</body>
</html>`

export function confirmationPage(
  action: 'accept' | 'decline',
  clientName: string,
  serviceName: string | number | unknown,
  durationMinutes: string | number | unknown,
  startTime: string,
  actionUrl: string,
): string {
  const isAccept = action === 'accept'
  const headerColor = isAccept ? '#2D6A4F' : '#b91c1c'
  const headerText = isAccept ? 'Confirm Booking Acceptance' : 'Confirm Booking Decline'
  const btnLabel = isAccept ? 'Yes, Accept Booking' : 'Yes, Decline Booking'
  const btnColor = headerColor

  return PAGE_SHELL(headerText, `
    <div style="background:${headerColor};padding:24px 32px;">
      <h1 style="color:#fff;margin:0;font-size:20px;font-weight:600;">${headerText}</h1>
      <p style="color:rgba(255,255,255,0.65);margin:6px 0 0;font-size:13px;font-family:sans-serif;">Olha Shelest — Massage Therapy</p>
    </div>
    <div style="padding:28px 32px;">
      <p style="font-family:sans-serif;font-size:15px;margin:0 0 20px;">Please confirm you want to <strong>${action}</strong> this booking:</p>
      <table style="width:100%;border-collapse:collapse;font-family:sans-serif;font-size:14px;">
        <tr>
          <td style="padding:8px 0;color:#5a7a6a;font-weight:600;width:130px;">Client</td>
          <td style="padding:8px 0;color:#1a2e25;">${clientName}</td>
        </tr>
        <tr style="border-top:1px solid #e8f3ed;">
          <td style="padding:8px 0;color:#5a7a6a;font-weight:600;">Service</td>
          <td style="padding:8px 0;color:#1a2e25;">${serviceName}${durationMinutes ? ` (${durationMinutes} min)` : ''}</td>
        </tr>
        <tr style="border-top:1px solid #e8f3ed;">
          <td style="padding:8px 0;color:#5a7a6a;font-weight:600;">Time</td>
          <td style="padding:8px 0;color:#1a2e25;">${startTime}</td>
        </tr>
      </table>
      <div style="margin-top:28px;display:flex;gap:12px;font-family:sans-serif;">
        <a href="${actionUrl}" style="display:inline-block;padding:12px 24px;background:${btnColor};color:#fff;text-decoration:none;font-size:15px;font-weight:600;border-radius:4px;">${btnLabel}</a>
        <a href="javascript:window.close()" style="display:inline-block;padding:12px 24px;background:#e8f3ed;color:#2D6A4F;text-decoration:none;font-size:15px;font-weight:600;border-radius:4px;">Cancel</a>
      </div>
    </div>`)
}

export function successPage(action: 'accept' | 'decline', clientName: string): string {
  const isAccept = action === 'accept'
  const title = isAccept ? 'Booking Accepted' : 'Booking Declined'
  const message = isAccept
    ? `Booking confirmed. ${clientName} has been notified.`
    : `Booking declined. ${clientName} has been notified.`
  return PAGE_SHELL(title, `
    <div style="background:#2D6A4F;padding:24px 32px;">
      <h1 style="color:#fff;margin:0;font-size:20px;font-weight:600;">${title}</h1>
      <p style="color:rgba(255,255,255,0.65);margin:6px 0 0;font-size:13px;font-family:sans-serif;">Olha Shelest — Massage Therapy</p>
    </div>
    <div style="padding:28px 32px;font-family:sans-serif;font-size:15px;">
      <p style="margin:0;">${message}</p>
    </div>`)
}

export function alreadyHandledPage(): string {
  return PAGE_SHELL('Booking Already Handled', `
    <div style="background:#2D6A4F;padding:24px 32px;">
      <h1 style="color:#fff;margin:0;font-size:20px;font-weight:600;">Booking Already Handled</h1>
      <p style="color:rgba(255,255,255,0.65);margin:6px 0 0;font-size:13px;font-family:sans-serif;">Olha Shelest — Massage Therapy</p>
    </div>
    <div style="padding:28px 32px;font-family:sans-serif;font-size:15px;">
      <p style="margin:0;">This booking has already been handled and is no longer pending. No further action is needed.</p>
    </div>`)
}

export function htmlResponse(body: string, status = 200): Response {
  return new Response(body, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}

export function jsonResponse(body: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export function getClientIp(request: Request): string | undefined {
  return (
    request.headers.get('x-forwarded-for') ??
    request.headers.get('x-real-ip') ??
    undefined
  )
}
