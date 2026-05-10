'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { signOut } from 'next-auth/react'
import { BOOKING } from '@/lib/config'

// ── Availability tab types & helpers ──────────────────────────────────────────

interface OpenBlock {
  id: string
  date: string       // YYYY-MM-DD Toronto
  startTime: string  // HH:MM Toronto
  endTime: string    // HH:MM Toronto
}

interface CalendarDay {
  dateStr: string | null
  blocks: OpenBlock[]
}

function currentMonthKey(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

function addMonths(key: string, n: number): string {
  const [y, m] = key.split('-').map(Number)
  const d = new Date(y, m - 1 + n, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function monthLabel(key: string): string {
  const [y, m] = key.split('-').map(Number)
  return new Date(y, m - 1, 1).toLocaleString('en-CA', { month: 'long', year: 'numeric' })
}

function buildCalendarGrid(year: number, month: number, blocks: OpenBlock[]): CalendarDay[][] {
  const byDay: Record<string, OpenBlock[]> = {}
  for (const b of blocks) {
    if (!byDay[b.date]) byDay[b.date] = []
    byDay[b.date].push(b)
  }

  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0)
  // Monday-first: Sun(0)→6, Mon(1)→0, …
  const startDow = (firstDay.getDay() + 6) % 7

  const weeks: CalendarDay[][] = []
  let week: CalendarDay[] = []

  for (let i = 0; i < startDow; i++) week.push({ dateStr: null, blocks: [] })

  for (let d = 1; d <= lastDay.getDate(); d++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    week.push({ dateStr, blocks: byDay[dateStr] ?? [] })
    if (week.length === 7) { weeks.push(week); week = [] }
  }

  if (week.length > 0) {
    while (week.length < 7) week.push({ dateStr: null, blocks: [] })
    weeks.push(week)
  }

  return weeks
}


interface MonthCache {
  blocks: OpenBlock[]
  bookedDates: string[]
}

interface AddBlockForm {
  date: string
  startTime: string
  endTime: string
}

// 30-min increments, 07:00–21:00
const TIME_OPTIONS = Array.from({ length: 29 }, (_, i) => {
  const totalMinutes = 7 * 60 + i * 30
  const h = String(Math.floor(totalMinutes / 60)).padStart(2, '0')
  const m = totalMinutes % 60 === 0 ? '00' : '30'
  return `${h}:${m}`
})

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']

function formatBlockDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-')
  return `${day} ${MONTH_NAMES[Number(month) - 1]}, ${year}`
}

function AvailabilityTab() {
  const MIN_MONTH = currentMonthKey()
  const MAX_MONTH = addMonths(MIN_MONTH, 12)

  const [activeMonth, setActiveMonth] = useState(MIN_MONTH)
  const [blocks, setBlocks] = useState<OpenBlock[]>([])
  const [bookedDates, setBookedDates] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastFetched, setLastFetched] = useState<Date | null>(null)
  const cacheRef = useRef<Map<string, MonthCache>>(new Map())

  // click-to-add state
  const [addForm, setAddForm] = useState<AddBlockForm | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // delete state
  const [deleteConfirm, setDeleteConfirm] = useState<OpenBlock | null>(null)
  const [deleting, setDeleting] = useState(false)

  const applyCache = useCallback((cached: MonthCache) => {
    setBlocks(cached.blocks)
    setBookedDates(cached.bookedDates)
  }, [])

  const fetchBlocks = useCallback(async (month: string, forceRefresh = false) => {
    if (!forceRefresh && cacheRef.current.has(month)) {
      applyCache(cacheRef.current.get(month)!)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/availability?month=${month}`)
      if (!res.ok) throw new Error(`Failed to load availability (${res.status})`)
      const data = await res.json()
      const entry: MonthCache = {
        blocks: data.blocks ?? [],
        bookedDates: data.bookedDates ?? [],
      }
      cacheRef.current.set(month, entry)
      applyCache(entry)
      setLastFetched(new Date())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [applyCache])

  useEffect(() => { fetchBlocks(activeMonth) }, [activeMonth, fetchBlocks])

  const handleDayClick = (dateStr: string) => {
    setAddForm({ date: dateStr, startTime: '09:00', endTime: '18:00' })
    setSaveError(null)
  }

  const handleSaveBlock = async () => {
    if (!addForm) return
    const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m }
    if (toMin(addForm.endTime) - toMin(addForm.startTime) < 60) {
      setSaveError('End time must be at least 1 hour after start time')
      return
    }
    const newStart = toMin(addForm.startTime)
    const newEnd   = toMin(addForm.endTime)
    const overlaps = blocks.some(b =>
      b.date === addForm.date &&
      newStart < toMin(b.endTime) && toMin(b.startTime) < newEnd
    )
    if (overlaps) {
      setSaveError('This time range overlaps with an existing availability block')
      return
    }
    setSaving(true)
    setSaveError(null)
    try {
      const res = await fetch('/api/admin/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? `Error ${res.status}`)
      }
      setAddForm(null)
      fetchBlocks(activeMonth, true)
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteBlock = async () => {
    if (!deleteConfirm) return
    setDeleting(true)
    try {
      const res = await fetch('/api/admin/availability', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteConfirm.id }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? `Error ${res.status}`)
      }
      setDeleteConfirm(null)
      fetchBlocks(activeMonth, true)
    } catch (e) {
      // keep dialog open on error so user sees it
      console.error('Delete failed:', e)
    } finally {
      setDeleting(false)
    }
  }

  const [year, mon] = activeMonth.split('-').map(Number)
  const grid = buildCalendarGrid(year, mon, blocks)
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Toronto' })
  const bookedSet = new Set(bookedDates)
  const DOW_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const canGoPrev = activeMonth > MIN_MONTH
  const canGoNext = activeMonth < MAX_MONTH
  const isCurrentMonth = activeMonth === MIN_MONTH

  return (
    <div>
      {/* Month navigation */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <button
          onClick={() => setActiveMonth(m => addMonths(m, -1))}
          disabled={!canGoPrev || loading}
          className="px-3 py-1.5 rounded text-sm font-medium bg-[#F0F7F4] text-[#2D6A4F] hover:bg-[#dceee6] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          ← Prev
        </button>
        <span className="text-base font-semibold text-[#2D6A4F] min-w-[160px] text-center">
          {monthLabel(activeMonth)}
        </span>
        <button
          onClick={() => setActiveMonth(m => addMonths(m, 1))}
          disabled={!canGoNext || loading}
          className="px-3 py-1.5 rounded text-sm font-medium bg-[#F0F7F4] text-[#2D6A4F] hover:bg-[#dceee6] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Next →
        </button>
        {!isCurrentMonth && (
          <button
            onClick={() => setActiveMonth(MIN_MONTH)}
            disabled={loading}
            className="px-3 py-1.5 rounded text-sm font-medium bg-[#F0F7F4] text-[#2D6A4F] hover:bg-[#dceee6] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Today
          </button>
        )}
        <button
          onClick={() => fetchBlocks(activeMonth, true)}
          disabled={loading}
          className="ml-auto px-3 py-1.5 rounded text-sm font-medium bg-[#F0F7F4] text-[#2D6A4F] hover:bg-[#dceee6] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Fetch fresh data from calendar"
        >
          ↺ Refresh
        </button>
        {lastFetched && !loading && (
          <span className="text-xs text-gray-400">
            Updated {lastFetched.toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>

      {/* Add-block form */}
      {addForm && (
        <div className="mb-5 p-4 bg-[#F0F7F4] border border-[#52B788]/40 rounded-lg">
          <p className="text-sm font-semibold text-[#2D6A4F] mb-3">
            Add availability — {formatBlockDate(addForm.date)}
          </p>
          <div className="flex flex-wrap items-end gap-3">
            <label className="flex flex-col gap-1 text-xs text-gray-600">
              Start
              <select
                value={addForm.startTime}
                onChange={e => setAddForm(f => f ? { ...f, startTime: e.target.value } : f)}
                className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#52B788] cursor-pointer"
              >
                {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs text-gray-600">
              End
              <select
                value={addForm.endTime}
                onChange={e => setAddForm(f => f ? { ...f, endTime: e.target.value } : f)}
                className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#52B788] cursor-pointer"
              >
                {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>
            <button
              onClick={handleSaveBlock}
              disabled={saving}
              className="bg-[#2D6A4F] hover:bg-[#245a42] disabled:opacity-50 text-white text-sm px-4 py-1.5 rounded transition-colors"
            >
              {saving ? 'Saving…' : 'Add block'}
            </button>
            <button
              onClick={() => setAddForm(null)}
              disabled={saving}
              className="text-sm px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          </div>
          {saveError && <p className="text-red-600 text-xs mt-2">{saveError}</p>}

          {/* Existing blocks for this day */}
          {blocks.filter(b => b.date === addForm.date).length > 0 && (
            <div className="mt-4 pt-4 border-t border-[#52B788]/30">
              <p className="text-xs font-semibold text-gray-500 mb-2">Existing blocks on this day</p>
              <div className="flex flex-col gap-1">
                {blocks.filter(b => b.date === addForm.date).map(b => (
                  <div key={b.id} className="flex items-center justify-between px-3 py-1.5 bg-white border border-[#52B788]/30 rounded text-sm">
                    <span className="text-[#2D6A4F] font-medium">{b.startTime} – {b.endTime}</span>
                    <button
                      onClick={() => setDeleteConfirm(b)}
                      className="text-xs text-red-500 hover:text-red-700 transition-colors ml-4"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete confirmation dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
            <p className="text-sm font-semibold text-gray-800 mb-5">
              Are you sure you want to delete {deleteConfirm.startTime} – {deleteConfirm.endTime} block?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                data-testid="cancel-delete"
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
                className="text-sm px-4 py-1.5 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                data-testid="confirm-delete"
                onClick={handleDeleteBlock}
                disabled={deleting}
                className="text-sm px-4 py-1.5 rounded bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white transition-colors"
              >
                {deleting ? 'Deleting…' : 'Yes, delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center gap-3 py-12 text-[#2D6A4F]">
          <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-gray-500">Loading availability from calendar…</p>
        </div>
      )}
      {error && <p className="text-red-600 text-sm py-4">{error}</p>}

      {!loading && !error && (
        <>
          <div className="flex items-center gap-4 mb-4">
            <p className="text-xs text-gray-400">
              {blocks.length === 0
                ? 'No open blocks this month'
                : `${blocks.length} open block${blocks.length !== 1 ? 's' : ''} this month`}
            </p>
            {bookedDates.length > 0 && (
              <span className="flex items-center gap-1 text-xs text-amber-600">
                <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
                {bookedDates.length} day{bookedDates.length !== 1 ? 's' : ''} with bookings
              </span>
            )}
            <p className="text-xs text-gray-400 ml-auto">Click a day to add availability</p>
          </div>

          <div className="w-full">
            <div className="grid grid-cols-7 gap-px mb-px">
              {DOW_LABELS.map(d => (
                <div key={d} className="text-center text-xs font-semibold text-gray-500 py-1">{d}</div>
              ))}
            </div>
            {grid.map((week, wi) => (
              <div key={wi} className="grid grid-cols-7 gap-px mb-px">
                {week.map((day, di) => {
                  const isToday = day.dateStr === today
                  const isPast = !!day.dateStr && day.dateStr < today
                  const hasBooking = day.dateStr ? bookedSet.has(day.dateStr) : false
                  const dayNum = day.dateStr ? Number(day.dateStr.slice(8)) : null
                  const clickable = !!day.dateStr && !isPast
                  return (
                    <div
                      key={di}
                      onClick={() => clickable && handleDayClick(day.dateStr!)}
                      className={`min-h-[60px] rounded p-1 text-xs transition-colors ${
                        !day.dateStr
                          ? 'bg-transparent'
                          : isPast
                          ? 'bg-gray-50 border border-gray-100 opacity-40 cursor-default'
                          : day.blocks.length > 0
                          ? 'bg-[#F0F7F4] border border-[#52B788]/40 cursor-pointer hover:bg-[#dceee6]'
                          : 'bg-gray-50 border border-gray-100 cursor-pointer hover:bg-[#F0F7F4]'
                      } ${isToday ? 'ring-2 ring-[#2D6A4F]' : ''}`}
                    >
                      {dayNum !== null && (
                        <div className="flex items-center justify-between mb-0.5">
                          <span className={`font-semibold ${isToday ? 'text-[#2D6A4F]' : 'text-gray-600'}`}>
                            {dayNum}
                          </span>
                          {hasBooking && (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" title="Has bookings" />
                          )}
                        </div>
                      )}
                      {day.blocks.map(b => (
                        <div key={b.id} className="text-[9px] leading-tight text-[#2D6A4F] bg-[#52B788]/20 rounded px-0.5 py-0.5 mb-0.5 truncate">
                          {b.startTime}–{b.endTime}
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ── Booking types ─────────────────────────────────────────────────────────────

interface Booking {
  eventId: string
  status: 'pending' | 'confirmed'
  clientName: string
  clientEmail: string
  clientPhone: string
  clientNotes?: string
  serviceName: string
  durationMinutes: number
  sessionStart: string
  sessionEnd: string
  breakEnd: string
}

function formatDateTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString('en-CA', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit', hour12: false })
}

interface BookingCardProps {
  booking: Booking
  onAccept?: (eventId: string) => void
  onDecline?: (eventId: string) => void
  onCancel?: (eventId: string) => void
  readOnly?: boolean
}

function BookingCard({ booking, onAccept, onDecline, onCancel, readOnly }: BookingCardProps) {
  const [pendingAction, setPendingAction] = useState<'accept' | 'decline' | 'cancel' | null>(null)
  const [loading, setLoading] = useState(false)

  const borderClass =
    booking.status === 'pending'
      ? 'border-l-4 border-yellow-400'
      : 'border-l-4 border-green-600'

  const handleAccept = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: booking.eventId }),
      })
      if (res.ok) {
        setPendingAction(null)
        onAccept?.(booking.eventId)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDecline = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/decline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: booking.eventId }),
      })
      if (res.ok) {
        setPendingAction(null)
        onDecline?.(booking.eventId)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: booking.eventId }),
      })
      if (res.ok) {
        setPendingAction(null)
        onCancel?.(booking.eventId)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`bg-[#F0F7F4] rounded-lg p-4 shadow-sm ${borderClass}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[#2D6A4F]">{booking.clientName}</p>
          <p className="text-sm text-gray-600">{booking.clientEmail} · {booking.clientPhone}</p>
          <p className="text-sm text-gray-700 mt-1">
            {booking.serviceName} · {booking.durationMinutes} min
          </p>
          <p className="text-sm text-gray-700">
            {formatDateTime(booking.sessionStart)} – {formatTime(booking.sessionEnd)}
          </p>
          {booking.clientNotes && (
            <p className="text-sm text-gray-500 mt-1 italic">"{booking.clientNotes}"</p>
          )}
        </div>

        {!readOnly && (
          <div className="flex-shrink-0">
            {booking.status === 'pending' && (
              <div className="flex flex-col gap-2 items-end">
                <button
                  onClick={() => setPendingAction('accept')}
                  disabled={loading}
                  className="bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white text-sm px-3 py-1.5 rounded w-full"
                >
                  Accept
                </button>
                <button
                  onClick={() => setPendingAction('decline')}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm px-3 py-1.5 rounded w-full"
                >
                  Decline
                </button>
              </div>
            )}

            {booking.status === 'confirmed' && (
              <button
                onClick={() => setPendingAction('cancel')}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm px-3 py-1.5 rounded"
              >
                Cancel Booking
              </button>
            )}

            {pendingAction && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
                  <p className="text-sm font-semibold text-gray-800 mb-1">
                    {pendingAction === 'accept' ? 'Accept booking?' :
                     pendingAction === 'decline' ? 'Decline booking?' :
                     'Cancel this booking?'}
                  </p>
                  <p className="text-sm text-gray-500 mb-5">
                    {booking.clientName} — {booking.serviceName}
                  </p>
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => setPendingAction(null)}
                      disabled={loading}
                      className="text-sm px-4 py-1.5 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                    >
                      {pendingAction === 'cancel' ? 'Keep' : 'Cancel'}
                    </button>
                    <button
                      onClick={pendingAction === 'accept' ? handleAccept : pendingAction === 'decline' ? handleDecline : handleCancel}
                      disabled={loading}
                      data-testid={`confirm-${pendingAction}`}
                      className={`text-sm px-4 py-1.5 rounded disabled:opacity-50 text-white transition-colors ${
                        pendingAction === 'accept'
                          ? 'bg-green-700 hover:bg-green-800'
                          : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      {loading
                        ? pendingAction === 'accept' ? 'Accepting…' : pendingAction === 'decline' ? 'Declining…' : 'Cancelling…'
                        : pendingAction === 'accept' ? 'Yes, accept' : pendingAction === 'decline' ? 'Yes, decline' : 'Yes, cancel'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const NOW = new Date()
const CURRENT_YEAR = NOW.getFullYear()
const CURRENT_MONTH = NOW.getMonth() + 1 // 1-based

const YEAR_OPTIONS = Array.from({ length: 8 }, (_, i) => CURRENT_YEAR - i)
const ALL_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function PastBookingDetails({ booking, onClose }: { booking: Booking; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-[#2D6A4F]">Booking Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Client</dt>
            <dd className="text-gray-800 font-medium mt-0.5">{booking.clientName}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Email</dt>
            <dd className="text-gray-700 mt-0.5">{booking.clientEmail}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Phone</dt>
            <dd className="text-gray-700 mt-0.5">{booking.clientPhone}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Date & Time</dt>
            <dd className="text-gray-700 mt-0.5">{formatDateTime(booking.sessionStart)} – {formatTime(booking.sessionEnd)}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Service</dt>
            <dd className="text-gray-700 mt-0.5">{booking.serviceName}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Duration</dt>
            <dd className="text-gray-700 mt-0.5">{booking.durationMinutes} min</dd>
          </div>
          {booking.clientNotes && (
            <div>
              <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Notes</dt>
              <dd className="text-gray-700 mt-0.5 italic">"{booking.clientNotes}"</dd>
            </div>
          )}
          <div>
            <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</dt>
            <dd className="mt-0.5">
              <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800 font-medium capitalize">
                {booking.status}
              </span>
            </dd>
          </div>
        </dl>
        <button
          onClick={onClose}
          className="mt-6 w-full text-sm px-4 py-2 rounded border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  )
}

// ── AdminDashboard ────────────────────────────────────────────────────────────

export default function AdminDashboard({ email }: { email?: string }) {
  const [activeTab, setActiveTab] = useState<'pending' | 'confirmed' | 'past' | 'availability'>('pending')

  // ── Upcoming (pending + confirmed) state ──
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([])
  const [upcomingLoading, setUpcomingLoading] = useState(true)
  const [upcomingError, setUpcomingError] = useState<string | null>(null)
  const [lastUpcomingFetched, setLastUpcomingFetched] = useState<Date | null>(null)

  // ── Past state ──
  const [pastBookings, setPastBookings] = useState<Booking[]>([])
  const [pastLoading, setPastLoading] = useState(false)
  const [pastError, setPastError] = useState<string | null>(null)
  const [pastYear, setPastYear] = useState(CURRENT_YEAR)
  const [pastMonthNum, setPastMonthNum] = useState(CURRENT_MONTH)
  const [detailsBooking, setDetailsBooking] = useState<Booking | null>(null)
  const [lastPastFetched, setLastPastFetched] = useState<Date | null>(null)
  const pastCacheRef = useRef<Map<string, Booking[]>>(new Map())

  const pastMonthKey = `${pastYear}-${String(pastMonthNum).padStart(2, '0')}`

  // ── Fetch upcoming ────────────────────────────────────────────────────────
  const fetchUpcoming = useCallback(async () => {
    setUpcomingLoading(true)
    setUpcomingError(null)
    try {
      const res = await fetch('/api/admin/bookings?view=future', { cache: 'no-store' })
      if (!res.ok) throw new Error(`Failed to load bookings (${res.status})`)
      const data = await res.json()
      setUpcomingBookings(data.bookings ?? data)
      setLastUpcomingFetched(new Date())
    } catch (e) {
      setUpcomingError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setUpcomingLoading(false)
    }
  }, [])

  // ── Fetch past ────────────────────────────────────────────────────────────
  const fetchPast = useCallback(async (month: string, forceRefresh = false) => {
    if (!forceRefresh && pastCacheRef.current.has(month)) {
      setPastBookings(pastCacheRef.current.get(month)!)
      return
    }
    setPastLoading(true)
    setPastError(null)
    try {
      const res = await fetch(`/api/admin/bookings?view=past&month=${month}`, { cache: 'no-store' })
      if (!res.ok) throw new Error(`Failed to load bookings (${res.status})`)
      const data = await res.json()
      const fetched: Booking[] = data.bookings ?? data
      setPastBookings(fetched)
      pastCacheRef.current.set(month, fetched)
      setLastPastFetched(new Date())
    } catch (e) {
      setPastError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setPastLoading(false)
    }
  }, [])

  // ── Tab change effects ────────────────────────────────────────────────────
  useEffect(() => {
    if (activeTab === 'pending' || activeTab === 'confirmed') {
      fetchUpcoming()
    } else if (activeTab === 'past') {
      fetchPast(pastMonthKey)
    }
  }, [activeTab, fetchUpcoming, fetchPast]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Derived lists ─────────────────────────────────────────────────────────
  const now = new Date()
  const pending   = upcomingBookings.filter(b => b.status === 'pending' && new Date(b.sessionStart) > now)
  const confirmed = upcomingBookings.filter(b => b.status === 'confirmed')

  // Pagination
  const PENDING_PAGE_SIZE = BOOKING.pendingPageSize
  const HORIZON_DAYS = BOOKING.bookingHorizonDays
  const [pendingPage, setPendingPage] = useState(0)
  const pendingTotalPages = Math.ceil(pending.length / PENDING_PAGE_SIZE)
  const pendingPageItems = pending.slice(pendingPage * PENDING_PAGE_SIZE, (pendingPage + 1) * PENDING_PAGE_SIZE)

  // Reset to page 0 when bookings reload
  useEffect(() => { setPendingPage(0) }, [upcomingBookings])

  // Confirmed pagination
  const [confirmedPage, setConfirmedPage] = useState(0)
  const confirmedTotalPages = Math.ceil(confirmed.length / PENDING_PAGE_SIZE)
  const confirmedPageItems = confirmed.slice(confirmedPage * PENDING_PAGE_SIZE, (confirmedPage + 1) * PENDING_PAGE_SIZE)
  useEffect(() => { setConfirmedPage(0) }, [upcomingBookings])

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleAccepted = (eventId: string) => {
    setUpcomingBookings(prev =>
      prev.map(b => b.eventId === eventId ? { ...b, status: 'confirmed' as const } : b)
    )
  }

  const removeUpcoming = (eventId: string) => {
    setUpcomingBookings(prev => prev.filter(b => b.eventId !== eventId))
  }

  const handlePastYearChange = (year: number) => {
    const clampedMonth = year === CURRENT_YEAR ? Math.min(pastMonthNum, CURRENT_MONTH) : pastMonthNum
    setPastYear(year)
    setPastMonthNum(clampedMonth)
    fetchPast(`${year}-${String(clampedMonth).padStart(2, '0')}`)
  }

  const handlePastMonthChange = (month: number) => {
    setPastMonthNum(month)
    fetchPast(`${pastYear}-${String(month).padStart(2, '0')}`)
  }

  // ── Shared spinner ────────────────────────────────────────────────────────
  const Spinner = () => (
    <div className="flex flex-col items-center gap-3 py-12 text-[#2D6A4F]">
      <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      <p className="text-sm text-gray-500">Loading bookings from calendar…</p>
    </div>
  )

  // ── Tab label helpers ─────────────────────────────────────────────────────
  const pendingCount   = upcomingLoading ? null : pending.length
  const confirmedCount = upcomingLoading ? null : confirmed.length

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[#2D6A4F]">Booking Dashboard</h1>
        <div className="flex flex-col items-end gap-1">
          {email && <span className="text-sm text-gray-500">{email}</span>}
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="text-sm px-3 py-1.5 rounded border border-[#2D6A4F] text-white bg-[#2D6A4F] hover:bg-[#245a42] hover:border-[#245a42] transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 gap-px flex-wrap">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors rounded-t-md flex items-center gap-2 ${
            activeTab === 'pending'
              ? 'border-[#2D6A4F] text-white bg-[#2D6A4F]'
              : 'border-transparent text-[#2D6A4F]/70 bg-[#2D6A4F]/[0.08] hover:bg-[#2D6A4F]/[0.15] hover:text-[#2D6A4F]'
          }`}
        >
          Pending
          {pendingCount !== null && pendingCount > 0 && (
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
              activeTab === 'pending' ? 'bg-amber-400 text-amber-900' : 'bg-amber-400 text-amber-900'
            }`}>
              {pendingCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('confirmed')}
          className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors rounded-t-md flex items-center gap-2 ${
            activeTab === 'confirmed'
              ? 'border-[#2D6A4F] text-white bg-[#2D6A4F]'
              : 'border-transparent text-[#2D6A4F]/70 bg-[#2D6A4F]/[0.08] hover:bg-[#2D6A4F]/[0.15] hover:text-[#2D6A4F]'
          }`}
        >
          Confirmed
          {confirmedCount !== null && confirmedCount > 0 && (
            <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-green-200 text-green-800">
              {confirmedCount}
            </span>
          )}
        </button>
        {([
          { key: 'past', label: 'Past' },
          { key: 'availability', label: 'Availability' },
        ] as const).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors rounded-t-md ${
              activeTab === key
                ? 'border-[#2D6A4F] text-white bg-[#2D6A4F]'
                : 'border-transparent text-[#2D6A4F]/70 bg-[#2D6A4F]/[0.08] hover:bg-[#2D6A4F]/[0.15] hover:text-[#2D6A4F]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Pending tab ───────────────────────────────────────────────────── */}
      {activeTab === 'pending' && (
        <div>
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            {!upcomingLoading && pending.length > 0 && (
              <span className="text-sm text-gray-500">
                {pending.length} pending request{pending.length !== 1 ? 's' : ''} in the next {HORIZON_DAYS} days
              </span>
            )}
            <button
              onClick={fetchUpcoming}
              disabled={upcomingLoading}
              className="ml-auto px-3 py-1.5 rounded text-sm font-medium bg-[#F0F7F4] text-[#2D6A4F] hover:bg-[#dceee6] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ↺ Refresh
            </button>
            {lastUpcomingFetched && !upcomingLoading && (
              <span className="text-xs text-gray-400">
                Updated {lastUpcomingFetched.toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
          {upcomingLoading ? <Spinner /> : upcomingError ? (
            <p className="text-red-600 text-sm py-4">{upcomingError}</p>
          ) : pending.length === 0 ? (
            <p className="text-sm text-gray-400">No pending requests</p>
          ) : (
            <>
              <div className="space-y-3 mb-4">
                {pendingPageItems.map(b => (
                  <BookingCard
                    key={b.eventId}
                    booking={b}
                    onAccept={handleAccepted}
                    onDecline={removeUpcoming}
                  />
                ))}
              </div>
              {pendingTotalPages > 1 && (
                <div className="flex items-center gap-2 justify-center mt-2">
                  <button
                    data-testid="pending-prev"
                    onClick={() => setPendingPage(p => p - 1)}
                    disabled={pendingPage === 0}
                    className="px-3 py-1.5 rounded text-sm font-medium bg-[#F0F7F4] text-[#2D6A4F] hover:bg-[#dceee6] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    ← Prev
                  </button>
                  <span data-testid="pending-page-label" className="text-sm text-gray-500">
                    Page {pendingPage + 1} of {pendingTotalPages}
                  </span>
                  <button
                    data-testid="pending-next"
                    onClick={() => setPendingPage(p => p + 1)}
                    disabled={pendingPage >= pendingTotalPages - 1}
                    className="px-3 py-1.5 rounded text-sm font-medium bg-[#F0F7F4] text-[#2D6A4F] hover:bg-[#dceee6] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ── Confirmed tab ─────────────────────────────────────────────────── */}
      {activeTab === 'confirmed' && (
        <div>
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            {!upcomingLoading && confirmed.length > 0 && (
              <span className="text-sm text-gray-500">
                {confirmed.length} confirmed booking{confirmed.length !== 1 ? 's' : ''} in the next {HORIZON_DAYS} days
              </span>
            )}
            <button
              onClick={fetchUpcoming}
              disabled={upcomingLoading}
              className="ml-auto px-3 py-1.5 rounded text-sm font-medium bg-[#F0F7F4] text-[#2D6A4F] hover:bg-[#dceee6] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ↺ Refresh
            </button>
            {lastUpcomingFetched && !upcomingLoading && (
              <span className="text-xs text-gray-400">
                Updated {lastUpcomingFetched.toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
          {upcomingLoading ? <Spinner /> : upcomingError ? (
            <p className="text-red-600 text-sm py-4">{upcomingError}</p>
          ) : confirmed.length === 0 ? (
            <p className="text-sm text-gray-400">No confirmed bookings</p>
          ) : (
            <>
              <div className="space-y-3 mb-4">
                {confirmedPageItems.map(b => (
                  <BookingCard
                    key={b.eventId}
                    booking={b}
                    onCancel={removeUpcoming}
                  />
                ))}
              </div>
              {confirmedTotalPages > 1 && (
                <div className="flex items-center gap-2 justify-center mt-2">
                  <button
                    data-testid="confirmed-prev"
                    onClick={() => setConfirmedPage(p => p - 1)}
                    disabled={confirmedPage === 0}
                    className="px-3 py-1.5 rounded text-sm font-medium bg-[#F0F7F4] text-[#2D6A4F] hover:bg-[#dceee6] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    ← Prev
                  </button>
                  <span data-testid="confirmed-page-label" className="text-sm text-gray-500">
                    Page {confirmedPage + 1} of {confirmedTotalPages}
                  </span>
                  <button
                    data-testid="confirmed-next"
                    onClick={() => setConfirmedPage(p => p + 1)}
                    disabled={confirmedPage >= confirmedTotalPages - 1}
                    className="px-3 py-1.5 rounded text-sm font-medium bg-[#F0F7F4] text-[#2D6A4F] hover:bg-[#dceee6] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ── Past tab ──────────────────────────────────────────────────────── */}
      {activeTab === 'past' && (
        <div>
          <div className="mb-5 flex items-center gap-2 flex-wrap">
            <label className="text-sm text-gray-600 font-medium">Period:</label>
            <select
              value={pastMonthNum}
              onChange={e => handlePastMonthChange(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#52B788] cursor-pointer"
            >
              {ALL_MONTHS.map((name, i) => {
                const monthNum = i + 1
                const isFuture = pastYear === CURRENT_YEAR && monthNum > CURRENT_MONTH
                return (
                  <option key={monthNum} value={monthNum} disabled={isFuture}>
                    {name}
                  </option>
                )
              })}
            </select>
            <select
              value={pastYear}
              onChange={e => handlePastYearChange(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#52B788] cursor-pointer"
            >
              {YEAR_OPTIONS.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <button
              onClick={() => fetchPast(pastMonthKey, true)}
              disabled={pastLoading}
              className="ml-auto px-3 py-1.5 rounded text-sm font-medium bg-[#F0F7F4] text-[#2D6A4F] hover:bg-[#dceee6] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ↺ Refresh
            </button>
            {lastPastFetched && !pastLoading && (
              <span className="text-xs text-gray-400">
                Updated {lastPastFetched.toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>

          {pastLoading ? <Spinner /> : pastError ? (
            <p className="text-red-600 text-sm py-4">{pastError}</p>
          ) : pastBookings.length === 0 ? (
            <p className="text-sm text-gray-400">No bookings found for this month</p>
          ) : (
            <div className="space-y-2">
              {pastBookings.map(b => (
                <div key={b.eventId} className="flex items-center justify-between gap-4 bg-[#F0F7F4] rounded-lg px-4 py-3 border-l-4 border-green-600">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#2D6A4F] text-sm">{b.clientName}</p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {formatDateTime(b.sessionStart)} · {b.serviceName} · {b.durationMinutes} min
                    </p>
                  </div>
                  <button
                    onClick={() => setDetailsBooking(b)}
                    className="flex-shrink-0 text-xs px-3 py-1.5 rounded border border-[#2D6A4F]/30 text-[#2D6A4F] hover:bg-[#2D6A4F] hover:text-white transition-colors font-medium"
                  >
                    Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {detailsBooking && (
        <PastBookingDetails booking={detailsBooking} onClose={() => setDetailsBooking(null)} />
      )}

      {/* Always mounted so the calendar fetch starts on page load — hidden until tab is active */}
      <div className={activeTab === 'availability' ? '' : 'hidden'}>
        <AvailabilityTab />
      </div>
    </div>
  )
}
