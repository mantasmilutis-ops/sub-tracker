'use client'

import { useState, useEffect, useMemo } from 'react'
import { Subscription } from './DashboardClient'
import { useCurrency } from './CurrencyContext'
import { formatCurrency } from '@/lib/currency'
import { getDaysUntil, parseBillingDate } from '@/lib/date'

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Use LOCAL date components — toISOString() converts to UTC first, which shifts
// the date by ±1 day for users not in UTC.
function toYMD(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

type DotColor = 'red' | 'yellow' | 'green'

function getDotColor(days: number): DotColor {
  if (days <= 0) return 'red'
  if (days < 7) return 'yellow'
  return 'green'
}

const DOT_CLASS: Record<DotColor, string> = {
  red:    'bg-red-500',
  yellow: 'bg-amber-400',
  green:  'bg-emerald-400',
}

// Build a map of { 'YYYY-MM-DD': Subscription[] } for the visible subscriptions
function buildDateMap(subscriptions: Subscription[]): Record<string, Subscription[]> {
  const map: Record<string, Subscription[]> = {}
  for (const sub of subscriptions) {
    const key = sub.nextBilling.slice(0, 10)
    if (!map[key]) map[key] = []
    map[key].push(sub)
  }
  return map
}

// Return the 6×7 grid of Date objects for a given year/month (Mon-first)
function buildCalendarGrid(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1)
  // getDay(): 0=Sun…6=Sat — convert to Mon-first: Mon=0…Sun=6
  const startOffset = (firstDay.getDay() + 6) % 7
  const start = new Date(year, month, 1 - startOffset)
  const days: Date[] = []
  for (let i = 0; i < 42; i++) {
    days.push(new Date(start.getFullYear(), start.getMonth(), start.getDate() + i))
  }
  return days
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

// ─── Day popover ──────────────────────────────────────────────────────────────

function DayDetail({
  date,
  subs,
  onClose,
}: {
  date: Date
  subs: Subscription[]
  onClose: () => void
}) {
  const { currency } = useCurrency()
  const fmt = (n: number) => formatCurrency(n, currency)

  const total = subs.reduce((sum, s) => sum + s.price, 0)

  const label = date.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="divide-y divide-slate-100">
        {subs.map(sub => (
          <div key={sub.id} className="flex items-center justify-between px-4 py-2.5">
            <div>
              <p className="text-sm font-medium text-slate-900">{sub.name}</p>
              {sub.category && (
                <p className="text-xs text-slate-400 capitalize">{sub.category}</p>
              )}
            </div>
            <span className="text-sm font-semibold text-slate-700">{fmt(sub.price)}</span>
          </div>
        ))}
      </div>
      {subs.length > 1 && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total due</p>
          <span className="text-sm font-bold text-slate-900">{fmt(total)}</span>
        </div>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

type Props = { subscriptions: Subscription[] }

export function CalendarView({ subscriptions }: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const [year, setYear] = useState(() => new Date().getFullYear())
  const [month, setMonth] = useState(() => new Date().getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  // Recompute whenever subscriptions change so newly added subs appear immediately
  const dateMap = useMemo(() => buildDateMap(subscriptions), [subscriptions])
  const grid = useMemo(() => buildCalendarGrid(year, month), [year, month])

  if (!mounted) return <div className="card p-4 min-h-[340px]" />

  const today = new Date()
  const todayYMD = toYMD(today)

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
    setSelectedDate(null)
  }

  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
    setSelectedDate(null)
  }

  function handleDayClick(ymd: string) {
    if (!dateMap[ymd]) return
    setSelectedDate(prev => prev === ymd ? null : ymd)
  }

  const selectedSubs = selectedDate ? (dateMap[selectedDate] ?? []) : []
  const selectedDateObj = selectedDate ? parseBillingDate(selectedDate) : null

  return (
    <div className="card p-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Previous month"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <h3 className="text-sm font-semibold text-slate-900">
          {MONTH_NAMES[month]} {year}
        </h3>
        <button
          onClick={nextMonth}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Next month"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map(d => (
          <div key={d} className="text-center text-[10px] font-semibold text-slate-400 uppercase tracking-wide py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {grid.map((day, i) => {
          const ymd = toYMD(day)
          const isCurrentMonth = day.getMonth() === month
          const isToday = ymd === todayYMD
          const isSelected = ymd === selectedDate
          const hasSubs = !!dateMap[ymd]
          const subs = dateMap[ymd] ?? []

          // Pick worst-case dot color for the day
          const worstColor: DotColor | null = hasSubs
            ? subs.reduce<DotColor | null>((worst, sub) => {
                const c = getDotColor(getDaysUntil(sub.nextBilling))
                if (!worst) return c
                const rank: Record<DotColor, number> = { red: 2, yellow: 1, green: 0 }
                return rank[c] > rank[worst] ? c : worst
              }, null)
            : null

          return (
            <button
              key={i}
              onClick={() => handleDayClick(ymd)}
              disabled={!hasSubs}
              className={`
                relative flex flex-col items-center justify-start pt-1.5 pb-1 rounded-lg min-h-[44px]
                text-xs font-medium transition-colors
                ${!isCurrentMonth ? 'text-slate-300' : 'text-slate-700'}
                ${isToday ? 'font-bold' : ''}
                ${isSelected ? 'bg-indigo-50 ring-1 ring-indigo-300' : ''}
                ${hasSubs && !isSelected ? 'hover:bg-slate-50 cursor-pointer' : ''}
                ${!hasSubs ? 'cursor-default' : ''}
              `}
            >
              {/* Today ring */}
              {isToday ? (
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold leading-none">
                  {day.getDate()}
                </span>
              ) : (
                <span className={isCurrentMonth ? '' : 'opacity-40'}>
                  {day.getDate()}
                </span>
              )}

              {/* Colored dot */}
              {worstColor && (
                <span className={`mt-0.5 w-1.5 h-1.5 rounded-full ${DOT_CLASS[worstColor]}`} />
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 sm:gap-4 flex-wrap mt-3 pt-3 border-t border-slate-100">
        {([['green', 'On track'], ['yellow', 'Due soon'], ['red', 'Due today / overdue']] as [DotColor, string][]).map(([color, label]) => (
          <div key={color} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${DOT_CLASS[color]}`} />
            <span className="text-xs text-slate-400">{label}</span>
          </div>
        ))}
      </div>

      {/* Day detail panel */}
      {selectedDate && selectedDateObj && selectedSubs.length > 0 && (
        <DayDetail
          date={selectedDateObj}
          subs={selectedSubs}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  )
}
