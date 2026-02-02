export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()
  const isLoginPage = to.path === '/login'

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return navigateTo('/login')
  }

  if (to.meta.role && auth.role !== to.meta.role) {
    return navigateTo('/403')
  }

  if (isLoginPage && auth.isAuthenticated) {
    if (auth.isAdmin) return navigateTo('/dashboard/admin')
    return navigateTo('/products')
  }
})
