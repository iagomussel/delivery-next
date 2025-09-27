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

    const address = await prisma.address.findUnique({ where: { id: params.id }, include: { customer: true } })
    if (!address) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (address.customer.tenantId !== decoded.tenantId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    return NextResponse.json(address)
  } catch (err) {
    console.error('Address GET error:', err)
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

    const data = await request.json()
    const updated = await prisma.address.update({
      where: { id: params.id },
      data: {
        label: data.label,
        street: data.street,
        number: data.number,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        zip: data.zip,
        notes: data.notes,
      },
    })
    return NextResponse.json(updated)
  } catch (err) {
    console.error('Address PATCH error:', err)
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

    await prisma.address.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Address DELETE error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
