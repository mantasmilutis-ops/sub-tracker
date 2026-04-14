import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sendEmail } from '@/lib/email'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { error } = await sendEmail('mantasmilutis@gmail.com', 'Test email', 'It works')

  if (error) {
    return NextResponse.json({ error }, { status: 500 })
  }

  return NextResponse.json({ ok: true, to: 'mantasmilutis@gmail.com' })
}
