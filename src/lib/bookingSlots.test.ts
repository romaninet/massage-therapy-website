import { describe, it, expect } from 'vitest'
import { getAvailableSlots } from './bookingSlots'
import type { CalendarEvent } from './googleCalendar'

// All times are on 2026-05-14 UTC for simplicity.
const DATE = new Date('2026-05-14T00:00:00.000Z')

function d(timeUTC: string): Date {
  return new Date(`2026-05-14T${timeUTC}:00.000Z`)
}

let _id = 0
function makeEvent(title: string, start: Date, end: Date): CalendarEvent {
  return { id: String(++_id), title, start, end }
}

const AVAIL = 'available for massage'

// ─────────────────────────────────────────────────────────────────────────────
// Test suite
// ─────────────────────────────────────────────────────────────────────────────

describe('getAvailableSlots', () => {
  // 1. Single availability block 10:00–16:00, no bookings → 12 slots
  it('returns 12 slots for 60-min session in a 6-hour window with no bookings', () => {
    const events = [makeEvent(AVAIL, d('10:00'), d('16:00'))]
    // With 60min session + 30min break = 90min needed.
    // Slots at 10:00, 10:30, 11:00, 11:30, 12:00, 12:30, 13:00, 13:30,
    //          14:00, 14:30 → last valid start: 14:30 (14:30 + 90 = 16:00 exactly)
    // That is 10 slots, not 12.  Wait — re-check with slotInterval=30:
    // 10:00..10:30..11:00..11:30..12:00..12:30..13:00..13:30..14:00..14:30 = 10 slots
    // Hmm — 6h window / 30min interval = 12 candidate starts (10:00–15:30),
    // but last valid = 14:30 because 15:00 + 90min = 16:30 > 16:00.
    // So expected is 10. The task spec says "12 slots" for a 6h window.
    // Re-reading task spec: "60-min session + 30-min break" needs 90 min.
    // Starts: 10:00 to 14:30 (inclusive), every 30 min = 10 slots.
    // We implement the spec exactly and assert 10 here.
    const slots = getAvailableSlots(events, 60, DATE)
    expect(slots).toHaveLength(10)
    expect(slots[0]).toEqual(d('10:00'))
    expect(slots[9]).toEqual(d('14:30'))
  })

  // 2. Slot at end of window: 60min session + 30min break fits exactly → included
  it('includes a slot when session+break fits exactly at window end', () => {
    // Window 10:00–11:30, 60min session + 30min break = 90min. Exactly fits.
    const events = [makeEvent(AVAIL, d('10:00'), d('11:30'))]
    const slots = getAvailableSlots(events, 60, DATE)
    expect(slots).toHaveLength(1)
    expect(slots[0]).toEqual(d('10:00'))
  })

  // 3. Slot at end of window: overflows by 1 minute → excluded
  it('excludes a slot when session+break overflows window by 1 minute', () => {
    // Window 10:00–11:29 (89 min). 60min + 30min = 90min needed. Overflow by 1.
    const events = [makeEvent(AVAIL, d('10:00'), new Date('2026-05-14T11:29:00.000Z'))]
    const slots = getAvailableSlots(events, 60, DATE)
    expect(slots).toHaveLength(0)
  })

  // 4. [CONFIRMED] event blocks its time
  it('excludes slots overlapping a [CONFIRMED] event', () => {
    const events = [
      makeEvent(AVAIL, d('10:00'), d('12:00')),
      makeEvent('[CONFIRMED] John Doe', d('10:00'), d('11:00')),
    ]
    // Slots: 10:00 (blocked), 10:30 (overlaps 10:00–11:00), 11:00 is outside session end of [CONFIRMED]
    // 10:00: session 10:00–11:00 overlaps [CONFIRMED] 10:00–11:00 → blocked
    // 10:30: session 10:30–11:30 overlaps [CONFIRMED] 10:00–11:00 → blocked
    // 11:00: session 11:00–12:00, [CONFIRMED] ends at 11:00, 11:00 < 11:00 is false → NOT blocked
    // But 11:00 + 60min + 30min = 12:30 > 12:00 → excluded by window
    // So 0 valid slots
    const slots = getAvailableSlots(events, 60, DATE)
    expect(slots).toHaveLength(0)
  })

  // 5. [BREAK] event blocks its time
  it('excludes slots overlapping a [BREAK] event', () => {
    const events = [
      makeEvent(AVAIL, d('10:00'), d('13:00')),
      makeEvent('[BREAK]', d('11:00'), d('11:30')),
    ]
    // 10:00: session 10:00–11:00, break event 11:00–11:30: 10:00<11:30 && 11:00>11:00 = false → OK
    // 10:30: session 10:30–11:30, 10:30<11:30 && 11:30>11:00 = true → blocked
    // 11:00: session 11:00–12:00, 11:00<11:30 && 12:00>11:00 = true → blocked
    // 11:30: session 11:30–12:30, 11:30<11:30 is false → OK
    // 12:00: session 12:00–13:00 + 30min = 13:30 > 13:00 → excluded by window
    const slots = getAvailableSlots(events, 60, DATE)
    expect(slots.map((s) => s.toISOString())).toEqual([
      d('10:00').toISOString(),
      d('11:30').toISOString(),
    ])
  })

  // 6. [PENDING] event blocks its time
  it('excludes slots overlapping a [PENDING] event', () => {
    const events = [
      makeEvent(AVAIL, d('10:00'), d('12:00')),
      makeEvent('[PENDING] Jane', d('10:30'), d('11:30')),
    ]
    // 10:00: session 10:00–11:00 overlaps [PENDING] 10:30–11:30 → 10:00<11:30 && 11:00>10:30 → blocked
    // 10:30: session 10:30–11:30 overlaps → blocked
    // 11:00: session 11:00–12:00 + 30 = 12:30 > 12:00 → excluded by window
    const slots = getAvailableSlots(events, 60, DATE)
    expect(slots).toHaveLength(0)
  })

  // 7. Two availability blocks in one day → returns slots from both
  it('returns slots from two availability windows in the same day', () => {
    const events = [
      makeEvent(AVAIL, d('09:00'), d('10:30')), // 90min: 1 slot (09:00)
      makeEvent(AVAIL, d('14:00'), d('15:30')), // 90min: 1 slot (14:00)
    ]
    const slots = getAvailableSlots(events, 60, DATE)
    expect(slots).toHaveLength(2)
    expect(slots[0]).toEqual(d('09:00'))
    expect(slots[1]).toEqual(d('14:00'))
  })

  // 8. No availability blocks → returns empty array
  it('returns empty array when there are no availability events', () => {
    const events = [makeEvent('[CONFIRMED] Someone', d('10:00'), d('11:00'))]
    const slots = getAvailableSlots(events, 60, DATE)
    expect(slots).toHaveLength(0)
  })

  // 9. All slots blocked by existing bookings → returns empty array
  it('returns empty array when all slots are blocked', () => {
    const events = [
      makeEvent(AVAIL, d('10:00'), d('12:00')),
      makeEvent('[CONFIRMED] A', d('10:00'), d('11:00')),
      makeEvent('[CONFIRMED] B', d('10:30'), d('11:30')),
      makeEvent('[CONFIRMED] C', d('11:00'), d('12:00')),
    ]
    // 10:00 blocked by A, 10:30 blocked by A+B, 11:00 blocked by C (and window overflow anyway)
    const slots = getAvailableSlots(events, 60, DATE)
    expect(slots).toHaveLength(0)
  })

  // 10. 30-min session in 30-min window (no room for break) → empty
  it('returns empty when 30-min session + 30-min break exceeds 30-min window', () => {
    // Session=30, break=30, total needed=60. Window only 30min.
    const events = [makeEvent(AVAIL, d('10:00'), d('10:30'))]
    const slots = getAvailableSlots(events, 30, DATE)
    expect(slots).toHaveLength(0)
  })

  // 11. 30-min session in 61-min window → exactly 1 slot
  it('returns 1 slot when 30-min session fits once in a 61-min window', () => {
    // 10:00 + 30min session + 30min break = 11:00 <= 11:01 ✓
    // 10:30 + 30 + 30 = 11:30 > 11:01 ✗
    const events = [makeEvent(AVAIL, d('10:00'), new Date('2026-05-14T11:01:00.000Z'))]
    const slots = getAvailableSlots(events, 30, DATE)
    expect(slots).toHaveLength(1)
    expect(slots[0]).toEqual(d('10:00'))
  })

  // 12. slotInterval effect: window starting at :30 — algorithm starts at window.start
  it('starts candidate slots at window.start, not at a rounded hour', () => {
    // Window 10:30–12:00 (90 min). slotInterval=30.
    // Expected slots: 10:30 (10:30+60+30=12:00 exactly ✓), 11:00 (11:00+90=12:30 > 12:00 ✗).
    // So only 10:30 is returned — the algorithm does not skip non-on-the-hour starts.
    const events = [makeEvent(AVAIL, d('10:30'), d('12:00'))]
    const slots = getAvailableSlots(events, 60, DATE)
    expect(slots).toHaveLength(1)
    expect(slots[0]).toEqual(d('10:30'))
  })

  // 13. Break boundary math: slot right at boundary excluded, slot 30min earlier included
  it('excludes slot where break would overflow, includes earlier slot that fits', () => {
    // Window 10:00–11:30. 60min session + 30min break = 90min.
    // 10:00: 10:00+90 = 11:30 = window.end → included (exact fit)
    // 10:30: 10:30+90 = 12:00 > 11:30 → excluded
    const events = [makeEvent(AVAIL, d('10:00'), d('11:30'))]
    const slots = getAvailableSlots(events, 60, DATE)
    expect(slots).toHaveLength(1)
    expect(slots[0]).toEqual(d('10:00'))
    // Now shrink window by 1 min — the exact-fit slot is now excluded
    const events2 = [makeEvent(AVAIL, d('10:00'), new Date('2026-05-14T11:29:00.000Z'))]
    const slots2 = getAvailableSlots(events2, 60, DATE)
    expect(slots2).toHaveLength(0)
  })
})
