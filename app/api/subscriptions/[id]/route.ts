import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendSubscriptionRemovedEmail } from '@/lib/email'

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const subscription = await prisma.subscription.findUnique({
    where: { id: params.id },
  })

  if (!subscription) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  if (subscription.userId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await prisma.subscription.delete({ where: { id: params.id } })

  const userEmail = session.user.email
  if (userEmail) {
    sendSubscriptionRemovedEmail(userEmail, { name: subscription.name })
      .catch((err) => console.error('sendSubscriptionRemovedEmail failed:', err))
  }

  return NextResponse.json({ message: 'Deleted' })
}
