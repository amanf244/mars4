// middleware/auth-init.global.ts
export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore()

  if (!auth.initialized) {
    await auth.restore()
  }
})
