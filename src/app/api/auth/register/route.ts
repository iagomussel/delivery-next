import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateToken } from '@/lib/auth'
import { UserRole, TenantStatus } from '@prisma/client'
import { generateSlug } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, tenantName, restaurantName } = await request.json()

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

    // Create tenant
    const tenantSlug = generateSlug(tenantName)
    const tenant = await prisma.tenant.create({
      data: {
        name: tenantName,
        slug: tenantSlug,
        status: TenantStatus.ACTIVE,
        plan: 'basic',
      },
    })

    // Create restaurant
    const restaurantSlug = generateSlug(restaurantName)
    const restaurant = await prisma.restaurant.create({
      data: {
        tenantId: tenant.id,
        name: restaurantName,
        slug: restaurantSlug,
        address: {
          street: '',
          number: '',
          neighborhood: '',
          city: '',
          state: '',
          zip: '',
        },
        openingHours: {
          monday: { open: '08:00', close: '22:00' },
          tuesday: { open: '08:00', close: '22:00' },
          wednesday: { open: '08:00', close: '22:00' },
          thursday: { open: '08:00', close: '22:00' },
          friday: { open: '08:00', close: '22:00' },
          saturday: { open: '08:00', close: '22:00' },
          sunday: { open: '08:00', close: '22:00' },
        },
      },
    })

    // Create user
    const hashedPassword = await hashPassword(password)
    const user = await prisma.user.create({
      data: {
        tenantId: tenant.id,
        name,
        email,
        passwordHash: hashedPassword,
        role: UserRole.OWNER,
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
