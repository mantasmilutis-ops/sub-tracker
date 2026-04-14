/**
 * lib/services/search.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Smart search over the service catalog.
 *
 * Matching strategy (highest score wins):
 *  100 – exact match on canonical name or any alias
 *   90 – canonical name starts with query
 *   80 – any alias starts with query
 *   75 – any word inside the canonical name starts with query  (e.g. "pre" → "YouTube Premium")
 *   65 – any word inside any alias starts with query
 *   60 – canonical name contains query as a substring
 *   50 – any alias contains query as a substring
 *   30 – fuzzy: edit-distance ≤ 2 on name or alias (only for queries ≥ 4 chars)
 *
 * Within the same score tier, `popular` entries rank first.
 */

import { CATALOG, ServiceEntry } from './catalog'

// ─── Index ────────────────────────────────────────────────────────────────────
// Built once at module load for O(1) exact lookups.

const exactIndex = new Map<string, ServiceEntry>()

for (const entry of CATALOG) {
  exactIndex.set(entry.name.toLowerCase(), entry)
  for (const alias of entry.aliases ?? []) {
    exactIndex.set(alias.toLowerCase(), entry)
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Look up a service by exact name or alias (case-insensitive).
 * Returns null when the service is not in the catalog.
 */
export function lookupService(name: string): ServiceEntry | null {
  if (!name.trim()) return null
  return exactIndex.get(name.toLowerCase().trim()) ?? null
}

/**
 * Search the catalog with prefix, substring, and fuzzy matching.
 *
 * When `query` is empty, returns the top `limit` popular services.
 */
export function searchServices(query: string, limit = 8): ServiceEntry[] {
  const q = query.toLowerCase().trim()
  if (!q) return getTopServices(limit)

  const seen = new Set<string>()
  const scored: Array<{ entry: ServiceEntry; score: number }> = []

  for (const entry of CATALOG) {
    const score = scoreEntry(entry, q)
    if (score > 0 && !seen.has(entry.name)) {
      seen.add(entry.name)
      scored.push({ entry, score })
    }
  }

  // Primary sort: score descending. Tie-break: popular entries first.
  scored.sort((a, b) =>
    b.score - a.score ||
    Number(b.entry.popular ?? false) - Number(a.entry.popular ?? false)
  )

  return scored.slice(0, limit).map(s => s.entry)
}

/**
 * Returns the `limit` most popular services (for showing when the field is empty).
 */
export function getTopServices(limit = 8): ServiceEntry[] {
  return CATALOG.filter(e => e.popular).slice(0, limit)
}

// ─── Scoring ──────────────────────────────────────────────────────────────────

function scoreEntry(entry: ServiceEntry, q: string): number {
  const name = entry.name.toLowerCase()
  const aliases = (entry.aliases ?? []).map(a => a.toLowerCase())

  // ── Tier 1: exact match ───────────────────────────────────────────────────
  if (name === q) return 100
  if (aliases.includes(q)) return 100

  // ── Tier 2: prefix on canonical name ─────────────────────────────────────
  if (name.startsWith(q)) return 90

  // ── Tier 3: prefix on alias ───────────────────────────────────────────────
  if (aliases.some(a => a.startsWith(q))) return 80

  // ── Tier 4: any word in canonical name starts with query ──────────────────
  // e.g. "pre" matches "YouTube Premium" via the "premium" word
  if (wordStartsWithQuery(name, q)) return 75

  // ── Tier 5: any word in any alias starts with query ───────────────────────
  if (aliases.some(a => wordStartsWithQuery(a, q))) return 65

  // ── Tier 6: substring in canonical name ───────────────────────────────────
  if (name.includes(q)) return 60

  // ── Tier 7: substring in alias ────────────────────────────────────────────
  if (aliases.some(a => a.includes(q))) return 50

  // ── Tier 8: fuzzy (edit-distance ≤ 2, only for longer queries) ───────────
  if (q.length >= 4) {
    const allTerms = [name, ...aliases]
    for (const term of allTerms) {
      // Only fuzzy-compare against short windows to keep it meaningful
      if (Math.abs(term.length - q.length) > 4) continue
      const dist = levenshtein(q, term.slice(0, q.length + 2))
      if (dist <= 2) return 30 + (2 - dist) * 5  // 30, 35, or 40
    }
  }

  return 0
}

/**
 * Returns true if any whitespace/punctuation-separated word in `text`
 * starts with `query`. Used for "YouTube Premium" matching "pre".
 */
function wordStartsWithQuery(text: string, query: string): boolean {
  const words = text.split(/[\s\-_+.]+/)
  return words.some(w => w.startsWith(query))
}

/**
 * Standard Levenshtein edit distance.
 */
function levenshtein(a: string, b: string): number {
  const m = a.length
  const n = b.length
  // Use a flat array for the DP table to avoid nested allocations.
  const dp = new Uint8Array((m + 1) * (n + 1))

  for (let i = 0; i <= m; i++) dp[i * (n + 1)] = i
  for (let j = 0; j <= n; j++) dp[j] = j

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i * (n + 1) + j] =
        a[i - 1] === b[j - 1]
          ? dp[(i - 1) * (n + 1) + (j - 1)]
          : 1 + Math.min(
              dp[(i - 1) * (n + 1) + j],       // delete
              dp[i * (n + 1) + (j - 1)],        // insert
              dp[(i - 1) * (n + 1) + (j - 1)],  // replace
            )
    }
  }

  return dp[m * (n + 1) + n]
}
