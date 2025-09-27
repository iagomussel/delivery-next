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
    const groupId = searchParams.get('optionGroupId')
    if (!groupId) return NextResponse.json({ error: 'optionGroupId required' }, { status: 400 })

    const options = await prisma.option.findMany({
      where: { optionGroupId: groupId },
      orderBy: { name: 'asc' },
    })
    return NextResponse.json(options)
  } catch (err) {
    console.error('Options GET error:', err)
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
    const { optionGroupId, name, priceDelta, active, maxQuantityPerItem, stock } = body
    if (!optionGroupId || !name) {
      return NextResponse.json({ error: 'optionGroupId and name are required' }, { status: 400 })
    }
    const opt = await prisma.option.create({
      data: {
        optionGroupId,
        name,
        priceDelta: priceDelta ?? 0,
        active: active ?? true,
        maxQuantityPerItem,
        stock,
      },
    })
    return NextResponse.json(opt, { status: 201 })
  } catch (err) {
    console.error('Options POST error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

