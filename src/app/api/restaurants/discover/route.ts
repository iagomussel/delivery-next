import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')
    const neighborhood = searchParams.get('neighborhood')
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Build where clause for filtering
    const whereClause: Record<string, unknown> = {
      // Only show restaurants that are active and have at least one category
      categories: {
        some: {
          active: true,
          products: {
            some: {
              active: true
            }
          }
        }
      }
    }

    // Filter by location if provided
    if (city || neighborhood) {
      whereClause.address = {
        path: [],
        ...(city && { 
          string_contains: city 
        }),
        ...(neighborhood && { 
          string_contains: neighborhood 
        })
      }
    }

    // Get restaurants with their categories and products
    const restaurants = await prisma.restaurant.findMany({
      where: whereClause,
      include: {
        categories: {
          where: { active: true },
          orderBy: { order: 'asc' },
          include: {
            products: {
              where: { active: true },
              select: {
                id: true,
                name: true,
                basePrice: true,
              },
              take: 5, // Limit products per category for performance
            },
          },
          take: 10, // Limit categories per restaurant
        },
        tenant: {
          select: {
            name: true,
            status: true,
          }
        }
      },
      orderBy: [
        { acceptingOrders: 'desc' }, // Show accepting orders first
        { name: 'asc' }
      ],
      take: limit,
    })

    // Filter by category if provided
    let filteredRestaurants = restaurants
    if (category) {
      filteredRestaurants = restaurants.filter(restaurant =>
        restaurant.categories.some(cat =>
          cat.name.toLowerCase().includes(category.toLowerCase())
        )
      )
    }

    // Format response for frontend
    const formattedRestaurants = filteredRestaurants.map(restaurant => ({
      id: restaurant.id,
      name: restaurant.name,
      slug: restaurant.slug,
      address: restaurant.address,
      deliveryFee: Number(restaurant.deliveryFee),
      minimumOrder: Number(restaurant.minimumOrder),
      deliveryRadiusKm: Number(restaurant.deliveryRadiusKm),
      acceptingOrders: restaurant.acceptingOrders,
      pickupEnabled: restaurant.pickupEnabled,
      openingHours: restaurant.openingHours,
      categories: restaurant.categories.map(category => ({
        id: category.id,
        name: category.name,
        products: category.products.map(product => ({
          id: product.id,
          name: product.name,
          basePrice: Number(product.basePrice)
        }))
      })),
      tenant: {
        name: restaurant.tenant.name,
        status: restaurant.tenant.status
      }
    }))

    return NextResponse.json(formattedRestaurants)
  } catch (error) {
    console.error('Discover restaurants error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
