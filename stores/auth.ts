// stores/auth.ts
import { defineStore } from 'pinia'
import type { User, LoginPayload, LoginResponse } from '~/types/auth'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const initialized = ref(false)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value && !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isUser = computed(() => user.value?.role === 'user')
  const role = computed(() => user.value?.role)
  const userName = computed(() => user.value?.name || 'Guest')

  // Actions
  async function login(payload: LoginPayload) {
    loading.value = true
    error.value = null

    try {
      const config = useRuntimeConfig()

      const response = await $fetch<LoginResponse>(
        `${config.public.apiBase}${config.public.authEndpoint}/login`,
        {
          method: 'POST',
          body: {
            email: payload.email,
            password: payload.password,
            rememberMe: payload.rememberMe ?? true,
            deviceName: payload.deviceName ?? 'web-nuxt-client'
          }
        }
      )

      if (!response.success) {
        throw new Error(response.message || 'Login gagal')
      }

      // Set state
      user.value = response.user
      token.value = response.token
      refreshToken.value = response.refreshToken

      // Save to cookies
      _saveToCookies()

      console.log('✅ Login successful:', response.user.email)
      return response
    } catch (err: any) {
      const errorMsg = err?.data?.message || err?.message || 'Login gagal'
      error.value = errorMsg
      console.error('❌ Login error:', errorMsg)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function restore() {
    if (initialized.value) return

    try {
      const config = useRuntimeConfig()
      const tokenCookie = useCookie<string | null>(config.public.tokenKey)
      const refreshTokenCookie = useCookie<string | null>(config.public.refreshTokenKey)

      const tokenValue = tokenCookie.value
      const refreshTokenValue = refreshTokenCookie.value

      if (!tokenValue) {
        initialized.value = true
        return
      }

      token.value = tokenValue
      refreshToken.value = refreshTokenValue

      try {
        const userData = await $fetch<User>(
          `${config.public.apiBase}${config.public.authEndpoint}/me`,
          {
            headers: {
              Authorization: `Bearer ${tokenValue}`
            }
          }
        )
        user.value = userData
        console.log('✅ Auth restored:', userData.email)
      } catch (err) {
        console.warn('⚠️ Token invalid, attempting refresh...')
        const refreshed = await refreshAccessToken()
        if (!refreshed) {
          clearAuth()
        }
      }
    } catch (err) {
      console.warn('⚠️ Restore failed:', err)
      clearAuth()
    } finally {
      initialized.value = true
    }
  }

  async function refreshAccessToken() {
    if (!refreshToken.value) {
      clearAuth()
      return false
    }

    try {
      const config = useRuntimeConfig()
      const response = await $fetch<any>(
        `${config.public.apiBase}${config.public.authEndpoint}/refresh`,
        {
          method: 'POST',
          body: { refreshToken: refreshToken.value }
        }
      )

      token.value = response.access_token
      refreshToken.value = response.refresh_token

      _saveToCookies()

      console.log('✅ Token refreshed')
      return true
    } catch (err) {
      console.warn('❌ Refresh token failed:', err)
      clearAuth()
      return false
    }
  }

  async function logout() {
    try {
      const config = useRuntimeConfig()

      if (token.value) {
        await $fetch(
          `${config.public.apiBase}${config.public.authEndpoint}/logout`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token.value}`
            }
          }
        )
      }
    } catch (err) {
      console.warn('⚠️ Logout request failed (proceeding anyway):', err)
    } finally {
      clearAuth()
    }
    await navigateTo('/login')
  }

  function clearAuth() {
    user.value = null
    token.value = null
    refreshToken.value = null
    error.value = null

    const config = useRuntimeConfig()
    const tokenCookie = useCookie(config.public.tokenKey)
    const refreshTokenCookie = useCookie(config.public.refreshTokenKey)

    tokenCookie.value = null
    refreshTokenCookie.value = null

    console.log('🧹 Auth cleared')
  }

  // Private helper
  function _saveToCookies() {
    const config = useRuntimeConfig()

    const tokenCookie = useCookie(config.public.tokenKey, {
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7
    })

    const refreshTokenCookie = useCookie(config.public.refreshTokenKey, {
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30
    })

    tokenCookie.value = token.value
    refreshTokenCookie.value = refreshToken.value
  }

  return {
    // State
    user,
    token,
    refreshToken,
    initialized,
    loading,
    error,
    // Getters
    isAuthenticated,
    isAdmin,
    isUser,
    role,
    userName,
    // Actions
    login,
    restore,
    refreshAccessToken,
    logout,
    clearAuth
  }
})
