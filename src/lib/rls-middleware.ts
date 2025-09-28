import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, JWTPayload } from '@/lib/auth'
import { prismaWithRLS } from '@/lib/db-context'

// Middleware to extract and verify JWT token
export function extractTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.replace('Bearer ', '')
}

// Middleware to verify token and extract user context
export function verifyUserContext(token: string): JWTPayload | null {
  return verifyToken(token)
}

// Higher-order function to wrap API route handlers with RLS context
export function withRLS<T extends any[], R>(
  handler: (request: NextRequest, prisma: typeof prismaWithRLS, user: JWTPayload, ...args: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    try {
      // Extract and verify token
      const token = extractTokenFromRequest(request)
      if (!token) {
        return NextResponse.json({ error: 'No token provided' }, { status: 401 })
      }

      const user = verifyUserContext(token)
      if (!user) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
      }

      // Set RLS context
      await prismaWithRLS.setUserContext(user.tenantId, user.userId, user.role)

      // Call the handler with the scoped Prisma client
      const response = await handler(request, prismaWithRLS, user, ...args)

      return response
    } catch (error) {
      console.error('RLS middleware error:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    } finally {
      // Clear context after request
      await prismaWithRLS.clearUserContext()
    }
  }
}

// Helper for public endpoints that don't require authentication
export function withPublicRLS<T extends any[], R>(
  handler: (request: NextRequest, prisma: typeof prismaWithRLS, ...args: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    try {
      // Clear any existing context for public endpoints
      await prismaWithRLS.clearUserContext()
      
      // Call the handler
      const response = await handler(request, prismaWithRLS, ...args)

      return response
    } catch (error) {
      console.error('Public RLS middleware error:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }
}

// Helper for admin-only endpoints
export function withAdminRLS<T extends any[], R>(
  handler: (request: NextRequest, prisma: typeof prismaWithRLS, user: JWTPayload, ...args: T) => Promise<NextResponse>
) {
  return withRLS(async (request, prisma, user, ...args) => {
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }
    
    return handler(request, prisma, user, ...args)
  })
}

// Helper for restaurant user endpoints (OWNER, STAFF)
export function withRestaurantRLS<T extends any[], R>(
  handler: (request: NextRequest, prisma: typeof prismaWithRLS, user: JWTPayload, ...args: T) => Promise<NextResponse>
) {
  return withRLS(async (request, prisma, user, ...args) => {
    if (!['OWNER', 'STAFF', 'ADMIN'].includes(user.role)) {
      return NextResponse.json({ error: 'Restaurant access required' }, { status: 403 })
    }
    
    return handler(request, prisma, user, ...args)
  })
}

// Helper for customer endpoints
export function withCustomerRLS<T extends any[], R>(
  handler: (request: NextRequest, prisma: typeof prismaWithRLS, user: JWTPayload, ...args: T) => Promise<NextResponse>
) {
  return withRLS(async (request, prisma, user, ...args) => {
    if (user.role !== 'CUSTOMER') {
      return NextResponse.json({ error: 'Customer access required' }, { status: 403 })
    }
    
    return handler(request, prisma, user, ...args)
  })
}

// Helper for affiliate endpoints
export function withAffiliateRLS<T extends any[], R>(
  handler: (request: NextRequest, prisma: typeof prismaWithRLS, user: JWTPayload, ...args: T) => Promise<NextResponse>
) {
  return withRLS(async (request, prisma, user, ...args) => {
    if (user.role !== 'AFFILIATE') {
      return NextResponse.json({ error: 'Affiliate access required' }, { status: 403 })
    }
    
    return handler(request, prisma, user, ...args)
  })
}
