import { verifyToken, JWTPayload } from '@/lib/auth'

export function getSessionFromAuthHeader(authHeader?: string | null): JWTPayload | null {
  const token = authHeader?.replace('Bearer ', '')
  if (!token) return null
  return verifyToken(token)
}

export function isSessionValid(session: JWTPayload | null): boolean {
  return !!session
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
}

// Placeholder: returns same token (no refresh logic implemented)
export async function refreshToken(currentToken: string): Promise<string> {
  return currentToken
}

