/**
 * components/dashboard/ShareCard.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Off-screen card captured as a PNG by html-to-image.
 * Uses 100% inline styles — Tailwind classes are unreliable when html-to-image
 * clones the element into an isolated SVG/canvas context.
 *
 * Fixed at 480 × 640 px (portrait, Instagram-story-ish).
 */

import { forwardRef } from 'react'
import { type Currency, formatCurrency } from '@/lib/currency'

function getReaction(monthly: number): string {
  if (monthly < 50)  return 'Not bad 😎'
  if (monthly < 200) return 'Getting there 👀'
  if (monthly < 500) return "That's a lot 😬"
  return 'Bro… 💀'
}

// ─── Component ────────────────────────────────────────────────────────────────

type Props = { totalMonthly: number; totalYearly: number; currency: Currency }

export const ShareCard = forwardRef<HTMLDivElement, Props>(function ShareCard(
  { totalMonthly, totalYearly, currency },
  ref,
) {
  const fmt = (n: number) => formatCurrency(n, currency)
  const reaction = getReaction(totalMonthly)

  return (
    <div
      ref={ref}
      style={{
        width: 480,
        height: 640,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        background: 'linear-gradient(145deg, #0f0c29 0%, #1e1b4b 30%, #302b63 60%, #24243e 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 40px',
        boxSizing: 'border-box',
      }}
    >
      {/* ── Decorative orbs ── */}
      <div style={{
        position: 'absolute', top: -80, right: -80,
        width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -60, left: -60,
        width: 240, height: 240, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '45%', left: -40,
        width: 160, height: 160, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(79,70,229,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* ── Top glow line ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(129,140,248,0.6), transparent)',
      }} />

      {/* ── SubTracker wordmark ── */}
      <div style={{
        position: 'absolute', top: 36, left: 0, right: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      }}>
        {/* Icon circle */}
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
          </svg>
        </div>
        <span style={{
          fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em',
          color: 'white',
        }}>
          SubTracker
        </span>
      </div>

      {/* ── Centre content ── */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', gap: 0, zIndex: 1,
      }}>
        {/* Eyebrow label */}
        <p style={{
          fontSize: 11, fontWeight: 700, letterSpacing: '0.14em',
          textTransform: 'uppercase', color: 'rgba(165,180,252,0.8)',
          marginBottom: 20,
        }}>
          My Subscription Spend
        </p>

        {/* Reaction */}
        <div style={{
          display: 'inline-flex', alignItems: 'center',
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 99, padding: '8px 20px',
          marginBottom: 24,
        }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: 'white' }}>
            {reaction}
          </span>
        </div>

        {/* Big monthly number */}
        <p style={{
          fontSize: 72, fontWeight: 900, lineHeight: 1,
          letterSpacing: '-0.04em', color: 'white',
          marginBottom: 6,
        }}>
          {fmt(totalMonthly)}
        </p>
        <p style={{
          fontSize: 18, fontWeight: 500,
          color: 'rgba(148,163,184,0.9)',
          marginBottom: 32,
        }}>
          per month
        </p>

        {/* Divider */}
        <div style={{
          width: 48, height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(129,140,248,0.5), transparent)',
          marginBottom: 24,
        }} />

        {/* Yearly */}
        <p style={{
          fontSize: 13, fontWeight: 600, letterSpacing: '0.06em',
          textTransform: 'uppercase', color: 'rgba(148,163,184,0.7)',
          marginBottom: 8,
        }}>
          That&apos;s
        </p>
        <p style={{
          fontSize: 36, fontWeight: 800, lineHeight: 1,
          letterSpacing: '-0.02em', color: 'rgba(199,210,254,0.95)',
        }}>
          {fmt(totalYearly)}
        </p>
        <p style={{
          fontSize: 13, fontWeight: 500,
          color: 'rgba(148,163,184,0.6)',
          marginTop: 6,
        }}>
          every year
        </p>
      </div>

      {/* ── Bottom branding ── */}
      <div style={{
        position: 'absolute', bottom: 32, left: 0, right: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
      }}>
        <p style={{
          fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
          color: 'rgba(99,102,241,0.7)',
          textTransform: 'uppercase',
        }}>
          Track yours at
        </p>
        <p style={{
          fontSize: 13, fontWeight: 700,
          color: 'rgba(165,180,252,0.6)',
          letterSpacing: '0.02em',
        }}>
          subtracker.to
        </p>
      </div>
    </div>
  )
})
