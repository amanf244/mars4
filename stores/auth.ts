type Role = 'admin' | 'user'

interface User {
  id: number
  email: string
  role: Role
  name: string
}

interface LoginResponse {
  success: boolean
  message?: string
  token: string
  refreshToken: string
  user: User
}


export const useAuthStore = defineStore('auth', {
  
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    initialized: false as boolean,
    restoring: false as boolean,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user && !!state.token,
    role: (state) => state.user?.role,
    isAdmin: (state) => state.user?.role === 'admin',
    userId: (state) => state.user?.id,
  },

  actions: {
    /**
     * Initialize - untuk SSR
     */
    initializeFromStorage() {
      // ✅ Hanya di client
      if (import.meta.server) {
        this.initialized = true
        return
      }

      const token = localStorage.getItem('authToken')
      const userStr = localStorage.getItem('authUser')

      if (token && userStr) {
        this.token = token
        this.user = JSON.parse(userStr)
        console.log('✅ AUTH - Restored from localStorage')
      }

      this.initialized = true
    },

    /**
     * Login
     */
   async login(payload: {
  email: string
  password: string
  rememberMe?: boolean
  deviceName?: string
}) {
  try {
    const api = useApi()
    const response = await api.auth.login(payload)

    if (!response.success || !response.user || !response.token) {
      throw new Error(response.message || 'Login gagal')
    }

    this.token = response.token
    this.user = response.user
    this.initialized = true

    // ✅ Simpan ke localStorage (client)
    if (import.meta.client) {
      localStorage.setItem('authToken', response.token)
      localStorage.setItem('authUser', JSON.stringify(response.user))
      
      // ✅ SIMPAN KE COOKIE JUGA (untuk SSR)
      const cookie = useCookie('authToken', {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        secure: true,
        httpOnly: false,
        sameSite: 'lax'
      })
      cookie.value = response.token
    }

    console.log('✅ LOGIN SUCCESS')
    return response
  } catch (error: any) {
    console.error('❌ LOGIN ERROR:', error?.message)
    this.clearAuth()
    throw error
  }
}
,
    /**
     * Restore dengan backend
     */
    async restore() {
      if (this.initialized) return
      if (this.restoring) return

      this.restoring = true

      try {
        const api = useApi()
        console.log('🔄 RESTORE START')

        const me = await Promise.race([
          api.auth.me(),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), 5000)
          ),
        ])

        this.user = me
        this.initialized = true
        console.log('✅ RESTORED')
      } catch (err: any) {
        if (err?.status === 401 || err?.statusCode === 401) {
          console.log('ℹ️ Not authenticated')
          this.clearAuth()
        } else {
          console.error('❌ RESTORE ERROR:', err.message)
          this.clearAuth()
        }
      } finally {
        this.initialized = true
        this.restoring = false
      }
    },

    /**
     * Logout
     */
    async logout() {
      try {
        const api = useApi()
        console.log('🔵 LOGOUT START')
        await api.auth.logout()
      } catch (error) {
        console.error('❌ LOGOUT ERROR:', error)
      } finally {
        this.clearAuth()
        // ✅ Clear hanya di client
        if (import.meta.client) {
          localStorage.removeItem('authToken')
          localStorage.removeItem('authUser')
          const cookie = useCookie('authToken')
          cookie.value = null
        }
        await navigateTo('/login')
      }
    },

    /**
     * Clear auth
     */
    clearAuth() {
      this.user = null
      this.token = null
      this.initialized = true
      this.restoring = false
      if (import.meta.client) {
        localStorage.removeItem('authToken')
        localStorage.removeItem('authUser')
        const cookie = useCookie('authToken')
        cookie.value = null
      }
    },
  },
})
