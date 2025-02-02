const API_URL = import.meta.env.VITE_API_URL || 'https://medico-tst-be.vercel.app';

interface AppointmentCreate {
  date: string
  complaint: string
  medicalHistory: string
  doctorId: string
}

export const api = {
  async at(endpoint: string, options: RequestInit = {}) {
    const url = `${API_URL}${endpoint}`;
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'same-origin',
        mode: 'cors'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  get: (endpoint: string, options = {}) => 
    api.at(endpoint, { ...options, method: 'GET' }),

  post: (endpoint: string, data: any, options = {}) => 
    api.at(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    }),

  patch: (endpoint: string, data: any, options = {}) => 
    api.at(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  auth: {
    login: (credentials: { email: string; password: string }) =>
      api.post('/api/users/login', credentials),
    register: (data: { email: string; password: string; name: string; role: string }) =>
      api.post('/api/users/register', data),
  },

  notifications: {
    getAll: () => api.get('/api/notifications'),
    markAsRead: (id: string) => api.patch(`/api/notifications/${id}/read`, {}),
    markAllAsRead: () => api.patch('/api/notifications/read-all', {})
  },

  appointments: {
    create: (data: AppointmentCreate) => api.post('/api/appointments', data),
    getAll: () => api.get('/api/appointments'),
    getById: (id: string) => api.get(`/api/appointments/${id}`),
    updateStatus: (id: string, status: AppointmentStatus) => 
      api.patch(`/api/appointments/${id}`, { status })
  },

  chat: {
    getConversations: () => api.get('/api/chat/conversations'),
    getMessages: (conversationId: string) => api.get(`/api/chat/${conversationId}/messages`),
    sendMessage: (data: { content: string; receiverId: string }) => 
      api.post('/api/chat/send', data)
  },

  profile: {
    get: () => api.get('/api/users/profile'),
    update: (data: Partial<{ name: string; email: string; password: string }>) =>
      api.patch('/api/users/profile', data)
  }
};

export type AppointmentStatus = 'PENDING' | 'APPROVED' | 'COMPLETED' | 'CANCELLED'