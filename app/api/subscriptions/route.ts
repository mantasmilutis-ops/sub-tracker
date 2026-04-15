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
    const { name, price, billingCycle, category, nextBilling } = await req.json()

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
      },
    })

    const userEmail = session.user.email
    if (userEmail) {
      sendSubscriptionAddedEmail(userEmail, {
        name: subscription.name,
        price: subscription.price,
        billingCycle: subscription.billingCycle,
      }).catch((err) => console.error('sendSubscriptionAddedEmail failed:', err))
    }

    return NextResponse.json(subscription, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    )
  }
}
