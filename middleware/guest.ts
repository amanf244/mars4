export default defineNuxtRouteMiddleware(async (to) => {
  // Hanya terapkan ke halaman login
  if (to.path !== '/login') return
  
  const auth = useAuthStore()
  
  if (!auth.initialized && import.meta.client) {
    await auth.restore()
  }
  
  if (auth.isAuthenticated) {
    const redirectTo = to.query.redirect as string || 
      (auth.role === 'admin' ? '/admin/dashboard' : '/dashboard')
    return navigateTo(redirectTo)
  }
})