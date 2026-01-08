// plugins/auth-init.client.ts
/**
 * Nuxt 4 Plugin - Client-side only
 * Initialize auth state sebelum pages render
 */

export default defineNuxtPlugin(async (nuxtApp) => {
  const auth = useAuth()

  // Skip jika sudah initialized
  if (auth.initialized.value) {
    console.log('✅ AUTH PLUGIN - ALREADY INITIALIZED')
    return
  }

  console.log('🔵 AUTH PLUGIN - INIT START')

  try {
    console.log('🔄 AUTH PLUGIN - RESTORING')
    await auth.restore()
    console.log('✅ AUTH PLUGIN - RESTORED', {
      user: auth.user.value?.email,
      isAuthenticated: auth.isAuthenticated.value,
    })
  } catch (error) {
    console.error('❌ AUTH PLUGIN - ERROR', error)
    auth.clearAuth()
  }
})
