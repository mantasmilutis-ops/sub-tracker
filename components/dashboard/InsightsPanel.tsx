import type { ReactNode } from 'react'
import type { Insights, InsightCategory, InsightRenewal, SaveHint, TopSub } from '@/lib/insights'

// ─── Formatting ───────────────────────────────────────────────────────────────

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// ─── Icon primitive ───────────────────────────────────────────────────────────

function Icon({ path, className = '' }: { path: string; className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.7}
      stroke="currentColor"
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  )
}

const PATHS = {
  card:    'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z',
  chart:   'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
  star:    'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z',
  bell:    'M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0',
  check:   'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  arrowUp: 'M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18',
  arrowDn: 'M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3',
  users:   'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z',
}

// ─── Trend badge ──────────────────────────────────────────────────────────────

function TrendBadge({ percent }: { percent: number }) {
  // Spending more = unfavourable → red. Spending less = green.
  const isUp = percent > 0
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
        isUp
          ? 'bg-red-500/20 text-red-300'
          : 'bg-emerald-500/20 text-emerald-300'
      }`}
    >
      <Icon
        path={isUp ? PATHS.arrowUp : PATHS.arrowDn}
        className="w-2.5 h-2.5"
      />
      {Math.abs(percent)}% vs last month
    </span>
  )
}

// ─── Hero money card ──────────────────────────────────────────────────────────

function MoneyCard({
  totalMonthly,
  totalYearly,
  trendPercent,
  savingsHint,
}: {
  totalMonthly: number
  totalYearly: number
  trendPercent: number | null
  savingsHint: SaveHint | null
}) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #3730a3 55%, #4f46e5 100%)' }}
    >
      {/* Decorative orbs */}
      <div aria-hidden className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/[0.04]" />
      <div aria-hidden className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white/[0.04]" />
      <div aria-hidden className="absolute top-1/2 right-16 w-20 h-20 rounded-full bg-white/[0.03]" />

      <div className="relative p-6 sm:p-8">
        {/* Top row: icon + label + trend */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
              <Icon path={PATHS.card} className="w-[17px] h-[17px] text-indigo-200" />
            </div>
            <span className="text-[11px] font-semibold text-indigo-300 uppercase tracking-widest">
              Monthly Spend
            </span>
          </div>
          {trendPercent !== null && <TrendBadge percent={trendPercent} />}
        </div>

        {/* Main content — two columns on sm+ */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-5">
          {/* Primary number */}
          <div className="flex-1">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-[2.6rem] sm:text-5xl font-black text-white leading-none tracking-tight">
                {fmt(totalMonthly)}
              </span>
              <span className="text-base font-medium text-indigo-400">/mo</span>
            </div>
          </div>

          {/* Vertical divider (desktop only) */}
          <div aria-hidden className="hidden sm:block w-px self-stretch bg-white/10 mx-2" />
          {/* Horizontal divider (mobile only) */}
          <div aria-hidden className="sm:hidden h-px bg-white/10" />

          {/* Secondary: yearly */}
          <div className="sm:text-right min-w-[160px]">
            <p className="text-[11px] font-semibold text-indigo-400 uppercase tracking-widest mb-1">
              Yearly total
            </p>
            <p className="text-2xl font-bold text-white leading-none">
              {fmt(totalYearly)}
            </p>
            <p className="text-xs text-indigo-300 mt-1.5">
              You&apos;re spending this much each year
            </p>
          </div>
        </div>

        {/* Savings hint */}
        {savingsHint && (
          <>
            <div className="h-px bg-white/10 my-5" />
            <div className="flex items-start gap-2.5">
              <span className="text-base leading-none mt-px select-none" aria-hidden>💡</span>
              <p className="text-xs text-indigo-200 leading-relaxed">
                Cancel{' '}
                <span className="font-semibold text-white">{savingsHint.name}</span>
                {' '}and save{' '}
                <span className="font-semibold text-white">~{fmt(savingsHint.yearlyCost)}/year</span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Accent card shell ────────────────────────────────────────────────────────
// Shared chrome for the three white cards. Children own the inner content.

function AccentCard({
  accentGradient,
  children,
}: {
  accentGradient: string
  children: ReactNode
}) {
  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-slate-200">
      {/* 3-px gradient top bar */}
      <div className={`h-[3px] w-full ${accentGradient}`} />
      <div className="p-5 sm:p-6 flex flex-col flex-1">{children}</div>
    </div>
  )
}

// ─── Category card ────────────────────────────────────────────────────────────

function CategoryCard({
  topCategory,
  totalMonthly,
}: {
  topCategory: InsightCategory | null
  totalMonthly: number
}) {
  const pct =
    topCategory && totalMonthly > 0
      ? Math.round((topCategory.monthly / totalMonthly) * 100)
      : null

  return (
    <AccentCard accentGradient="bg-gradient-to-r from-violet-400 to-purple-500">
      {/* Icon row */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-full bg-violet-50 flex items-center justify-center">
          <Icon path={PATHS.chart} className="w-5 h-5 text-violet-600" />
        </div>
        {pct !== null && (
          <span className="text-[11px] font-semibold bg-violet-50 text-violet-700 px-2.5 py-1 rounded-full">
            {pct}% of total
          </span>
        )}
      </div>

      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">
        Biggest category
      </p>
      <p className="text-lg font-bold text-slate-900 leading-snug truncate mb-1">
        {topCategory ? capitalize(topCategory.name) : '—'}
      </p>
      <p className="text-xs text-slate-500 leading-relaxed mt-auto pt-1">
        {topCategory
          ? `${fmt(topCategory.monthly)}/mo · ${topCategory.count} subscription${topCategory.count !== 1 ? 's' : ''}`
          : 'No categories set yet'}
      </p>
    </AccentCard>
  )
}

// ─── Top subscription card ────────────────────────────────────────────────────

function TopSubCard({ top3 }: { top3: TopSub[] }) {
  return (
    <AccentCard accentGradient="bg-gradient-to-r from-amber-400 to-orange-400">
      {/* Icon row */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
          <Icon path={PATHS.star} className="w-5 h-5 text-amber-500" />
        </div>
        {top3.length > 0 && (
          <span className="text-[11px] font-semibold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full">
            #{1} costliest
          </span>
        )}
      </div>

      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">
        Top subscription
      </p>
      <p className="text-lg font-bold text-slate-900 leading-snug truncate mb-1">
        {top3[0]?.name ?? '—'}
      </p>
      <p className="text-xs text-slate-500 leading-relaxed mt-auto pt-1">
        {top3.length > 1
          ? `Also: ${top3.slice(1).map(s => s.name).join(', ')}`
          : top3.length === 1
          ? `${fmt(top3[0].monthly)}/mo · your most expensive`
          : 'No subscriptions yet'}
      </p>
    </AccentCard>
  )
}

// ─── Renewal card (3 urgency states) ─────────────────────────────────────────

type RenewalState = 'clear' | 'upcoming' | 'urgent'

function getRenewalState(renewal: InsightRenewal): RenewalState {
  if (renewal.count === 0) return 'clear'
  if (renewal.soonestDays !== null && renewal.soonestDays <= 1) return 'urgent'
  return 'upcoming'
}

const RENEWAL_CONFIG: Record<
  RenewalState,
  {
    accent: string
    iconBg: string
    iconColor: string
    badgeBg: string
    badgeText: string
  }
> = {
  clear: {
    accent:     'bg-gradient-to-r from-emerald-400 to-teal-400',
    iconBg:     'bg-emerald-50',
    iconColor:  'text-emerald-600',
    badgeBg:    'bg-emerald-50',
    badgeText:  'text-emerald-700',
  },
  upcoming: {
    accent:     'bg-gradient-to-r from-amber-400 to-orange-400',
    iconBg:     'bg-amber-50',
    iconColor:  'text-amber-600',
    badgeBg:    'bg-amber-50',
    badgeText:  'text-amber-700',
  },
  urgent: {
    accent:     'bg-gradient-to-r from-red-500 to-rose-500',
    iconBg:     'bg-red-50',
    iconColor:  'text-red-600',
    badgeBg:    'bg-red-50',
    badgeText:  'text-red-700',
  },
}

function RenewalCard({ renewal }: { renewal: InsightRenewal }) {
  const state = getRenewalState(renewal)
  const cfg = RENEWAL_CONFIG[state]
  const { soonestDays, count, total } = renewal

  const value =
    state === 'clear'
      ? 'All clear 🎉'
      : state === 'urgent'
      ? `${fmt(total)} — heads up!`
      : `${fmt(total)} due soon`

  const soonestLabel =
    soonestDays === 0
      ? 'one is due today'
      : soonestDays === 1
      ? 'one is due tomorrow'
      : soonestDays != null
      ? `soonest in ${soonestDays} days`
      : ''

  const sub =
    state === 'clear'
      ? 'No renewals in the next 7 days'
      : `${count} renewal${count !== 1 ? 's' : ''} · ${soonestLabel}`

  const badgeLabel =
    state === 'clear'
      ? 'No renewals'
      : soonestDays === 0
      ? 'Due today'
      : soonestDays === 1
      ? 'Due tomorrow'
      : `In ${soonestDays}d`

  return (
    <AccentCard accentGradient={cfg.accent}>
      {/* Icon row */}
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${cfg.iconBg}`}>
          <Icon
            path={state === 'clear' ? PATHS.check : PATHS.bell}
            className={`w-5 h-5 ${cfg.iconColor}`}
          />
        </div>

        <span
          className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${cfg.badgeBg} ${cfg.badgeText}`}
        >
          {state === 'urgent' && (
            <span
              className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse inline-block"
              aria-hidden
            />
          )}
          {badgeLabel}
        </span>
      </div>

      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">
        Due in 7 days
      </p>
      <p className="text-lg font-bold text-slate-900 leading-snug mb-1">{value}</p>
      <p className="text-xs text-slate-500 leading-relaxed mt-auto pt-1">{sub}</p>
    </AccentCard>
  )
}

// ─── Compare card ─────────────────────────────────────────────────────────────
// Uses mock benchmark data. Replace BENCHMARK_* with real API values when ready.

const BENCHMARK_AVERAGE = 42   // €/month — mock global average
const BENCHMARK_MEDIAN  = 35   // €/month — mock median (distribution is right-skewed)

/**
 * Approximate what percentile `monthly` sits at using piecewise-linear
 * interpolation over a realistic right-skewed spending distribution.
 * Replace with a real percentile lookup when backend data is available.
 */
const PERCENTILE_TABLE: [spend: number, pct: number][] = [
  [0, 0], [10, 8], [20, 18], [30, 28], [35, 35],
  [42, 50], [55, 60], [75, 70], [100, 78], [150, 85],
  [200, 90], [300, 95], [500, 98], [1000, 99],
]

function mockPercentile(monthly: number): number {
  for (let i = 1; i < PERCENTILE_TABLE.length; i++) {
    const [x0, y0] = PERCENTILE_TABLE[i - 1]
    const [x1, y1] = PERCENTILE_TABLE[i]
    if (monthly <= x1) {
      const t = (monthly - x0) / (x1 - x0)
      return Math.round(y0 + t * (y1 - y0))
    }
  }
  return 99
}

function CompareCard({ totalMonthly }: { totalMonthly: number }) {
  const percentile = mockPercentile(totalMonthly)
  const isAbove = totalMonthly > BENCHMARK_AVERAGE

  // ── Derived copy + colours ────────────────────────────────────────────────────
  const accent      = isAbove ? 'bg-gradient-to-r from-rose-400 to-pink-500'    : 'bg-gradient-to-r from-emerald-400 to-teal-500'
  const iconBg      = isAbove ? 'bg-rose-50'     : 'bg-emerald-50'
  const iconColor   = isAbove ? 'text-rose-500'  : 'text-emerald-600'
  const numColor    = isAbove ? 'text-rose-500'  : 'text-emerald-500'
  const badgeBg     = isAbove ? 'bg-rose-50 text-rose-700'   : 'bg-emerald-50 text-emerald-700'

  // Badge label: escalate to "Top X%" once comfortably above average
  const badgeLabel = !isAbove
    ? 'Below average'
    : percentile >= 90
    ? `Top ${100 - percentile}%`
    : 'Above average'

  // Main headline — the emotionally-charged line
  const headline = isAbove
    ? `You outspend ${percentile}% of users 😬`
    : `${100 - percentile}% of users spend more than you 😌`

  // Secondary context line
  const diff = Math.abs(totalMonthly - BENCHMARK_AVERAGE)
  const context = isAbove
    ? `Average is ${fmt(BENCHMARK_AVERAGE)}/mo · you're ${fmt(diff)} above that`
    : `Average is ${fmt(BENCHMARK_AVERAGE)}/mo · you're ${fmt(diff)} below that`

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-slate-200">
      {/* Accent bar */}
      <div className={`h-[3px] w-full ${accent}`} />

      <div className="px-5 sm:px-6 py-5 flex items-center gap-5">

        {/* Icon */}
        <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${iconBg}`}>
          <Icon path={PATHS.users} className={`w-5 h-5 ${iconColor}`} />
        </div>

        {/* Text block */}
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
            vs. other users
          </p>
          <p className="text-[15px] font-bold text-slate-900 leading-snug">
            {headline}
          </p>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            {context}
          </p>
        </div>

        {/* Right side: big percentile + badge */}
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0 pl-2">
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full leading-none ${badgeBg}`}>
            {badgeLabel}
          </span>
          <p className={`text-4xl font-black leading-none tabular-nums ${numColor}`}>
            {percentile}%
          </p>
          <p className="text-[10px] font-medium text-slate-400 text-right leading-tight">
            {isAbove ? 'spend less than you' : 'spend more than you'}
          </p>
        </div>

      </div>
    </div>
  )
}

