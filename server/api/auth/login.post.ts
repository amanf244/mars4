// server/api/auth/login.post.ts
import { setCookie } from 'h3'
import { API_ENDPOINTS } from '~/types/api'

export default defineEventHandler(async (event) => {
    console.log('🟢 /api/auth/login route HIT')
  const config = useRuntimeConfig(event)
  const apiBase = config.apiBase
  const body = await readBody<{
    email: string
    password: string
    rememberMe?: boolean
    deviceName?: string
  }>(event)

  try {
    // Panggil backend asli
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
    }>(apiBase + API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json' }
    })

      console.log('🔐 BACKEND LOGIN RESPONSE:', backendResponse)

    if (!backendResponse.success || !backendResponse.token) {
      throw createError({
        statusCode: 401,
        statusMessage: backendResponse.message || 'Login gagal'
      })
    }

    // Simpan JWT di cookie httpOnly
    setCookie(event, 'token', backendResponse.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: body.rememberMe ? 60 * 60 * 24 * 7 : 60 * 60 * 5,
      path: '/'
    })

    // Kalau mau refreshToken juga:
    setCookie(event, 'refreshToken', backendResponse.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: body.rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24,
        path: '/'
    })

    // Hanya kirim data yang perlu ke client (tanpa token)
    return {
      success: true,
      message: backendResponse.message,
      user: backendResponse.user
    }
  } catch (error: any) {
    console.error('🔴 BACKEND LOGIN ERROR:', error)

  throw createError({
    statusCode: error?.statusCode || error?.response?.status || 401,
    statusMessage:
      error?.data?.message ||
      error?.response?._data?.message ||
      error?.message ||
      'Login gagal'
    })
  }
})
