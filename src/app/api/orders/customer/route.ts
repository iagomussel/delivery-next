import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
// Enums are now strings in the schema
type FulfillmentType = 'DELIVERY' | 'PICKUP'
type PaymentMethod = 'CASH' | 'PIX' | 'DEBIT' | 'CREDIT' | 'VOUCHER' | 'OTHER'

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

    if (decoded.role !== 'CUSTOMER') {
      return NextResponse.json({ error: 'Only customers can create orders' }, { status: 403 })
    }

    const data = await request.json()
    const {
      restaurantId,
      fulfillment,
      paymentMethod,
      items,
      notes,
      customerInfo,
      deliveryAddress,
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

    // Get or create customer
    let customer = await prisma.customer.findFirst({
      where: { 
        email: customerInfo.email,
        tenantId: restaurant.tenantId
      }
    })

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          tenantId: restaurant.tenantId,
          name: customerInfo.name,
          phone: customerInfo.phone,
          email: customerInfo.email,
        }
      })
    }

    // Create address if delivery
    if (fulfillment === 'DELIVERY' && deliveryAddress) {
      await prisma.address.create({
        data: {
          customerId: customer.id,
          label: 'Delivery Address',
          street: deliveryAddress.street,
          number: deliveryAddress.number,
          neighborhood: deliveryAddress.neighborhood,
          city: deliveryAddress.city,
          state: deliveryAddress.state,
          zip: deliveryAddress.zip,
          notes: deliveryAddress.notes,
        }
      })
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
      const itemOptions = []
      for (const selectedOption of item.options || []) {
        const option = product.productOptionGroups
          .flatMap(pog => pog.optionGroup.options)
          .find(opt => opt.id === selectedOption.optionId)

        if (option) {
          itemTotal += Number(option.priceDelta) * (selectedOption.quantity || 1)
          itemOptions.push({
            optionId: selectedOption.optionId,
            groupNameSnapshot: selectedOption.groupName || '',
            optionNameSnapshot: selectedOption.optionName || option.name,
            priceDeltaApplied: Number(option.priceDelta),
            quantity: selectedOption.quantity || 1,
          })
        }
      }

      subtotal += itemTotal * item.quantity
      orderItems.push({
        productId: item.productId,
        nameSnapshot: product.name,
        unitPrice: itemTotal,
        quantity: item.quantity,
        observations: item.observations || '',
        options: itemOptions,
      })
    }

    const deliveryFee = fulfillment === 'DELIVERY' ? Number(restaurant.deliveryFee) : 0
    const total = subtotal + deliveryFee

    // Check minimum order
    if (Number(restaurant.minimumOrder) > 0 && subtotal < Number(restaurant.minimumOrder)) {
      return NextResponse.json(
        { error: `Minimum order is R$ ${Number(restaurant.minimumOrder).toFixed(2)}` },
        { status: 400 }
      )
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        restaurantId,
        customerId: customer.id,
        fulfillment: fulfillment as FulfillmentType,
        paymentMethod: paymentMethod as PaymentMethod,
        subtotal,
        deliveryFee,
        total,
        notes: notes || '',
        orderItems: {
          create: orderItems.map(item => ({
            productId: item.productId,
            nameSnapshot: item.nameSnapshot,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            observations: item.observations,
            orderItemOptions: {
              create: item.options,
            },
          })),
        },
        orderEvents: {
          create: {
            toStatus: 'PENDING',
            notes: 'Order created by customer',
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

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        status: order.status,
        total: Number(order.total),
        restaurant: {
          name: order.restaurant.name,
        },
        customer: {
          name: order.customer.name,
          phone: order.customer.phone,
        },
        createdAt: order.createdAt.toISOString(),
      }
    })
  } catch (error) {
    console.error('Create customer order error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

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

    if (decoded.role !== 'CUSTOMER') {
      return NextResponse.json({ error: 'Only customers can view their orders' }, { status: 403 })
    }

    // Get customer's orders
    const customer = await prisma.customer.findFirst({
      where: { 
        email: decoded.email 
      }
    })

    if (!customer) {
      return NextResponse.json([])
    }

    const orders = await prisma.order.findMany({
      where: { customerId: customer.id },
      include: {
        restaurant: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const formattedOrders = orders.map(order => ({
      id: order.id,
      restaurantName: order.restaurant.name,
      status: order.status.toLowerCase(),
      total: Number(order.total),
      itemCount: order.orderItems.reduce((sum, item) => sum + item.quantity, 0),
      createdAt: order.createdAt.toISOString(),
    }))

    return NextResponse.json(formattedOrders)
  } catch (error) {
    console.error('Get customer orders error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
