import { Hono } from 'hono'
import { prisma } from '../../index'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

const userRoutes = new Hono()

const createUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['PATIENT', 'DOCTOR', 'PHARMACIST'])
})

userRoutes.post('/', zValidator('json', createUserSchema), async (c) => {
  try {
    const data = await c.req.json()
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password, // In production, hash the password
        role: data.role
      }
    })
    return c.json({ user }, 201)
  } catch (error) {
    return c.json({ error: 'Failed to create user' }, 500)
  }
})

userRoutes.get('/', async (c) => {
  const users = await prisma.user.findMany()
  return c.json({ users })
})

export { userRoutes }