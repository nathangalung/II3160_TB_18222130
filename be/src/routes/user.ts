import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { supabase } from '../libs/supabase'
import { generateToken, hashPassword, comparePasswords } from '../utils/auth'
import { authMiddleware } from '../middlewares/auth'
import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const userRoutes = new Hono()

const registerSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['PATIENT', 'DOCTOR', 'PHARMACIST'])
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

const updateProfileSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional()
})

userRoutes.post('/register', zValidator('json', registerSchema), async (c) => {
  try {
    const data = await c.req.json()
    
    // Validate password
    if (data.password.length < 6) {
      return c.json({ 
        error: 'Password must be at least 6 characters long' 
      }, 400)
    }

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email: data.email }
    })

    if (existingEmail) {
      return c.json({ error: 'Email already registered' }, 400)
    }

    // Check if name already exists
    const existingName = await prisma.user.findFirst({
      where: { name: data.name }
    })

    if (existingName) {
      return c.json({ error: 'Name already taken' }, 400)
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password)

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
        imageUrl: null
      }
    })

    return c.json({ 
      message: 'Registration successful! Please login to continue.'
    }, 201)

  } catch (error) {
    console.error('Registration error:', error)
    return c.json({ 
      error: 'Registration failed',
      details: error.message 
    }, 500)
  }
})

userRoutes.post('/login', zValidator('json', loginSchema), async (c) => {
  try {
    const { email, password } = await c.req.json()

    // Check email first
    const user = await prisma.user.findUnique({
      where: { email: email.trim() }
    }).catch(error => {
      console.error('Database connection error:', error)
      throw new Error('Database connection failed')
    })

    if (!user) {
      return c.json({ error: 'Email not registered' }, 401)
    }

    // Then check password
    const validPassword = await comparePasswords(password, user.password)
    if (!validPassword) {
      return c.json({ error: 'Incorrect password' }, 401) 
    }

    const token = generateToken(user.id)

    return c.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    })

  } catch (error) {
    console.error('Login error:', error)
    return c.json({ 
      error: error.message || 'Failed to authenticate'
    }, 500)
  }
})

userRoutes.get('/profile', authMiddleware, async (c) => {
  try {
    const user = c.get('user')
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        imageUrl: true,
        doctorAppointments: user.role === 'DOCTOR',
        patientAppointments: user.role === 'PATIENT',
        prescriptions: user.role === 'PATIENT',
        writtenPrescriptions: user.role === 'DOCTOR'
      }
    })

    return c.json({ user: userData })
  } catch (error) {
    return c.json({ error: 'Failed to fetch profile' }, 500)
  }
})

userRoutes.get('/notifications', authMiddleware, async (c) => {
  try {
    const user = c.get('user')
    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    })
    return c.json(notifications)
  } catch (error) {
    return c.json({ error: 'Failed to fetch notifications' }, 500)
  }
})

userRoutes.get('/chat', authMiddleware, async (c) => {
  try {
    const user = c.get('user')
    let conversations = []

    switch (user.role) {
      case 'PATIENT':
        conversations = await prisma.conversation.findMany({
          where: {
            participants: {
              some: {
                userId: user.id,
                user: { role: 'DOCTOR' }
              }
            }
          },
          include: {
            participants: {
              include: { user: true }
            },
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1
            }
          }
        })
        break

      case 'DOCTOR':
        conversations = await prisma.conversation.findMany({
          where: {
            participants: {
              some: {
                userId: user.id,
                user: { role: 'PATIENT' }
              }
            }
          },
          include: {
            participants: {
              include: { user: true }
            },
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1
            }
          }
        })
        break

      case 'PHARMACIST':
        conversations = await prisma.conversation.findMany({
          where: {
            participants: {
              some: {
                userId: user.id
              }
            }
          },
          include: {
            participants: {
              include: { user: true }
            },
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1
            }
          }
        })
        break
    }

    return c.json({ conversations })
  } catch (error) {
    return c.json({ error: 'Failed to fetch conversations' }, 500)
  }
})

userRoutes.patch('/profile', authMiddleware, zValidator('json', updateProfileSchema), async (c) => {
  try {
    const user = c.get('user')
    const data = await c.req.json()
    
    // Check email uniqueness if changing email
    if (data.email) {
      const { data: existingUser } = await supabase
        .from('user')
        .select('id')
        .eq('email', data.email)
        .neq('id', user.id)
        .single()

      if (existingUser) {
        return c.json({ error: 'Email already exists' }, 400)
      }
    }

    // Hash password if provided
    const updates: any = { ...data }
    if (data.password) {
      updates.password = await hashPassword(data.password)
    }

    // Update user
    const { data: updatedUser, error } = await supabase
      .from('user')
      .update(updates)
      .eq('id', user.id)
      .select('id, name, email, role')
      .single()

    if (error) throw error

    return c.json({ user: updatedUser })
  } catch (error) {
    return c.json({ error: 'Failed to update profile' }, 500)
  }
})

export { userRoutes }