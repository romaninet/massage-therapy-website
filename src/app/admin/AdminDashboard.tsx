'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { signOut } from 'next-auth/react'
import { DatePickerInput } from '@/components/ui/DatePickerInput'

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
  })
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit' })
}

function todayString(): string {
  return new Date().toISOString().slice(0, 10)
}

interface BookingCardProps {
  booking: Booking
  onAccept?: (eventId: string) => void
  onDecline?: (eventId: string) => void
  onCancel?: (eventId: string) => void
  readOnly?: boolean
}

function BookingCard({ booking, onAccept, onDecline, onCancel, readOnly }: BookingCardProps) {
  const [confirming, setConfirming] = useState(false)
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
        onCancel?.(booking.eventId)
      }
    } finally {
      setLoading(false)
      setConfirming(false)
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
                  onClick={handleAccept}
                  disabled={loading}
                  className="bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white text-sm px-3 py-1.5 rounded w-full"
                >
                  {loading ? 'Accepting…' : 'Accept'}
                </button>
                <button
                  onClick={handleDecline}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm px-3 py-1.5 rounded w-full"
                >
                  {loading ? 'Declining…' : 'Decline'}
                </button>
              </div>
            )}
            {booking.status === 'confirmed' && !confirming && (
              <button
                onClick={() => setConfirming(true)}
                className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1.5 rounded"
              >
                Cancel Booking
              </button>
            )}
            {booking.status === 'confirmed' && confirming && (
              <div className="flex flex-col gap-2 items-end">
                <p className="text-sm text-gray-700">Cancel this booking?</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirming(false)}
                    className="text-sm px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-100"
                  >
                    Keep
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    data-testid="confirm-cancel"
                    className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm px-3 py-1.5 rounded"
                  >
                    {loading ? 'Cancelling…' : 'Yes, Cancel'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function AdminDashboard({ email }: { email?: string }) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'availability'>('upcoming')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pastDate, setPastDate] = useState(todayString())

  const fetchBookings = useCallback(async (view: 'future' | 'past', date?: string) => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ view })
      if (date) params.set('date', date)
      const res = await fetch(`/api/admin/bookings?${params}`)
      if (!res.ok) throw new Error(`Failed to load bookings (${res.status})`)
      const data = await res.json()
      setBookings(data.bookings ?? data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (activeTab === 'upcoming') {
      fetchBookings('future')
    } else {
      fetchBookings('past', pastDate)
    }
  }, [activeTab, fetchBookings])

  const handleDateChange = (date: string) => {
    setPastDate(date)
    fetchBookings('past', date)
  }

  const removeBooking = (eventId: string) => {
    setBookings(prev => prev.filter(b => b.eventId !== eventId))
  }

  const handleAccepted = (eventId: string) => {
    setBookings(prev =>
      prev.map(b => b.eventId === eventId ? { ...b, status: 'confirmed' as const } : b)
    )
  }

  const pending = bookings.filter(b => b.status === 'pending')
  const confirmed = bookings.filter(b => b.status === 'confirmed')

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[#2D6A4F]">Booking Dashboard</h1>
        <div className="flex items-center gap-4">
          {email && <span className="text-sm text-gray-500">{email}</span>}
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="text-sm text-gray-500 hover:text-red-600 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {([
          { key: 'upcoming', label: 'Upcoming' },
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

      {/* Past date picker */}
      {activeTab === 'past' && (
        <div className="mb-5 flex items-center gap-3">
          <label className="text-sm text-gray-600 font-medium">Show bookings up to:</label>
          <DatePickerInput
            value={pastDate}
            onChange={handleDateChange}
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#52B788]"
          />
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center gap-3 py-12 text-[#2D6A4F]">
          <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-gray-500">Loading bookings from calendar…</p>
        </div>
      )}

      {error && (
        <p className="text-red-600 text-sm py-4">{error}</p>
      )}

      {!loading && !error && activeTab === 'upcoming' && (
        <div className="space-y-8">
          <section>
            <h2 className="text-base font-semibold text-[#2D6A4F] mb-3">Pending Requests</h2>
            {pending.length === 0 ? (
              <p className="text-sm text-gray-400">No pending requests</p>
            ) : (
              <div className="space-y-3">
                {pending.map(b => (
                  <BookingCard key={b.eventId} booking={b} onAccept={handleAccepted} onDecline={removeBooking} />
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#2D6A4F] mb-3">Confirmed Bookings</h2>
            {confirmed.length === 0 ? (
              <p className="text-sm text-gray-400">No confirmed bookings</p>
            ) : (
              <div className="space-y-3">
                {confirmed.map(b => (
                  <BookingCard key={b.eventId} booking={b} onCancel={removeBooking} />
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {!loading && !error && activeTab === 'past' && (
        <div>
          {bookings.length === 0 ? (
            <p className="text-sm text-gray-400">No bookings found</p>
          ) : (
            <div className="space-y-3">
              {bookings.map(b => (
                <BookingCard key={b.eventId} booking={b} readOnly />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Always mounted so the fetch starts on page load — hidden until tab is active */}
      <div className={activeTab === 'availability' ? '' : 'hidden'}>
        <AvailabilityTab />
      </div>
    </div>
  )
}
