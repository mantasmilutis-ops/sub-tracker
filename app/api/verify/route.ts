import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { token } = await req.json()

    if (!token) {
      return NextResponse.json({ error: 'Token is required.' }, { status: 400 })
    }

    const record = await prisma.verificationToken.findUnique({ where: { token } })

    if (!record) {
      return NextResponse.json({ error: 'Invalid or expired verification link.' }, { status: 400 })
    }

    if (record.expires < new Date()) {
      await prisma.verificationToken.delete({ where: { token } })
      return NextResponse.json({ error: 'This verification link has expired. Please request a new one.' }, { status: 400 })
    }

    await prisma.user.update({
      where: { id: record.userId },
      data: { emailVerified: true },
    })

    await prisma.verificationToken.delete({ where: { token } })

    return NextResponse.json({ message: 'Email verified! You can now sign in.' })
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
