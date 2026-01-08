// utils/api.ts
import { useAuthStore } from '~/stores/auth'

/**
 * Get API headers dengan auth token jika ada
 */
export function getApiHeaders() {
  const authStore = useAuthStore()
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(authStore.token && { Authorization: `Bearer ${authStore.token}` })
  }
}

/**
 * Get API base URL dari config
 */
export function getApiBaseUrl() {
  const config = useRuntimeConfig()
  return config.public.apiBase || 'http://localhost:5084'
}

/**
 * Fetch dengan auth otomatis
 */
export async function apiFetch<T = any>(
  path: string,
  options?: FetchOptions & { method?: string; body?: any }
) {
  return $fetch<T>(path, {
    baseURL: getApiBaseUrl(),
    headers: getApiHeaders(),
    ...options
  })
}

/**
 * Handle API errors secara konsisten
 */
export function handleApiError(error: any): { code: string; message: string } {
  if (error.status === 401) {
    const authStore = useAuthStore()
    authStore.logout()
    return { 
      code: 'UNAUTHORIZED', 
      message: 'Session expired. Please login again.' 
    }
  }
  
  if (error.status === 403) {
    return { 
      code: 'FORBIDDEN', 
      message: 'You do not have permission to perform this action.' 
    }
  }
  
  if (error.status === 404) {
    return { 
      code: 'NOT_FOUND', 
      message: 'Resource not found.' 
    }
  }
  
  if (error.status === 500) {
    return { 
      code: 'SERVER_ERROR', 
      message: 'Server error. Please try again later.' 
    }
  }
  
  return {
    code: 'UNKNOWN_ERROR',
    message: error.data?.message || error.message || 'An unexpected error occurred.'
  }
}
