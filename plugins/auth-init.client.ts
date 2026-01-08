export default defineNuxtPlugin(async () => {
  const auth = useAuthStore()
  
  console.log('🟢 AUTH PLUGIN - INIT START', { initialized: auth.initialized })
  
  if (!auth.initialized) {
    console.log('🟠 AUTH PLUGIN - RESTORING')
    await auth.restore()
    console.log('🟢 AUTH PLUGIN - RESTORED', { user: auth.user?.email })
  }
})
