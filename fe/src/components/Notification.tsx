import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { api } from '../utils/api'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  isRead: boolean
  createdAt: string
}

const getSampleNotifications = (userRole: string): Notification[] => {
  switch (userRole?.toUpperCase()) {
    case 'DOCTOR':
      return [
        {
          id: '1',
          type: 'APPOINTMENT',
          title: 'New Appointment Request',
          message: 'You have a new appointment request from Bryan P. Hutagalung',
          isRead: false,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          type: 'CHAT',
          title: 'New Message',
          message: 'You have a new message from a patient',
          isRead: true,
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ]
    case 'PATIENT':
      return [
        {
          id: '1',
          type: 'PRESCRIPTION',
          title: 'Prescription Ready',
          message: 'Your prescription is ready for pickup',
          isRead: false,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          type: 'APPOINTMENT',
          title: 'Appointment Reminder',
          message: 'Your appointment with Dr. Kasyfil is tomorrow',
          isRead: true,
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ]
    case 'PHARMACIST':
      return [
        {
          id: '1',
          type: 'PRESCRIPTION',
          title: 'New Prescription',
          message: 'New prescription needs to be processed',
          isRead: false,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          type: 'CHAT',
          title: 'New Message',
          message: 'You have a new message from Dr. Kasyfil',
          isRead: true,
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ]
    default:
      return []
  }
}

export default function NotificationComponent() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    const sampleNotifs = getSampleNotifications(user.role)
    setNotifications(sampleNotifs)

    const fetchNotifications = async () => {
      if (!user?.id || !localStorage.getItem('token')) {
        return 
      }
      
      setLoading(true)
      try {
        const { data } = await api.notifications.getAll()
        
        if (data && data.length > 0) {
          setNotifications(data)
        }
      } catch (err) {
        console.error('Notification error:', err)
      } finally {
        setLoading(false)
      }
    }

    if (user?.id && localStorage.getItem('token')) {
      fetchNotifications()
    }
  }, [user?.id, user?.role])

  const handleMarkAsRead = async (id: string) => {
    try {
      const { error } = await api.notifications.markAsRead(id)
      if (error) throw new Error(error)

      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      )
    } catch (error) {
      console.error('Mark as read error:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const { error } = await api.notifications.markAllAsRead()
      if (error) throw new Error(error)

      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true }))
      )
    } catch (error) {
      console.error('Mark all as read error:', error)
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-white hover:text-[#0EA5E9] transition-colors"
      >
        <Bell className="h-5 w-5" />
        <span>Notifications</span>
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-lg bg-white shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
            {loading ? (
              <p className="p-4 text-center text-gray-500">Loading notifications...</p>
            ) : notifications.length === 0 ? (
              <p className="p-4 text-center text-gray-500">No notifications</p>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 ${!notification.isRead ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex justify-between">
                    <h4 className="font-medium text-gray-900">{notification.title}</h4>
                    {!notification.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                  <p className="mt-1 text-xs text-gray-400">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}