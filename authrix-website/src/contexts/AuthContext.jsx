import { createContext, useContext, useState, useEffect } from 'react'
import {AuthClient} from 'authrix-sdk'

const AuthContext = createContext()

const authClient = new AuthClient({
  apiKey: import.meta.env.VITE_API_KEY || '',
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      if (authClient.isAuthenticated()) {
        const userData = await authClient.getCurrentUser()
        setUser(userData)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      // Clear tokens and user state on auth failure
      setUser(null)
      try {
        await authClient.logout()
      } catch (logoutError) {
        // Ignore logout errors, tokens might already be cleared
      }
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    setLoading(true)
    try {
      const result = await authClient.login(credentials)
      setUser(result.user)
      return result
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    setLoading(true)
    try {
      const result = await authClient.register(userData)
      // Only set user if they are verified (auto-login)
      if (result.user && result.user.isVerified) {
        setUser(result.user)
      }
      return result
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authClient.logout()
      setUser(null)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const requestPasswordReset = async (email) => {
    return await authClient.requestPasswordReset(email)
  }

  const resetPassword = async (token, newPassword) => {
    return await authClient.resetPassword(token, newPassword)
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    requestPasswordReset,
    resetPassword,
    isAuthenticated: !!user,
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
