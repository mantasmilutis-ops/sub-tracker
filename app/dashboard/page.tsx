import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { DashboardClient } from '@/components/DashboardClient'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const subscriptions = await prisma.subscription.findMany({
    where: { userId: session.user.id },
    orderBy: { price: 'desc' },
  })

  const serialized = subscriptions.map(s => ({
    ...s,
    nextBilling: s.nextBilling.toISOString(),
    createdAt: s.createdAt.toISOString(),
  }))

  return (
    <DashboardClient
      initialSubscriptions={serialized}
      userName={session.user.name || session.user.email || 'there'}
    />
  )
}
