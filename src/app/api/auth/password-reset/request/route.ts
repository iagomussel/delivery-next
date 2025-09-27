import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generatePasswordResetToken } from '@/lib/tokens'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { email } })

    // Always respond success to avoid account enumeration
    if (!user || !user.active) {
      return NextResponse.json({ ok: true })
    }

    const token = generatePasswordResetToken(user.id, user.email)

    // TODO: send email. For now, return token in dev to unblock flow.
    return NextResponse.json({ ok: true, token })
  } catch (err) {
    console.error('Password reset request error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

