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

    const products = await prisma.product.findMany({
      where: {
        restaurant: {
          tenantId,
          ...(restaurantId && { id: restaurantId }),
        },
      },
      include: {
        category: true,
        productOptionGroups: {
          include: {
            optionGroup: {
              include: {
                options: {
                  where: { active: true },
                  orderBy: { name: 'asc' },
                },
              },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Get products error:', error)
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
    const { restaurantId, categoryId, name, description, basePrice, sku, imageUrl, stock } = data

    const product = await prisma.product.create({
      data: {
        restaurantId,
        categoryId,
        name,
        description,
        basePrice,
        sku,
        imageUrl,
        stock,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
