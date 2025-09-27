import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const affiliate = await prisma.affiliate.findUnique({ where: { id } })
    if (!affiliate) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ ...affiliate, commissionRate: Number(affiliate.commissionRate) })
  } catch (err) {
    console.error('Affiliate GET error:', err)
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
    if (decoded.role !== 'OWNER' && decoded.role !== 'ADMIN' && decoded.role !== 'STAFF') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    const updated = await prisma.affiliate.update({
      where: { id },
      data: {
        code: typeof body.code === 'string' ? body.code : undefined,
        utmSource: typeof body.utmSource === 'string' ? body.utmSource : undefined,
        utmMedium: typeof body.utmMedium === 'string' ? body.utmMedium : undefined,
        utmCampaign: typeof body.utmCampaign === 'string' ? body.utmCampaign : undefined,
        payoutModel: typeof body.payoutModel === 'string' ? body.payoutModel : undefined,
        commissionRate: typeof body.commissionRate === 'number' ? body.commissionRate : undefined,
        active: typeof body.active === 'boolean' ? body.active : undefined,
      },
    })
    return NextResponse.json({ ...updated, commissionRate: Number(updated.commissionRate) })
  } catch (err) {
    console.error('Affiliate PATCH error:', err)
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

    await prisma.affiliate.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Affiliate DELETE error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

