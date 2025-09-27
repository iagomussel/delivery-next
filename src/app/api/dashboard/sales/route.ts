import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    const daysParam = new URL(request.url).searchParams.get('days')
    const days = Math.max(1, Math.min(90, Number(daysParam) || 30))
    const since = new Date()
    since.setDate(since.getDate() - days)

    const orders = await prisma.order.findMany({
      where: { createdAt: { gte: since }, restaurant: { tenantId: decoded.tenantId } },
      select: { id: true, total: true, createdAt: true, status: true },
      orderBy: { createdAt: 'asc' },
    })

    const byDay: Record<string, { date: string; total: number; count: number }> = {}
    for (const o of orders) {
      const key = o.createdAt.toISOString().slice(0, 10)
      byDay[key] ||= { date: key, total: 0, count: 0 }
      byDay[key].total += Number(o.total)
      byDay[key].count += 1
    }

    const series = Object.values(byDay).sort((a, b) => a.date.localeCompare(b.date))
    return NextResponse.json(series)
  } catch (err) {
    console.error('Dashboard sales GET error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

