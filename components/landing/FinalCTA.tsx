import Link from 'next/link'

export default function FinalCTA() {
  return (
    <>
      {/* CTA section */}
      <section className="py-28 bg-slate-950 relative overflow-hidden">
        {/* Glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(99,102,241,0.18) 0%, transparent 70%)',
          }}
        />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Stop losing money to{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)' }}
            >
              forgotten subscriptions
            </span>
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
            Add your subscriptions in under a minute and finally see the full picture of what you're paying each month.
          </p>
          <Link
            href="/register"
            className="btn-primary text-base px-8 py-3.5 shadow-xl shadow-indigo-900/40 block sm:inline-block w-full sm:w-auto text-center"
          >
            Start tracking free
          </Link>
          <p className="mt-5 text-xs text-slate-600 font-medium">
            No credit card &middot; Takes 30 seconds
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-slate-400">SubTracker</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Log in</Link>
            <Link href="/register" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Sign up</Link>
            <a href="#features" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Features</a>
            <a href="#pricing" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Pricing</a>
          </div>
          <p className="text-xs text-slate-600">&copy; {new Date().getFullYear()} SubTracker</p>
        </div>
      </footer>
    </>
  )
}
