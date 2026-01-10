// middleware/guest.ts
/**
 * Nuxt 4 Route Middleware untuk guest routes
 * Redirect ke dashboard jika sudah authenticated
 */
export default defineNuxtRouteMiddleware(async (to, from) => {
  // Skip di server
  if (import.meta.server) return

  const auth = useAuth()

  // ✅ Wait sampai auth initialized
  if (!auth.initialized.value) {
    console.log('⏳ GUEST - Waiting for initialization')
    // Tunggu initialization selesai (max 5 detik)
    let count = 0
    while (!auth.initialized.value && count < 50) {
      await new Promise(resolve => setTimeout(resolve, 100))
      count++
    }
  }

  // ✅ Redirect jika sudah authenticated
  if (auth.isAuthenticated.value) {
    const redirectUrl =
      auth.role.value === 'admin' ? '/admin/dashboard' : '/dashboard'
    console.log('→ GUEST - Redirecting authenticated user to', redirectUrl)
    return navigateTo(redirectUrl)
  }
})
