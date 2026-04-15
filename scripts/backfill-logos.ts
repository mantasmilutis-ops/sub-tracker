/**
 * One-time script: backfill logoUrl for all subscriptions still on the default value.
 *
 * Run once against your production DB:
 *   DATABASE_URL="..." npx tsx scripts/backfill-logos.ts
 *
 * Safe to re-run — only touches rows where logoUrl is still the stale default.
 */

import { PrismaClient } from '@prisma/client'

// Inline the lookup so this script has no import issues with Next.js path aliases
const CATALOG_DOMAINS: Record<string, string> = {
  'netflix':              'netflix.com',
  'hulu':                 'hulu.com',
  'disney+':              'disneyplus.com',
  'max':                  'max.com',
  'prime video':          'primevideo.com',
  'amazon prime':         'amazon.com',
  'apple tv+':            'tv.apple.com',
  'paramount+':           'paramountplus.com',
  'peacock':              'peacocktv.com',
  'crunchyroll':          'crunchyroll.com',
  'spotify':              'spotify.com',
  'apple music':          'music.apple.com',
  'youtube premium':      'youtube.com',
  'youtube music':        'music.youtube.com',
  'tidal':                'tidal.com',
  'deezer':               'deezer.com',
  'xbox game pass':       'xbox.com',
  'playstation plus':     'playstation.com',
  'nintendo switch online': 'nintendo.com',
  'ea play':              'ea.com',
  'google one':           'one.google.com',
  'icloud+':              'icloud.com',
  'dropbox':              'dropbox.com',
  'notion':               'notion.so',
  'slack':                'slack.com',
  'zoom':                 'zoom.us',
  'monday.com':           'monday.com',
  'github pro':           'github.com',
  'github copilot':       'github.com',
  'vercel':               'vercel.com',
  'cursor':               'cursor.sh',
  'figma':                'figma.com',
  'canva pro':            'canva.com',
  'adobe creative cloud': 'adobe.com',
  'microsoft 365':        'microsoft.com',
  'google workspace':     'workspace.google.com',
  '1password':            '1password.com',
  'nordvpn':              'nordvpn.com',
  'grammarly':            'grammarly.com',
  'chatgpt plus':         'openai.com',
  'claude pro':           'anthropic.com',
  'midjourney':           'midjourney.com',
  'shopify':              'shopify.com',
  'hubspot':              'hubspot.com',
  'zapier':               'zapier.com',
  'mailchimp':            'mailchimp.com',
  'duolingo plus':        'duolingo.com',
  'coursera plus':        'coursera.org',
  'headspace':            'headspace.com',
  'calm':                 'calm.com',
  'discord nitro':        'discord.com',
  'new york times':       'nytimes.com',
}

const DEFAULT_LOGO = '/logos/subtracker.png'
const STALE_VALUES = ['/logos/subtracker.svg', '']

function resolveLogoUrl(name: string): string {
  const key = name.toLowerCase().trim()
  const domain = CATALOG_DOMAINS[key]
  if (domain) {
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
  }
  return DEFAULT_LOGO
}

async function main() {
  const prisma = new PrismaClient()

  try {
    const stale = await prisma.subscription.findMany({
      where: { logoUrl: { in: STALE_VALUES } },
      select: { id: true, name: true, logoUrl: true },
    })

    console.log(`Found ${stale.length} subscription(s) with stale logo URLs.\n`)

    if (stale.length === 0) {
      console.log('Nothing to update — all logos are already set.')
      return
    }

    let updated = 0
    for (const sub of stale) {
      const logoUrl = resolveLogoUrl(sub.name)
      await prisma.subscription.update({
        where: { id: sub.id },
        data: { logoUrl },
      })
      console.log(`  ✓  "${sub.name}"  →  ${logoUrl}`)
      updated++
    }

    console.log(`\nDone. ${updated} subscription(s) updated.`)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch(err => {
  console.error('Backfill failed:', err)
  process.exit(1)
})
