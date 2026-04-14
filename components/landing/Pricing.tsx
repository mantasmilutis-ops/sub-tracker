import Link from 'next/link'
import { WaitlistButton } from './WaitlistModal'

const freeFeatures = [
  'Unlimited subscriptions',
  'Monthly & yearly totals',
  'Email reminders',
  'Weekly summaries',
  'Clean dashboard',
]

const proFeatures = [
  'Everything in Free',
  'Unlimited reminders across all devices',
  'Priority alerts — get notified first',
  'Spending insights & analytics',
]

function Check({ muted = false }: { muted?: boolean }) {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  )
}

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Simple, free, and powerful
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Start free. More coming soon.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">

          {/* Free */}
          <div className="card p-8 flex flex-col">
            <div className="mb-6">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Free</p>
              <div className="flex items-end gap-1 mb-2">
                <span className="text-4xl font-bold text-slate-900">$0</span>
                <span className="text-slate-400 text-sm mb-1.5">/ month</span>
              </div>
              <p className="text-sm text-slate-500">No credit card required.</p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {freeFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-slate-600">
                  <span className="text-indigo-500"><Check /></span>
                  {f}
                </li>
              ))}
            </ul>

            <Link href="/register" className="btn-primary text-sm text-center py-3 shadow-md shadow-indigo-200">
              Get started free
            </Link>
          </div>

          {/* Pro */}
          <div className="relative rounded-2xl p-8 flex flex-col border border-slate-200 bg-white">
            {/* Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="bg-slate-800 text-white text-xs font-semibold px-3 py-1 rounded-full tracking-wide">
                Coming soon
              </span>
            </div>

            <div className="mb-6">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Pro</p>
              <div className="flex items-end gap-1 mb-2">
                <span className="text-4xl font-bold text-slate-900">$3</span>
                <span className="text-slate-400 text-sm mb-1.5">/ month</span>
              </div>
              <p className="text-sm text-slate-500">Never miss a payment. Know exactly where your money goes.</p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {proFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-slate-600">
                  <span className="text-indigo-500"><Check /></span>
                  {f}
                </li>
              ))}
            </ul>

            <WaitlistButton />
          </div>

        </div>
      </div>
    </section>
  )
}
