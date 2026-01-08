// composables/useAuth.ts
/**
 * Nuxt 4 Composable untuk Auth
 * Lebih cleaner daripada langsung pakai store
 */

export const useAuth = () => {
  const authStore = useAuthStore()

  // Return hanya yang dibutuhkan
  return {
    // State
    user: computed(() => authStore.user),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    role: computed(() => authStore.role),
    isAdmin: computed(() => authStore.isAdmin),
    initialized: computed(() => authStore.initialized),

    // Actions
    login: (payload: { email: string; password: string; rememberMe?: boolean }) =>
      authStore.login(payload),
    logout: () => authStore.logout(),
    restore: () => authStore.restore(),
    clearAuth: () => authStore.clearAuth(),
  }
}
