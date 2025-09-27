import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
// Enums are now strings in the schema
type UserRole = 'OWNER' | 'STAFF' | 'AFFILIATE' | 'ADMIN' | 'CUSTOMER'
type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELED'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const tenantId = request.headers.get('x-tenant-id')
    const userRole = request.headers.get('x-user-role') as UserRole

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant ID required' },
        { status: 400 }
      )
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        restaurant: true,
        orderItems: {
          include: {
            product: true,
            orderItemOptions: {
              include: {
                option: true,
              },
            },
          },
        },
        orderEvents: {
          orderBy: { ts: 'desc' },
        },
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Check permissions
    if (userRole === 'CUSTOMER') {
      const customerId = request.headers.get('x-customer-id')
      if (order.customerId !== customerId) {
        return NextResponse.json(
          { error: 'Access denied' },
          { status: 403 }
        )
      }
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Get order error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const tenantId = request.headers.get('x-tenant-id')
    const userRole = request.headers.get('x-user-role') as UserRole
    const userId = request.headers.get('x-user-id')

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant ID required' },
        { status: 400 }
      )
    }

    if (userRole !== 'OWNER' && userRole !== 'STAFF' && userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const data = await request.json()
    const { status, notes } = data

    // Get current order
    const currentOrder = await prisma.order.findUnique({
      where: { id },
    })

    if (!currentOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Validate status transition
    const validTransitions: Record<string, string[]> = {
      'PENDING': ['CONFIRMED', 'CANCELED'],
      'CONFIRMED': ['PREPARING', 'CANCELED'],
      'PREPARING': ['OUT_FOR_DELIVERY', 'CANCELED'],
      'OUT_FOR_DELIVERY': ['DELIVERED'],
      'DELIVERED': [],
      'CANCELED': [],
    }

    if (!validTransitions[currentOrder.status].includes(status)) {
      return NextResponse.json(
        { error: `Invalid status transition from ${currentOrder.status} to ${status}` },
        { status: 400 }
      )
    }

    // Update order
    const order = await prisma.order.update({
      where: { id },
      data: {
        status: status,
      },
    })

    // Create order event
    await prisma.orderEvent.create({
      data: {
        orderId: id,
        actorUserId: userId,
        fromStatus: currentOrder.status,
        toStatus: status,
        notes,
      },
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error('Update order error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
