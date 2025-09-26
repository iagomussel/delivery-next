import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UserRole, OrderStatus } from '@prisma/client'

export async function GET(
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

    const order = await prisma.order.findUnique({
      where: { id: params.id },
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
    if (userRole === UserRole.CUSTOMER) {
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
  { params }: { params: { id: string } }
) {
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

    if (userRole !== UserRole.OWNER && userRole !== UserRole.STAFF && userRole !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const data = await request.json()
    const { status, notes } = data

    // Get current order
    const currentOrder = await prisma.order.findUnique({
      where: { id: params.id },
    })

    if (!currentOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Validate status transition
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELED],
      [OrderStatus.CONFIRMED]: [OrderStatus.PREPARING, OrderStatus.CANCELED],
      [OrderStatus.PREPARING]: [OrderStatus.OUT_FOR_DELIVERY, OrderStatus.CANCELED],
      [OrderStatus.OUT_FOR_DELIVERY]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.CANCELED]: [],
    }

    if (!validTransitions[currentOrder.status].includes(status)) {
      return NextResponse.json(
        { error: `Invalid status transition from ${currentOrder.status} to ${status}` },
        { status: 400 }
      )
    }

    // Update order
    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        status: status as OrderStatus,
      },
    })

    // Create order event
    await prisma.orderEvent.create({
      data: {
        orderId: params.id,
        actorUserId: userId,
        fromStatus: currentOrder.status,
        toStatus: status as OrderStatus,
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
