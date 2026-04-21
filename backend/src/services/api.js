import axios from 'axios'
import { API_URL } from '../config'

export const apiClient = axios.create({
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
      const response = await apiClient.post(`${API_URL}/api/auth/login`, { email, password })
      return response.data
    } catch (error) {
      handleError(error)
    }
  },

  register: async (name, email, password) => {
    try {
      const response = await apiClient.post(`${API_URL}/api/auth/register`, {
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
      const response = await apiClient.get(`${API_URL}/api/auth/profile`)
      return response.data
    } catch (error) {
      handleError(error)
    }
  },
}

export const bookService = {
  getBooks: async () => {
    try {
      const response = await apiClient.get(`${API_URL}/api/books`)
      return response.data
    } catch (error) {
      handleError(error)
    }
  },

  getBookById: async (id) => {
    try {
      const response = await apiClient.get(`${API_URL}/api/books/${id}`)
      return response.data
    } catch (error) {
      handleError(error)
    }
  },

  createBook: async (bookData) => {
    try {
      const response = await apiClient.post(`${API_URL}/api/books`, bookData)
      return response.data
    } catch (error) {
      handleError(error)
    }
  },
}

export const orderService = {
  getOrdersByUser: async (userId) => {
    try {
      const response = await apiClient.get(`${API_URL}/api/orders/user/${userId}`)
      return response.data
    } catch (error) {
      handleError(error)
    }
  },
}

export const userService = {
  getAllUsers: async () => {
    try {
      const response = await apiClient.get(`${API_URL}/api/users`)
      return response.data
    } catch (error) {
      handleError(error)
    }
  },

  updateUserRole: async (userId, role) => {
    try {
      const response = await apiClient.put(`${API_URL}/api/users/${userId}/role`, { role })
      return response.data
    } catch (error) {
      handleError(error)
    }
  },
}

export const paymentService = {
  createPaymentIntent: async (amount) => {
    try {
      const response = await apiClient.post(`${API_URL}/api/payment/create-intent`, {
        amount,
      })
      return response.data
    } catch (error) {
      handleError(error)
    }
  },

  confirmPayment: async (payload) => {
    try {
      const response = await apiClient.post(`${API_URL}/api/payment/confirm`, payload)
      return response.data
    } catch (error) {
      handleError(error)
    }
  },
}
