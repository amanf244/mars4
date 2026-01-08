// stores/auth.ts
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
    restoring: false as boolean
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    role: (state) => state.user?.role,
    isAdmin: (state) => state.user?.role === 'admin'
  },

  actions: {
    async login(payload: {
      email: string
      password: string
      rememberMe?: boolean
      deviceName?: string
    }) {
      const response = await $fetch<LoginResponse>('/api/auth/login', {
        method: 'POST',
        body: payload
      })

      if (!response.success || !response.user) {
        throw new Error(response.message || 'Login gagal')
      }

      this.user = response.user
      this.initialized = true

      return response
    },

  async restore() {
  // Hanya cek initialized dan restoring, HAPUS cek import.meta.client
  if (this.initialized || this.restoring) return

  this.restoring = true
  try {
    const me = await $fetch<User>('/api/auth/me')
    this.user = me
  } catch (err) {
    console.error('🔴 restore error:', err)
    this.clearAuth()
  } finally {
    this.initialized = true
    this.restoring = false
  }
}

,


    clearAuth() {
      this.user = null
      this.initialized = true
    },

    async logout() {
      try {
        await $fetch('/api/auth/logout', { method: 'POST' })
      } finally {
        this.clearAuth()
        navigateTo('/login')
      }
    }
  }
})
