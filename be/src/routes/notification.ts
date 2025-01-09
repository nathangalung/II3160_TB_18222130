import { Hono } from 'hono'
import { authMiddleware } from '../middlewares/auth'
import { prisma } from '../libs/prisma'

const notificationRoutes = new Hono()
notificationRoutes.use('/*', authMiddleware)

// Get all notifications
notificationRoutes.get('/', async (c) => {
  try {
    const user = c.get('user')

    const notifications = await prisma.notification.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return c.json(notifications)
  } catch (error) {
    console.error('Failed to fetch notifications:', error)
    return c.json({ error: 'Failed to fetch notifications' }, 500)
  }
})

// Mark notification as read
notificationRoutes.patch('/:id/read', async (c) => {
  try {
    const user = c.get('user')
    const id = c.req.param('id')
    
    const notification = await prisma.notification.updateMany({
      where: {
        id,
        userId: user.id
      },
      data: {
        isRead: true
      }
    })

    return c.json({ success: true })
  } catch (error) {
    console.error('Failed to mark notification as read:', error)
    return c.json({ error: 'Failed to mark notification as read' }, 500)
  }
})

// Mark all notifications as read
notificationRoutes.patch('/read-all', async (c) => {
  try {
    const user = c.get('user')
    
    await prisma.notification.updateMany({
      where: {
        userId: user.id,
        isRead: false
      },
      data: {
        isRead: true
      }
    })

    return c.json({ success: true })
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error)
    return c.json({ error: 'Failed to mark all notifications as read' }, 500)
  }
})

export { notificationRoutes }