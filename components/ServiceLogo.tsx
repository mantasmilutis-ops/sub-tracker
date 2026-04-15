'use client'

import { useState, useEffect } from 'react'
import { getServiceDomain, lookupService } from '@/lib/services'

// ─── Direct-URL logo with error fallback ─────────────────────────────────────
// Used when the service catalog provides an explicit logoUrl.
// Owns its own errored state so a broken image never shows.
function DirectLogo({
  src,
  name,
  size,
  className,
  fallbackClassName,
}: {
  src: string
  name: string
  size: number
  className: string
  fallbackClassName: string
}) {
  const [errored, setErrored] = useState(false)
  const initial = name.charAt(0).toUpperCase() || '?'
  const imgSize = Math.round(size * 0.72)

  if (errored) {
    return (
      <div
        className={`flex items-center justify-center rounded-xl text-sm font-bold flex-shrink-0 bg-slate-100 text-slate-500 ${fallbackClassName} ${className}`}
        style={{ width: size, height: size }}
      >
        {initial}
      </div>
    )
  }

  return (
    <div
      className={`flex items-center justify-center rounded-xl overflow-hidden bg-white border border-slate-100 flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={`${name} logo`}
        width={imgSize}
        height={imgSize}
        onError={() => setErrored(true)}
        className="object-contain"
        style={{ width: imgSize, height: imgSize }}
      />
    </div>
  )
}

type Tier = 'clearbit' | 'google' | 'letter'

// ─── Logo tier cache (localStorage) ──────────────────────────────────────────
// Persists which source tier worked for each domain so that on page refresh the
// component skips known-failing tiers instead of always retrying Clearbit cold.
// Key: domain string  Value: Tier
const LS_KEY = 'sbt_logo_tiers'

function readTierCache(domain: string): Tier | null {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return null
    const map: Record<string, Tier> = JSON.parse(raw)
    return map[domain] ?? null
  } catch {
    return null
  }
}

function writeTierCache(domain: string, tier: Tier) {
  try {
    const raw = localStorage.getItem(LS_KEY)
    const map: Record<string, Tier> = raw ? JSON.parse(raw) : {}
    map[domain] = tier
    localStorage.setItem(LS_KEY, JSON.stringify(map))
  } catch {}
}
// ─────────────────────────────────────────────────────────────────────────────

type Props = {
  name: string
  size?: number
  className?: string
  /** Extra Tailwind classes applied to the letter-avatar fallback only */
  fallbackClassName?: string
}

export function ServiceLogo({ name, size = 40, className = '', fallbackClassName = '' }: Props) {
  const normalizedName = name.trim()
  const catalogEntry = lookupService(normalizedName)

  // ── Direct logoUrl override — skip the remote tier system entirely ───────────
  if (catalogEntry?.logoUrl === '__app__') {
    // Render the app's own branded icon inline (no network request, always correct)
    const iconSize = Math.round(size * 0.55)
    return (
      <div
        className={`flex items-center justify-center rounded-xl bg-indigo-600 flex-shrink-0 ${className}`}
        style={{ width: size, height: size }}
      >
        <svg width={iconSize} height={iconSize} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
        </svg>
      </div>
    )
  }

  if (catalogEntry?.logoUrl && catalogEntry.logoUrl !== '__app__') {
    // Direct image URL — delegate to DirectLogo which owns error state
    return (
      <DirectLogo
        src={catalogEntry.logoUrl}
        name={normalizedName}
        size={size}
        className={className}
        fallbackClassName={fallbackClassName}
      />
    )
  }

  const domain = getServiceDomain(normalizedName)
  const initial = normalizedName.charAt(0).toUpperCase() || '?'
  const imgSize = Math.round(size * 0.72)

  // Start at clearbit (or letter if no domain). We update from the cache in a
  // useEffect below to avoid SSR/hydration mismatches with localStorage.
  const [tier, setTier] = useState<Tier>(() => (domain ? 'clearbit' : 'letter'))
  const [activeDomain, setActiveDomain] = useState(domain)

  // Derived-state reset: when the service name changes (parent reuses the
  // component for a different subscription), restart the tier from scratch.
  if (domain !== activeDomain) {
    setActiveDomain(domain)
    setTier(domain ? 'clearbit' : 'letter')
  }

  // After mount (and whenever domain changes), read the persisted tier from
  // localStorage and fast-forward to it — this is what makes the logo resolve
  // consistently after a page refresh instead of retrying Clearbit cold.
  useEffect(() => {
    if (!domain) return

    const cached = readTierCache(domain)

    if (process.env.NODE_ENV === 'development') {
      console.log(
        `[ServiceLogo] mount — name="${normalizedName}" domain="${domain}" ` +
        `initialTier="clearbit" cachedTier=${cached ?? 'none'}`
      )
    }

    if (cached != null) {
      setTier(cached)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domain])

  // ── Fallback chain ──────────────────────────────────────────────────────────
  // clearbit → google favicon → letter avatar

  function advance(fromTier: Tier) {
    const next: Tier = fromTier === 'clearbit' ? 'google' : 'letter'

    if (next === 'letter') {
      // Both remote sources failed — cache so we skip them next time
      writeTierCache(domain, 'letter')
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(
        `[ServiceLogo] advance — name="${normalizedName}" domain="${domain}" ` +
        `"${fromTier}" → "${next}"`
      )
    }

    setTier(next)
  }

  function handleError() {
    advance(tier)
  }

  function handleLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { naturalWidth, naturalHeight } = e.currentTarget

    // Clearbit returns HTTP 200 with a 1×1 transparent PNG when it has no logo.
    // onError never fires in this case, so we must detect it on load.
    if (naturalWidth <= 1 || naturalHeight <= 1) {
      if (process.env.NODE_ENV === 'development') {
        console.log(
          `[ServiceLogo] 1×1 placeholder — name="${normalizedName}" domain="${domain}" ` +
          `tier="${tier}", advancing`
        )
      }
      advance(tier)
      return
    }

    // This tier worked — persist it so the next page load starts here directly
    writeTierCache(domain, tier)

    if (process.env.NODE_ENV === 'development') {
      console.log(
        `[ServiceLogo] success — name="${normalizedName}" domain="${domain}" ` +
        `tier="${tier}" cached ✓`
      )
    }
  }

  // ── Letter avatar (terminal fallback) ───────────────────────────────────────
  if (tier === 'letter') {
    return (
      <div
        className={`flex items-center justify-center rounded-xl text-sm font-bold flex-shrink-0 bg-slate-100 text-slate-500 ${fallbackClassName} ${className}`}
        style={{ width: size, height: size }}
      >
        {initial}
      </div>
    )
  }

  // ── Remote logo ─────────────────────────────────────────────────────────────
  const logoUrl =
    tier === 'clearbit'
      ? `https://logo.clearbit.com/${domain}`
      : `https://www.google.com/s2/favicons?domain=${domain}&sz=128`

  if (process.env.NODE_ENV === 'development') {
    console.log(
      `[ServiceLogo] render — name="${normalizedName}" domain="${domain}" ` +
      `tier="${tier}" url="${logoUrl}"`
    )
  }

  return (
    <div
      className={`relative flex items-center justify-center rounded-xl overflow-hidden bg-white border border-slate-100 flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {/*
        Silent letter fallback rendered behind the img at z-index 0.
        If the img never renders (broken, slow, blocked) the letter shows
        through instead of a broken-image icon — works even if onError
        doesn't fire (a known quirk in some mobile Chrome builds).
      */}
      <div
        className="absolute inset-0 flex items-center justify-center text-sm font-bold bg-slate-100 text-slate-500"
        aria-hidden="true"
      >
        {initial}
      </div>
      {/*
        key={logoUrl}: forces React to unmount and remount a fresh <img> DOM
        node when the URL changes (clearbit → google). Without this, some
        browsers cache the failed-state of the node and immediately fire
        onError on the new src without making a real network request.
      */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={logoUrl}
        src={logoUrl}
        alt={`${normalizedName} logo`}
        width={imgSize}
        height={imgSize}
        onLoad={handleLoad}
        onError={handleError}
        className="object-contain relative"
        style={{ width: imgSize, height: imgSize, zIndex: 1 }}
      />
    </div>
  )
}
