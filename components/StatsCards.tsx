'use client'

import { useCurrency } from './CurrencyContext'
import { formatCurrency } from '@/lib/currency'

type Props = {
  totalMonthly: number
  totalYearly: number
  count: number
}

export function StatsCards({ totalMonthly, totalYearly, count }: Props) {
  const { currency } = useCurrency()
  const fmt = (n: number) => formatCurrency(n, currency)

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {/* Monthly total — most prominent; full-width on mobile */}
      <div className="card p-5 bg-indigo-600 border-indigo-600 col-span-2 sm:col-span-1">
        <p className="text-indigo-200 text-xs font-medium uppercase tracking-wide">Monthly Total</p>
        <p className="text-3xl font-bold text-white mt-1">{fmt(totalMonthly)}</p>
        <p className="text-indigo-300 text-xs mt-1">per month</p>
      </div>

      {/* Yearly total */}
      <div className="card p-5">
        <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">Yearly Total</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">{fmt(totalYearly)}</p>
        <p className="text-slate-400 text-xs mt-1">per year</p>
      </div>

      {/* Count */}
      <div className="card p-5">
        <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">Subscriptions</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">{count}</p>
        <p className="text-slate-400 text-xs mt-1">active</p>
      </div>
    </div>
  )
}
