import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { jwtDecode } from 'jwt-decode'
import api from '../api'

interface UserData {
  id: number
  username: string
  role: string
}

interface JwtPayload extends UserData {
  exp: number
}

// Mock users for demo
const mockUsers = [
  { id: 1, username: 'admin', password: 'admin', role: 'admin' },
  { id: 2, username: 'operator1', password: 'operator1', role: 'operator' }
]

// Helper to base64 encode (simple version, not base64url)
function base64Encode(str: string): string {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<UserData | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const role = computed(() => user.value?.role || '')
  const username = computed(() => user.value?.username || '')

  // Actions
  function setToken(newToken: string | null) {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('token', newToken)
      // Set token for API calls
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`

      // Decode and set user
      try {
        // jwtDecode expects a string with at least two dots
        const decoded = jwtDecode<JwtPayload>(newToken)
        user.value = {
          id: decoded.id,
          username: decoded.username,
          role: decoded.role
        }
      } catch (error) {
        console.error('Error decoding token', error)
        // If decoding fails, clear the token
        logout()
      }
    } else {
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
      user.value = null
    }
  }

  async function login(username: string, password: string) {
    try {
      // Mock authentication
      const mockUser = mockUsers.find(u => u.username === username && u.password === password)

      if (!mockUser) {
        return false
      }

      // Create a mock JWT token structure (header.payload.signature)
      // This is NOT a secure or real JWT, just structured so jwt-decode can parse the payload
      const mockHeader = base64Encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
      const mockPayload = base64Encode(JSON.stringify({
        id: mockUser.id,
        username: mockUser.username,
        role: mockUser.role,
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // Expiration in seconds
      }))
      const mockSignature = 'mock_signature' // Placeholder

      const mockToken = `${mockHeader}.${mockPayload}.${mockSignature}`

      setToken(mockToken)
      return true
    } catch (error) {
      console.error('Login error', error)
      return false
    }
  }

  function logout() {
    setToken(null)
  }

  function checkAuth() {
    if (token.value) {
      try {
        const decoded = jwtDecode<JwtPayload>(token.value)

        // Check if token is expired (exp is in seconds)
        if (decoded.exp * 1000 < Date.now()) {
          console.log('Token expired')
          logout()
          return false
        }

        // Set user data
        user.value = {
          id: decoded.id,
          username: decoded.username,
          role: decoded.role
        }

        // Set token for API calls
        api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
        return true
      } catch (error) {
        console.error('Invalid token in localStorage', error)
        logout()
        return false
      }
    }
    return false
  }

  // Check auth on store initialization
  checkAuth()

  return {
    token,
    user,
    isAuthenticated,
    role,
    username,
    login,
    logout,
    checkAuth
  }
})
