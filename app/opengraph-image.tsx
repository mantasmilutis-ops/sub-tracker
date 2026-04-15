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
          background: 'linear-gradient(135deg, #0f0c29 0%, #1a1040 50%, #0d1b4b 100%)',
          padding: '80px',
          position: 'relative',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Subtle grid overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            display: 'flex',
          }}
        />

        {/* Glow blob top-right */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            right: -80,
            width: 480,
            height: 480,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Glow blob bottom-left */}
        <div
          style={{
            position: 'absolute',
            bottom: -100,
            left: -60,
            width: 360,
            height: 360,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Content container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0,
            zIndex: 1,
            textAlign: 'center',
          }}
        >
          {/* Highlight pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: 'rgba(99,102,241,0.15)',
              border: '1px solid rgba(99,102,241,0.4)',
              borderRadius: 999,
              padding: '10px 28px',
              marginBottom: 44,
            }}
          >
            <span style={{ fontSize: 28 }}>💸</span>
            <span
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: '#a5b4fc',
                letterSpacing: '0.01em',
              }}
            >
              $419/month in hidden subscriptions
            </span>
          </div>

          {/* Main headline */}
          <div
            style={{
              fontSize: 88,
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.0,
              letterSpacing: '-0.03em',
              marginBottom: 28,
              maxWidth: 960,
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            Track your{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #818cf8 0%, #a78bfa 100%)',
                backgroundClip: 'text',
                color: 'transparent',
                paddingLeft: 22,
              }}
            >
              subscriptions
            </span>
          </div>

          {/* Subheadline */}
          <div
            style={{
              fontSize: 32,
              fontWeight: 400,
              color: '#94a3b8',
              letterSpacing: '0.005em',
              lineHeight: 1.4,
              maxWidth: 680,
              display: 'flex',
            }}
          >
            Stop wasting money on forgotten subscriptions.
          </div>
        </div>

        {/* Brand — bottom center */}
        <div
          style={{
            position: 'absolute',
            bottom: 44,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#6366f1',
              display: 'flex',
            }}
          />
          <span
            style={{
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: '0.18em',
              color: '#475569',
              textTransform: 'uppercase',
            }}
          >
            SubTracker
          </span>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#6366f1',
              display: 'flex',
            }}
          />
        </div>
      </div>
    ),
    { ...size },
  )
}
