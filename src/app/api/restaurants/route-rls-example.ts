import { NextRequest, NextResponse } from 'next/server'
import { withRLS, withPublicRLS, withRestaurantRLS } from '@/lib/rls-middleware'
import { JWTPayload } from '@/lib/auth'

// Example of how to refactor the restaurants route to use RLS
// This shows the pattern for converting existing routes

// Public endpoint for getting restaurant by slug (no auth required)
export const GET = withPublicRLS(async (request, prisma) => {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (slug) {
      // Public endpoint to get restaurant by slug
      // RLS policies will automatically filter based on tenant
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

    // For authenticated requests, use the RLS-protected version
    return NextResponse.json({ error: 'Authentication required for tenant restaurants' }, { status: 401 })
  } catch (error) {
    console.error('Get restaurants error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})

// Alternative: Separate public and authenticated endpoints
export const GET_PUBLIC = withPublicRLS(async (request, prisma) => {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  if (!slug) {
    return NextResponse.json({ error: 'Slug parameter required' }, { status: 400 })
  }

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
})

export const GET_TENANT = withRLS(async (request, prisma, user: JWTPayload) => {
  // RLS policies automatically filter by tenant
  const restaurants = await prisma.restaurant.findMany({
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
})

// Restaurant creation (requires restaurant user role)
export const POST = withRestaurantRLS(async (request, prisma, user: JWTPayload) => {
  const data = await request.json()
  const { name, address, geo, deliveryRadiusKm, openingHours } = data

  const restaurant = await prisma.restaurant.create({
    data: {
      // tenantId is automatically set by RLS context
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
})
