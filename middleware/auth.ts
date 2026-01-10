// middleware/auth.ts
/**
 * Nuxt 4 Route Middleware untuk protect auth routes
 */
export default defineNuxtRouteMiddleware(async (to, from) => {
  // Skip di server
  if (import.meta.server) return

  // Jika route tidak require auth, skip
  if (!to.meta.requiresAuth) return

  const auth = useAuth()

  // ✅ Wait sampai auth initialized
  if (!auth.initialized.value) {
    console.log('⏳ AUTH - Waiting for initialization')
    // Tunggu initialization selesai (max 5 detik)
    let count = 0
    while (!auth.initialized.value && count < 50) {
      await new Promise(resolve => setTimeout(resolve, 100))
      count++
    }
  }

  // ✅ Check authentication
  if (!auth.isAuthenticated.value) {
    console.warn('⚠️ Access denied - not authenticated')
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }

  // ✅ Check role
  const requiresRole = to.meta.requiresRole as string | undefined
  if (requiresRole && auth.role.value !== requiresRole) {
    console.warn(
      `⚠️ Access denied - role ${requiresRole} required, got ${auth.role.value}`
    )
    return navigateTo('/unauthorized')
  }
})
