// server/api/auth/login.post.ts
/**
 * Nuxt 4 Server Route: POST /api/auth/login
 */

import { API_ENDPOINTS } from '~/types/api'

const loginAttempts = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(clientIp: string): boolean {
  const now = Date.now()
  const key = clientIp
  const attemptRecord = loginAttempts.get(key)

  if (!attemptRecord || now >= attemptRecord.resetTime) {
    loginAttempts.set(key, {
      count: 0,
      resetTime: now + 15 * 60 * 1000,
    })
    return true
  }

  if (attemptRecord.count >= 5) {
    return false
  }

  attemptRecord.count++
  return true
}

function getClientIP(event: any): string {
  return (
    event.node.req.headers['x-forwarded-for']?.toString().split(',')[0] ||
    event.node.req.socket.remoteAddress ||
    'unknown'
  )
}

function validateLoginInput(data: any) {
  if (!data.email || typeof data.email !== 'string') {
    return { valid: false, error: 'Email wajib diisi' }
  }

  if (!data.password || typeof data.password !== 'string') {
    return { valid: false, error: 'Password wajib diisi' }
  }

  if (data.email.length > 255) {
    return { valid: false, error: 'Email terlalu panjang' }
  }

  if (data.password.length > 255) {
    return { valid: false, error: 'Password terlalu panjang' }
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return { valid: false, error: 'Format email tidak valid' }
  }

  return { valid: true }
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiBase = config.apiBase
  const clientIp = getClientIP(event)

  // Endpoint untuk backend
  const loginEndpoint = API_ENDPOINTS.AUTH.LOGIN // /v1/auth/login
  const backendUrl = `${apiBase}${loginEndpoint}`

  console.log('🔵 [POST] /api/auth/login', {
    apiBase,
    loginEndpoint,
    backendUrl,
  })

  // Rate limiting
  if (!checkRateLimit(clientIp)) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Terlalu banyak percobaan login. Coba lagi dalam 15 menit.',
    })
  }

  // Read body
  let body
  try {
    body = await readBody(event)
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body',
    })
  }

  // Validate
  const validation = validateLoginInput(body)
  if (!validation.valid) {
    throw createError({
      statusCode: 400,
      statusMessage: validation.error,
    })
  }

  setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate')

  try {
    console.log('📡 PROXYING TO BACKEND:', {
      url: backendUrl,
      email: body.email,
    })

    // Proxy ke backend
    const backendResponse = await $fetch<{
      success: boolean
      message: string
      token: string
      refreshToken: string
      user: {
        id: number
        email: string
        role: 'admin' | 'user'
        name: string | null
      }
    }>(backendUrl, {
      method: 'POST',
      body: {
        email: body.email.toLowerCase().trim(),
        password: body.password,
        rememberMe: body.rememberMe || false,
        deviceName: body.deviceName || 'web',
      },
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000,
    })

    console.log('✅ LOGIN SUCCESSFUL:', {
      user: backendResponse.user.email,
      role: backendResponse.user.role,
    })

    if (!backendResponse.success || !backendResponse.token) {
      throw createError({
        statusCode: 401,
        statusMessage: backendResponse.message || 'Login gagal',
      })
    }

    // Reset rate limit
    loginAttempts.delete(clientIp)

    // Set cookies
    const tokenMaxAge = body.rememberMe ? 60 * 60 * 24 * 7 : 60 * 60 * 5

    setCookie(event, 'token', backendResponse.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: tokenMaxAge,
      path: '/',
    })

    const refreshTokenMaxAge = body.rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24

    setCookie(event, 'refreshToken', backendResponse.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: refreshTokenMaxAge,
      path: '/',
    })

    console.log('🍪 COOKIES SET')

    return {
      success: true,
      message: 'Login berhasil',
      user: backendResponse.user,
    }
  } catch (error: any) {
    console.error('❌ LOGIN FAILED:', {
      message: error?.message,
      status: error?.status,
      statusCode: error?.statusCode,
      url: backendUrl,
    })

    throw createError({
      statusCode: error?.statusCode || error?.status || 500,
      statusMessage: error?.message || 'Login gagal',
    })
  }
})
