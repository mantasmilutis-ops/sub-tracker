'use client'

import { useState, useEffect } from 'react'
import { signOut } from 'next-auth/react'
import { AddSubscriptionForm } from './AddSubscriptionForm'
import { SubscriptionList } from './SubscriptionList'
import { StatsCards } from './StatsCards'
import { UpcomingPayments } from './UpcomingPayments'
import { ViralCard } from './dashboard/ViralCard'
import { LogoLink } from './LogoLink'
import { CurrencyProvider, CurrencySelector } from './CurrencyContext'
import { CalendarView } from './CalendarView'
import { getDaysUntil } from '@/lib/date'

// ─── Smart Alerts banner ──────────────────────────────────────────────────────

function AlertsBanner({ subscriptions }: { subscriptions: Subscription[] }) {
  const urgentCount = subscriptions.filter(
    s => { const d = getDaysUntil(s.nextBilling); return d >= 0 && d < 7 }
  ).length

  const hasAlert = urgentCount > 0

  function scrollToUpcoming() {
    document.getElementById('upcoming-payments')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className={`flex items-center justify-between gap-x-3 gap-y-1.5 flex-wrap rounded-xl px-4 py-3 mb-6 text-sm ${
      hasAlert
        ? 'bg-amber-50 border border-amber-200 text-amber-800'
        : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
    }`}>
      <span className="font-medium">
        {hasAlert
          ? `⚠️  ${urgentCount} payment${urgentCount !== 1 ? 's' : ''} due in the next 7 days`
          : '✅  No payments due in the next 7 days'}
      </span>
      <button
        onClick={scrollToUpcoming}
        className={`whitespace-nowrap font-semibold hover:underline underline-offset-2 flex-shrink-0 ${
          hasAlert ? 'text-amber-700' : 'text-emerald-700'
        }`}
      >
        View upcoming →
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

export type Subscription = {
  id: string
  name: string
  price: number
  billingCycle: string
  category: string | null
  nextBilling: string
  logoUrl: string
  createdAt: string
}

type Props = {
  initialSubscriptions: Subscription[]
  userName: string
}

export function DashboardClient({ initialSubscriptions, userName }: Props) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(initialSubscriptions)
  const [showForm, setShowForm] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [view, setView] = useState<'list' | 'calendar'>('list')

  // Detect and persist timezone once on mount; updates automatically if it changes.
  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    fetch('/api/user/timezone', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ timezone: tz }),
    }).catch(() => {}) // best-effort — never block the UI
  }, [])

  function getMonthlyEquivalent(sub: Subscription) {
    return sub.billingCycle === 'yearly' ? sub.price / 12 : sub.price
  }

  const totalMonthly = subscriptions.reduce(
    (sum, s) => sum + getMonthlyEquivalent(s),
    0
  )
  const totalYearly = subscriptions.reduce(
    (sum, s) => sum + (s.billingCycle === 'yearly' ? s.price : s.price * 12),
    0
  )

  async function handleDelete(id: string) {
    setDeletingId(id)
    const res = await fetch(`/api/subscriptions/${id}`, { method: 'DELETE' })
    setDeletingId(null)
    if (res.ok) {
      setSubscriptions(prev => prev.filter(s => s.id !== id))
    }
  }

  function handleAdded(newSub: Subscription) {
    setSubscriptions(prev =>
      [...prev, newSub].sort((a, b) => b.price - a.price)
    )
    setShowForm(false)
  }

  const firstName = userName.includes('@') ? userName.split('@')[0] : userName.split(' ')[0]

  return (
    <CurrencyProvider>
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <LogoLink />

          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500 hidden sm:block">
              Hi, <span className="text-slate-700 font-medium capitalize">{firstName}</span>
            </span>
            <CurrencySelector />
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Page title + Add button */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {subscriptions.length === 0
                ? 'No subscriptions yet'
                : `${subscriptions.length} subscription${subscriptions.length !== 1 ? 's' : ''} tracked`}
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add</span>
          </button>
        </div>

        {/* Smart Alerts banner */}
        {subscriptions.length > 0 && <AlertsBanner subscriptions={subscriptions} />}

        {/* Viral spending card */}
        <ViralCard totalMonthly={totalMonthly} totalYearly={totalYearly} />

        {/* Stats */}
        <StatsCards
          totalMonthly={totalMonthly}
          totalYearly={totalYearly}
          count={subscriptions.length}
        />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Subscriptions list / calendar */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-slate-900">All Subscriptions</h2>
              {/* View toggle */}
              <div className="flex items-center bg-slate-100 rounded-lg p-0.5 gap-0.5">
                <button
                  onClick={() => setView('list')}
                  className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${
                    view === 'list'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                  List
                </button>
                <button
                  onClick={() => setView('calendar')}
                  className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${
                    view === 'calendar'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
                  </svg>
                  Calendar
                </button>
              </div>
            </div>
            {view === 'list' ? (
              <SubscriptionList
                subscriptions={subscriptions}
                onDelete={handleDelete}
                deletingId={deletingId}
                getMonthlyEquivalent={getMonthlyEquivalent}
              />
            ) : (
              <CalendarView subscriptions={subscriptions} />
            )}
          </div>

          {/* Sidebar */}
          <div id="upcoming-payments">
            <h2 className="text-base font-semibold text-slate-900 mb-3">Upcoming Payments</h2>
            <UpcomingPayments subscriptions={subscriptions} />
          </div>
        </div>
      </main>

      {/* Add Subscription Modal */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
          onClick={e => { if (e.target === e.currentTarget) setShowForm(false) }}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90dvh] flex flex-col">
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100 flex-shrink-0">
              <h2 className="text-lg font-semibold text-slate-900">Add Subscription</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 -mr-1"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <AddSubscriptionForm onAdded={handleAdded} onCancel={() => setShowForm(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
    </CurrencyProvider>
  )
}
