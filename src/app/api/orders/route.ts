import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
// Enums are now strings in the schema
type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELED'
type FulfillmentType = 'DELIVERY' | 'PICKUP'
type PaymentMethod = 'CASH' | 'PIX' | 'DEBIT' | 'CREDIT' | 'VOUCHER' | 'OTHER'

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
    const status = searchParams.get('status') as OrderStatus
    const restaurantId = searchParams.get('restaurantId')

    const whereClause: Record<string, unknown> = {
      restaurant: {
        tenantId: decoded.tenantId,
        ...(restaurantId && { id: restaurantId }),
      },
    }

    if (status) {
      whereClause.status = status
    }

    // Customers can only see their own orders
    if (decoded.role === 'CUSTOMER') {
      // For customers, we'd need to get customer ID from user
      // For now, we'll skip this since we're focusing on restaurant management
      return NextResponse.json({ error: 'Customer access not implemented' }, { status: 403 })
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
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
      orderBy: { createdAt: 'desc' },
    })

    // Format orders for frontend
    const formattedOrders = orders.map(order => ({
      id: order.id,
      customerName: order.customer.name,
      customerPhone: order.customer.phone || '',
      status: order.status.toLowerCase(),
      total: Number(order.total),
      items: order.orderItems.map(item => ({
        id: item.id,
        name: item.nameSnapshot,
        quantity: item.quantity,
        price: Number(item.unitPrice)
      })),
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString()
    }))

    return NextResponse.json(formattedOrders)
  } catch (error) {
    console.error('Get orders error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const {
      restaurantId,
      customerId,
      fulfillment,
      paymentMethod,
      items,
      notes,
      affiliateId,
      sourceUtm,
    } = data

    // Validate restaurant exists and is accepting orders
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    })

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      )
    }

    if (!restaurant.acceptingOrders) {
      return NextResponse.json(
        { error: 'Restaurant is not accepting orders' },
        { status: 400 }
      )
    }

    // Calculate totals
    let subtotal = 0
    const orderItems = []

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: {
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

      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 400 }
        )
      }

      let itemTotal = Number(product.basePrice)

      // Calculate option prices
      for (const selectedOption of item.options || []) {
        const option = product.productOptionGroups
          .flatMap(pog => pog.optionGroup.options)
          .find(opt => opt.id === selectedOption.optionId)

        if (option) {
          itemTotal += Number(option.priceDelta) * selectedOption.quantity
        }
      }

      subtotal += itemTotal * item.quantity
      orderItems.push({
        productId: item.productId,
        nameSnapshot: product.name,
        unitPrice: itemTotal,
        quantity: item.quantity,
        observations: item.observations,
        options: item.options || [],
      })
    }

    const deliveryFee = fulfillment === 'DELIVERY' ? Number(restaurant.deliveryFee) : 0
    const total = subtotal + deliveryFee

    // Create order
    const order = await prisma.order.create({
      data: {
        restaurantId,
        customerId,
        fulfillment: fulfillment as FulfillmentType,
        paymentMethod: paymentMethod as PaymentMethod,
        subtotal,
        deliveryFee,
        total,
        notes,
        affiliateId,
        sourceUtm,
        orderItems: {
          create: orderItems.map(item => ({
            productId: item.productId,
            nameSnapshot: item.nameSnapshot,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            observations: item.observations,
            orderItemOptions: {
              create: item.options.map((opt: Record<string, unknown>) => ({
                optionId: opt.optionId,
                groupNameSnapshot: opt.groupName,
                optionNameSnapshot: opt.optionName,
                priceDeltaApplied: opt.priceDelta,
                quantity: opt.quantity,
              })),
            },
          })),
        },
        orderEvents: {
          create: {
            toStatus: 'PENDING',
            notes: 'Order created',
          },
        },
      },
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
      },
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
