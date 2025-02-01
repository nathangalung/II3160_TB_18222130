import { Hono } from 'hono'
import type { Context } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { supabase } from '../libs/supabase'
import { generateToken, hashPassword, comparePasswords } from '../utils/auth'
import { authMiddleware } from '../middlewares/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface Message {
  id: string;
  content: string;
  createdAt: Date;
  conversationId: string;
  senderId: string;
}

interface Participant {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    imageUrl?: string;
  };
}

interface Conversation {
  id: string;
  messages: Message[];
  participants: Participant[];
  lastMessage?: string;
  updatedAt?: Date;
  createdAt: Date;
}

interface ApiError extends Error {
  message: string;
}

type UserRole = 'DOCTOR' | 'PATIENT' | 'PHARMACIST';

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
    
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    })

    if (existingUser) {
      return c.json({ error: 'Email already registered' }, 400)
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password)

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role as UserRole,
        imageUrl: null
      }
    })

    return c.json({ 
      message: 'Registration successful! Please login to continue.'
    }, 201)

  } catch (err) {
    const error = err as ApiError
    return c.json({ 
      error: 'Registration failed',
      details: error.message 
    }, 500)
  }
})

userRoutes.post('/login', zValidator('json', loginSchema), async (c) => {
  try {
    const { email, password } = await c.req.json()

    const user = await prisma.user.findUnique({
      where: { email: email.trim() }
    })

    if (!user) {
      return c.json({ error: 'Email not registered' }, 401)
    }

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
        role: user.role,
        imageUrl: user.imageUrl
      },
      token
    })

  } catch (err) {
    const error = err as ApiError
    return c.json({ 
      error: error.message || 'Failed to authenticate'
    }, 500)
  }
})

userRoutes.get('/chat', authMiddleware, async (c) => {
  try {
    const user = c.get('user')
    let conversations: Conversation[] = []

    switch (user.role) {
      case 'PATIENT':
        const patientConversations = await prisma.conversation.findMany({
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

        conversations = patientConversations.map(conv => ({
          id: conv.id,
          messages: conv.messages,
          participants: conv.participants.map(p => ({
            user: {
              id: p.user.id,
              name: p.user.name,
              email: p.user.email,
              role: p.user.role,
              imageUrl: p.user.imageUrl || undefined
            }
          })),
          lastMessage: conv.lastMessage || undefined,
          updatedAt: conv.updatedAt,
          createdAt: conv.createdAt
        }));
        break;

      case 'DOCTOR':
        const doctorConversations = await prisma.conversation.findMany({
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

        conversations = doctorConversations.map(conv => ({
          id: conv.id,
          messages: conv.messages,
          participants: conv.participants.map(p => ({
            user: {
              id: p.user.id,
              name: p.user.name,
              email: p.user.email,
              role: p.user.role,
              imageUrl: p.user.imageUrl || undefined
            }
          })),
          lastMessage: conv.lastMessage || undefined,
          updatedAt: conv.updatedAt,
          createdAt: conv.createdAt
        }));
        break;

      case 'PHARMACIST':
        const pharmacistConversations = await prisma.conversation.findMany({
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

        conversations = pharmacistConversations.map(conv => ({
          id: conv.id,
          messages: conv.messages,
          participants: conv.participants.map(p => ({
            user: {
              id: p.user.id,
              name: p.user.name,
              email: p.user.email,
              role: p.user.role,
              imageUrl: p.user.imageUrl || undefined
            }
          })),
          lastMessage: conv.lastMessage || undefined,
          updatedAt: conv.updatedAt,
          createdAt: conv.createdAt
        }));
        break;
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
    
    // Hash password if provided
    const updates: any = { ...data }
    if (data.password) {
      updates.password = await hashPassword(data.password)
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updates,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        imageUrl: true
      }
    })

    return c.json({ user: updatedUser })
  } catch (error) {
    return c.json({ error: 'Failed to update profile' }, 500)
  }
})

export { userRoutes }