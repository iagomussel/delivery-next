import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    const customers = await prisma.customer.findMany({
      where: { tenantId: decoded.tenantId },
      include: { _count: { select: { orders: true, addresses: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(customers)
  } catch (err) {
    console.error('Customers GET error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    const { name, phone, email } = await request.json()
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 })

    const created = await prisma.customer.create({
      data: { tenantId: decoded.tenantId, name, phone, email },
    })
    return NextResponse.json(created, { status: 201 })
  } catch (err) {
    console.error('Customers POST error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

