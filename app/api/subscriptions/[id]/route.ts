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

  try {
    console.log('[remove] started — id:', params.id)

    await prisma.subscription.delete({ where: { id: params.id } })
    console.log('[remove] DB delete success —', subscription.name)

    const userEmail = session.user.email
    if (userEmail) {
      console.log('[remove] email send started — to:', userEmail)
      try {
        await sendSubscriptionRemovedEmail(userEmail, { name: subscription.name })
        console.log('[remove] email send success')
      } catch (err) {
        console.error('[remove] email send FAILED:', err)
      }
    }

    return NextResponse.json({ message: 'Deleted' })
  } catch (err) {
    console.error('[remove] unhandled error:', err)
    return NextResponse.json({ error: 'Failed to delete subscription' }, { status: 500 })
  }
}
