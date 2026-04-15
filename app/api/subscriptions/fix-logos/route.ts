import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { lookupService } from '@/lib/services'

const DEFAULT_LOGO = '/logos/subtracker.png'
// Values that indicate a subscription was saved before logoUrl was properly populated
const STALE_VALUES = ['/logos/subtracker.svg', '']

function resolveLogoUrl(name: string): string {
  const entry = lookupService(name)
  if (entry?.domain) {
    return `https://www.google.com/s2/favicons?domain=${entry.domain}&sz=128`
  }
  return DEFAULT_LOGO
}

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Only touch subscriptions still on a stale/default logo value
  const stale = await prisma.subscription.findMany({
    where: {
      userId: session.user.id,
      logoUrl: { in: STALE_VALUES },
    },
    select: { id: true, name: true },
  })

  if (stale.length === 0) {
    return NextResponse.json({ updated: 0 })
  }

  await Promise.all(
    stale.map(sub =>
      prisma.subscription.update({
        where: { id: sub.id },
        data: { logoUrl: resolveLogoUrl(sub.name) },
      })
    )
  )

  return NextResponse.json({ updated: stale.length })
}
