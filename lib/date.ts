/**
 * lib/date.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Date helpers that treat billing dates as LOCAL dates.
 *
 * The DB stores nextBilling as UTC midnight ("2026-05-15T00:00:00.000Z").
 * Passing that string to `new Date(iso)` produces a UTC instant, which in
 * UTC+ timezones is still "today" but in UTC- timezones becomes "yesterday".
 * `parseBillingDate` avoids the shift by extracting the YYYY-MM-DD digits and
 * constructing a local-midnight Date directly with new Date(y, m-1, d).
 */

/**
 * Parse a billing-date ISO string as a LOCAL date (no UTC shift).
 *   "2026-05-15T00:00:00.000Z"  →  new Date(2026, 4, 15)  local midnight
 *   "2026-05-15"                →  new Date(2026, 4, 15)  local midnight
 */
export function parseBillingDate(iso: string): Date {
  const [year, month, day] = iso.slice(0, 10).split('-').map(Number)
  return new Date(year, month - 1, day)
}

/**
 * How many whole days from today (local midnight) until the billing date.
 * Negative means overdue.
 */
export function getDaysUntil(iso: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = parseBillingDate(iso)
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

/**
 * Format a billing-date ISO string for display (e.g. "May 15, 2026").
 * Uses parseBillingDate to avoid the UTC-shift on display.
 */
export function formatBillingDate(iso: string): string {
  return parseBillingDate(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}
