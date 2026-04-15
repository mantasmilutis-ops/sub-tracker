'use client'

import { useState, useRef } from 'react'
import { Subscription } from './DashboardClient'
import { ServiceLogo } from './ServiceLogo'
import { searchServices, getTopServices, getServicePrice } from '@/lib/services'
import type { ServiceEntry } from '@/lib/services'
import { useCurrency } from './CurrencyContext'
import { SYMBOLS, RATES, formatCurrency } from '@/lib/currency'

const CATEGORIES = [
  'Entertainment',
  'Software',
  'Tools',
  'Gaming',
  'Music',
  'News',
  'Health',
  'Education',
  'Other',
]

function defaultNextBilling() {
  const d = new Date()
  d.setMonth(d.getMonth() + 1)
  return d.toISOString().split('T')[0]
}

type Props = {
  onAdded: (sub: Subscription) => void
  onCancel: () => void
}

export function AddSubscriptionForm({ onAdded, onCancel }: Props) {
  const { currency } = useCurrency()
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [billingCycle, setBillingCycle] = useState('monthly')
  const [category, setCategory] = useState('')
  const [nextBilling, setNextBilling] = useState(defaultNextBilling())
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Track whether category / price were auto-filled (vs. manually entered).
  // When true, typing a new service name is allowed to overwrite the value.
  const [categoryAutoDetected, setCategoryAutoDetected] = useState(false)
  const [priceAutoFilled, setPriceAutoFilled] = useState(false)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)

  // Autocomplete state
  const [showSuggestions, setShowSuggestions] = useState(false)
  const nameInputRef = useRef<HTMLInputElement>(null)

  // Live suggestions — top popular services when empty, search results otherwise
  const suggestions: ServiceEntry[] =
    showSuggestions
      ? name.trim().length === 0
        ? getTopServices(8)
        : searchServices(name.trim(), 8)
      : []

  const isShowingTopSuggestions = showSuggestions && name.trim().length === 0

  // ── Helpers ─────────────────────────────────────────────────────────────────

  function applyPriceSuggestion(entry: ServiceEntry | null, cycle: string): string | null {
    if (!entry?.price) return null
    const val = cycle === 'yearly' ? entry.price * 12 : entry.price
    // entry.price is EUR-based; convert to selected currency for the input
    return (val * RATES[currency]).toFixed(2)
  }

  // ── Handlers ────────────────────────────────────────────────────────────────

  function handleNameChange(value: string) {
    setName(value)
    setShowSuggestions(true)

    // Try exact lookup first for instant fill; searchServices handles the rest
    const [match] = searchServices(value, 1)
    const isExact = match?.name.toLowerCase() === value.toLowerCase() ||
                    (match?.aliases ?? []).includes(value.toLowerCase())

    if (isExact && match) {
      // Category
      if (!category || categoryAutoDetected) {
        setCategory(match.category)
        setCategoryAutoDetected(true)
      }
      // Price
      const suggested = applyPriceSuggestion(match, billingCycle)
      if (suggested && (!price || priceAutoFilled)) {
        setPrice(suggested)
        setPriceAutoFilled(true)
      }
      // Logo — set once; don't overwrite if already set by selectSuggestion
      if (!logoUrl) {
        setLogoUrl(`https://www.google.com/s2/favicons?domain=${match.domain}&sz=128`)
      }
    } else if (!value.trim()) {
      // Field cleared — reset auto-fills
      if (categoryAutoDetected) { setCategory(''); setCategoryAutoDetected(false) }
      if (priceAutoFilled) { setPrice(''); setPriceAutoFilled(false) }
      setLogoUrl(null)
    } else {
      // Non-empty but no exact match — user is typing a custom name
      setLogoUrl(null)
    }
  }

  function handleManualCategoryChange(value: string) {
    setCategory(value)
    setCategoryAutoDetected(false)
  }

  function handlePriceChange(value: string) {
    setPrice(value)
    setPriceAutoFilled(false)
  }

  function handleBillingCycleChange(cycle: string) {
    setBillingCycle(cycle)
    if (priceAutoFilled && price) {
      const current = parseFloat(price)
      if (!isNaN(current)) {
        if (cycle === 'yearly' && billingCycle === 'monthly') {
          setPrice((current * 12).toFixed(2))
        } else if (cycle === 'monthly' && billingCycle === 'yearly') {
          setPrice((current / 12).toFixed(2))
        }
      }
    }
  }

  function selectSuggestion(entry: ServiceEntry) {
    setName(entry.name)
    setShowSuggestions(false)

    // Fill category
    setCategory(entry.category)
    setCategoryAutoDetected(true)

    // Fill price
    const suggested = applyPriceSuggestion(entry, billingCycle)
    if (suggested) {
      setPrice(suggested)
      setPriceAutoFilled(true)
    }

    // Logo — always use the catalog domain, overwrite any prior value
    setLogoUrl(`https://www.google.com/s2/favicons?domain=${entry.domain}&sz=128`)

    nameInputRef.current?.focus()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!name.trim()) { setError('Please enter a name'); return }
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      setError('Please enter a valid price'); return
    }
    if (!nextBilling) { setError('Please select a next billing date'); return }

    setLoading(true)

    const res = await fetch('/api/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.trim(),
        // Convert from selected currency back to EUR (DB base currency)
        price: parseFloat(price) / RATES[currency],
        displayPrice: parseFloat(price),
        currency,
        billingCycle,
        category: category || null,
        nextBilling,
        logoUrl: logoUrl ?? null,
      }),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Failed to add subscription')
      return
    }

    const newSub = await res.json()
    onAdded(newSub)
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {/* ── Service name: logo preview + input + autocomplete ── */}
      <div>
        <label className="label" htmlFor="sub-name">Service name</label>
        <div className="flex items-center gap-2">
          {/* Live logo preview — fades in once name has content */}
          <div
            className={`flex-shrink-0 transition-opacity duration-150 ${name.trim() ? 'opacity-100' : 'opacity-0'}`}
          >
            <ServiceLogo name={name.trim() || 'X'} size={36} />
          </div>

          <div className="relative flex-1">
            <input
              id="sub-name"
              ref={nameInputRef}
              type="text"
              className="input"
              placeholder="Netflix, Spotify, GitHub…"
              value={name}
              onChange={e => handleNameChange(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              required
              autoFocus
              autoComplete="off"
            />

            {/* Autocomplete dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute z-20 left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                {isShowingTopSuggestions && (
                  <li className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wide bg-slate-50 border-b border-slate-100">
                    Popular services
                  </li>
                )}
                {suggestions.map(entry => (
                  <li key={entry.name}>
                    <button
                      type="button"
                      onMouseDown={() => selectSuggestion(entry)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 text-left transition-colors"
                    >
                      <ServiceLogo name={entry.name} size={24} />
                      <span className="text-sm text-slate-700 flex-1 truncate">{entry.name}</span>
                      <span className="text-xs text-slate-400 capitalize hidden sm:inline">{entry.category}</span>
                      {entry.price != null && (
                        <span className="text-xs text-indigo-400 font-medium flex-shrink-0">
                          {formatCurrency(entry.price, currency)}/mo
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* ── Price + billing cycle ── */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label" htmlFor="sub-price">
            Price
            {priceAutoFilled && price ? (
              <span className="ml-1.5 text-xs font-normal text-indigo-500">suggested price</span>
            ) : null}
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">{SYMBOLS[currency]}</span>
            <input
              id="sub-price"
              type="number"
              className="input pl-7"
              placeholder="9.99"
              value={price}
              onChange={e => handlePriceChange(e.target.value)}
              min="0.01"
              step="0.01"
              required
            />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="sub-cycle">Billing cycle</label>
          <select
            id="sub-cycle"
            className="input"
            value={billingCycle}
            onChange={e => handleBillingCycleChange(e.target.value)}
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

      {/* ── Category + next billing ── */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label" htmlFor="sub-category">
            Category
            {categoryAutoDetected && category ? (
              <span className="ml-1.5 text-xs font-normal text-indigo-500">auto-detected</span>
            ) : (
              <span className="text-slate-400 font-normal"> (optional)</span>
            )}
          </label>
          <select
            id="sub-category"
            className="input"
            value={category}
            onChange={e => handleManualCategoryChange(e.target.value)}
          >
            <option value="">— None —</option>
            {CATEGORIES.map(c => (
              <option key={c} value={c.toLowerCase()}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="sub-next">Next billing date</label>
          <input
            id="sub-next"
            type="date"
            className="input"
            value={nextBilling}
            onChange={e => setNextBilling(e.target.value)}
            required
          />
        </div>
      </div>

      {/* ── Yearly hint ── */}
      {billingCycle === 'yearly' && price && !isNaN(parseFloat(price)) && (
        <p className="text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2">
          Monthly equivalent:{' '}
          <strong className="text-slate-700">
            {SYMBOLS[currency]}{(parseFloat(price) / 12).toFixed(2)}/mo
          </strong>
        </p>
      )}

      {/* ── Actions ── */}
      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onCancel} className="btn-secondary flex-1">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="btn-primary flex-1">
          {loading ? 'Adding…' : 'Add subscription'}
        </button>
      </div>
    </form>
  )
}
