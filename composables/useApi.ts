// composables/useApi.ts
/**
 * Composable untuk API management
 * Handle URL building dengan config
 */

import { API_ENDPOINTS } from '~/types/api'

export const useApi = () => {
  const config = useRuntimeConfig()

  /**
   * Build full URL dari endpoint + config
   * Contoh: '/auth/login' → 'http://localhost:5084/api/v1/auth/login'
   */
  const buildUrl = (endpoint: string): string => {
    const base = config.public.apiBase       // http://localhost:5084/api
    const version = config.public.apiVersion // /v1
    const fullUrl = `${base}${version}${endpoint}`

    console.log('🔗 buildUrl:', { endpoint, base, version, fullUrl })

    return fullUrl
  }

  /**
   * Generic fetch function
   */
  const apiCall = async <T = any>(
    endpoint: string,
    options: any = {}
  ): Promise<T> => {
    const url = buildUrl(endpoint)

    try {
      console.log(
        `📡 [${options.method || 'GET'}] ${url}`,
        options.body ? { body: options.body } : ''
      )

      return await $fetch<T>(url, {
        credentials: 'include', // ✅ PENTING: Kirim cookies
        ...options,
      })
    } catch (error: any) {
      console.error(`❌ API ERROR [${options.method || 'GET'} ${url}]:`, {
        status: error?.status,
        statusCode: error?.statusCode,
        message: error?.message,
      })
      throw error
    }
  }

  // HTTP Methods
  const get = <T = any>(endpoint: string, options: any = {}) =>
    apiCall<T>(endpoint, { method: 'GET', ...options })

  const post = <T = any>(endpoint: string, body?: any, options: any = {}) =>
    apiCall<T>(endpoint, { method: 'POST', body, ...options })

  const put = <T = any>(endpoint: string, body?: any, options: any = {}) =>
    apiCall<T>(endpoint, { method: 'PUT', body, ...options })

  const patch = <T = any>(endpoint: string, body?: any, options: any = {}) =>
    apiCall<T>(endpoint, { method: 'PATCH', body, ...options })

  const del = <T = any>(endpoint: string, options: any = {}) =>
    apiCall<T>(endpoint, { method: 'DELETE', ...options })

  // ✅ Helper methods untuk grouped endpoints
  const auth = {
    login: (body: any) => post(API_ENDPOINTS.AUTH.LOGIN, body),
    logout: () => post(API_ENDPOINTS.AUTH.LOGOUT),
    me: () => get(API_ENDPOINTS.AUTH.ME),
    refresh: () => post(API_ENDPOINTS.AUTH.REFRESH),
  }

  const gallery = {
    list: () => get(API_ENDPOINTS.GALLERY.LIST),
    detail: (id: number | string) => get(API_ENDPOINTS.GALLERY.DETAIL(id)),
    upload: (formData: FormData) =>
      post(API_ENDPOINTS.GALLERY.UPLOAD, formData),
  }

  const adminGallery = {
    list: (params?: any) =>
      get(API_ENDPOINTS.ADMIN_GALLERY.LIST, { query: params }),
    detail: (id: number | string) =>
      get(API_ENDPOINTS.ADMIN_GALLERY.DETAIL(id)),
    create: (body: any) =>
      post(API_ENDPOINTS.ADMIN_GALLERY.CREATE, body),
    update: (id: number | string, body: any) =>
      put(API_ENDPOINTS.ADMIN_GALLERY.UPDATE(id), body),
    delete: (id: number | string) =>
      del(API_ENDPOINTS.ADMIN_GALLERY.DELETE(id)),
    bulkUpdate: (body: any) =>
      post(API_ENDPOINTS.ADMIN_GALLERY.BULK_UPDATE, body),
    stats: () => get(API_ENDPOINTS.ADMIN_GALLERY.STATS),
  }

  const adminUsers = {
    list: (params?: any) =>
      get(API_ENDPOINTS.ADMIN_USERS.LIST, { query: params }),
    detail: (id: number) => get(API_ENDPOINTS.ADMIN_USERS.DETAIL(id)),
    create: (body: any) =>
      post(API_ENDPOINTS.ADMIN_USERS.CREATE, body),
    update: (id: number, body: any) =>
      put(API_ENDPOINTS.ADMIN_USERS.UPDATE(id), body),
    delete: (id: number) =>
      del(API_ENDPOINTS.ADMIN_USERS.DELETE(id)),
  }

  return {
    buildUrl,
    apiCall,
    get,
    post,
    put,
    patch,
    del,

    // Grouped endpoints
    auth,
    gallery,
    adminGallery,
    adminUsers,
  }
}
