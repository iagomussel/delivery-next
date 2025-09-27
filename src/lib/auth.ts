import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
// Enums are now strings in the schema
type UserRole = 'OWNER' | 'STAFF' | 'AFFILIATE' | 'ADMIN' | 'CUSTOMER'

export interface JWTPayload {
  userId: string
  tenantId: string
  role: string
  email: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload
  } catch {
    return null
  }
}

export function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    CUSTOMER: 0,
    AFFILIATE: 1,
    STAFF: 2,
    OWNER: 3,
    ADMIN: 4,
  }
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}
