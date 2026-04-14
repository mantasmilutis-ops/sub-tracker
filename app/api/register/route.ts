import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { sendWelcomeEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        emailVerified: true,
      },
    })

    console.log('sending welcome email to', email)
    sendWelcomeEmail(email)
      .then(({ error }) => {
        if (error) console.error('welcome email failed for', email, error)
        else console.log('welcome email sent to', email)
      })
      .catch((err) => console.error('welcome email failed for', email, err))

    return NextResponse.json({ message: 'Account created.' })
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
