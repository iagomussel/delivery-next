import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
// Enums are now strings in the schema
type UserRole = 'OWNER' | 'STAFF' | 'AFFILIATE' | 'ADMIN' | 'CUSTOMER'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true, active: true, tenantId: true }
    })
    if (!user || user.tenantId !== decoded.tenantId) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role, active: user.active })
  } catch (err) {
    console.error('Employee GET error:', err)
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
    if (decoded.role !== 'OWNER' && decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { name, role, active } = await request.json()
    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(typeof name === 'string' ? { name } : {}),
        ...(typeof role === 'string' ? { role: role.toUpperCase() as UserRole } : {}),
        ...(typeof active === 'boolean' ? { active } : {}),
      },
      select: { id: true, name: true, email: true, role: true, active: true }
    })
    return NextResponse.json(updated)
  } catch (err) {
    console.error('Employee PATCH error:', err)
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
    if (decoded.role !== 'OWNER' && decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    await prisma.user.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Employee DELETE error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

