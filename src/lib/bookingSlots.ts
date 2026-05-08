import type { CalendarEvent } from './googleCalendar'
import { BOOKING } from './config'

/**
 * Returns available start times (as Date objects) for a given date/duration.
 *
 * Availability windows are calendar events whose title equals
 * BOOKING.availabilityEventTitle. Blocking events are those whose title starts
 * with [PENDING], [CONFIRMED], or [BREAK].
 *
 * For each availability window, candidate slots are generated every
 * BOOKING.slotInterval minutes starting at the window start. A candidate is
 * included only when:
 *   - candidate + durationMinutes <= window.end  (session fits; break may extend past window)
 *   - no blocking event overlaps the candidate session time
 *
 * @param events        All calendar events for the target date.
 * @param durationMinutes  Requested session length in minutes.
 * @param targetDate    Used only to scope results to this calendar date.
 * @returns Sorted ascending list of valid start times.
 */
export function getAvailableSlots(
  events: CalendarEvent[],
  durationMinutes: number,
  targetDate: Date,
): Date[] {
  // Scope: only care about events on the target calendar date in Toronto timezone.
  // Cannot use UTC dates — a 22:00 Toronto block starts on the next UTC date.
  const targetDateStr = targetDate.toISOString().slice(0, 10)
  const torontoDate = (d: Date) =>
    d.toLocaleDateString('en-CA', { timeZone: 'America/Toronto' })

  const availabilityWindows = events.filter(
    (e) =>
      e.title === BOOKING.availabilityEventTitle &&
      torontoDate(e.start) === targetDateStr,
  )

  const blockingEvents = events.filter((e) => {
    const t = e.title
    return t.startsWith('[PENDING]') || t.startsWith('[CONFIRMED]') || t.startsWith('[BREAK]')
  })

  const SLOT_MS = BOOKING.slotInterval * 60 * 1000
  const DURATION_MS = durationMinutes * 60 * 1000
  const BREAK_MS = BOOKING.breakAfterSession * 60 * 1000

  const results: Date[] = []

  for (const window of availabilityWindows) {
    const windowStart = window.start.getTime()
    const windowEnd = window.end.getTime()

    // Snap to the next :00 or :30 boundary (multiples of slotInterval from Unix epoch)
    let candidateMs = Math.ceil(windowStart / SLOT_MS) * SLOT_MS

    while (candidateMs < windowEnd) {
      // Session must fit inside the window; break may extend past window end
      if (candidateMs + DURATION_MS > windowEnd) break

      // Check overlap against blocking events
      const sessionEnd = candidateMs + DURATION_MS
      const overlaps = blockingEvents.some((b) => {
        const bs = b.start.getTime()
        const be = b.end.getTime()
        return candidateMs < be && sessionEnd > bs
      })

      if (!overlaps) {
        results.push(new Date(candidateMs))
      }

      candidateMs += SLOT_MS
    }
  }

  const seen = new Set<number>()
  return results
    .filter((d) => {
      const ms = d.getTime()
      if (seen.has(ms)) return false
      seen.add(ms)
      return true
    })
    .sort((a, b) => a.getTime() - b.getTime())
}
