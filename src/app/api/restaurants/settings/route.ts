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

    // Get user's restaurant
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        tenant: {
          include: {
            restaurants: true
          }
        }
      }
    })

    if (!user || !user.tenant.restaurants[0]) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })
    }

    const restaurant = user.tenant.restaurants[0]

    // Format response
    const settings = {
      name: restaurant.name,
      description: '', // Add description field to schema if needed
      phone: '', // Add phone field to schema if needed
      email: '', // Add email field to schema if needed
      website: '', // Add website field to schema if needed
      address: restaurant.address,
      openingHours: restaurant.openingHours,
      deliveryFee: Number(restaurant.deliveryFee),
      minimumOrder: Number(restaurant.minimumOrder),
      deliveryRadiusKm: Number(restaurant.deliveryRadiusKm),
      pickupEnabled: restaurant.pickupEnabled,
      acceptingOrders: restaurant.acceptingOrders,
      emailNotifications: true, // Add to schema if needed
      smsNotifications: false, // Add to schema if needed
      orderNotifications: true, // Add to schema if needed
      theme: 'light', // Add to schema if needed
      language: 'pt-BR' // Add to schema if needed
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Settings GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const data = await request.json()

    // Get user's restaurant
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        tenant: {
          include: {
            restaurants: true
          }
        }
      }
    })

    if (!user || !user.tenant.restaurants[0]) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })
    }

    const restaurantId = user.tenant.restaurants[0].id

    // Update restaurant settings
    const updatedRestaurant = await prisma.restaurant.update({
      where: { id: restaurantId },
      data: {
        name: data.name,
        address: data.address,
        openingHours: data.openingHours,
        deliveryFee: data.deliveryFee,
        minimumOrder: data.minimumOrder,
        deliveryRadiusKm: data.deliveryRadiusKm,
        pickupEnabled: data.pickupEnabled,
        acceptingOrders: data.acceptingOrders,
      }
    })

    return NextResponse.json({ success: true, restaurant: updatedRestaurant })
  } catch (error) {
    console.error('Settings PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
