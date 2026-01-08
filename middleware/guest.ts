// middleware/guest.ts
/**
 * Nuxt 4 Route Middleware untuk guest routes
 * Redirect ke dashboard jika sudah authenticated
 */

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Skip di server
  if (process.server) return

  const auth = useAuth()

  // Restore jika belum initialized
  if (!auth.initialized.value) {
    await auth.restore()
  }

  // Redirect jika sudah authenticated
  if (auth.isAuthenticated.value) {
    const redirectUrl = auth.role.value === 'admin' 
      ? '/admin/dashboard' 
      : '/dashboard'
    return navigateTo(redirectUrl)
  }
})
