import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: params.id },
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
  } catch (error) {
    console.error('Get restaurant error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tenantId = request.headers.get('x-tenant-id')
    const userRole = request.headers.get('x-user-role') as UserRole

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant ID required' },
        { status: 400 }
      )
    }

    if (userRole !== UserRole.OWNER && userRole !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const data = await request.json()
    const { name, address, geo, deliveryRadiusKm, openingHours, acceptingOrders } = data

    const restaurant = await prisma.restaurant.update({
      where: { id: params.id },
      data: {
        name,
        address,
        geo,
        deliveryRadiusKm,
        openingHours,
        acceptingOrders,
      },
    })

    return NextResponse.json(restaurant)
  } catch (error) {
    console.error('Update restaurant error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tenantId = request.headers.get('x-tenant-id')
    const userRole = request.headers.get('x-user-role') as UserRole

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant ID required' },
        { status: 400 }
      )
    }

    if (userRole !== UserRole.OWNER && userRole !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    await prisma.restaurant.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete restaurant error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
