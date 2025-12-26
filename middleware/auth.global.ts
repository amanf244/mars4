import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()

  if (!auth.initialized) {
    await auth.restore()
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return navigateTo('/login')
  }

  if (to.path === '/login' && auth.isAuthenticated) {
    return navigateTo('/admin/dashboard')
  }

  if (to.meta.role && auth.role !== to.meta.role) {
    return navigateTo('/403')
  }
})
