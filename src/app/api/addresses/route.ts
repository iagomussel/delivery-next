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
    const customerId = searchParams.get('customerId')
    const me = searchParams.get('me') === 'true'

    let where: any = {}
    if (customerId) {
      where.customerId = customerId
    } else if (me) {
      const customer = await prisma.customer.findFirst({ where: { email: decoded.email, tenantId: decoded.tenantId } })
      if (!customer) return NextResponse.json([])
      where.customerId = customer.id
    } else {
      return NextResponse.json({ error: 'customerId or me=true required' }, { status: 400 })
    }

    const addresses = await prisma.address.findMany({ where, orderBy: { createdAt: 'desc' } })
    return NextResponse.json(addresses)
  } catch (err) {
    console.error('Addresses GET error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    const data = await request.json()
    let customerId = data.customerId as string | undefined
    if (!customerId) {
      const me = await prisma.customer.findFirst({ where: { email: decoded.email, tenantId: decoded.tenantId } })
      if (!me) return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
      customerId = me.id
    }

    const created = await prisma.address.create({
      data: {
        customerId,
        label: data.label || 'Endereço',
        street: data.street,
        number: data.number,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        zip: data.zip,
        notes: data.notes,
      },
    })
    return NextResponse.json(created, { status: 201 })
  } catch (err) {
    console.error('Addresses POST error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

