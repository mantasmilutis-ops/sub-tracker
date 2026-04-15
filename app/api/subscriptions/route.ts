import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendSubscriptionAddedEmail } from '@/lib/email'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const subscriptions = await prisma.subscription.findMany({
    where: { userId: session.user.id },
    orderBy: { price: 'desc' },
  })

  return NextResponse.json(subscriptions)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { name, price, billingCycle, category, nextBilling, currency, displayPrice, logoUrl: rawLogoUrl } = await req.json()

    // Always resolve to a non-empty string — never pass null/undefined to Prisma.
    // Covers: custom service (no logo sent), failed lookup, old client payloads.
    const logoUrl: string = rawLogoUrl || '/logos/subtracker.svg'

    console.log('[add] started —', name, '| logoUrl:', logoUrl)

    if (!name || !price || !billingCycle || !nextBilling) {
      return NextResponse.json(
        { error: 'Name, price, billing cycle, and next billing date are required' },
        { status: 400 }
      )
    }

    const subscription = await prisma.subscription.create({
      data: {
        name,
        price: parseFloat(price),
        billingCycle,
        category: category || null,
        nextBilling: new Date(nextBilling),
        userId: session.user.id,
        logoUrl,
      },
    })
    console.log('[add] DB write success — id:', subscription.id)

    const userEmail = session.user.email
    if (userEmail) {
      console.log('[add] email send started — to:', userEmail)
      try {
        await sendSubscriptionAddedEmail(userEmail, {
          name: subscription.name,
          price: typeof displayPrice === 'number' ? displayPrice : subscription.price,
          billingCycle: subscription.billingCycle,
          currency: currency ?? 'EUR',
        })
        console.log('[add] email send success')
      } catch (err) {
        console.error('[add] email send FAILED:', err)
      }
    }

    return NextResponse.json(subscription, { status: 201 })
  } catch (err) {
    console.error('[add] unhandled error:', err)
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    )
  }
}
