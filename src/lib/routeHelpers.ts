const TORONTO_TZ = 'America/Toronto'

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
