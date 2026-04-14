'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { LogoLink } from '@/components/LogoLink'

function VerifyContent() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')

    if (!token) {
      setStatus('error')
      setMessage('Invalid verification link.')
      return
    }

    fetch('/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setStatus('error')
          setMessage(data.error)
        } else {
          setStatus('success')
          setMessage(data.message)
        }
      })
      .catch(() => {
        setStatus('error')
        setMessage('Something went wrong. Please try again.')
      })
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <LogoLink size="lg" />
        </div>

        <div className="card p-6 text-center">
          {status === 'loading' && (
            <p className="text-slate-500 text-sm">Verifying your email…</p>
          )}

          {status === 'success' && (
            <>
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-slate-900 mb-2">Email verified!</h2>
              <p className="text-slate-500 text-sm mb-4">{message}</p>
              <Link href="/login" className="btn-primary inline-block">
                Sign in
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-slate-900 mb-2">Verification failed</h2>
              <p className="text-slate-500 text-sm mb-4">{message}</p>
              <Link href="/register" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                Back to register
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyContent />
    </Suspense>
  )
}