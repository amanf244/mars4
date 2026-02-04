import { defineStore } from 'pinia'
import type { User, LoginPayload, LoginResponse } from '~/types/auth'

export const useAuthStore = defineStore('auth', () => {
  // Nuxt context (aman di sini)
  const config = useRuntimeConfig()
  const tokenCookie = useCookie<string | null>(config.public.tokenKey)
  const refreshTokenCookie = useCookie<string | null>(config.public.refreshTokenKey)

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

      user.value = response.user
      token.value = response.token
      refreshToken.value = response.refreshToken

      _saveToCookies()
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

    tokenCookie.value = null
    refreshTokenCookie.value = null

    console.log('🧹 Auth cleared')
  }

  function _saveToCookies() {
    tokenCookie.value = token.value
    refreshTokenCookie.value = refreshToken.value
  }

  return {
    user,
    token,
    refreshToken,
    initialized,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    isUser,
    role,
    userName,
    login,
    restore,
    refreshAccessToken,
    logout,
    clearAuth
  }
})
