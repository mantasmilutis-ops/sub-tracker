import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { sendVerificationEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return NextResponse.json({ error: 'No account found with this email.' }, { status: 404 })
    }

    if (user.emailVerified) {
      return NextResponse.json({ message: 'Your email is already verified. You can sign in.' })
    }

    // Delete existing tokens for this user
    await prisma.verificationToken.deleteMany({ where: { userId: user.id } })

    // Create a fresh 24-hour token
    const token = crypto.randomBytes(32).toString('hex')
    await prisma.verificationToken.create({
      data: {
        token,
        userId: user.id,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    })

    await sendVerificationEmail(email, token)

    return NextResponse.json({ message: 'Verification email sent. Check your inbox.' })
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
