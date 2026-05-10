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
    return (
      t.startsWith(BOOKING.eventTitles.pending) ||
      t.startsWith(BOOKING.eventTitles.confirmed) ||
      t.startsWith(BOOKING.eventTitles.break)
    )
  })

  const SLOT_MS = BOOKING.slotInterval * 60 * 1000
  const DURATION_MS = durationMinutes * 60 * 1000
  const BREAK_MS = BOOKING.breakAfterSession * 60 * 1000

  // Latest time a session of this duration can START across all availability windows.
  // A [BREAK] that starts at or after this point is end-of-day: no slot could begin
  // during it anyway, so it should not block the last valid slot.
  const maxLastValidStartMs = availabilityWindows.length > 0
    ? Math.max(...availabilityWindows.map((w) => w.end.getTime() - DURATION_MS))
    : -Infinity

  const results: Date[] = []

  for (const window of availabilityWindows) {
    const windowStart = window.start.getTime()
    const windowEnd = window.end.getTime()

    // Snap to the next :00 or :30 boundary (multiples of slotInterval from Unix epoch)
    let candidateMs = Math.ceil(windowStart / SLOT_MS) * SLOT_MS

    while (candidateMs < windowEnd) {
      // Session must fit inside the window; break may extend past window end
      if (candidateMs + DURATION_MS > windowEnd) break

      // Check overlap against blocking events.
      // Two symmetrical rules:
      //   (a) PENDING events extend their effective end by BREAK_MS — they have no
      //       sibling [BREAK] on the calendar yet, so we synthesise the buffer.
      //   (b) When checking against a session event (PENDING/CONFIRMED) we use
      //       sessionEnd+BREAK_MS on the right side, so a candidate whose break
      //       would overlap the next session is correctly blocked.
      //   (c) [BREAK] events that start at or after maxLastValidStartMs are end-of-day:
      //       no further slot could begin during them, so they don't block the last slot.
      const sessionEnd = candidateMs + DURATION_MS
      const sessionEndWithBreak = sessionEnd + BREAK_MS
      const overlaps = blockingEvents.some((b) => {
        const bs = b.start.getTime()
        if (b.title === BOOKING.eventTitles.break && bs >= maxLastValidStartMs) return false
        const isSession = b.title.startsWith(BOOKING.eventTitles.pending) || b.title.startsWith(BOOKING.eventTitles.confirmed)
        const be = b.title.startsWith(BOOKING.eventTitles.pending)
          ? b.end.getTime() + BREAK_MS
          : b.end.getTime()
        // For session events use extended right boundary so our break is also accounted for
        const effectiveEnd = isSession ? sessionEndWithBreak : sessionEnd
        return candidateMs < be && effectiveEnd > bs
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
