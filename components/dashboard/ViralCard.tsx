'use client'

import { useState, useEffect, useRef } from 'react'
import { ShareCard } from './ShareCard'
import { ShareModal } from './ShareModal'
import { useCurrency } from '@/components/CurrencyContext'
import { formatCurrency } from '@/lib/currency'

type Props = {
  totalMonthly: number
  totalYearly: number
}

function getReaction(monthly: number): string {
  if (monthly < 50) return 'Not bad 😎'
  if (monthly < 200) return 'Getting there 👀'
  if (monthly < 500) return "That's a lot 😬"
  return 'Bro… 💀'
}

export function ViralCard({ totalMonthly, totalYearly }: Props) {
  const [visible, setVisible] = useState(false)
  const { currency } = useCurrency()
  const fmt = (n: number) => formatCurrency(n, currency)
  // 'idle' | 'generating' | 'open'
  const [shareState, setShareState] = useState<'idle' | 'generating' | 'open'>('idle')
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null)
  const shareCardRef = useRef<HTMLDivElement>(null)

  // Slight delay so the scale-in animation plays on mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  async function handleOpenShare() {
    if (!shareCardRef.current || shareState !== 'idle') return

    setShareState('generating')

    try {
      const { toPng } = await import('html-to-image')
      const dataUrl = await toPng(shareCardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      })
      setImageDataUrl(dataUrl)
      setShareState('open')
    } catch {
      setShareState('idle')
    }
  }

  function handleCloseModal() {
    setShareState('idle')
  }

  const reaction = getReaction(totalMonthly)

  return (
    <>
      {/* ── Off-screen ShareCard captured by html-to-image ── */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          left: -9999,
          top: -9999,
          pointerEvents: 'none',
          zIndex: -1,
        }}
      >
        <ShareCard
          ref={shareCardRef}
          totalMonthly={totalMonthly}
          totalYearly={totalYearly}
          currency={currency}
        />
      </div>

      {/* ── Visible ViralCard ── */}
      <div className="relative rounded-2xl overflow-hidden mb-6 shadow-lg">
        {/* Background gradient */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 55%, #2d2a7a 100%)' }}
        />
        {/* Top glow line */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(129,140,248,0.5), transparent)' }}
        />

        {/* Content */}
        <div
          className="relative px-6 py-8 sm:py-10 text-center transition-all duration-500"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'scale(1)' : 'scale(0.96)',
          }}
        >
          <p className="text-indigo-300 text-xs font-semibold uppercase tracking-widest mb-4">
            Your subscription spend
          </p>

          <p className="text-5xl sm:text-6xl font-black text-white leading-none mb-1">
            {fmt(totalMonthly)}
            <span className="text-xl sm:text-2xl font-semibold text-slate-400 ml-1">/mo</span>
          </p>

          <p className="text-slate-400 text-sm sm:text-base mt-3">
            That&apos;s{' '}
            <span className="text-slate-200 font-semibold">{fmt(totalYearly)}</span>
            {' '}per year
          </p>

          <div className="inline-flex items-center mt-4 mb-7 bg-white/10 border border-white/10 rounded-full px-4 py-1.5">
            <span className="text-white text-sm font-semibold">{reaction}</span>
          </div>

          {/* Share button */}
          <div>
            <button
              onClick={handleOpenShare}
              disabled={shareState === 'generating'}
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 disabled:opacity-60 text-slate-900 font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors shadow-md"
            >
              {shareState === 'generating' ? (
                <>
                  <svg className="w-4 h-4 text-slate-400 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                  </svg>
                  Generating…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                  </svg>
                  Share this 😅
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Share modal ── */}
      {shareState === 'open' && imageDataUrl && (
        <ShareModal
          dataUrl={imageDataUrl}
          totalMonthly={totalMonthly}
          currency={currency}
          onClose={handleCloseModal}
        />
      )}
    </>
  )
}
