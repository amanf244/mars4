export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()
  
  // Untuk halaman yang perlu auth, tunggu inisialisasi
  if (to.meta.requiresAuth) {
    if (!auth.initialized && import.meta.client) {
      await auth.restore()
    }
    
    if (!auth.isAuthenticated) {
      return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
    }
    
    // Check role
    if (to.meta.role && auth.role !== to.meta.role) {
      return navigateTo('/403')
    }
  }
})