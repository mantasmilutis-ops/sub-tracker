/**
 * Thin analytics wrapper.
 *
 * In production with Plausible configured: fires real custom events.
 * In development (or without Plausible): logs to console so you can
 * still see the funnel without any setup.
 *
 * Usage:
 *   trackEvent('waitlist_click')
 *   trackEvent('waitlist_submit', { email_domain: 'gmail.com' })
 */

declare global {
  interface Window {
    plausible?: (
      event: string,
      options?: { props?: Record<string, string | number | boolean> },
    ) => void
  }
}

export function trackEvent(
  name: string,
  props?: Record<string, string | number | boolean>,
) {
  if (typeof window === 'undefined') return

  if (window.plausible) {
    window.plausible(name, props ? { props } : undefined)
  } else {
    // Dev fallback — visible in browser console and Vercel function logs
    console.log(`[analytics] ${name}`, props ?? '')
  }
}
