import { hasPermission as baseHasPermission, JWTPayload } from '@/lib/auth'

export type UserRole = 'OWNER' | 'STAFF' | 'AFFILIATE' | 'ADMIN' | 'CUSTOMER'

export function hasPermission(user: JWTPayload, required: UserRole) {
  return baseHasPermission(user.role as UserRole, required)
}

export function requireRole(user: JWTPayload | null, role: UserRole) {
  if (!user || !hasPermission(user, role)) {
    const err = new Error('Insufficient permissions')
    ;(err as any).status = 403
    throw err
  }
}

