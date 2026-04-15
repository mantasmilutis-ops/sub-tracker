import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'SubTracker – Track your subscriptions',
  description: 'Stop wasting money on forgotten subscriptions.',
  metadataBase: new URL('https://subtracker.to'),
  openGraph: {
    title: 'SubTracker – Track your subscriptions',
    description: 'Stop wasting money on forgotten subscriptions.',
    url: 'https://subtracker.to',
    siteName: 'SubTracker',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SubTracker – Track your subscriptions',
    description: 'Stop wasting money on forgotten subscriptions.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>
        <Providers>{children}</Providers>
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
          <Script
            defer
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  )
}
