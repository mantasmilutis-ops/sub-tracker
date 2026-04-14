'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { type Currency, formatCurrency } from '@/lib/currency'

function detectShareCapability(): 'file' | 'basic' | 'none' {
  if (typeof navigator === 'undefined' || !('share' in navigator)) return 'none'
  try {
    if (
      navigator.canShare &&
      navigator.canShare({ files: [new File([''], 'test.png', { type: 'image/png' })] })
    ) return 'file'
  } catch { /* basic only */ }
  return 'basic'
}

// ─── Tier-based copy ──────────────────────────────────────────────────────────
// Each tier has a distinct emotional tone.
// shareText → what gets shared / copied to clipboard
// cta       → shown below the card preview inside the modal
// heading   → modal title

type ShareVariant = { shareText: string; cta: string; heading: string }

function getVariant(monthly: number, fmt: (n: number) => string): ShareVariant {
  if (monthly < 50) return {
    shareText:
      `I only spend ${fmt(monthly)}/month on subscriptions.\n` +
      `Somehow I actually have my life together 😌\n` +
      `How much are YOU spending? → track with SubTracker`,
    cta: 'Go on — make your friends feel bad about themselves 🙌',
    heading: 'Show off your discipline',
  }
  if (monthly < 200) return {
    shareText:
      `I just found out I spend ${fmt(monthly)}/month on subscriptions 👀\n` +
      `Totally reasonable. Definitely. Right?\n` +
      `Check yours → SubTracker`,
    cta: 'Make people question their own spending 👀',
    heading: 'Are you the most normal one?',
  }
  if (monthly < 500) return {
    shareText:
      `Didn't realise I was spending ${fmt(monthly)}/month on subscriptions until now 😬\n` +
      `Honestly I didn't want to know. Neither will you → SubTracker`,
    cta: "Go on. Show them what you've discovered 😬",
    heading: 'Share your... findings',
  }
  return {
    shareText:
      `I spend ${fmt(monthly)}/month on subscriptions.\n` +
      `Someone take my card away 💀\n` +
      `See what you're actually spending → SubTracker`,
    cta: 'Might as well own it at this point 💀',
    heading: 'Send help. And share this.',
  }
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function IcShare() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
    </svg>
  )
}

function IcDownload() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
  )
}

function IcCopy() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
    </svg>
  )
}

function IcCheck() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  )
}

function IcClose() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

// ─── Action row ───────────────────────────────────────────────────────────────

type ActionRowProps = {
  icon: React.ReactNode
  iconBg: string
  iconColor: string
  label: string
  description: string
  onClick: () => void
  success?: boolean
}

function ActionRow({ icon, iconBg, iconColor, label, description, onClick, success }: ActionRowProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left transition-all duration-150 group ${
        success ? 'bg-emerald-50' : 'hover:bg-slate-50 active:bg-slate-100'
      }`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-150 group-active:scale-95 ${iconBg} ${iconColor}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold leading-tight ${success ? 'text-emerald-700' : 'text-slate-900'}`}>
          {label}
        </p>
        <p className={`text-xs mt-0.5 leading-relaxed ${success ? 'text-emerald-500' : 'text-slate-400'}`}>
          {description}
        </p>
      </div>
      <svg
        className={`w-4 h-4 flex-shrink-0 transition-colors ${success ? 'text-emerald-400' : 'text-slate-300 group-hover:text-slate-400'}`}
        fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>
    </button>
  )
}

// ─── Social buttons ───────────────────────────────────────────────────────────

type SocialProps = { label: string; href: string; color: string; icon: React.ReactNode }

function SocialButton({ label, href, color, icon }: SocialProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={`Share on ${label}`}
      className="flex flex-col items-center gap-1.5 group"
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-all duration-150 group-hover:scale-105 group-active:scale-95"
        style={{ background: color }}
      >
        {icon}
      </div>
      <span className="text-[10px] font-medium text-slate-400 group-hover:text-slate-600 transition-colors">
        {label}
      </span>
    </a>
  )
}

const XIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)
const WhatsAppIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)
const TelegramIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
)
const FacebookIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)

// ─── Floating toast ───────────────────────────────────────────────────────────

