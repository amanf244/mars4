// server/api/auth/logout.post.ts
/**
 * Nuxt 4 Server Route: POST /api/auth/logout
 */

export default defineEventHandler((event) => {
  console.log('🔵 [POST] /api/auth/logout')

  setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate')
  setHeader(event, 'Pragma', 'no-cache')
  setHeader(event, 'Expires', '0')

  // Delete cookies
  deleteCookie(event, 'token', { path: '/' })
  deleteCookie(event, 'refreshToken', { path: '/' })

  console.log('✅ LOGGED OUT - COOKIES DELETED')

  return {
    success: true,
    message: 'Logout berhasil',
  }
})
