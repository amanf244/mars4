// server/utils/auth.ts
/**
 * Server-side auth utilities untuk Nuxt 4
 */

import type { H3Event } from 'h3'

/**
 * Get token dari request
 */
export function getTokenFromRequest(event: H3Event): string | null {
  // Cek dari cookie dulu (lebih aman)
  const cookieToken = getCookie(event, 'token')
  if (cookieToken) return cookieToken

  // Fallback ke Authorization header
  const authHeader = event.node.req.headers.authorization
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7)
  }

  return null
}

/**
 * Validate token exists
 */
export function requireAuth(event: H3Event): string {
  const token = getTokenFromRequest(event)

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthenticated - Token not provided',
    })
  }

  return token
}

/**
 * Get client IP address
 */
export function getClientIP(event: H3Event): string {
  return (
    event.node.req.headers['x-forwarded-for']?.toString().split(',')[0] ||
    event.node.req.socket.remoteAddress ||
    'unknown'
  )
}

/**
 * Rate limiter untuk Nuxt 4
 */
class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map()

  check(key: string, limit: number, windowMs: number): boolean {
    const now = Date.now()
    const record = this.attempts.get(key)

    if (!record || now >= record.resetTime) {
      this.attempts.set(key, {
        count: 1,
        resetTime: now + windowMs,
      })
      return true
    }

    if (record.count >= limit) {
      return false
    }

    record.count++
    return true
  }

  reset(key: string) {
    this.attempts.delete(key)
  }
}

export const loginLimiter = new RateLimiter()
