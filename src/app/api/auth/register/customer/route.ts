import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateToken } from '@/lib/auth'
// Enums are now strings in the schema
type UserRole = 'OWNER' | 'STAFF' | 'AFFILIATE' | 'ADMIN' | 'CUSTOMER'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone } = await request.json()

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

    // For customers, we create them without a specific tenant
    // They can order from any restaurant
    const hashedPassword = await hashPassword(password)
    
    // Create a customer record first
    const customer = await prisma.customer.create({
      data: {
        name,
        phone: phone || '',
        email: email,
        tenantId: 'public', // Special tenant for customers
      },
    })

    // Create user with CUSTOMER role
    const user = await prisma.user.create({
      data: {
        tenantId: 'public', // Special tenant for customers
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
