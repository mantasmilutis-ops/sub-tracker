import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendWaitlistConfirmation } from '@/lib/email'

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }

  const existing = await prisma.waitlistEntry.findUnique({ where: { email } })

  if (existing) {
    return NextResponse.json({ ok: true, message: "You're already on the waitlist." })
  }

  await prisma.waitlistEntry.create({ data: { email } })
  console.log('[waitlist] DB insert success:', email)

  console.log('[waitlist] sending confirmation email to', email)
  try {
    const { error } = await sendWaitlistConfirmation(email)
    if (error) {
      console.error('[waitlist] email send failed:', email, error)
    } else {
      console.log('[waitlist] email sent successfully to', email)
    }
  } catch (err) {
    console.error('[waitlist] email threw:', email, err)
  }

  return NextResponse.json({ ok: true, message: "You're on the waitlist 🚀" })
}
