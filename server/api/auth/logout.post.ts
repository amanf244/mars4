// server/api/auth/logout.post.ts
import { deleteCookie } from 'h3'

export default defineEventHandler((event) => {
  deleteCookie(event, 'token', { path: '/' })
  // Kalau pakai refreshToken juga, hapus di sini
  // deleteCookie(event, 'refreshToken', { path: '/' })
  return { success: true }
})
