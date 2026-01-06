export default defineNuxtPlugin(async () => {
  const auth = useAuthStore()
  
  // Hanya di client side
  if (import.meta.client && !auth.initialized) {
    await auth.restore()
  }
})