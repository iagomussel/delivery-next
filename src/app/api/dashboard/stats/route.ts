import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
// Enums are now strings in the schema
type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELED'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'No token provided' }, { status: 401 })

    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    const restaurants = await prisma.restaurant.findMany({
      where: { tenantId: decoded.tenantId },
      select: { id: true },
    })
    const restaurantIds = restaurants.map(r => r.id)

    const [ordersAgg, pendingOrders, productsCount] = await Promise.all([
      prisma.order.aggregate({
        where: { restaurantId: { in: restaurantIds } },
        _count: { id: true },
        _sum: { total: true },
      }),
      prisma.order.count({
        where: {
          restaurantId: { in: restaurantIds },
          status: 'PENDING',
        },
      }),
      prisma.product.count({
        where: { restaurantId: { in: restaurantIds }, active: true },
      }),
    ])

    return NextResponse.json({
      totalOrders: ordersAgg._count.id || 0,
      pendingOrders,
      totalRevenue: Number(ordersAgg._sum.total || 0),
      totalProducts: productsCount,
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

