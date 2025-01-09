const API_URL = 'http://localhost:3000/api'

// Types
interface ApiResponse<T = any> {
  data?: T;
  error?: string;
}

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface AppointmentCreate {
  date: string;
  complaint: string;
  medicalHistory: string;
  doctorId: string;
}

// Helper function for API requests
async function makeRequest<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('token')
  if (!token) {
    return { error: 'Authentication required' }
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...options?.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error || 'API request failed')
    }

    return { data }
  } catch (error: any) {
    console.error('API Error:', error)
    return { error: error.message }
  }
}

// API endpoints
export const api = {
  notifications: {
    getAll: () => makeRequest<Notification[]>('/notifications'),
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