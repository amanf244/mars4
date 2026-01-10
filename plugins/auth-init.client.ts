// plugins/auth-init.client.ts
/**
 * Nuxt 4 Plugin - Client-side only
 * Initialize auth state sebelum pages render
 */
export default defineNuxtPlugin(async (nuxtApp) => {
  const auth = useAuth()

  console.log('🔵 AUTH PLUGIN - INIT START')

  // ✅ 1. Restore dari localStorage dulu
  auth.initializeFromStorage()

  // ✅ 2. Jika ada token, verify dengan backend
  if (auth.token.value) {
    try {
      console.log('🔄 AUTH PLUGIN - VERIFYING TOKEN')
      await auth.restore()
      console.log('✅ AUTH PLUGIN - TOKEN VERIFIED', {
        user: auth.user.value?.email,
        isAuthenticated: auth.isAuthenticated.value,
      })
    } catch (error) {
      console.error('❌ AUTH PLUGIN - TOKEN INVALID', error)
      auth.clearAuth()
    }
  } else {
    console.log('ℹ️ AUTH PLUGIN - NO TOKEN FOUND')
    auth.clearAuth()
  }
})
