import { serve } from '@hono/node-server'
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

app.use('/*', cors({
  origin: [
    'http://localhost:5173',
    'https://medico-tst.vercel.app'
  ],
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'PATCH', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
  maxAge: 600,
}))

// API routes
app.route('/api/users', userRoutes)
app.route('/api/appointments', appointmentRoutes)
app.route('/api/prescriptions', prescriptionRoutes)
app.route('/api/chat', chatRoutes)
app.route('/api/notifications', notificationRoutes)

// Development server
if (process.env.NODE_ENV !== 'production') {
  const startServer = async () => {
    try {
      const server = serve({
        fetch: app.fetch,
        port: PORT
      })
      console.log(`Server is running on http://localhost:${PORT}`)
    } catch (error) {
      console.error('Failed to start server:', error)
      process.exit(1)
    }
  }
  startServer()
}

export default app