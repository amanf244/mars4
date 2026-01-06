import { defineStore } from 'pinia'

type Role = 'admin' | 'user'

interface User {
  id: number
  email: string
  role: Role
  name: string | null
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    initialized: false as boolean,
    restoring: false as boolean
  }),

  getters: {
    isAuthenticated: (state) => !!state.user && !!state.token,
    role: (state) => state.user?.role,
    isAdmin: (state) => state.user?.role === 'admin'
  },

  actions: {
    async login(payload: { 
      email: string; 
      password: string; 
      rememberMe?: boolean;
      deviceName?: string 
    }) {
      try {
        const { data, error } = await useFetch('/api/v1/auth/login', {
          method: 'POST',
          body: payload,
          baseURL: 'http://localhost:5084/'
        })

        if (error.value) throw error.value

        const response = data.value as any
        
        if (!response.success) throw new Error('Login gagal')

        this.user = response.user
        this.token = response.token
        this.initialized = true

        // Simpan token ke cookie
        const tokenCookie = useCookie('token', {
          maxAge: payload.rememberMe ? 60 * 60 * 24 * 7 : undefined,
          sameSite: 'lax',
          //secure: process.env.NODE_ENV === 'production'
        })
        tokenCookie.value = response.token

        console.log('✅ Login successful')

      } catch (err: any) {
        console.error('❌ Login error:', err)
        throw err
      }
    },

    async restore() {
      // Hanya di client
      if (!import.meta.client || this.initialized || this.restoring) return
      
      this.restoring = true
      
      try {
        const tokenCookie = useCookie<string | null>('token')
        const token = tokenCookie.value

        if (!token) {
          this.initialized = true
          return
        }

        this.token = token

        const { data, error } = await useFetch('/api/v1/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          baseURL: 'http://localhost:5084/'
        })

        if (error.value) {
          throw error.value
        }

        this.user = data.value as User
        
      } catch (err) {
        console.warn('Restore failed, clearing auth', err)
        this.clearAuth()
      } finally {
        this.initialized = true
        this.restoring = false
      }
    },

    clearAuth() {
      this.user = null
      this.token = null
      this.initialized = true

      const tokenCookie = useCookie('token')
      tokenCookie.value = null
    },

    logout() {
      this.clearAuth()
      navigateTo('/login')
    }
  }
})