import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    const conversions = await prisma.affiliateConversion.findMany({
      where: {
        affiliate: { id, tenantId: decoded.tenantId },
      },
      orderBy: { createdAt: 'desc' },
    })

    const data = conversions.map(c => ({ ...c, commissionEstimated: Number(c.commissionEstimated) }))
    return NextResponse.json(data)
  } catch (err) {
    console.error('Conversions GET error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    if (decoded.role !== 'OWNER' && decoded.role !== 'ADMIN' && decoded.role !== 'STAFF') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    const { orderId, commissionEstimated, status = 'pending' } = body
    if (!orderId) return NextResponse.json({ error: 'orderId required' }, { status: 400 })

    const created = await prisma.affiliateConversion.create({
      data: {
        affiliateId: id,
        orderId,
        commissionEstimated: Number(commissionEstimated ?? 0),
        status,
      },
    })
    return NextResponse.json({ ...created, commissionEstimated: Number(created.commissionEstimated) }, { status: 201 })
  } catch (err) {
    console.error('Conversions POST error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

