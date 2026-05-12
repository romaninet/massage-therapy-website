'use client'

import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'

interface BookingCalendarProps {
  month: string              // YYYY-MM
  availableDates: Set<string>
  loading: boolean
  minMonth: string           // YYYY-MM — cannot navigate before this
  maxMonth: string           // YYYY-MM — cannot navigate past this
  onMonthChange: (month: string) => void
  onDateSelect: (date: string) => void
  locale: string
  prevMonthLabel: string
  nextMonthLabel: string
  noSlotsLabel: string
}

interface CalendarDay {
  dateStr: string | null
  dayNum: number
}

function addMonths(monthKey: string, n: number): string {
  const [y, m] = monthKey.split('-').map(Number)
  const d = new Date(y, m - 1 + n, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function buildCalendarGrid(year: number, month: number): CalendarDay[][] {
  const firstDay = new Date(year, month - 1, 1)
  const daysInMonth = new Date(year, month, 0).getDate()
  // Monday-first: Sun(0)→6, Mon(1)→0, …
  const startDow = (firstDay.getDay() + 6) % 7

  const weeks: CalendarDay[][] = []
  let week: CalendarDay[] = []

  for (let i = 0; i < startDow; i++) week.push({ dateStr: null, dayNum: 0 })

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    week.push({ dateStr, dayNum: d })
    if (week.length === 7) { weeks.push(week); week = [] }
  }

  if (week.length > 0) {
    while (week.length < 7) week.push({ dateStr: null, dayNum: 0 })
    weeks.push(week)
  }

  return weeks
}

function getDOWLabels(locale: string): string[] {
  // Monday-first labels
  const monday = new Date(2024, 0, 1)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d.toLocaleDateString(locale === 'fr' ? 'fr-CA' : 'en-CA', { weekday: 'short' })
  })
}

export function BookingCalendar({
  month,
  availableDates,
  loading,
  minMonth,
  maxMonth,
  onMonthChange,
  onDateSelect,
  locale,
  prevMonthLabel,
  nextMonthLabel,
  noSlotsLabel,
}: BookingCalendarProps) {
  const [year, monthNum] = month.split('-').map(Number)
  const monthLabel = new Date(year, monthNum - 1, 1).toLocaleString(
    locale === 'fr' ? 'fr-CA' : 'en-CA',
    { month: 'long', year: 'numeric' }
  )

  const todayStr = new Date().toISOString().slice(0, 10)
  const weeks = buildCalendarGrid(year, monthNum)
  const dowLabels = getDOWLabels(locale)

  const canGoPrev = month > minMonth
  const canGoNext = month < maxMonth

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm select-none">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => canGoPrev && onMonthChange(addMonths(month, -1))}
          disabled={!canGoPrev}
          aria-label={prevMonthLabel}
          className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
            canGoPrev
              ? 'text-[#2D6A4F] hover:bg-[#F0F7F4]'
              : 'text-gray-200 cursor-not-allowed'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <span className="font-semibold text-[#2D6A4F] capitalize text-sm">
          {monthLabel}
        </span>

        <button
          onClick={() => canGoNext && onMonthChange(addMonths(month, 1))}
          disabled={!canGoNext}
          aria-label={nextMonthLabel}
          className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
            canGoNext
              ? 'text-[#2D6A4F] hover:bg-[#F0F7F4]'
              : 'text-gray-200 cursor-not-allowed'
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 mb-1">
        {dowLabels.map((label) => (
          <div key={label} className="text-center text-xs font-medium text-gray-400 py-1">
            {label}
          </div>
        ))}
      </div>

      {/* Calendar grid with loading overlay */}
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-lg z-10">
            <Loader2 className="w-6 h-6 text-[#52B788] animate-spin" />
          </div>
        )}
        <div className={`grid grid-cols-7 gap-y-1 transition-opacity ${loading ? 'opacity-40' : 'opacity-100'}`}>
          {weeks.map((week, wi) =>
            week.map((day, di) => {
              if (!day.dateStr) {
                return <div key={`${wi}-${di}`} />
              }

              const isPast = day.dateStr < todayStr
              const hasSlots = availableDates.has(day.dateStr)
              const isClickable = !isPast && hasSlots

              return (
                <button
                  key={day.dateStr}
                  disabled={!isClickable}
                  onClick={() => isClickable && onDateSelect(day.dateStr!)}
                  className={`
                    h-9 w-full rounded-lg text-sm font-medium transition-colors
                    ${isPast
                      ? 'text-gray-500 cursor-not-allowed'
                      : hasSlots
                      ? 'bg-[#2D6A4F] text-white hover:bg-[#245c44] cursor-pointer'
                      : 'text-gray-200 cursor-not-allowed'
                    }
                  `}
                >
                  {day.dayNum}
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* Empty month hint */}
      {!loading && availableDates.size === 0 && (
        <p className="text-xs text-center text-gray-400 mt-3">{noSlotsLabel}</p>
      )}
    </div>
  )
}
