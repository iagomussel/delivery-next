import jwt from 'jsonwebtoken'

interface ResetTokenPayload {
  type: 'password_reset'
  userId: string
  email: string
}

export function generatePasswordResetToken(userId: string, email: string): string {
  const payload: ResetTokenPayload = { type: 'password_reset', userId, email }
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '15m' })
}

export function verifyPasswordResetToken(token: string): ResetTokenPayload | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as ResetTokenPayload
    if (decoded.type !== 'password_reset') return null
    return decoded
  } catch {
    return null
  }
}

