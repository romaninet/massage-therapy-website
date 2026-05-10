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
