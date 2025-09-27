import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const days = Math.max(1, Math.min(90, Number(searchParams.get('days')) || 30))
    const since = new Date()
    since.setDate(since.getDate() - days)

    const orders = await prisma.order.findMany({
      where: { createdAt: { gte: since }, restaurant: { tenantId: decoded.tenantId } },
      select: { id: true },
    })
    const orderIds = orders.map((o) => o.id)

    if (orderIds.length === 0) return NextResponse.json([])

    const items = await prisma.orderItem.findMany({
      where: { orderId: { in: orderIds } },
      select: { productId: true, nameSnapshot: true, unitPrice: true, quantity: true },
    })

    const agg: Record<string, { productId: string; name: string; qty: number; revenue: number }> = {}
    for (const it of items) {
      const key = it.productId
      agg[key] ||= { productId: key, name: it.nameSnapshot, qty: 0, revenue: 0 }
      agg[key].qty += it.quantity
      agg[key].revenue += Number(it.unitPrice) * it.quantity
    }

    const result = Object.values(agg).sort((a, b) => b.revenue - a.revenue).slice(0, 20)
    return NextResponse.json(result)
  } catch (err) {
    console.error('Dashboard products GET error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

