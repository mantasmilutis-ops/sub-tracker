/**
 * lib/currency.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Currency conversion and formatting helpers.
 * All prices in the database are treated as EUR (base currency).
 * Conversion happens at display time only — nothing is stored in another currency.
 *
 * To add a currency: add it to the Currency union, RATES, SYMBOLS, and OPTIONS.
 */

export type Currency = 'EUR' | 'USD' | 'GBP'

/** Fixed conversion rates relative to EUR. */
export const RATES: Record<Currency, number> = {
  EUR: 1,
  USD: 1.1,
  GBP: 0.85,
}

export const SYMBOLS: Record<Currency, string> = {
  EUR: '€',
  USD: '$',
  GBP: '£',
}

/** Used to populate the currency selector. */
export const CURRENCY_OPTIONS: { value: Currency; label: string }[] = [
  { value: 'EUR', label: '€ EUR' },
  { value: 'USD', label: '$ USD' },
  { value: 'GBP', label: '£ GBP' },
]

/**
 * Convert an amount stored in EUR to the target currency.
 * The input is always EUR — do not pass already-converted values.
 */
export function convertFromEur(amountEur: number, currency: Currency): number {
  return amountEur * RATES[currency]
}

/**
 * Format an EUR-based amount in the target currency.
 * Handles conversion + locale formatting in one call.
 *
 * @example
 *   formatCurrency(9.99, 'USD')  // "$10.99"
 *   formatCurrency(100, 'GBP')   // "£85.00"
 */
export function formatCurrency(amountEur: number, currency: Currency): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(convertFromEur(amountEur, currency))
}
