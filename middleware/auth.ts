// middleware/auth.ts
/**
 * Nuxt 4 Route Middleware untuk protect auth routes
 */

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Skip di server
  if (process.server) return

  // Jika route tidak require auth, skip
  if (!to.meta.requiresAuth) return

  const auth = useAuth()

  // Restore jika belum initialized
  if (!auth.initialized.value) {
    try {
      await auth.restore()
    } catch (error) {
      console.error('❌ Auth restore failed:', error)
      auth.clearAuth()
    }
  }

  // Check authentication
  if (!auth.isAuthenticated.value) {
    console.warn('⚠️ Access denied - not authenticated')
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }

  // Check role
  const requiresRole = to.meta.requiresRole as string | undefined
  if (requiresRole && auth.role.value !== requiresRole) {
    console.warn(`⚠️ Access denied - role ${requiresRole} required, got ${auth.role.value}`)
    return navigateTo('/unauthorized')
  }
})
