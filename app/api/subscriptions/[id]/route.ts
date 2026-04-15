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
    const t0 = Date.now()
    console.log(`[remove] t=0ms — request start — name="${subscription.name}"`)

    await prisma.subscription.delete({ where: { id: params.id } })
    console.log(`[remove] t=${Date.now() - t0}ms — DB delete success`)

    const userEmail = session.user.email
    if (userEmail) {
      console.log(`[remove] t=${Date.now() - t0}ms — email send start — to:${userEmail}`)
      try {
        const { messageId, error } = await sendSubscriptionRemovedEmail(userEmail, { name: subscription.name })
        if (error) {
          console.error(`[remove] t=${Date.now() - t0}ms — email send response — error:${error}`)
        } else {
          console.log(`[remove] t=${Date.now() - t0}ms — email send response — messageId:${messageId}`)
        }
      } catch (err) {
        console.error(`[remove] t=${Date.now() - t0}ms — email send FAILED:`, err)
      }
    }

    console.log(`[remove] t=${Date.now() - t0}ms — returning 200`)
    return NextResponse.json({ message: 'Deleted' })
  } catch (err) {
    console.error('[remove] unhandled error:', err)
    return NextResponse.json({ error: 'Failed to delete subscription' }, { status: 500 })
  }
}
