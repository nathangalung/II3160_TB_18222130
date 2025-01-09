import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { userRoutes } from './src/routes/user'
import { appointmentRoutes } from './src/routes/appointment'
import { prescriptionRoutes } from './src/routes/prescription'
import { chatRoutes } from './src/routes/chat'
import { notificationRoutes } from './src/routes/notification'
import { logger } from 'hono/logger'

const app = new Hono()

// Middlewares
app.use('/*', cors())
app.use(logger())

// Routes
app.route('/api/users', userRoutes)
app.route('/api/appointments', appointmentRoutes)
app.route('/api/prescriptions', prescriptionRoutes)
app.route('/api/chat', chatRoutes)
app.route('/api/notifications', notificationRoutes)

// Health check
app.get('/', (c) => {
  return c.json({ status: 'ok', message: 'Welcome to Medico API' })
})

export default app