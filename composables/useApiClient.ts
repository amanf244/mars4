// composables/useApiClient.ts
/**
 * Composable untuk API calls
 * LANGSUNG KE BACKEND ASP.NET
 */

import { API_ENDPOINTS } from '~/types/api'

export const useApiClient = () => {
  const config = useRuntimeConfig()
  const { public: publicConfig } = config

  /**
   * Fetch dengan full URL ke backend
   */
  const apiCall = async <T = any>(
    endpoint: string,
    options: any = {}
  ): Promise<T> => {
    const fullUrl = `${publicConfig.apiBase}${endpoint}`
    
    try {
      console.log(`📡 [${options.method || 'GET'}] ${fullUrl}`)
      
      return await $fetch<T>(fullUrl, {
        credentials: 'include', // ✅ PENTING: Kirim cookies
        ...options,
      })
    } catch (error: any) {
      console.error(`❌ API ERROR [${options.method || 'GET'} ${fullUrl}]:`, {
        status: error?.status,
        message: error?.message,
      })
      throw error
    }
  }

  const get = <T = any>(endpoint: string, options: any = {}) =>
    apiCall<T>(endpoint, { method: 'GET', ...options })

  const post = <T = any>(endpoint: string, body?: any, options: any = {}) =>
    apiCall<T>(endpoint, { method: 'POST', body, ...options })

  const put = <T = any>(endpoint: string, body?: any, options: any = {}) =>
    apiCall<T>(endpoint, { method: 'PUT', body, ...options })

  const del = <T = any>(endpoint: string, options: any = {}) =>
    apiCall<T>(endpoint, { method: 'DELETE', ...options })

  // Gallery endpoints
  const gallery = {
    list: () => get(API_ENDPOINTS.GALLERY.LIST),
    detail: (id: number | string) => get(API_ENDPOINTS.GALLERY.DETAIL(id)),
    upload: (formData: FormData) => post(API_ENDPOINTS.GALLERY.UPLOAD, formData),
  }

  // Admin Gallery endpoints
  const adminGallery = {
    list: (params?: any) => get(API_ENDPOINTS.ADMIN_GALLERY.LIST, { query: params }),
    detail: (id: number | string) => get(API_ENDPOINTS.ADMIN_GALLERY.DETAIL(id)),
    create: (body: any) => post(API_ENDPOINTS.ADMIN_GALLERY.CREATE, body),
    update: (id: number | string, body: any) =>
      put(API_ENDPOINTS.ADMIN_GALLERY.UPDATE(id), body),
    delete: (id: number | string) => del(API_ENDPOINTS.ADMIN_GALLERY.DELETE(id)),
    bulkUpdate: (body: any) => post(API_ENDPOINTS.ADMIN_GALLERY.BULK_UPDATE, body),
    stats: () => get(API_ENDPOINTS.ADMIN_GALLERY.STATS),
  }

  // Admin Users endpoints
  const adminUsers = {
    list: (params?: any) => get(API_ENDPOINTS.ADMIN_USERS.LIST, { query: params }),
    detail: (id: number) => get(API_ENDPOINTS.ADMIN_USERS.DETAIL(id)),
    create: (body: any) => post(API_ENDPOINTS.ADMIN_USERS.CREATE, body),
    update: (id: number, body: any) => put(API_ENDPOINTS.ADMIN_USERS.UPDATE(id), body),
    delete: (id: number) => del(API_ENDPOINTS.ADMIN_USERS.DELETE(id)),
  }

  return {
    apiCall,
    get,
    post,
    put,
    del,
    gallery,
    adminGallery,
    adminUsers,
  }
}
