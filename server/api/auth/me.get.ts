// server/api/auth/me.get.ts
import { getCookie } from 'h3'
import { API_ENDPOINTS } from '~/types/api'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const apiBase = config.apiBase

  const token = getCookie(event, 'token')
  
  console.log('🔵 ME.GET - TOKEN FROM COOKIE:', token ? '✅ FOUND' : '❌ NOT FOUND')

  if (!token) {
    console.log('🔴 ME.GET - NO TOKEN')
    throw createError({ statusCode: 401, statusMessage: 'Unauthenticated' })
  }

  try {
    console.log('📡 ME.GET - CALLING BACKEND')
    const me = await $fetch<{
      id: number
      email: string
      role: 'admin' | 'user'
      name: string | null
    }>(apiBase + API_ENDPOINTS.AUTH.ME, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    console.log('🟢 ME.GET - BACKEND RESPONSE:', me)
    return me
  } catch (err: any) {
    console.error('🔴 ME.GET - BACKEND ERROR:', err.message)
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }
})
