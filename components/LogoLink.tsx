'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'

const ICON_PATH =
  'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'

type Props = {
  /**
   * sm  — horizontal layout used in navbars   (w-8 icon, text-lg)
   * lg  — stacked layout used on auth pages   (w-12 icon, text-2xl)
   */
  size?: 'sm' | 'lg'
  className?: string
}

/**
 * Clickable logo that routes to /dashboard for authenticated users
 * and to / (landing page) for guests.
 * Auth state is read from the existing NextAuth session — no extra fetch.
 */
export function LogoLink({ size = 'sm', className = '' }: Props) {
  const { data: session } = useSession()
  // While loading, session is undefined → defaults to '/' safely.
  const href = session?.user ? '/dashboard' : '/'

  if (size === 'lg') {
    return (
      <Link
        href={href}
        className={`inline-flex flex-col items-center group cursor-pointer ${className}`}
      >
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 transition-opacity group-hover:opacity-80">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={ICON_PATH}
            />
          </svg>
        </div>
        <span className="text-2xl font-bold text-slate-900 transition-opacity group-hover:opacity-80">
          SubTracker
        </span>
      </Link>
    )
  }

  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 transition-opacity hover:opacity-80 cursor-pointer ${className}`}
    >
      <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
        <svg
          className="w-4 h-4 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d={ICON_PATH}
          />
        </svg>
      </div>
      <span className="font-bold text-slate-900 text-lg">SubTracker</span>
    </Link>
  )
}
