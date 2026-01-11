// composables/useApi.ts
/**
 * Reusable API methods wrapper
 */

export const useApi = () => {
  const config = useRuntimeConfig()
  const authEndpoint = config.public.authEndpoint

  return {
    async getMe() {
      return useAuthFetch(`${authEndpoint}/me`)
    },

    async revokeToken(refreshToken: string) {
      return useAuthFetch(`${authEndpoint}/revoke`, {
        method: 'POST',
        body: { refreshToken }
      })
    },

    async get<T = any>(url: string) {
      return useAuthFetch<T>(url, { method: 'GET' })
    },

    async post<T = any>(url: string, body?: any) {
      return useAuthFetch<T>(url, { method: 'POST', body })
    },

    async put<T = any>(url: string, body?: any) {
      return useAuthFetch<T>(url, { method: 'PUT', body })
    },

    async delete<T = any>(url: string) {
      return useAuthFetch<T>(url, { method: 'DELETE' })
    }
  }
}
