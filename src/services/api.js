import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const handleError = (error) => {
  const message =
    error?.response?.data?.message || error?.message || 'Something went wrong.'
  throw new Error(message)
}

export const authService = {
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/api/auth/login', { email, password })
      return response.data
    } catch (error) {
      handleError(error)
    }
  },

  register: async (name, email, password) => {
    try {
      const response = await apiClient.post('/api/auth/register', {
        name,
        email,
        password,
      })
      return response.data
    } catch (error) {
      handleError(error)
    }
  },

  getProfile: async () => {
    try {
      const response = await apiClient.get('/api/auth/profile')
      return response.data
    } catch (error) {
      handleError(error)
    }
  },
}

export const bookService = {
  getBooks: async () => {
    try {
      const response = await apiClient.get('/api/books')
      return response.data
    } catch (error) {
      handleError(error)
    }
  },

  getBookById: async (id) => {
    try {
      const response = await apiClient.get(`/api/books/${id}`)
      return response.data
    } catch (error) {
      handleError(error)
    }
  },

  createBook: async (bookData) => {
    try {
      const response = await apiClient.post('/api/books', bookData)
      return response.data
    } catch (error) {
      handleError(error)
    }
  },
}

export const orderService = {
  getOrdersByUser: async (userId) => {
    try {
      const response = await apiClient.get(`/api/orders/user/${userId}`)
      return response.data
    } catch (error) {
      handleError(error)
    }
  },
}

export const userService = {
  getAllUsers: async () => {
    try {
      const response = await apiClient.get('/api/users')
      return response.data
    } catch (error) {
      handleError(error)
    }
  },

  updateUserRole: async (userId, role) => {
    try {
      const response = await apiClient.put(`/api/users/${userId}/role`, { role })
      return response.data
    } catch (error) {
      handleError(error)
    }
  },
}

export const paymentService = {
  createPaymentIntent: async (amount) => {
    try {
      const response = await apiClient.post('/api/payment/create-intent', {
        amount,
      })
      return response.data
    } catch (error) {
      handleError(error)
    }
  },

  confirmPayment: async (payload) => {
    try {
      const response = await apiClient.post('/api/payment/confirm', payload)
      return response.data
    } catch (error) {
      handleError(error)
    }
  },
}
