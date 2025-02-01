import type { Context, Next } from 'hono'
import { prisma } from '../libs/prisma'
import { verifyToken } from '../utils/auth'

export const authMiddleware = async (c: Context, next: Next) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader) {
      return c.json({ error: 'No token provided' }, 401)
    }

    const token = authHeader.split(' ')[1]
    const userId = verifyToken(token)
    
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return c.json({ error: 'Invalid token' }, 401)
    }

    c.set('user', user)
    await next()
  } catch (error) {
    return c.json({ error: 'Invalid token' }, 401)
  }
}