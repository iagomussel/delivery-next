import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id')
    const { searchParams } = new URL(request.url)
    const restaurantId = searchParams.get('restaurantId')

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant ID required' },
        { status: 400 }
      )
    }

    const categories = await prisma.category.findMany({
      where: {
        restaurant: {
          tenantId,
          ...(restaurantId && { id: restaurantId }),
        },
        active: true,
      },
      include: {
        _count: {
          select: {
            products: {
              where: { active: true },
            },
          },
        },
      },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(categories)
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
    const tenantId = request.headers.get('x-tenant-id')
    const userRole = request.headers.get('x-user-role') as UserRole

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant ID required' },
        { status: 400 }
      )
    }

    if (userRole !== UserRole.OWNER && userRole !== UserRole.STAFF && userRole !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const data = await request.json()
    const { restaurantId, name, order } = data

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
