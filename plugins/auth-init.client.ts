export default defineNuxtPlugin(async (nuxtApp) => {
  const auth = useAuthStore()
  
  // Restore SEKALI saat app pertama load di browser
  if (!auth.initialized) {
    await auth.restore()
  }
})
