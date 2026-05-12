import { describe, it, expect } from 'vitest'
import { getAvailableSlots } from './bookingSlots'
import { BOOKING } from './config'
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

const AVAIL = BOOKING.availabilityEventTitle

// ─────────────────────────────────────────────────────────────────────────────
// Test suite
// ─────────────────────────────────────────────────────────────────────────────

describe('getAvailableSlots', () => {
  // 1. Single availability block 10:00–16:00, no bookings → 11 slots
  it('returns 11 slots for 60-min session in a 6-hour window with no bookings', () => {
    const events = [makeEvent(AVAIL, d('10:00'), d('16:00'))]
    // Session only needs to fit inside the window (break may extend past end).
    // Last valid start: 15:00 (15:00+60=16:00 exactly).
    // Slots: 10:00, 10:30, 11:00, 11:30, 12:00, 12:30, 13:00, 13:30, 14:00, 14:30, 15:00 = 11 slots
    const slots = getAvailableSlots(events, 60, DATE)
    expect(slots).toHaveLength(11)
    expect(slots[0]).toEqual(d('10:00'))
    expect(slots[10]).toEqual(d('15:00'))
  })

  // 2. Slot at end of window: session fits, break extends past window end → included
  it('includes slots where session fits even if break extends past window end', () => {
    // Window 10:00–11:30, 60min session.
    // 10:00: session ends 11:00 ≤ 11:30 → included
    // 10:30: session ends 11:30 ≤ 11:30 → included (break would run to 12:00, past window — OK)
    // 11:00: session ends 12:00 > 11:30 → excluded
    const events = [makeEvent(AVAIL, d('10:00'), d('11:30'))]
    const slots = getAvailableSlots(events, 60, DATE)
    expect(slots).toHaveLength(2)
    expect(slots[0]).toEqual(d('10:00'))
    expect(slots[1]).toEqual(d('10:30'))
  })

  // 3. Slot excluded only when session itself overflows window
  it('excludes a slot when the session itself overflows the window', () => {
    // Window 10:00–11:29 (89 min). 60min session: 10:00 fits (ends 11:00), 10:30 does not (ends 11:30 > 11:29).
    const events = [makeEvent(AVAIL, d('10:00'), new Date('2026-05-14T11:29:00.000Z'))]
    const slots = getAvailableSlots(events, 60, DATE)
    expect(slots).toHaveLength(1)
    expect(slots[0]).toEqual(d('10:00'))
  })

  // 4. [CONFIRMED] event blocks its time
  it('excludes slots overlapping a [CONFIRMED] event', () => {
    const events = [
      makeEvent(AVAIL, d('10:00'), d('12:00')),
      makeEvent('[CONFIRMED] John Doe', d('10:00'), d('11:00')),
    ]
    // 10:00: session 10:00–11:00 overlaps [CONFIRMED] → blocked
    // 10:30: session 10:30–11:30 overlaps [CONFIRMED] → blocked
    // 11:00: session 11:00–12:00; [CONFIRMED] ends at 11:00, candidateMs(11:00) < be(11:00) is false → NOT overlapping; fits → included
    const slots = getAvailableSlots(events, 60, DATE)
    expect(slots).toHaveLength(1)
    expect(slots[0]).toEqual(d('11:00'))
  })

  // 5. [BREAK] event blocks its time
  it('excludes slots overlapping a [BREAK] event', () => {
    const events = [
      makeEvent(AVAIL, d('10:00'), d('13:00')),
      makeEvent('[BREAK]', d('11:00'), d('11:30')),
    ]
    // 10:00: session 10:00–11:00; 10:00<11:30 && 11:00>11:00 = false → OK
    // 10:30: session 10:30–11:30; 10:30<11:30 && 11:30>11:00 = true → blocked
    // 11:00: session 11:00–12:00; 11:00<11:30 && 12:00>11:00 = true → blocked
    // 11:30: session 11:30–12:30; 11:30<11:30 is false → OK
    // 12:00: session 12:00–13:00; 12:00<11:30 is false → OK; session ends 13:00 ≤ 13:00 → included
    const slots = getAvailableSlots(events, 60, DATE)
    expect(slots.map((s) => s.toISOString())).toEqual([
      d('10:00').toISOString(),
      d('11:30').toISOString(),
      d('12:00').toISOString(),
    ])
  })

  // 6. [PENDING] event blocks its time
  it('excludes slots overlapping a [PENDING] event', () => {
    const events = [
      makeEvent(AVAIL, d('10:00'), d('12:00')),
      makeEvent('[PENDING] Jane', d('10:30'), d('11:30')),
    ]
    // 10:00: session 10:00–11:00 overlaps [PENDING] 10:30–11:30 → blocked
    // 10:30: session 10:30–11:30 overlaps → blocked
    // 11:00: session 11:00–12:00; 11:00<11:30 && 12:00>10:30 → overlaps → blocked
    const slots = getAvailableSlots(events, 60, DATE)
    expect(slots).toHaveLength(0)
  })

  // 6b. [PENDING] break window blocks slots before AND after the session
  it('blocks slots whose break would overlap a PENDING session, and slots during its break window', () => {
    // PENDING 12:00–13:00. Effective end (rule a) = 13:30.
    // Rule (b): candidate's break must not overlap PENDING session start (12:00).
    //   11:00: session 11:00–12:00, break 12:00–12:30 → effectiveEnd (12:30) > 12:00 → BLOCKED
    //   10:30: session 10:30–11:30, break 11:30–12:00 → effectiveEnd (12:00) > 12:00 is false → available
    //   13:00: 13:00 < 13:30 → BLOCKED (within PENDING break window)
    //   13:30: 13:30 < 13:30 → false → available
    const events = [
      makeEvent(AVAIL, d('10:00'), d('16:00')),
      makeEvent('[PENDING] Test', d('12:00'), d('13:00')),
    ]
    const slots = getAvailableSlots(events, 60, DATE)
    const times = slots.map((s) => s.toISOString())
    expect(times).not.toContain(d('11:00').toISOString()) // break 12:00–12:30 overlaps PENDING → blocked
    expect(times).not.toContain(d('11:30').toISOString()) // session 11:30–12:30 overlaps PENDING → blocked
    expect(times).not.toContain(d('12:00').toISOString()) // inside PENDING session → blocked
    expect(times).not.toContain(d('12:30').toISOString()) // inside PENDING session → blocked
    expect(times).not.toContain(d('13:00').toISOString()) // inside PENDING break window → blocked
    expect(times).toContain(d('10:30').toISOString())     // break ends at 12:00 = PENDING start → clear
    expect(times).toContain(d('13:30').toISOString())     // after PENDING break window → clear
  })

  // 7. Two availability blocks in one day → returns slots from both
  it('returns slots from two availability windows in the same day', () => {
    const events = [
      makeEvent(AVAIL, d('09:00'), d('10:30')), // 90min window: slots 09:00 and 09:30
      makeEvent(AVAIL, d('14:00'), d('15:30')), // 90min window: slots 14:00 and 14:30
    ]
    const slots = getAvailableSlots(events, 60, DATE)
    expect(slots).toHaveLength(4)
    expect(slots[0]).toEqual(d('09:00'))
    expect(slots[1]).toEqual(d('09:30'))
    expect(slots[2]).toEqual(d('14:00'))
    expect(slots[3]).toEqual(d('14:30'))
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
    // 10:00 blocked by A, 10:30 blocked by A+B, 11:00 blocked by C, 11:30 session ends 12:30 > 12:00
    const slots = getAvailableSlots(events, 60, DATE)
    expect(slots).toHaveLength(0)
  })

  // 10. 30-min session in 30-min window → 1 slot (break may extend past window)
  it('returns 1 slot when 30-min session fits exactly in a 30-min window', () => {
    // Session=30: 10:00+30=10:30 ≤ 10:30 → included. Break extends to 11:00, past window — OK.
    const events = [makeEvent(AVAIL, d('10:00'), d('10:30'))]
    const slots = getAvailableSlots(events, 30, DATE)
    expect(slots).toHaveLength(1)
    expect(slots[0]).toEqual(d('10:00'))
  })

  // 11. 30-min session in 61-min window → 2 slots
  it('returns 2 slots when 30-min session fits twice in a 61-min window', () => {
    // 10:00+30=10:30 ≤ 11:01 ✓; 10:30+30=11:00 ≤ 11:01 ✓; 11:00+30=11:30 > 11:01 ✗
    const events = [makeEvent(AVAIL, d('10:00'), new Date('2026-05-14T11:01:00.000Z'))]
    const slots = getAvailableSlots(events, 30, DATE)
    expect(slots).toHaveLength(2)
    expect(slots[0]).toEqual(d('10:00'))
    expect(slots[1]).toEqual(d('10:30'))
  })

  // 12. slotInterval effect: window starting at :30 — algorithm starts at window.start
  it('starts candidate slots at window.start, not at a rounded hour', () => {
    // Window 10:30–12:00 (90 min). slotInterval=30.
    // 10:30: session ends 11:30 ≤ 12:00 → included
    // 11:00: session ends 12:00 ≤ 12:00 → included
    // 11:30: session ends 12:30 > 12:00 → excluded
    const events = [makeEvent(AVAIL, d('10:30'), d('12:00'))]
    const slots = getAvailableSlots(events, 60, DATE)
    expect(slots).toHaveLength(2)
    expect(slots[0]).toEqual(d('10:30'))
    expect(slots[1]).toEqual(d('11:00'))
  })

  // 5b. [BREAK] at the last valid slot start still blocks that slot
  it('blocks the last slot when [BREAK] starts exactly at that slot time', () => {
    // Window 10:00–14:00. [CONFIRMED] 12:00–13:00, [BREAK] 13:00–13:30.
    // maxLastValidStart = 14:00 - 60min = 13:00.
    // [BREAK] starts at 13:00 — NOT exempt (> not >=) → blocks 13:00 slot.
    // This is the real-world scenario: auto-break after confirmed booking must block the next slot.
    const events = [
      makeEvent(AVAIL, d('10:00'), d('14:00')),
      makeEvent('[CONFIRMED] Jane', d('12:00'), d('13:00')),
      makeEvent('[BREAK]', d('13:00'), d('13:30')),
    ]
    const slots = getAvailableSlots(events, 60, DATE)
    const times = slots.map((s) => s.toISOString())
    expect(times).not.toContain(d('13:00').toISOString()) // break blocks last slot ✓
    expect(times).not.toContain(d('11:00').toISOString()) // session 11:00–12:00, break 12:00–12:30 overlaps CONFIRMED
    expect(times).not.toContain(d('11:30').toISOString()) // session 11:30–12:30 overlaps CONFIRMED
    expect(times).not.toContain(d('12:00').toISOString()) // overlaps CONFIRMED
  })

  // 5c. Mid-day [BREAK] still blocks normally
  it('still blocks a slot when [BREAK] is in the middle of the day', () => {
    // Window 10:00–14:00. [BREAK] 11:00–11:30. maxLastValidStart = 13:00.
    // [BREAK] at 11:00 < 13:00 → mid-day → blocks as normal.
    const events = [
      makeEvent(AVAIL, d('10:00'), d('14:00')),
      makeEvent('[BREAK]', d('11:00'), d('11:30')),
    ]
    const slots = getAvailableSlots(events, 60, DATE)
    const times = slots.map((s) => s.toISOString())
    expect(times).not.toContain(d('10:30').toISOString()) // 10:30–11:30 overlaps BREAK 11:00–11:30
    expect(times).not.toContain(d('11:00').toISOString()) // 11:00–12:00 overlaps BREAK
    expect(times).toContain(d('10:00').toISOString())     // 10:00–11:00; 10:00<11:30 && 11:00>11:00 = false → clear
    expect(times).toContain(d('11:30').toISOString())     // after break
  })

  // 13. Session boundary: slot included when session ends exactly at window end
  it('includes slot when session ends exactly at window end, excludes when session overflows', () => {
    // Window 10:00–11:30.
    // 10:00: ends 11:00 ≤ 11:30 → included; 10:30: ends 11:30 ≤ 11:30 → included; 11:00: ends 12:00 > 11:30 → excluded
    const events = [makeEvent(AVAIL, d('10:00'), d('11:30'))]
    const slots = getAvailableSlots(events, 60, DATE)
    expect(slots).toHaveLength(2)
    // Shrink window by 1 min — 10:30 slot is now excluded
    const events2 = [makeEvent(AVAIL, d('10:00'), new Date('2026-05-14T11:29:00.000Z'))]
    const slots2 = getAvailableSlots(events2, 60, DATE)
    expect(slots2).toHaveLength(1)
    expect(slots2[0]).toEqual(d('10:00'))
  })
})
