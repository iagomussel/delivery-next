import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const tenants = await prisma.tenant.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(tenants)
  } catch (err) {
    console.error('Admin tenants GET error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await request.json()
    const { name, slug, timezone = 'America/Sao_Paulo', plan = 'basic', status = 'ACTIVE' } = body
    if (!name || !slug) return NextResponse.json({ error: 'name and slug required' }, { status: 400 })

    const created = await prisma.tenant.create({ data: { name, slug, timezone, plan, status } })
    return NextResponse.json(created, { status: 201 })
  } catch (err: any) {
    console.error('Admin tenants POST error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

