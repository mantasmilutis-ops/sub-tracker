/**
 * lib/services.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Public API for subscription service metadata.
 *
 * All data lives in lib/services/catalog.ts.
 * All search logic lives in lib/services/search.ts.
 *
 * This file re-exports a stable surface so existing imports keep working:
 *   import { getServiceCategory, getServicePrice, ... } from '@/lib/services'
 */

export type { Category, ServiceEntry } from './services/catalog'
export { CATALOG } from './services/catalog'
export { lookupService, searchServices, getTopServices } from './services/search'

// ─── Convenience helpers (used by ServiceLogo and AddSubscriptionForm) ────────

import { lookupService } from './services/search'

/**
 * Domain for logo fetching.
 * Falls back to a best-guess slug for unknown services.
 */
export function getServiceDomain(name: string): string {
  const info = lookupService(name)
  if (info) return info.domain
  const slug = name.toLowerCase().trim().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')
  return slug ? `${slug}.com` : ''
}

/** Auto-detected category, or null if the service is not in the catalog. */
export function getServiceCategory(name: string): import('./services/catalog').Category | null {
  return lookupService(name)?.category ?? null
}

/**
 * Suggested monthly price in USD, or null if unknown.
 * The form multiplies by 12 for yearly billing.
 */
export function getServicePrice(name: string): number | null {
  return lookupService(name)?.price ?? null
}

/**
 * Legacy flat list used by older code paths.
 * Prefer `searchServices()` or `getTopServices()` for new code.
 */
export const POPULAR_SERVICES: string[] = [
  'Netflix', 'Hulu', 'Disney+', 'Max', 'Prime Video', 'Apple TV+',
  'Spotify', 'Apple Music', 'YouTube Premium',
  'Xbox Game Pass', 'PlayStation Plus', 'Nintendo Switch Online',
  'Google One', 'iCloud+', 'Dropbox',
  'Notion', 'Slack', 'Zoom', 'Monday.com',
  'GitHub Pro', 'GitHub Copilot', 'Vercel', 'Cursor',
  'Figma', 'Canva Pro', 'Adobe Creative Cloud',
  'Microsoft 365', 'Google Workspace',
  '1Password', 'NordVPN', 'Grammarly',
  'ChatGPT Plus', 'Claude Pro', 'Midjourney',
  'Shopify', 'HubSpot', 'Zapier', 'Mailchimp',
  'Duolingo Plus', 'Coursera Plus',
  'Headspace', 'Calm',
  'Discord Nitro', 'New York Times',
]
