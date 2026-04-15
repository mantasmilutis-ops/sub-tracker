import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden bg-white">
      {/* Glow backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.12) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block" />
          Track subscriptions · Get reminders · Stay in control
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight tracking-tight mb-6">
          Stop losing money to{' '}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}
          >
            forgotten subscriptions!!! 🚀
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto mb-10">
          Track your subscriptions, see upcoming charges, and get reminded before you're billed — not after.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/register"
            className="btn-primary text-base px-6 py-3 w-full sm:w-auto shadow-lg shadow-indigo-100"
          >
            Start tracking free
          </Link>
          <Link
            href="/login"
            className="btn-secondary text-base px-6 py-3 w-full sm:w-auto"
          >
            Sign in
          </Link>
        </div>

        {/* Trust line */}
        <p className="mt-6 text-xs text-slate-400 font-medium">
          No credit card required &middot; Takes 30 seconds
        </p>

        {/* Benefits line */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-slate-500">
          <span><span className="text-indigo-500 font-semibold">✔</span> See what renews this week</span>
          <span><span className="text-indigo-500 font-semibold">✔</span> Know your real monthly spend</span>
          <span><span className="text-indigo-500 font-semibold">✔</span> Never get surprised by a charge again</span>
        </div>

        {/* Floating stat cards */}
        <div className="mt-16 flex flex-col sm:flex-row items-stretch justify-center gap-4 max-w-2xl mx-auto">
          <StatCard
            label="Monthly spend"
            value="€83.97"
            accent="indigo"
            icon={
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            }
          />
          <StatCard
            label="Yearly total"
            value="€1,007.64"
            accent="violet"
            icon={
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            }
          />
          <StatCard
            label="Subscriptions"
            value="8 active"
            accent="slate"
            icon={
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            }
          />
        </div>
      </div>
    </section>
  )
}

function StatCard({
  label,
  value,
  accent,
  icon,
}: {
  label: string
  value: string
  accent: 'indigo' | 'violet' | 'slate'
  icon: React.ReactNode
}) {
  const iconColors = {
    indigo: 'bg-indigo-50 text-indigo-600',
    violet: 'bg-violet-50 text-violet-600',
    slate: 'bg-slate-100 text-slate-500',
  }

  return (
    <div className="flex-1 card px-5 py-4 flex items-center gap-4 text-left">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconColors[accent]}`}>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          {icon}
        </svg>
      </div>
      <div>
        <p className="text-xs text-slate-400 font-medium mb-0.5">{label}</p>
        <p className="text-lg font-bold text-slate-900">{value}</p>
      </div>
    </div>
  )
}
