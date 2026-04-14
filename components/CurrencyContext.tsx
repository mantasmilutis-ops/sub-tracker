'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { type Currency, CURRENCY_OPTIONS } from '@/lib/currency'

const LS_KEY = 'sbt_currency'
const VALID: Currency[] = ['EUR', 'USD', 'GBP']

type CurrencyContextValue = {
  currency: Currency
  setCurrency: (c: Currency) => void
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: 'EUR',
  setCurrency: () => {},
})

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('EUR')

  // Read persisted preference after mount (avoids SSR mismatch)
  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY) as Currency | null
    if (saved && VALID.includes(saved)) setCurrencyState(saved)
  }, [])

  function setCurrency(c: Currency) {
    setCurrencyState(c)
    localStorage.setItem(LS_KEY, c)
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  return useContext(CurrencyContext)
}

/** Drop-in selector — place anywhere inside CurrencyProvider. */
export function CurrencySelector() {
  const { currency, setCurrency } = useCurrency()
  return (
    <select
      value={currency}
      onChange={e => setCurrency(e.target.value as Currency)}
      className="text-sm text-slate-600 bg-white border border-slate-200 rounded-lg px-2 py-1.5 cursor-pointer hover:border-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
      aria-label="Currency"
    >
      {CURRENCY_OPTIONS.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}
