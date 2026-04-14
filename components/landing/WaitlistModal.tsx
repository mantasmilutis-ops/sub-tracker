'use client'

import { useState } from 'react'
import { trackEvent } from '@/lib/analytics'

export function WaitlistButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => { trackEvent('waitlist_click'); setOpen(true) }}
        className="w-full text-sm text-center py-3 rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors font-medium"
      >
        Join waitlist
      </button>

      {open && <WaitlistModal onClose={() => setOpen(false)} />}
    </>
  )
}

function WaitlistModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Something went wrong. Please try again.')
      return
    }

    trackEvent('waitlist_submit')
    setSuccess(data.message)
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Join the Pro waitlist</h2>
            <p className="text-sm text-slate-500 mt-0.5">Be the first to know when Pro launches.</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {success ? (
            /* Success state */
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <p className="text-slate-900 font-semibold text-base mb-1">{success}</p>
              <p className="text-slate-500 text-sm">We'll email you when Pro is ready.</p>
              <button
                onClick={onClose}
                className="mt-6 btn-primary w-full text-sm py-2.5"
              >
                Done
              </button>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
                  {error}
                </div>
              )}

              <div>
                <label className="label" htmlFor="waitlist-email">Email address</label>
                <input
                  id="waitlist-email"
                  type="email"
                  className="input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full text-sm py-2.5"
              >
                {loading ? 'Joining…' : 'Join waitlist'}
              </button>

              <p className="text-xs text-slate-400 text-center">
                No spam. Just one email when Pro launches.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
