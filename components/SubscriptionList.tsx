'use client'

import { useState, useEffect } from 'react'
import { Subscription } from './DashboardClient'
import { ServiceLogo } from './ServiceLogo'
import { getCancelUrl, getFallbackSearchUrl } from '@/lib/cancel-catalog'
import { useCurrency } from './CurrencyContext'
import { formatCurrency } from '@/lib/currency'
import { getDaysUntil, formatBillingDate } from '@/lib/date'

// ─── Cancel modal ─────────────────────────────────────────────────────────────

function CancelModal({ sub, onClose }: { sub: Subscription; onClose: () => void }) {
  const cancelUrl = getCancelUrl(sub.name)
  const yearlyCost = sub.billingCycle === 'yearly' ? sub.price : sub.price * 12
  const { currency } = useCurrency()
  const savingsLabel = formatCurrency(yearlyCost, currency)

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xs">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">{sub.name}</h3>
            <p className="text-sm text-slate-500 mt-0.5">Want to stop paying for this?</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors mt-0.5 flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-5 pb-5 flex flex-col gap-3">
          {/* Savings pill */}
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5">
            <span className="text-base leading-none select-none" aria-hidden>💰</span>
            <p className="text-sm font-semibold text-emerald-700">
              You could save {savingsLabel}/year
            </p>
          </div>

          {/* Cancel link — direct if known, Google search fallback otherwise */}
          <a
            href={cancelUrl ?? getFallbackSearchUrl(sub.name)}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-between w-full text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors ${
              cancelUrl
                ? 'bg-slate-900 hover:bg-slate-800 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {cancelUrl ? 'Find cancellation page' : 'Search how to cancel →'}
            <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  entertainment: 'bg-purple-100 text-purple-700',
  software:      'bg-blue-100 text-blue-700',
  tools:         'bg-blue-100 text-blue-700',
  gaming:        'bg-green-100 text-green-700',
  music:         'bg-pink-100 text-pink-700',
  news:          'bg-yellow-100 text-yellow-700',
  health:        'bg-emerald-100 text-emerald-700',
  education:     'bg-orange-100 text-orange-700',
  other:         'bg-slate-100 text-slate-600',
}

function getCategoryColor(category: string | null) {
  if (!category) return 'bg-slate-100 text-slate-600'
  return CATEGORY_COLORS[category.toLowerCase()] || 'bg-slate-100 text-slate-600'
}


function formatDate(iso: string) {
  return formatBillingDate(iso)
}

// ─── List ─────────────────────────────────────────────────────────────────────

type Props = {
  subscriptions: Subscription[]
  onDelete: (id: string) => void
  deletingId: string | null
  getMonthlyEquivalent: (s: Subscription) => number
}

export function SubscriptionList({ subscriptions, onDelete, deletingId, getMonthlyEquivalent }: Props) {
  const [cancelSub, setCancelSub] = useState<Subscription | null>(null)

  if (subscriptions.length === 0) {
    return (
      <div className="card p-10 text-center">
        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <p className="text-slate-600 font-medium">No subscriptions yet</p>
        <p className="text-slate-400 text-sm mt-1">Click &ldquo;Add&rdquo; to track your first one</p>
      </div>
    )
  }

  const maxMonthly = Math.max(...subscriptions.map(getMonthlyEquivalent))
  const { currency } = useCurrency()
  const fmt = (n: number) => formatCurrency(n, currency)

  return (
    <>
      <div className="space-y-2.5">
        {subscriptions.map((sub, index) => {
          const monthly = getMonthlyEquivalent(sub)
          const isTopExpensive = index < 3 && monthly >= maxMonthly * 0.7
          const daysUntil = getDaysUntil(sub.nextBilling)
          const isDueSoon = daysUntil >= 0 && daysUntil <= 7

          return (
            <div
              key={sub.id}
              className={`card px-3 py-3 sm:p-4 flex items-center gap-3 sm:gap-4 ${
                isTopExpensive ? 'border-indigo-200 bg-indigo-50/30' : ''
              }`}
            >
              {/* Service logo */}
              <ServiceLogo
                name={sub.name}
                size={40}
                className={isTopExpensive ? 'ring-2 ring-indigo-200' : ''}
                fallbackClassName={isTopExpensive ? 'bg-indigo-100 text-indigo-600' : ''}
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-slate-900 truncate">{sub.name}</span>
                  {sub.category && (
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${getCategoryColor(sub.category)}`}>
                      {sub.category}
                    </span>
                  )}
                  {isTopExpensive && index === 0 && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                      Most expensive
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-400 flex-wrap">
                  <span className={isDueSoon ? 'text-orange-500 font-medium' : ''}>
                    {isDueSoon && daysUntil === 0
                      ? 'Due today'
                      : isDueSoon
                      ? `Due in ${daysUntil}d`
                      : `Next: ${formatDate(sub.nextBilling)}`}
                  </span>
                  <span>•</span>
                  <span className="capitalize">{sub.billingCycle}</span>
                  {sub.billingCycle === 'yearly' && (
                    <>
                      <span>•</span>
                      <span>{fmt(monthly)}/mo</span>
                    </>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-slate-900">{fmt(sub.price)}</p>
                <p className="text-xs text-slate-400">
                  {sub.billingCycle === 'yearly' ? '/year' : '/month'}
                </p>
              </div>

              {/* Cancel helper */}
              <button
                onClick={() => setCancelSub(sub)}
                className="text-slate-300 hover:text-rose-400 transition-colors flex-shrink-0 p-2 -m-1"
                title="Help canceling this subscription"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>

              {/* Delete */}
              <button
                onClick={() => onDelete(sub.id)}
                disabled={deletingId === sub.id}
                className="text-slate-300 hover:text-red-500 transition-colors flex-shrink-0 disabled:opacity-50 p-2 -m-1"
                title="Delete subscription"
              >
                {deletingId === sub.id ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )}
              </button>
            </div>
          )
        })}
      </div>

      {/* Cancel modal — rendered outside the list so it overlays everything */}
      {cancelSub && (
        <CancelModal sub={cancelSub} onClose={() => setCancelSub(null)} />
      )}
    </>
  )
}
