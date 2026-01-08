// stores/auth.ts
/**
 * Nuxt 4 Pinia Store untuk Authentication
 * CLIENT langsung call backend ASP.NET
 * TIDAK perlu proxy melalui Nuxt server
 */

import { API_ENDPOINTS } from '~/types/api'

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
     * ✅ LANGSUNG CALL BACKEND ASP.NET
     */
    async login(payload: {
      email: string
      password: string
      rememberMe?: boolean
      deviceName?: string
    }) {
      try {
        const { public: config } = useRuntimeConfig()

        console.log('🔵 LOGIN START', {
          endpoint: API_ENDPOINTS.AUTH.LOGIN,
          baseUrl: config.apiBase,
        })

        // ✅ LANGSUNG KE BACKEND (bukan Nuxt server)
        const response = await $fetch<LoginResponse>(
          `${config.apiBase}${API_ENDPOINTS.AUTH.LOGIN}`,
          {
            method: 'POST',
            body: payload,
            // ✅ PENTING: Credentials untuk CORS cookies
            credentials: 'include',
          }
        )

        console.log('✅ LOGIN SUCCESS', {
          user: response.user.email,
          role: response.user.role,
        })

        if (!response.success || !response.user) {
          throw new Error(response.message || 'Login gagal')
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
     * Restore auth
     * ✅ LANGSUNG CALL BACKEND ASP.NET
     */
    async restore() {
      if (process.server) {
        this.initialized = true
        return
      }

      if (this.initialized || this.restoring) return

      this.restoring = true
      const startTime = Date.now()
      const timeout = 5000

      try {
        const { public: config } = useRuntimeConfig()

        console.log('🔄 RESTORE START', {
          endpoint: API_ENDPOINTS.AUTH.ME,
          baseUrl: config.apiBase,
        })

        // ✅ LANGSUNG KE BACKEND
        const me = await Promise.race([
          $fetch<User>(
            `${config.apiBase}${API_ENDPOINTS.AUTH.ME}`,
            {
              method: 'GET',
              // ✅ PENTING: Credentials untuk CORS cookies
              credentials: 'include',
            }
          ),
          new Promise<never>((_, reject) =>
            setTimeout(
              () => reject(new Error('Auth restore timeout')),
              timeout
            )
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
     * Logout
     * ✅ LANGSUNG CALL BACKEND ASP.NET
     */
    async logout() {
      try {
        const { public: config } = useRuntimeConfig()

        console.log('🔵 LOGOUT START')

        // ✅ LANGSUNG KE BACKEND
        await $fetch(
          `${config.apiBase}${API_ENDPOINTS.AUTH.LOGOUT}`,
          {
            method: 'POST',
            credentials: 'include',
          }
        )

        console.log('✅ LOGGED OUT')
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
