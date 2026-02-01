// middleware/admin.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore()

  if (!auth.isAuthenticated) {
    return navigateTo('/login')
  }

  if (!auth.isAdmin) {
    return navigateTo('/403')
  }
})