// ─── AI insights card ─────────────────────────────────────────────────────────

function AiInsightsCard({ insights }: { insights: string[] }) {
  if (insights.length === 0) return null
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="h-[3px] bg-gradient-to-r from-indigo-400 to-violet-400" />
      <div className="px-5 sm:px-6 py-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg leading-none select-none" aria-hidden>🧠</span>
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
            Smart Observations
          </p>
        </div>
        <ul className="flex flex-col gap-3">
          {insights.map((text, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
              {text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// ─── Panel ────────────────────────────────────────────────────────────────────

type Props = { insights: Insights }

export function InsightsPanel({ insights }: Props) {
  const { totalMonthly, totalYearly, topCategory, top3, renewal, trendPercent, savingsHint, aiInsights } =
    insights

  return (
    <section className="mt-8">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-5">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest whitespace-nowrap">
          Smart Insights
        </h2>
        <div className="h-px flex-1 bg-slate-100" />
      </div>

      {/* Hero money card — full width */}
      <MoneyCard
        totalMonthly={totalMonthly}
        totalYearly={totalYearly}
        trendPercent={trendPercent}
        savingsHint={savingsHint}
      />

      {/* Peer comparison — full width, sits between hero and detail cards */}
      <div className="mt-4">
        <CompareCard totalMonthly={totalMonthly} />
      </div>

      {/* Three accent cards below */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        <CategoryCard topCategory={topCategory} totalMonthly={totalMonthly} />
        <TopSubCard top3={top3} />
        <RenewalCard renewal={renewal} />
      </div>

      {/* AI-style observations */}
      <div className="mt-4">
        <AiInsightsCard insights={aiInsights} />
      </div>
    </section>
  )
}
