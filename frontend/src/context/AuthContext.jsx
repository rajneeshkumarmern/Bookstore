import { createContext, useContext, useState, useEffect } from 'react'
import { authService, apiClient } from '../services/api.js'

const AuthContext = createContext()

export const useAuth = () => {
  return useContext(AuthContext)
}

const setToken = (token) => {
  if (token) {
    localStorage.setItem('token', token)
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    localStorage.removeItem('token')
    delete apiClient.defaults.headers.common.Authorization
  }
}

const setUserInStorage = (user) => {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user))
  } else {
    localStorage.removeItem('user')
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') return null
    try {
      return JSON.parse(localStorage.getItem('user'))
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }

    setToken(token)
    authService
      .getProfile()
      .then((profile) => {
        setUser(profile)
        setUserInStorage(profile)
      })
      .catch(() => {
        setToken(null)
        setUser(null)
        setUserInStorage(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password)
      const { token, ...userData } = response
      setToken(token)
      setUser(userData)
      setUserInStorage(userData)
      return { success: true }
    } catch (error) {
      return { success: false, message: error.message || 'Login failed' }
    }
  }

  const register = async (name, email, password) => {
    try {
      const response = await authService.register(name, email, password)
      const { token, ...userData } = response
      setToken(token)
      setUser(userData)
      setUserInStorage(userData)
      return { success: true }
    } catch (error) {
      return { success: false, message: error.message || 'Registration failed' }
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    setUserInStorage(null)
  }

  const value = {
    user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
