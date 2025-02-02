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

// Add CORS middleware
app.use('/*', cors({
  origin: ['https://medico-tst-fe.vercel.app', 'http://localhost:5173'],
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowHeaders: ['Origin', 'Content-Type', 'Accept', 'Authorization'],
  exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
  maxAge: 600,
}))

// Your existing routes
app.route('/api/users', userRoutes)
app.route('/api/appointments', appointmentRoutes)
app.route('/api/prescriptions', prescriptionRoutes)
app.route('/api/chat', chatRoutes)
app.route('/api/notifications', notificationRoutes)

export default {
  port: PORT,
  fetch: app.fetch
}