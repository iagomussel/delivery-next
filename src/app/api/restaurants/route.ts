import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { UserRole } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    const token = request.headers.get('authorization')?.replace('Bearer ', '')

    if (slug) {
      // Public endpoint to get restaurant by slug
      const restaurant = await prisma.restaurant.findUnique({
        where: { slug },
        include: {
          categories: {
            where: { active: true },
            orderBy: { order: 'asc' },
            include: {
              products: {
                where: { active: true },
                include: {
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
              },
            },
          },
        },
      })

      if (!restaurant) {
        return NextResponse.json(
          { error: 'Restaurant not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(restaurant)
    }

    // Get restaurants for authenticated user's tenant
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const restaurants = await prisma.restaurant.findMany({
      where: { tenantId: decoded.tenantId },
      include: {
        _count: {
          select: {
            orders: true,
            products: true,
          },
        },
      },
    })

    return NextResponse.json(restaurants)
  } catch (error) {
    console.error('Get restaurants error:', error)
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

    if (decoded.role !== 'OWNER' && decoded.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const data = await request.json()
    const { name, address, geo, deliveryRadiusKm, openingHours } = data

    const restaurant = await prisma.restaurant.create({
      data: {
        tenantId: decoded.tenantId,
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        address,
        geo,
        deliveryRadiusKm: deliveryRadiusKm || 5.0,
        openingHours: openingHours || {
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

    return NextResponse.json(restaurant)
  } catch (error) {
    console.error('Create restaurant error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
