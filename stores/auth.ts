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
    restoring: false as boolean // untuk mencegah race condition
  }),

  getters: {
    isAuthenticated: (s) => !!s.user && !!s.token,
    role: (s) => s.user?.role,
    isAdmin: (s) => s.user?.role === 'admin'
  },

  actions: {
    async login(payload: { email: string; password: string }) {
      try {
        const response = await $fetch<{
          success: boolean
          token: string
          user: User
        }>('http://localhost:3333/login', {
          method: 'POST',
          body: payload
        })

        if (!response.success) throw new Error('Login gagal')

        this.user = response.user
        this.token = response.token

        // simpan token ke cookie
        const tokenCookie = useCookie('token', {
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          httpOnly: false // jika ingin bisa diakses client
        })
        tokenCookie.value = response.token
      } catch (err: any) {
        console.error('Login error:', err)
        throw err
      }
    },

    async restore() {
      if (this.initialized || this.restoring) return
      this.restoring = true

      const tokenCookie = useCookie<string | null>('token')
      const token = tokenCookie.value

      if (!token) {
        this.initialized = true
        this.restoring = false
        return
      }

      this.token = token

      try {
        const user = await $fetch<User>('http://localhost:3333/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        this.user = user
      } catch (err) {
        console.warn('Restore failed, logging out', err)
        this.logout()
      } finally {
        this.initialized = true
        this.restoring = false
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.initialized = true

      const tokenCookie = useCookie('token')
      tokenCookie.value = null
    }
  }
})
