import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    const affiliates = await prisma.affiliate.findMany({
      where: { tenantId: decoded.tenantId },
      orderBy: { createdAt: 'desc' },
    })

    const data = affiliates.map(a => ({
      ...a,
      commissionRate: Number(a.commissionRate),
    }))
    return NextResponse.json(data)
  } catch (err) {
    console.error('Affiliates GET error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    if (decoded.role !== 'OWNER' && decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    const {
      code,
      utmSource,
      utmMedium,
      utmCampaign,
      payoutModel = 'percent',
      commissionRate = 0.1,
      userId,
      active = true,
    } = body

    if (!code || typeof code !== 'string') return NextResponse.json({ error: 'code is required' }, { status: 400 })

    const created = await prisma.affiliate.create({
      data: {
        tenantId: decoded.tenantId,
        code,
        utmSource,
        utmMedium,
        utmCampaign,
        payoutModel,
        commissionRate,
        userId,
        active,
      },
    })

    return NextResponse.json({ ...created, commissionRate: Number(created.commissionRate) }, { status: 201 })
  } catch (err: any) {
    console.error('Affiliates POST error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

