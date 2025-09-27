import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const restaurantId = searchParams.get('restaurantId')

    const categories = await prisma.category.findMany({
      where: {
        restaurant: {
          tenantId: decoded.tenantId,
          ...(restaurantId && { id: restaurantId }),
        },
      },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: { order: 'asc' },
    })

    // Format categories for frontend
    const formattedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      description: '', // Add description field to schema if needed
      order: category.order,
      isActive: category.active,
      productCount: category._count.products,
      createdAt: category.createdAt.toISOString()
    }))

    return NextResponse.json(formattedCategories)
  } catch (error) {
    console.error('Get categories error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    if (decoded.role !== 'OWNER' && decoded.role !== 'STAFF' && decoded.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const data = await request.json()
    const { restaurantId, name, order } = data

    // Verify restaurant belongs to tenant
    const restaurant = await prisma.restaurant.findFirst({
      where: { id: restaurantId, tenantId: decoded.tenantId },
    })

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      )
    }

    const category = await prisma.category.create({
      data: {
        restaurantId,
        name,
        order: order || 0,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error('Create category error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}