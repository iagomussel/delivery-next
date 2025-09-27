import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const option = await prisma.option.findUnique({ where: { id } })
    if (!option) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(option)
  } catch (err) {
    console.error('Option GET by id error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    const body = await request.json()
    const updated = await prisma.option.update({
      where: { id },
      data: {
        name: body.name,
        priceDelta: body.priceDelta,
        active: body.active,
        maxQuantityPerItem: body.maxQuantityPerItem,
        stock: body.stock,
      },
    })
    return NextResponse.json(updated)
  } catch (err) {
    console.error('Option PATCH error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    await prisma.option.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Option DELETE error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

