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
    const restaurantId = searchParams.get('restaurantId')
    if (!restaurantId) return NextResponse.json({ error: 'restaurantId required' }, { status: 400 })

    const groups = await prisma.optionGroup.findMany({
      where: {
        restaurant: { tenantId: decoded.tenantId },
        restaurantId,
      },
      include: { options: true },
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(groups)
  } catch (err) {
    console.error('Option groups GET error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    const body = await request.json()
    const { restaurantId, name, description, required, minSelect, maxSelect, freeQuota, appliesToAll, order } = body
    if (!restaurantId || !name) {
      return NextResponse.json({ error: 'restaurantId and name are required' }, { status: 400 })
    }

    const group = await prisma.optionGroup.create({
      data: {
        restaurantId,
        name,
        description,
        required: !!required,
        minSelect: minSelect ?? 0,
        maxSelect: maxSelect ?? 1,
        freeQuota: freeQuota ?? 0,
        appliesToAll: !!appliesToAll,
        order: order ?? 0,
      },
    })
    return NextResponse.json(group, { status: 201 })
  } catch (err) {
    console.error('Option groups POST error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

