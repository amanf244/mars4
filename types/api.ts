/**
 * API Endpoints - Centralized
 * HANYA berisi path, tanpa /v1 prefix
 * /v1 prefix di-add dari nuxt.config.ts
 */

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH: '/auth/refresh'
  },

  // Gallery - Public
  GALLERY: {
    LIST: '/gallery',
    DETAIL: (id: number | string) => `/gallery/${id}`,
    UPLOAD: '/gallery/upload'
  },

  // Gallery - Admin
  ADMIN_GALLERY: {
    LIST: '/admin/gallery',
    DETAIL: (id: number | string) => `/admin/gallery/${id}`,
    CREATE: '/admin/gallery',
    UPDATE: (id: number | string) => `/admin/gallery/${id}`,
    DELETE: (id: number | string) => `/admin/gallery/${id}`,
    BULK_UPDATE: '/admin/gallery/bulk/status',
    STATS: '/admin/gallery/statistics'
  },

  // Users
  ADMIN_USERS: {
    LIST: '/admin/users',
    DETAIL: (id: number) => `/admin/users/${id}`,
    CREATE: '/admin/users',
    UPDATE: (id: number) => `/admin/users/${id}`,
    DELETE: (id: number) => `/admin/users/${id}`
  }
} as const
