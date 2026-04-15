/**
 * app/api/cron/alerts/route.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Cron endpoint for subscription billing alerts.
 *
 * Run hourly via Vercel Cron (vercel.json). Each run checks which users have
 * reached their local SEND_HOUR and sends only the alerts they haven't
 * received yet today (daily) or this week on Monday (weekly).
 *
 * Secure with CRON_SECRET env var:
 *   Authorization: Bearer <CRON_SECRET>
 * (If CRON_SECRET is not set the endpoint is open — fine for local dev only.)
 *
 * Query params:
 *   GET /api/cron/alerts?type=daily    — today + tomorrow reminders
 *   GET /api/cron/alerts?type=weekly   — 7-day summary (Mondays only)
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendTodayAlert, sendTomorrowAlert, sendWeeklySummaryEmail, type AlertSub } from '@/lib/email'

// ─── Config ───────────────────────────────────────────────────────────────────

/** Local hour at which alerts are sent (24-hour clock, 0–23). */
const SEND_HOUR = 9

// ─── Timezone-aware date helpers ──────────────────────────────────────────────

/**
 * Return the local date string ("YYYY-MM-DD") for a given IANA timezone,
 * offset by `offsetDays` from now.
 * Uses 'en-CA' locale which formats as YYYY-MM-DD natively.
 */
function getLocalDateStr(timezone: string, offsetDays = 0): string {
  // Adding whole-day milliseconds is accurate enough for ±1 week offsets.
  const ms = Date.now() + offsetDays * 24 * 60 * 60 * 1000
  return new Intl.DateTimeFormat('en-CA', { timeZone: timezone }).format(ms)
}

/** Return the current local hour (0–23) for a given IANA timezone. */
function getLocalHour(timezone: string): number {
  return parseInt(
    new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      hour12: false,
    }).format(new Date()),
    10,
  )
}

/** Return the current local day-of-week (0=Sun … 6=Sat) for a given IANA timezone. */
function getLocalDayOfWeek(timezone: string): number {
  return new Date(
    new Intl.DateTimeFormat('en-CA', { timeZone: timezone }).format(new Date()),
  ).getDay()
}

/**
 * UTC query window wide enough to catch every timezone.
 * Timezones span UTC-12 → UTC+14, so "today" anywhere on earth fits within a
 * UTC window of [yesterday 00:00 UTC, tomorrow+1 23:59 UTC].
 * `extraDays` expands the far end for weekly queries.
 */
function utcDayRange(offsetDays: number) {
  const start = new Date()
  start.setUTCHours(0, 0, 0, 0)
  start.setUTCDate(start.getUTCDate() + offsetDays)
  const end = new Date(start)
  end.setUTCHours(23, 59, 59, 999)
  return { gte: start, lte: end }
}

function utcQueryWindow(extraDays = 0) {
  const start = new Date()
  start.setUTCHours(0, 0, 0, 0)
  start.setUTCDate(start.getUTCDate() - 1) // reach UTC-12
  const end = new Date()
  end.setUTCHours(23, 59, 59, 999)
  end.setUTCDate(end.getUTCDate() + 2 + extraDays) // reach UTC+14 + lookahead
  return { gte: start, lte: end }
}

// ─── Types ────────────────────────────────────────────────────────────────────

type RawSub = {
  name: string
  price: number
  billingCycle: string
  nextBilling: Date
  userId: string
  user: { email: string; timezone: string | null }
}

type UserBucket = { email: string; timezone: string; subs: AlertSub[] }

/** Extract the calendar-date string ("YYYY-MM-DD") from a billing Date. */
function billingDateStr(sub: AlertSub): string {
  return (sub.nextBilling as Date).toISOString().slice(0, 10)
}

/**
 * Group raw subs into a per-user map; timezone falls back to UTC if unset.
 */
