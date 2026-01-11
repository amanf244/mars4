// middleware/auth.global.ts
import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = useAuthStore()
  const isLoginPage = to.path === '/login'

  // Restore auth jika belum initialized
  if (!auth.initialized) {
    await auth.restore()
  }

  // Check requiresAuth meta
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return navigateTo('/login')
  }

  // Check role-based access
  if (to.meta.role && auth.role !== to.meta.role) {
    return navigateTo('/403')
  }

  // Redirect authenticated user away from login
  if (isLoginPage && auth.isAuthenticated) {
    if (auth.isAdmin) {
      return navigateTo('/dashboard/admin')
    }
    return navigateTo('/dashboard/user')
  }
})
