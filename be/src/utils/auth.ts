import { sign, verify, JwtPayload } from 'jsonwebtoken'
import { hash, compare } from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

interface JwtCustomPayload {
  userId: string;
}

export const generateToken = (userId: string) => {
  return sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}

export const verifyToken = (token: string): string | null => {
  try {
    const decoded = verify(token, JWT_SECRET) as JwtCustomPayload
    return decoded.userId
  } catch {
    return null
  }
}

export const hashPassword = async (password: string) => {
  return hash(password, 10)
}

export const comparePasswords = async (password: string, hashedPassword: string) => {
  return compare(password, hashedPassword)
}