'use client'

import Link from 'next/link'
import { useState } from 'react'
import { LogoLink } from '@/components/LogoLink'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <LogoLink />

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Features</a>
            <a href="#pricing" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Pricing</a>
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-3 py-2">
              Log in
            </Link>
            <Link href="/register" className="btn-primary text-sm py-2 px-4">
              Start free
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          >
            {open ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 flex flex-col gap-1">
          <a href="#features" onClick={() => setOpen(false)} className="px-3 py-2.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">Features</a>
          <a href="#pricing" onClick={() => setOpen(false)} className="px-3 py-2.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">Pricing</a>
          <div className="border-t border-slate-100 mt-2 pt-3 flex flex-col gap-2">
            <Link href="/login" className="px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors text-center">Log in</Link>
            <Link href="/register" className="btn-primary text-sm text-center py-2.5">Start free</Link>
          </div>
        </div>
      )}
    </nav>
  )
}
