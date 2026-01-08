import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.initialized && import.meta.client) {
    await auth.restore()
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})
