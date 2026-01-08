// types/api.ts

/**
 * API Endpoints - Centralized
 */
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/v1/auth/login',
    LOGOUT: '/v1/auth/logout',
    ME: '/v1/auth/me',
    REFRESH: '/v1/auth/refresh'
  },
  
  // Gallery - Public
  GALLERY: {
    LIST: '/v1/gallery',
    DETAIL: (id: number | string) => `/v1/gallery/${id}`,
    UPLOAD: '/v1/gallery/upload'
  },
  
  // Gallery - Admin
  ADMIN_GALLERY: {
    LIST: '/v1/admin/gallery',
    DETAIL: (id: number | string) => `/v1/admin/gallery/${id}`,
    CREATE: '/v1/admin/gallery',
    UPDATE: (id: number | string) => `/v1/admin/gallery/${id}`,
    DELETE: (id: number | string) => `/v1/admin/gallery/${id}`,
    BULK_UPDATE: '/v1/admin/gallery/bulk/status',
    STATS: '/v1/admin/gallery/statistics'
  },
  
  // Users
  ADMIN_USERS: {
    LIST: '/v1/admin/users',
    DETAIL: (id: number) => `/v1/admin/users/${id}`,
    CREATE: '/v1/admin/users',
    UPDATE: (id: number) => `/v1/admin/users/${id}`,
    DELETE: (id: number) => `/v1/admin/users/${id}`
  }
} as const
