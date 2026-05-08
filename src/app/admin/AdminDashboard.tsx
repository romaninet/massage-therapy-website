'use client'

import { useState, useEffect, useCallback } from 'react'
import { signOut } from 'next-auth/react'

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

function getMonthTabs(): { key: string; label: string }[] {
  const tabs = []
  const now = new Date()
  for (let i = 0; i < 7; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const label = d.toLocaleString('en-CA', { month: 'long', year: 'numeric' })
    tabs.push({ key, label })
  }
  return tabs
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


function AvailabilityTab() {
  const monthTabs = getMonthTabs()
  const [activeMonth, setActiveMonth] = useState(monthTabs[0].key)
  const [blocks, setBlocks] = useState<OpenBlock[]>([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBlocks = useCallback(async (month: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/availability?month=${month}`)
      if (!res.ok) throw new Error(`Failed to load availability (${res.status})`)
      const data = await res.json()
      setBlocks(data.blocks ?? [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchBlocks(activeMonth) }, [activeMonth, fetchBlocks])

  const [year, mon] = activeMonth.split('-').map(Number)
  const grid = buildCalendarGrid(year, mon, blocks)
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Toronto' })

  const DOW_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <div>
      {/* Month sub-tabs */}
      <div className="flex flex-wrap gap-1 mb-6">
        {monthTabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveMonth(t.key)}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              activeMonth === t.key
                ? 'bg-[#2D6A4F] text-white'
                : 'bg-[#F0F7F4] text-[#2D6A4F] hover:bg-[#dceee6]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading && <p className="text-gray-500 text-sm py-8 text-center">Loading…</p>}
      {error && <p className="text-red-600 text-sm py-4">{error}</p>}


      {!loading && !error && (
        <>
          {blocks.length === 0 ? (
            <p className="text-sm text-gray-400">No open blocks this month</p>
          ) : (
            <>
              <p className="text-xs text-gray-400 mb-4">{blocks.length} open block{blocks.length !== 1 ? 's' : ''} this month</p>
              {/* Calendar grid */}
              <div className="overflow-x-auto">
                <div className="min-w-[560px]">
                  {/* Day-of-week header */}
                  <div className="grid grid-cols-7 gap-1 mb-1">
                    {DOW_LABELS.map(d => (
                      <div key={d} className="text-center text-xs font-semibold text-gray-500 py-1">{d}</div>
                    ))}
                  </div>
                  {/* Weeks */}
                  {grid.map((week, wi) => (
                    <div key={wi} className="grid grid-cols-7 gap-1 mb-1">
                      {week.map((day, di) => {
                        const isToday = day.dateStr === today
                        const dayNum = day.dateStr ? Number(day.dateStr.slice(8)) : null
                        return (
                          <div
                            key={di}
                            className={`min-h-[64px] rounded p-1.5 text-xs ${
                              !day.dateStr
                                ? 'bg-transparent'
                                : day.blocks.length > 0
                                ? 'bg-[#F0F7F4] border border-[#52B788]/40'
                                : 'bg-gray-50 border border-gray-100'
                            } ${isToday ? 'ring-2 ring-[#2D6A4F]' : ''}`}
                          >
                            {dayNum !== null && (
                              <span className={`block font-semibold mb-1 ${isToday ? 'text-[#2D6A4F]' : 'text-gray-600'}`}>
                                {dayNum}
                              </span>
                            )}
                            {day.blocks.map(b => (
                              <div key={b.id} className="text-[10px] leading-tight text-[#2D6A4F] bg-[#52B788]/20 rounded px-1 py-0.5 mb-0.5">
                                {b.startTime}–{b.endTime}
                              </div>
                            ))}
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
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
  onDecline?: (eventId: string) => void
  onCancel?: (eventId: string) => void
  readOnly?: boolean
}

function BookingCard({ booking, onDecline, onCancel, readOnly }: BookingCardProps) {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)

  const borderClass =
    booking.status === 'pending'
      ? 'border-l-4 border-yellow-400'
      : 'border-l-4 border-green-600'

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
              <button
                onClick={handleDecline}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm px-3 py-1.5 rounded"
              >
                {loading ? 'Declining…' : 'Decline'}
              </button>
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
  const [loading, setLoading] = useState(false)
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
            className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === key
                ? 'border-[#2D6A4F] text-[#2D6A4F]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
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
          <input
            type="date"
            value={pastDate}
            onChange={e => handleDateChange(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#52B788]"
          />
        </div>
      )}

      {loading && (
        <p className="text-gray-500 text-sm py-8 text-center">Loading…</p>
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
                  <BookingCard key={b.eventId} booking={b} onDecline={removeBooking} />
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

      {activeTab === 'availability' && <AvailabilityTab />}
    </div>
  )
}
