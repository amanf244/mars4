// server/middleware/auth-logging.ts
/**
 * Server middleware untuk logging auth requests
 * Optional tapi berguna untuk debugging
 */

export default defineEventHandler((event) => {
  // Jangan process image, css, js files
  if (
    event.node.req.url?.includes('/_nuxt') ||
    event.node.req.url?.includes('.css') ||
    event.node.req.url?.includes('.js')
  ) {
    return
  }

  const token = getCookie(event, 'token')
  const method = event.node.req.method
  const url = event.node.req.url

  if (token) {
    console.log(`✅ [${method}] ${url} - Authenticated`)
  } else if (url?.includes('/api/auth')) {
    console.log(`🔓 [${method}] ${url} - Auth Route`)
  }
})