function FloatingToast({ message }: { message: string | null }) {
  return (
    <div
      className="absolute bottom-5 left-1/2 pointer-events-none transition-all duration-300"
      style={{
        transform: message
          ? 'translateX(-50%) translateY(0)'
          : 'translateX(-50%) translateY(8px)',
        opacity: message ? 1 : 0,
      }}
    >
      <div className="flex items-center gap-2 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg whitespace-nowrap">
        <svg className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
        {message}
      </div>
    </div>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export type ShareModalProps = {
  dataUrl: string
  totalMonthly: number
  currency: Currency
  onClose: () => void
}

export function ShareModal({ dataUrl, totalMonthly, currency, onClose }: ShareModalProps) {
  const fmt = (n: number) => formatCurrency(n, currency)
  const [copied, setCopied] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [shareCapability] = useState<'file' | 'basic' | 'none'>(() => detectShareCapability())
  const toastTimer = useRef<ReturnType<typeof setTimeout>>()

  const variant = getVariant(totalMonthly, fmt)
  const shareUrl = typeof window !== 'undefined' ? window.location.origin : 'https://subtracker.app'

  function showToast(msg: string) {
    clearTimeout(toastTimer.current)
    setToast(msg)
    toastTimer.current = setTimeout(() => setToast(null), 2400)
  }

  const handleKey = useCallback(
    (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() },
    [onClose],
  )
  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('keydown', handleKey)
      clearTimeout(toastTimer.current)
    }
  }, [handleKey])

  // ── Handlers ─────────────────────────────────────────────────────────────────

  async function handleNativeShare() {
    if (shareCapability === 'file') {
      try {
        const res = await fetch(dataUrl)
        const blob = await res.blob()
        const file = new File([blob], 'my-subscription-spend.png', { type: 'image/png' })
        await navigator.share({ files: [file], text: variant.shareText })
        return
      } catch (e) {
        if ((e as DOMException).name === 'AbortError') return
        // file share failed → fall through to text share
      }
    }
    try {
      await navigator.share({ text: variant.shareText, url: shareUrl })
    } catch (e) {
      if ((e as DOMException).name !== 'AbortError') console.error(e)
    }
  }

  function handleDownload() {
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = 'my-subscription-spend.png'
    a.click()
    showToast('Saved to your device!')
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(variant.shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
      showToast('Copied to clipboard!')
    } catch { /* ignore */ }
  }

  // ── Social links ──────────────────────────────────────────────────────────────

  const enc = encodeURIComponent
  const socials: SocialProps[] = [
    { label: 'X',        href: `https://twitter.com/intent/tweet?text=${enc(variant.shareText)}`, color: '#000', icon: XIcon },
    { label: 'WhatsApp', href: `https://wa.me/?text=${enc(variant.shareText)}`,                   color: '#25D366', icon: WhatsAppIcon },
    { label: 'Telegram', href: `https://t.me/share/url?url=${enc(shareUrl)}&text=${enc(variant.shareText)}`, color: '#2AABEE', icon: TelegramIcon },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${enc(shareUrl)}`,  color: '#1877F2', icon: FacebookIcon },
  ]

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">

        {/* ── Header ── */}
        <div className="flex items-start justify-between px-5 pt-5 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-snug">
              {variant.heading}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Your card is ready to share</p>
          </div>
          <button
            onClick={onClose}
            className="mt-0.5 w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors flex-shrink-0"
          >
            <IcClose />
          </button>
        </div>

        {/* ── Card preview ── */}
        {/* Slight tilt + glow makes this feel like a physical card reveal */}
        <div className="px-5 pb-1 flex flex-col items-center gap-3">
          <div
            className="relative"
            style={{ filter: 'drop-shadow(0 20px 40px rgba(79,70,229,0.25)) drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={dataUrl}
              alt="Your share card"
              className="rounded-2xl ring-1 ring-black/5"
              style={{
                height: 224,
                width: 'auto',
                transform: 'rotate(-1.5deg)',
                display: 'block',
              }}
            />
          </div>
          {/* Tier-specific CTA */}
          <p className="text-sm font-medium text-slate-500 text-center leading-snug pb-1">
            {variant.cta}
          </p>
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-slate-100 mx-5 mt-1 mb-0" />

        {/* ── Primary actions ── */}
        <div className="p-3 flex flex-col gap-0.5">
          {shareCapability !== 'none' && (
            <ActionRow
              icon={<IcShare />}
              iconBg="bg-indigo-50"
              iconColor="text-indigo-600"
              label="Share now"
              description={
                shareCapability === 'file'
                  ? 'Send the image via any app on your device'
                  : 'Share the link via any app on your device'
              }
              onClick={handleNativeShare}
            />
          )}

          <ActionRow
            icon={<IcDownload />}
            iconBg="bg-slate-100"
            iconColor="text-slate-600"
            label="Download image"
            description="Save PNG to your device · perfect for Instagram &amp; TikTok"
            onClick={handleDownload}
          />

          <ActionRow
            icon={copied ? <IcCheck /> : <IcCopy />}
            iconBg={copied ? 'bg-emerald-50' : 'bg-slate-100'}
            iconColor={copied ? 'text-emerald-600' : 'text-slate-600'}
            label={copied ? 'Copied!' : 'Copy text'}
            description="Copy the share message to paste anywhere"
            onClick={handleCopy}
            success={copied}
          />
        </div>

        {/* ── Social section ── */}
        <div className="h-px bg-slate-100 mx-5" />
        <div className="px-5 py-4">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-3">
            Also share on
          </p>
          <div className="flex gap-4">
            {socials.map(s => (
              <SocialButton key={s.label} {...s} />
            ))}
          </div>
        </div>

        {/* ── Floating toast ── */}
        <FloatingToast message={toast} />

      </div>
    </div>
  )
}
