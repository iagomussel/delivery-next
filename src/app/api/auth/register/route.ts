import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateToken } from '@/lib/auth'
import { generateSlug } from '@/lib/utils'

function isJsonRequest(req: NextRequest) {
  const ct = req.headers.get('content-type') || ''
  return ct.includes('application/json')
}

export async function POST(request: NextRequest) {
  try {
    let name = ''
    let email = ''
    let password = ''
    let tenantName = ''
    let restaurantName = ''
    if (isJsonRequest(request)) {
      const body = await request.json()
      name = body?.name || ''
      email = body?.email || ''
      password = body?.password || ''
      tenantName = body?.tenantName || ''
      restaurantName = body?.restaurantName || ''
    } else {
      const form = await request.formData()
      name = String(form.get('name') || '')
      email = String(form.get('email') || '')
      password = String(form.get('password') || '')
      tenantName = String(form.get('tenantName') || '')
      restaurantName = String(form.get('restaurantName') || '')
    }

    if (!name || !email || !password || !tenantName || !restaurantName) {
      return NextResponse.json(
        { error: 'All fields are required' },
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

    // Create tenant (guard against duplicate slug)
    const tenantSlug = generateSlug(tenantName)
    const existingTenantSlug = await prisma.tenant.findUnique({ where: { slug: tenantSlug } })
    if (existingTenantSlug) {
      return NextResponse.json(
        { error: 'Company name already in use. Choose another.' },
        { status: 409 }
      )
    }
    const tenant = await prisma.tenant.create({
      data: {
        name: tenantName,
        slug: tenantSlug,
        status: 'ACTIVE',
        plan: 'basic',
      },
    })

    // Create restaurant (guard against duplicate slug)
    const restaurantSlug = generateSlug(restaurantName)
    const existingRestaurantSlug = await prisma.restaurant.findUnique({ where: { slug: restaurantSlug } })
    if (existingRestaurantSlug) {
      return NextResponse.json(
        { error: 'Restaurant name already in use. Choose another.' },
        { status: 409 }
      )
    }
    const restaurant = await prisma.restaurant.create({
      data: {
        tenantId: tenant.id,
        name: restaurantName,
        slug: restaurantSlug,
        address: JSON.stringify({
          street: '',
          number: '',
          neighborhood: '',
          city: '',
          state: '',
          zip: '',
        }),
        openingHours: JSON.stringify({
          monday: { open: '08:00', close: '22:00' },
          tuesday: { open: '08:00', close: '22:00' },
          wednesday: { open: '08:00', close: '22:00' },
          thursday: { open: '08:00', close: '22:00' },
          friday: { open: '08:00', close: '22:00' },
          saturday: { open: '08:00', close: '22:00' },
          sunday: { open: '08:00', close: '22:00' },
        }),
      },
    })

    // Create user (first user becomes ADMIN, others default to OWNER)
    const totalUsers = await prisma.user.count()
    const defaultRole = totalUsers === 0 ? 'ADMIN' : 'OWNER'
    const hashedPassword = await hashPassword(password)
    const user = await prisma.user.create({
      data: {
        tenantId: tenant.id,
        name,
        email,
        passwordHash: hashedPassword,
        role: defaultRole,
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
        tenant: {
          id: tenant.id,
          name: tenant.name,
          slug: tenant.slug,
        },
        restaurant: {
          id: restaurant.id,
          name: restaurant.name,
          slug: restaurant.slug,
        },
      },
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed. Use POST.' }, { status: 405 })
}
