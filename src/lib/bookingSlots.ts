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
 *   - candidate + durationMinutes + BOOKING.breakAfterSession <= window.end
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
  // Scope: only care about events on the target calendar date (UTC date string)
  const targetDateStr = targetDate.toISOString().slice(0, 10)

  const availabilityWindows = events.filter(
    (e) =>
      e.title === BOOKING.availabilityEventTitle &&
      e.start.toISOString().slice(0, 10) === targetDateStr,
  )

  const blockingEvents = events.filter((e) => {
    const t = e.title
    return t.startsWith('[PENDING]') || t.startsWith('[CONFIRMED]') || t.startsWith('[BREAK]')
  })

  const SLOT_MS = BOOKING.slotInterval * 60 * 1000
  const BREAK_MS = BOOKING.breakAfterSession * 60 * 1000
  const DURATION_MS = durationMinutes * 60 * 1000

  const results: Date[] = []

  for (const window of availabilityWindows) {
    const windowStart = window.start.getTime()
    const windowEnd = window.end.getTime()

    let candidateMs = windowStart

    while (candidateMs < windowEnd) {
      const requiredEnd = candidateMs + DURATION_MS + BREAK_MS

      // Must fit entirely within the availability window
      if (requiredEnd > windowEnd) break

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

  return results.sort((a, b) => a.getTime() - b.getTime())
}
