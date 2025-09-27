import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    const { optionGroupIds } = await request.json() as { optionGroupIds: string[] }
    if (!Array.isArray(optionGroupIds)) {
      return NextResponse.json({ error: 'optionGroupIds must be an array' }, { status: 400 })
    }

    // Validate product belongs to tenant via restaurant
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { restaurant: true },
    })
    if (!product || product.restaurant.tenantId !== decoded.tenantId) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Remove existing relations then add the provided ones (simple replace strategy)
    await prisma.productOptionGroup.deleteMany({ where: { productId: params.id } })
    if (optionGroupIds.length) {
      await prisma.productOptionGroup.createMany({
        data: optionGroupIds.map((ogId, idx) => ({ productId: params.id, optionGroupId: ogId, order: idx })),
        skipDuplicates: true,
      })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Assign product option groups error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

