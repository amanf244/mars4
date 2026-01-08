// server/api/auth/me.get.ts
/**
 * Nuxt 4 Server Route: GET /api/auth/me
 * Proxy ke backend API
 */

import { API_ENDPOINTS } from '~/types/api'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiBase = config.apiBase
  const token = getCookie(event, 'token')

  // Endpoint untuk backend
  const meEndpoint = API_ENDPOINTS.AUTH.ME // /v1/auth/me
  const backendUrl = `${apiBase}${meEndpoint}`

  console.log('🔵 [GET] /api/auth/me', {
    apiBase,
    meEndpoint,
    backendUrl,
    hasToken: !!token,
  })

  setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate')

  if (!token) {
    console.log('❌ NO TOKEN FOUND')
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthenticated - Token tidak ditemukan',
    })
  }

  try {
    console.log('📡 PROXYING TO BACKEND:', backendUrl)

    // PROXY ke backend
    const me = await $fetch<{
      id: number
      email: string
      role: 'admin' | 'user'
      name: string | null
    }>(backendUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 5000,
    })

    console.log('✅ USER DATA FETCHED:', { email: me.email, role: me.role })
    return me
  } catch (err: any) {
    console.error('❌ FAILED TO FETCH USER:', {
      message: err?.message,
      status: err?.status,
      statusCode: err?.statusCode,
      url: backendUrl,
    })

    if (err?.status === 401 || err?.statusCode === 401) {
      deleteCookie(event, 'token', { path: '/' })
      console.log('🔴 TOKEN INVALID - COOKIES CLEARED')

      throw createError({
        statusCode: 401,
        statusMessage: 'Token expired or invalid',
      })
    }

    throw createError({
      statusCode: err?.status || err?.statusCode || 500,
      statusMessage: 'Failed to fetch user data',
    })
  }
})
