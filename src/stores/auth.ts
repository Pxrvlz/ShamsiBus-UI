import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { jwtDecode } from 'jwt-decode'
import api from '../api' // Assuming api.ts exports a configured Axios instance

interface UserData {
  id: number | string // User ID can be number or string (e.g., UUID)
  username: string
  role: string
  // Add any other user properties you expect in your JWT payload
}

interface JwtPayload extends UserData {
  exp: number // Standard JWT expiration claim (timestamp in seconds)
  // Add any other standard JWT claims like iat, iss, aud if present in your tokens
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<UserData | null>(null)
  const isLoading = ref(false) // For login loading UX
  const loginError = ref<string | null>(null) // For displaying login errors

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value) // User must also be populated
  const role = computed(() => user.value?.role || '')
  const username = computed(() => user.value?.username || '')

  // Actions
  function _setTokenInternal(newToken: string | null) {
    token.value = newToken
    loginError.value = null // Clear login error on new token or logout

    if (newToken) {
      localStorage.setItem('token', newToken)
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
      try {
        const decoded = jwtDecode<JwtPayload>(newToken)
        // Validate essential decoded properties before setting user
        if (typeof decoded.id === 'undefined' || !decoded.username || !decoded.role || !decoded.exp) {
          console.error('Decoded token is missing essential user data or expiration.')
          _clearTokenAndUser() // Treat as invalid token
          return
        }
        user.value = {
          id: decoded.id,
          username: decoded.username,
          role: decoded.role,
          // Map other relevant fields from decoded payload here
        }
      } catch (error) {
        console.error('Error decoding token:', error)
        _clearTokenAndUser() // Clear state if token is malformed
      }
    } else {
      _clearTokenAndUser()
    }
  }

  function _clearTokenAndUser() {
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
    user.value = null
    token.value = null // Ensure token ref is also cleared
  }

  async function login(usernameInput: string, passwordInput: string): Promise<boolean> {
    isLoading.value = true
    loginError.value = null
    try {
      // --- CRITICAL: Replace with actual API call to your backend ---
      // Example:
      // const response = await api.post('/api/v1/auth/login', { username: usernameInput, password: passwordInput });
      // const receivedToken = response.data.token; // Adjust based on your API response structure
      //
      // if (!receivedToken) {
      //   throw new Error(response.data.message || 'Login failed: No token received.');
      // }
      // _setTokenInternal(receivedToken);
      // return true;
      // --- End of CRITICAL section ---

      // Placeholder for backend integration:
      // This section should be removed once the actual API call above is implemented.
      console.warn(
        'AuthStore: login() is not connected to a real backend. ' +
        'This is a placeholder and does not perform actual authentication.'
      )
      // Simulate a successful login for 'admin'/'admin' for development if needed,
      // but this is NOT secure and should NOT be in production.
      if (usernameInput === 'admin' && passwordInput === 'admin') {
         // THIS IS A MOCK TOKEN FOR DEV ONLY. REPLACE WITH REAL TOKEN FROM BACKEND.
         // A real token would be a long, signed string.
        const mockDevToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
                             "eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImV4cCI6OTk5OTk5OTk5OX0." +
                             "mock_signature_for_dev_only";
        _setTokenInternal(mockDevToken);
        console.log("Mock login successful for dev purposes.");
        return true;
      } else {
        loginError.value = 'Mock login failed: Invalid credentials. Integrate a real backend.';
        return false;
      }
      // End of placeholder section

    } catch (e: any) {
      console.error('Login API call error:', e)
      if (e.response && e.response.data && e.response.data.message) {
        loginError.value = e.response.data.message
      } else if (e.message) {
        loginError.value = e.message
      } else {
        loginError.value = 'An unexpected error occurred during login.'
      }
      _clearTokenAndUser() // Ensure state is clean on error
      return false
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    _setTokenInternal(null) // This will call _clearTokenAndUser
    // Optionally, add router.push('/login') if router is accessible
    // or emit an event that App.vue can listen to for redirection.
  }

  function checkAuth(): boolean {
    const currentToken = localStorage.getItem('token') // Get token directly from storage

    if (currentToken) {
      try {
        const decoded = jwtDecode<JwtPayload>(currentToken)
        if (decoded.exp * 1000 < Date.now()) {
          console.log('Token expired during checkAuth.')
          logout() // Token is expired
          return false
        }
        // Token is present and not expired, re-initialize state
        _setTokenInternal(currentToken) // This will set user, token ref, and API header
        return true
      } catch (error) {
        console.error('Invalid token in localStorage during checkAuth:', error)
        logout() // Token is malformed or invalid
        return false
      }
    }
    // No token found, ensure state is clean
    _clearTokenAndUser()
    return false
  }

  // Initial authentication check when the store is initialized.
  // This ensures the user state is hydrated if a valid token exists in localStorage.
  checkAuth()

  return {
    token, // Read-only access to the token string
    user,  // Read-only access to user data
    isLoading,
    loginError,
    isAuthenticated,
    role,
    username,
    login,
    logout,
    checkAuth, // Might be useful for manual re-check in some scenarios
    // Exposing _setTokenInternal is generally not recommended unless for very specific cases like OAuth handling.
  }
})
