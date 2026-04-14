'use client'

import { Subscription } from './DashboardClient'
import { useCurrency } from './CurrencyContext'
import { formatCurrency } from '@/lib/currency'
import { getDaysUntil, parseBillingDate } from '@/lib/date'

// ─── Urgency tier ─────────────────────────────────────────────────────────────

type Tier = 'urgent' | 'soon' | 'far'

function getTier(days: number): Tier {
  if (days < 7)  return 'urgent'
  if (days <= 14) return 'soon'
  return 'far'
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusDot({ tier }: { tier: Tier }) {
  if (tier === 'urgent') {
    return (
      // Pulsing red dot for urgent — draws the eye immediately
      <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-60" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
      </span>
    )
  }
  return (
    <span className={`flex-shrink-0 w-2.5 h-2.5 rounded-full ${
      tier === 'soon' ? 'bg-amber-400' : 'bg-emerald-400'
    }`} />
  )
}

function Badge({ days }: { days: number }) {
  if (days === 0) {
    return (
      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-red-100 text-red-700 leading-none">
        Today
      </span>
    )
  }
  if (days === 1) {
    return (
      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-red-100 text-red-700 leading-none">
        Tomorrow
      </span>
    )
  }
  if (days < 7) {
    return (
      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-amber-100 text-amber-700 leading-none">
        Soon
      </span>
    )
  }
  return null
}

function DateLabel({ days }: { days: number }) {
  const tier = getTier(days)
  const label =
    days === 0 ? 'Due today' :
    days === 1 ? 'Due tomorrow' :
    `In ${days} days`

  return (
    <p className={`text-xs mt-0.5 ${
      tier === 'urgent'
        ? 'text-red-500 font-medium'
        : tier === 'soon'
        ? 'text-amber-600'
        : 'text-slate-400'
    }`}>
      {label}
    </p>
  )
}

// ─── Alert header ─────────────────────────────────────────────────────────────

function UrgentAlert({ count }: { count: number }) {
  return (
    <div className="mx-3 mt-3 flex items-center gap-2.5 bg-red-50 border border-red-100 rounded-xl px-3.5 py-2.5">
      <span className="text-sm leading-none select-none" aria-hidden>⚠️</span>
      <p className="text-sm font-semibold text-red-700">
        {count} payment{count !== 1 ? 's' : ''} due within 7 days
      </p>
    </div>
  )
}

// ─── Payment row ──────────────────────────────────────────────────────────────

function PaymentRow({ sub }: { sub: Subscription }) {
  const days = getDaysUntil(sub.nextBilling)
  const tier = getTier(days)
  const isUrgent = tier === 'urgent'
  const { currency } = useCurrency()
  const fmt = (n: number) => formatCurrency(n, currency)

  return (
    <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
      isUrgent ? 'bg-red-50/70' : 'hover:bg-slate-50'
    }`}>
      {/* Status dot */}
      <StatusDot tier={tier} />

      {/* Name + date */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className={`text-sm truncate ${
            isUrgent ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'
          }`}>
            {sub.name}
          </p>
          <Badge days={days} />
        </div>
        <DateLabel days={days} />
      </div>

      {/* Price */}
      <span className={`text-sm font-semibold flex-shrink-0 tabular-nums ${
        isUrgent ? 'text-red-700' : 'text-slate-700'
      }`}>
        {fmt(sub.price)}
      </span>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

type Props = { subscriptions: Subscription[] }

export function UpcomingPayments({ subscriptions }: Props) {
  const upcoming = [...subscriptions]
    .filter(s => getDaysUntil(s.nextBilling) >= 0)
    .sort((a, b) => parseBillingDate(a.nextBilling).getTime() - parseBillingDate(b.nextBilling).getTime())
    .slice(0, 6)

  if (upcoming.length === 0) {
    return (
      <div className="card p-5 text-center">
        <p className="text-slate-400 text-sm">No upcoming payments</p>
      </div>
    )
  }

  const urgentCount = upcoming.filter(s => getDaysUntil(s.nextBilling) < 7).length

  return (
    <div className="card overflow-hidden pb-2">
      {/* Urgent alert header */}
      {urgentCount > 0 && <UrgentAlert count={urgentCount} />}

      {/* Payment rows */}
      <div className="p-2 mt-1 flex flex-col gap-0.5">
        {upcoming.map(sub => (
          <PaymentRow key={sub.id} sub={sub} />
        ))}
      </div>
    </div>
  )
}
