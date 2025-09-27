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
    const categoryId = searchParams.get('categoryId')

    const whereClause: Record<string, unknown> = {
      restaurant: {
        tenantId: decoded.tenantId,
        ...(restaurantId && { id: restaurantId }),
      },
      ...(categoryId && { categoryId }),
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: true,
        restaurant: true,
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

    // Format products for frontend
    const formattedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description || '',
      basePrice: Number(product.basePrice),
      imageUrl: product.imageUrl,
      isActive: product.active,
      categoryId: product.categoryId,
      categoryName: product.category.name,
      createdAt: product.createdAt.toISOString()
    }))

    return NextResponse.json(formattedProducts)
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
    const {
      restaurantId,
      categoryId,
      name,
      description,
      basePrice,
      sku,
      imageUrl,
      stock,
      optionGroups,
    } = data

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
        productOptionGroups: {
          create: optionGroups?.map((og: Record<string, unknown>, index: number) => ({
            optionGroupId: og.optionGroupId,
            overrideMinSelect: og.overrideMinSelect,
            overrideMaxSelect: og.overrideMaxSelect,
            overrideFreeQuota: og.overrideFreeQuota,
            order: index,
          })) || [],
        },
      },
      include: {
        category: true,
        restaurant: true,
        productOptionGroups: {
          include: {
            optionGroup: {
              include: {
                options: true,
              },
            },
          },
        },
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