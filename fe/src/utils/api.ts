const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://medico-tst-be.vercel.app/api'
  : 'http://localhost:3000/api'

interface ApiNotification {
  id: string
  type: string
  title: string
  message: string
  isRead: boolean
  createdAt: string
}

interface AppointmentCreate {
  date: string
  complaint: string
  medicalHistory: string
  doctorId: string
}

interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
}

async function makeRequest<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options?.headers,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong')
    }

    return data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

// API endpoints
export const api = {
  auth: {
    login: (credentials: { email: string; password: string }) =>
      makeRequest<{ token: string; user: any }>('/users/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    register: (userData: { name: string; email: string; password: string; role: string }) =>
      makeRequest<{ message: string }>('/users/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
  },

  notifications: {
    getAll: () => makeRequest<ApiNotification[]>('/notifications'),
    markAsRead: (id: string) => makeRequest(`/notifications/${id}/read`, { method: 'PATCH' }),
    markAllAsRead: () => makeRequest('/notifications/read-all', { method: 'PATCH' })
  },

  appointments: {
    create: (data: AppointmentCreate) => 
      makeRequest('/appointments', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    getAll: () => makeRequest('/appointments'),
    getById: (id: string) => makeRequest(`/appointments/${id}`),
    updateStatus: (id: string, status: string) => 
      makeRequest(`/appointments/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      })
  },

  chat: {
    getConversations: () => makeRequest('/chat/conversations'),
    getMessages: (conversationId: string) => makeRequest(`/chat/${conversationId}/messages`),
    sendMessage: (data: { content: string; receiverId: string }) => 
      makeRequest('/chat/send', {
        method: 'POST',
        body: JSON.stringify(data)
      })
  },

  profile: {
    get: () => makeRequest('/users/profile'),
    update: (data: Partial<{ name: string; email: string; password: string }>) =>
      makeRequest('/users/profile', {
        method: 'PATCH',
        body: JSON.stringify(data)
      })
  }
}

export type AppointmentStatus = 'PENDING' | 'APPROVED' | 'COMPLETED' | 'CANCELLED'