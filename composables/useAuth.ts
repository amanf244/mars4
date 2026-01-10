// composables/useAuth.ts
/**
 * Nuxt 4 Composable untuk Auth
 * Wrapper dari useAuthStore
 */
export const useAuth = () => {
  const authStore = useAuthStore()

  return {
    // State
    user: computed(() => authStore.user),
    token: computed(() => authStore.token),
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
    initializeFromStorage: () => authStore.initializeFromStorage(),
  }
}
