import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { PrismaClient } from '@prisma/client'
import { userRoutes } from './src/routes/user'
import { appointmentRoutes } from './src/routes/appointment'
import { prescriptionRoutes } from './src/routes/prescription'
import { chatRoutes } from './src/routes/chat'
import { notificationRoutes } from './src/routes/notification'

const app = new Hono()
export const prisma = new PrismaClient()

const PORT = parseInt(process.env.PORT || '3000')

// CORS configuration
app.use('/*', cors({
  origin: ['https://medico-tst-fe.vercel.app'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
  maxAge: 600,
}))

// Handle OPTIONS preflight requests
app.options('*', (c) => {
  c.header('Access-Control-Allow-Origin', 'https://medico-tst-fe.vercel.app')
  c.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH')
  c.header('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  c.header('Access-Control-Allow-Credentials', 'true')
  return c.text('OK', 200)
})

// API routes
app.route('/api/users', userRoutes)
app.route('/api/appointments', appointmentRoutes)
app.route('/api/prescriptions', prescriptionRoutes)
app.route('/api/chat', chatRoutes)
app.route('/api/notifications', notificationRoutes)

export default {
  port: PORT,
  fetch: app.fetch
}