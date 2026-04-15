import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'SubTracker – Track your subscriptions'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f1f5f9 0%, #e8edf5 100%)',
          padding: '80px',
        }}
      >
        {/* Brand pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: '#eef2ff',
            borderRadius: 999,
            padding: '10px 24px',
            marginBottom: 40,
          }}
        >
          <span
            style={{
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: '#6366f1',
            }}
          >
            SUBTRACKER
          </span>
        </div>

        {/* Main heading */}
        <div
          style={{
            display: 'flex',
            fontSize: 72,
            fontWeight: 800,
            color: '#0f172a',
            textAlign: 'center',
            lineHeight: 1.1,
            marginBottom: 28,
            maxWidth: 900,
          }}
        >
          Track your subscriptions
        </div>

        {/* Subtitle */}
        <div
          style={{
            display: 'flex',
            fontSize: 32,
            color: '#64748b',
            textAlign: 'center',
            maxWidth: 720,
            lineHeight: 1.4,
          }}
        >
          Stop wasting money on forgotten subscriptions.
        </div>
      </div>
    ),
    { ...size },
  )
}
