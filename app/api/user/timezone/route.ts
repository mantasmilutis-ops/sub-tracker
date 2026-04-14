import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { timezone } = await req.json()

  if (!timezone || typeof timezone !== 'string') {
    return NextResponse.json({ error: 'Invalid timezone' }, { status: 400 })
  }

  // Validate it is a real IANA timezone string
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone })
  } catch {
    return NextResponse.json({ error: 'Unknown timezone' }, { status: 400 })
  }

  // Skip the write if nothing changed
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { timezone: true },
  })
  if (user?.timezone === timezone) {
    return NextResponse.json({ ok: true, changed: false })
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { timezone },
  })

  return NextResponse.json({ ok: true, changed: true })
}
