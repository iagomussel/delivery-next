import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest, context: any) {
  const params = context?.params as { id: string }
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    const customer = await prisma.customer.findUnique({
      where: { id: params.id },
      include: { addresses: true, orders: { take: 5, orderBy: { createdAt: 'desc' } } },
    })
    if (!customer || customer.tenantId !== decoded.tenantId) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(customer)
  } catch (err) {
    console.error('Customer GET error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, context: any) {
  const params = context?.params as { id: string }
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    const { name, phone, email } = await request.json()
    const updated = await prisma.customer.update({
      where: { id: params.id },
      data: { name, phone, email },
    })
    return NextResponse.json(updated)
  } catch (err) {
    console.error('Customer PATCH error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, context: any) {
  const params = context?.params as { id: string }
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    await prisma.customer.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Customer DELETE error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
