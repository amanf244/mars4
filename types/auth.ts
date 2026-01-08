// types/auth.ts (atau server/types/auth.ts)
export interface User {
  id: number
  email: string
  role: 'admin' | 'user'
  name: string | null
}

export interface LoginBackendResponse {
  success: boolean
  message?: string
  user: User
  token: string
}
