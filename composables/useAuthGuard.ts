// composables/useAuthGuard.ts
/**
 * Composable untuk protect routes
 * Bisa dipakai di pages atau components
 */

export const useAuthGuard = (options?: {
  requiresAuth?: boolean
  requiresRole?: 'admin' | 'user'
  onUnauthorized?: () => void
}) => {
  const auth = useAuth()
  const router = useRouter()

  const checkAccess = async () => {
    // Restore auth jika belum initialized
    if (!auth.initialized.value && !process.server) {
      await auth.restore()
    }

    // Check authentication
    if (options?.requiresAuth && !auth.isAuthenticated.value) {
      options?.onUnauthorized?.()
      await router.push('/login')
      return false
    }

    // Check role
    if (options?.requiresRole && auth.role.value !== options.requiresRole) {
      options?.onUnauthorized?.()
      await router.push('/unauthorized')
      return false
    }

    return true
  }

  return { checkAccess }
}
