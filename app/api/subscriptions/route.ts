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

    const t0 = Date.now()
    console.log(`[add] t=0ms — request start — name="${name}"`)

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
    console.log(`[add] t=${Date.now() - t0}ms — DB write success — id:${subscription.id}`)

    const userEmail = session.user.email
    if (userEmail) {
      console.log(`[add] t=${Date.now() - t0}ms — email send start — to:${userEmail}`)
      try {
        const { messageId, error } = await sendSubscriptionAddedEmail(userEmail, {
          name: subscription.name,
          price: typeof displayPrice === 'number' ? displayPrice : subscription.price,
          billingCycle: subscription.billingCycle,
          currency: currency ?? 'EUR',
        })
        if (error) {
          console.error(`[add] t=${Date.now() - t0}ms — email send response — error:${error}`)
        } else {
          console.log(`[add] t=${Date.now() - t0}ms — email send response — messageId:${messageId}`)
        }
      } catch (err) {
        console.error(`[add] t=${Date.now() - t0}ms — email send FAILED:`, err)
      }
    }

    console.log(`[add] t=${Date.now() - t0}ms — returning 201`)
    return NextResponse.json(subscription, { status: 201 })
  } catch (err) {
    console.error('[add] unhandled error:', err)
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    )
  }
}
