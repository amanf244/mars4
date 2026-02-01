// middleware/user.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore()

  if (!auth.isAuthenticated) {
    return navigateTo('/login')
  }

  if (!auth.isUser) {
    return navigateTo('/403')
  }
})
