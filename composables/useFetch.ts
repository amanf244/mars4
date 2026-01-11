/**
 * Auto-fetch wrapper dengan auto-refresh token
 * Gunakan ini untuk semua API calls yang memerlukan authentication
 */

import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack'

type HttpMethod = 'GET' | 'HEAD' | 'PATCH' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'get' | 'head' | 'patch' | 'post' | 'put' | 'delete' | 'connect' | 'options' | 'trace'

interface FetchOptions extends Omit<NitroFetchOptions<NitroFetchRequest>, 'method'> {
  method?: HttpMethod
  body?: any
  headers?: Record<string, string>
}

export const useAuthFetch = async <T = any>(
  url: string,
  options: FetchOptions = {}
) => {
  const auth = useAuthStore()
  const config = useRuntimeConfig()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers
  }

  if (auth.token) {
    headers.Authorization = `Bearer ${auth.token}`
  }

  try {
    return await $fetch<T>(url, {
      baseURL: config.public.apiBase,
      ...options,
      headers
    })
  } catch (err: any) {
    // If 401, try refresh
    if (err?.status === 401 && auth.token && auth.refreshToken) {
      console.warn('⚠️ Token expired, refreshing...')

      const refreshed = await auth.refreshAccessToken()

      if (refreshed) {
        headers.Authorization = `Bearer ${auth.token}`
        return await $fetch<T>(url, {
          baseURL: config.public.apiBase,
          ...options,
          headers
        })
      } else {
        await navigateTo('/login')
        throw new Error('Session expired. Please login again.')
      }
    }

    throw err
  }
}