function groupByUser(subs: RawSub[]): Map<string, UserBucket> {
  const map = new Map<string, UserBucket>()
  for (const sub of subs) {
    if (!map.has(sub.userId)) {
      map.set(sub.userId, {
        email: sub.user.email,
        timezone: sub.user.timezone ?? 'UTC',
        subs: [],
      })
    }
    map.get(sub.userId)!.subs.push({
      name: sub.name,
      price: sub.price,
      billingCycle: sub.billingCycle,
      nextBilling: sub.nextBilling,
    })
  }
  return map
}

// ─── Route ────────────────────────────────────────────────────────────────────

export async function GET(req: Request) {
  // Auth
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = req.headers.get('authorization')
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') ?? 'daily'

  // ── Daily: today + tomorrow reminders ─────────────────────────────────────
  if (type === 'daily') {
    // Two separate queries — one per day — so grouping is trivial
    const [todayRaw, tomorrowRaw] = await Promise.all([
      prisma.subscription.findMany({
        where: { nextBilling: utcDayRange(0) },
        include: { user: { select: { email: true, timezone: true } } },
      }),
      prisma.subscription.findMany({
        where: { nextBilling: utcDayRange(1) },
        include: { user: { select: { email: true, timezone: true } } },
      }),
    ])

    // Group each result set by userId → { email, timezone, subs[] }
    const todayByUser = new Map<string, { email: string; timezone: string; subs: typeof todayRaw }>()
    for (const sub of todayRaw) {
      if (!todayByUser.has(sub.userId))
        todayByUser.set(sub.userId, { email: sub.user.email, timezone: sub.user.timezone ?? 'UTC', subs: [] })
      todayByUser.get(sub.userId)!.subs.push(sub)
    }

    const tomorrowByUser = new Map<string, { email: string; timezone: string; subs: typeof tomorrowRaw }>()
    for (const sub of tomorrowRaw) {
      if (!tomorrowByUser.has(sub.userId))
        tomorrowByUser.set(sub.userId, { email: sub.user.email, timezone: sub.user.timezone ?? 'UTC', subs: [] })
      tomorrowByUser.get(sub.userId)!.subs.push(sub)
    }

    let sentToday = 0
    let sentTomorrow = 0

    for (const [userId, { email, timezone, subs }] of Array.from(todayByUser)) {
      if (getLocalHour(timezone) !== SEND_HOUR) continue
      const localDate = getLocalDateStr(timezone)
      const alreadySent = await prisma.alertLog.findUnique({
        where: { userId_type_localDate: { userId, type: 'today', localDate } },
      })
      if (alreadySent) continue

      const alertSubs: AlertSub[] = subs.map(s => ({ name: s.name, price: s.price, billingCycle: s.billingCycle, nextBilling: s.nextBilling }))
      console.log('Sending TODAY alert to', email, '—', alertSubs.length, 'sub(s)')
      const { error } = await sendTodayAlert(email, alertSubs)
      if (error) {
        console.error('Failed today alert:', error)
      } else {
        console.log('[AlertLog] inserting today —', userId, localDate)
        try {
          await prisma.alertLog.create({ data: { userId, type: 'today', localDate } })
          console.log('[AlertLog] insert OK — today', userId, localDate)
        } catch (e) {
          console.error('[AlertLog] insert FAILED — today', userId, localDate, e)
        }
        sentToday++
      }
    }

    for (const [userId, { email, timezone, subs }] of Array.from(tomorrowByUser)) {
      if (getLocalHour(timezone) !== SEND_HOUR) continue
      const localDate = getLocalDateStr(timezone)
      const alreadySent = await prisma.alertLog.findUnique({
        where: { userId_type_localDate: { userId, type: 'tomorrow', localDate } },
      })
      if (alreadySent) continue

      const alertSubs: AlertSub[] = subs.map(s => ({ name: s.name, price: s.price, billingCycle: s.billingCycle, nextBilling: s.nextBilling }))
      console.log('Sending TOMORROW alert to', email, '—', alertSubs.length, 'sub(s)')
      const { error } = await sendTomorrowAlert(email, alertSubs)
      if (error) {
        console.error('Failed tomorrow alert:', error)
      } else {
        console.log('[AlertLog] inserting tomorrow —', userId, localDate)
        try {
          await prisma.alertLog.create({ data: { userId, type: 'tomorrow', localDate } })
          console.log('[AlertLog] insert OK — tomorrow', userId, localDate)
        } catch (e) {
          console.error('[AlertLog] insert FAILED — tomorrow', userId, localDate, e)
        }
        sentTomorrow++
      }
    }

    return NextResponse.json({
      type: 'daily',
      today: todayByUser.size,
      tomorrow: tomorrowByUser.size,
      sentToday,
      sentTomorrow,
    })
  }

  // ── Weekly: stats summary ─────────────────────────────────────────────────
  if (type === 'weekly') {
    const now = new Date()
    now.setUTCHours(0, 0, 0, 0)

    const in7Days = new Date(now)
    in7Days.setUTCDate(in7Days.getUTCDate() + 7)
    in7Days.setUTCHours(23, 59, 59, 999)

    const in8Days = new Date(now)
    in8Days.setUTCDate(in8Days.getUTCDate() + 8)

    const in30Days = new Date(now)
    in30Days.setUTCDate(in30Days.getUTCDate() + 30)
    in30Days.setUTCHours(23, 59, 59, 999)

    const weekSubsRaw = await prisma.subscription.findMany({
      where: { nextBilling: { gte: now, lte: in7Days } },
      orderBy: { nextBilling: 'asc' },
      include: { user: { select: { email: true, timezone: true } } },
    })

    // Group this week's subs by user
    const weekByUser = new Map<string, { email: string; timezone: string; subs: typeof weekSubsRaw }>()
    for (const sub of weekSubsRaw) {
      if (!weekByUser.has(sub.userId))
        weekByUser.set(sub.userId, { email: sub.user.email, timezone: sub.user.timezone ?? 'UTC', subs: [] })
      weekByUser.get(sub.userId)!.subs.push(sub)
    }

    let sentWeekly = 0

    for (const [userId, { email, timezone, subs }] of Array.from(weekByUser)) {
      if (getLocalHour(timezone) !== SEND_HOUR) continue
      if (getLocalDayOfWeek(timezone) !== 1) continue // Monday only
      const localDate = getLocalDateStr(timezone)
      const alreadySent = await prisma.alertLog.findUnique({
        where: { userId_type_localDate: { userId, type: 'weekly', localDate } },
      })
      if (alreadySent) continue

      const [totalSubscriptions, upcomingCount] = await Promise.all([
        prisma.subscription.count({ where: { userId } }),
        prisma.subscription.count({ where: { userId, nextBilling: { gte: in8Days, lte: in30Days } } }),
      ])

      const upcomingSubs: AlertSub[] = subs.map(s => ({
        name: s.name,
        price: s.price,
        billingCycle: s.billingCycle,
        nextBilling: s.nextBilling,
      }))

      console.log('Sending WEEKLY summary to:', email)

      const { error } = await sendWeeklySummaryEmail(email, {
        totalSubscriptions,
        expiringThisWeek: subs.length,
        upcoming: upcomingCount,
        upcomingSubs,
      })

      if (error) {
        console.error('Failed weekly summary:', error)
      } else {
        console.log('[AlertLog] inserting weekly —', userId, localDate)
        try {
          await prisma.alertLog.create({ data: { userId, type: 'weekly', localDate } })
          console.log('[AlertLog] insert OK — weekly', userId, localDate)
        } catch (e) {
          console.error('[AlertLog] insert FAILED — weekly', userId, localDate, e)
        }
        sentWeekly++
      }
    }

    return NextResponse.json({
      type: 'weekly',
      usersNotified: sentWeekly,
      sent: sentWeekly > 0,
    })
  }

  return NextResponse.json(
    { error: 'Unknown type. Use ?type=daily or ?type=weekly' },
    { status: 400 },
  )
}
