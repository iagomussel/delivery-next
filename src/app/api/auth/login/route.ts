import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, generateToken } from '@/lib/auth'

function isJsonRequest(req: NextRequest) {
  const ct = req.headers.get('content-type') || ''
  return ct.includes('application/json')
}

export async function POST(request: NextRequest) {
  try {
    let email = ''
    let password = ''
    if (isJsonRequest(request)) {
      const body = await request.json()
      email = body?.email || ''
      password = body?.password || ''
    } else {
      const form = await request.formData()
      email = String(form.get('email') || '')
      password = String(form.get('password') || '')
    }

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { tenant: true },
    })

    if (!user || !user.active) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // If no ADMIN exists yet, promote this user if they are OWNER
    const admins = await prisma.user.count({ where: { role: 'ADMIN' } })
    let role = user.role
    if (admins === 0 && user.role === 'OWNER') {
      const updated = await prisma.user.update({ where: { id: user.id }, data: { role: 'ADMIN' }, select: { role: true } })
      role = updated.role
    }

    const token = generateToken({
      userId: user.id,
      tenantId: user.tenantId,
      role,
      email: user.email,
    })

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role,
        tenant: {
          id: user.tenant.id,
          name: user.tenant.name,
          slug: user.tenant.slug,
        },
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed. Use POST.' }, { status: 405 })
}
