// stores/auth.ts
/**
 * Auth Store - Menggunakan useApi composable
 */


import { defineStore } from 'pinia'

type Role = 'admin' | 'user'

interface User {
  id: number
  email: string
  role: Role
  name: string | null
}

interface LoginResponse {
  success: boolean
  message?: string
  user: User
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    initialized: false as boolean,
    restoring: false as boolean,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    role: (state) => state.user?.role,
    isAdmin: (state) => state.user?.role === 'admin',
    userId: (state) => state.user?.id,
  },

  actions: {
    /**
     * Login action
     */
   /**
 * Login action
 */
async login(payload: {
  email: string
  password: string
  rememberMe?: boolean
  deviceName?: string
}) {
  try {
    const api = useApi()
    console.log('🔵 LOGIN START', { email: payload.email })
    // ✅ gunakan useApi().auth.login()
    const response = await api.auth.login(payload)
    console.log('✅ LOGIN SUCCESS', {
      user: response.user.email,
      role: response.user.role,
    })
    if (!response.success || !response.user) {
      throw new Error(response.message || 'Login gagal')
    }

    // ✅ SIMPAN JWT TOKEN dari response
    if (response.token) {
      localStorage.setItem('authToken', response.token)
      console.log('✅ JWT Token saved to localStorage')
    }

    this.user = response.user
    this.initialized = true
    return response
  } catch (error: any) {
    console.error('❌ LOGIN ERROR:', error?.message || error)
    throw error
  }
},


    /**
     * Restore auth dari session
     */
    async restore() {
      if (process.server) {
        this.initialized = true
        return
      }

      if (this.initialized || this.restoring) return

      this.restoring = true
      const startTime = Date.now()

      try {
        const api = useApi()

        console.log('🔄 RESTORE START')

        // ✅ gunakan useApi().auth.me()
        const me = await Promise.race([
          api.auth.me(),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), 5000)
          ),
        ])

        this.user = me
        this.initialized = true

        const elapsed = Date.now() - startTime
        console.log('✅ RESTORED', {
          user: me.email,
          elapsed: `${elapsed}ms`,
        })
      } catch (err: any) {
        console.error('❌ RESTORE ERROR:', err.message)
        this.clearAuth()
      } finally {
        this.initialized = true
        this.restoring = false
      }
    },

    /**
 * Logout action
 */
async logout() {
  try {
    const api = useApi()
    console.log('🔵 LOGOUT START')
    // ✅ gunakan useApi().auth.logout()
    await api.auth.logout()
    console.log('✅ LOGGED OUT')
    // ✅ HAPUS JWT TOKEN
    localStorage.removeItem('authToken')
    console.log('✅ JWT Token removed from localStorage')
  } catch (error) {
    console.error('❌ LOGOUT ERROR:', error)
  } finally {
    this.clearAuth()
    await navigateTo('/login')
  }
},

    /**
     * Clear auth state
     */
    clearAuth() {
      this.user = null
      this.initialized = true
      this.restoring = false
    },
  },
})
