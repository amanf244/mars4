// composables/useApi.ts
import { API_ENDPOINTS } from '~/types/api'

export const useApi = () => {
  const config = useRuntimeConfig()
  const nuxtApp = useNuxtApp()

  /**
   * Get JWT token
   */
const getToken = (): string | null => {
  if (import.meta.server) {
    try {
      const cookieHeader = (nuxtApp.ssrContext?.event.headers as any)?.cookie || ''
      const cookies = parseCookies(cookieHeader as string)
      return cookies.authToken || null
    } catch {
      return null
    }
  } else {
    // Client-side: localStorage dulu
    const token = localStorage.getItem('authToken')
    console.log('🔐 TOKEN FROM STORAGE:', token ? '✅ Found' : '❌ Not found')
    return token
  }
}

const parseCookies = (cookieStr: string): Record<string, string> => {
  const cookies: Record<string, string> = {}
  if (!cookieStr) return cookies
  cookieStr.split(';').forEach(cookie => {
    const [name, value] = cookie.trim().split('=')
    if (name && value) {
      cookies[name] = decodeURIComponent(value)
    }
  })
  return cookies
}


  /**
   * Build full URL
   */
  const buildUrl = (endpoint: string): string => {
    const base = config.public.apiBase
    const version = config.public.apiVersion
    const fullUrl = `${base}${version}${endpoint}`
    console.log('🔗 buildUrl:', { endpoint, fullUrl })
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
  const token = getToken()

  try {
    console.log(`📡 [${options.method || 'GET'}] ${url}`)
    console.log('🔐 TOKEN:', token ? '✅ Sending' : '❌ Not found') // Debug
    
    return await $fetch<T>(url, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }), // ✅ Ini penting
        ...options.headers,
      },
      ...options,
    }) as T
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

  const auth = {
    login: (body: any) => post<any>(API_ENDPOINTS.AUTH.LOGIN, body),
    logout: () => post<any>(API_ENDPOINTS.AUTH.LOGOUT),
    me: () => get<any>(API_ENDPOINTS.AUTH.ME),
    refresh: () => post<any>(API_ENDPOINTS.AUTH.REFRESH),
  }

  const gallery = {
    list: () => get<any>(API_ENDPOINTS.GALLERY.LIST),
    detail: (id: number | string) => get<any>(API_ENDPOINTS.GALLERY.DETAIL(id)),
    upload: (formData: FormData) =>
      post<any>(API_ENDPOINTS.GALLERY.UPLOAD, formData),
  }

  const adminGallery = {
    list: (params?: any) =>
      get<any>(API_ENDPOINTS.ADMIN_GALLERY.LIST, { query: params }),
    detail: (id: number | string) =>
      get<any>(API_ENDPOINTS.ADMIN_GALLERY.DETAIL(id)),
    create: (body: any) =>
      post<any>(API_ENDPOINTS.ADMIN_GALLERY.CREATE, body),
    update: (id: number | string, body: any) =>
      put<any>(API_ENDPOINTS.ADMIN_GALLERY.UPDATE(id), body),
    delete: (id: number | string) =>
      del<any>(API_ENDPOINTS.ADMIN_GALLERY.DELETE(id)),
    bulkUpdate: (body: any) =>
      post<any>(API_ENDPOINTS.ADMIN_GALLERY.BULK_UPDATE, body),
    stats: () => get<any>(API_ENDPOINTS.ADMIN_GALLERY.STATS),
  }

  const adminUsers = {
    list: (params?: any) =>
      get<any>(API_ENDPOINTS.ADMIN_USERS.LIST, { query: params }),
    detail: (id: number) => get<any>(API_ENDPOINTS.ADMIN_USERS.DETAIL(id)),
    create: (body: any) =>
      post<any>(API_ENDPOINTS.ADMIN_USERS.CREATE, body),
    update: (id: number, body: any) =>
      put<any>(API_ENDPOINTS.ADMIN_USERS.UPDATE(id), body),
    delete: (id: number) =>
      del<any>(API_ENDPOINTS.ADMIN_USERS.DELETE(id)),
  }

  return {
    buildUrl,
    apiCall,
    get,
    post,
    put,
    patch,
    del,
    auth,
    gallery,
    adminGallery,
    adminUsers,
  }
}
