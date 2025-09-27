import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const startedAt = process.env.BOOT_TIME ? new Date(process.env.BOOT_TIME) : null
  try {
    await prisma.$queryRaw`SELECT 1 as ok` // lightweight check
    return NextResponse.json({ status: 'ok', db: 'ok', startedAt: startedAt?.toISOString() || null, ts: new Date().toISOString() })
  } catch {
    return NextResponse.json({ status: 'degraded', db: 'error', ts: new Date().toISOString() }, { status: 500 })
  }
}

