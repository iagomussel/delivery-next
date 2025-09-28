import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateToken } from '@/lib/auth'

function isJsonRequest(req: NextRequest) {
  const ct = req.headers.get('content-type') || ''
  return ct.includes('application/json')
}

export async function POST(request: NextRequest) {
  try {
    let name = ''
    let email = ''
    let password = ''
    let phone = ''
    if (isJsonRequest(request)) {
      const body = await request.json()
      name = body?.name || ''
      email = body?.email || ''
      password = body?.password || ''
      phone = body?.phone || ''
    } else {
      const form = await request.formData()
      name = String(form.get('name') || '')
      email = String(form.get('email') || '')
      password = String(form.get('password') || '')
      phone = String(form.get('phone') || '')
    }

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email and password are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Ensure a special public tenant exists for customers
    // Resolve a tenant to attach customers to
    const PUBLIC_TENANT_SLUG = 'public'
    const existingPublic = await prisma.tenant.findUnique({ where: { slug: PUBLIC_TENANT_SLUG } })
    const publicTenant = existingPublic ?? (await prisma.tenant.create({
      data: {
        id: 'public', // stable id if available
        name: 'Public',
        slug: PUBLIC_TENANT_SLUG,
        status: 'ACTIVE',
        plan: 'basic',
      },
    }))

    // For customers, we associate them to the public tenant
    const hashedPassword = await hashPassword(password)
    
    // Create a customer record first
    const customer = await prisma.customer.create({
      data: {
        name,
        phone: phone || '',
        email: email,
        tenantId: publicTenant.id, // Special tenant for customers
      },
    })

    // Create user with CUSTOMER role
    const user = await prisma.user.create({
      data: {
        tenantId: publicTenant.id, // Special tenant for customers
        name,
        email,
        passwordHash: hashedPassword,
        role: 'CUSTOMER',
        active: true,
      },
    })

    const token = generateToken({
      userId: user.id,
      tenantId: user.tenantId,
      role: user.role,
      email: user.email,
    })

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        customerId: customer.id,
      },
    })
  } catch (error) {
    console.error('Customer registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed. Use POST.' }, { status: 405 })
}
