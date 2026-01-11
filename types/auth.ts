// types/auth.ts

export type Role = 'admin' | 'user'

export interface User {
  id: number
  email: string
  role: Role
  name: string
  createdAt?: string
  lastLoginAt?: string
}

export interface LoginPayload {
  email: string
  password: string
  rememberMe?: boolean
  deviceName?: string
}

export interface LoginResponse {
  success: boolean
  message: string
  token: string
  refreshToken: string
  user: User
}

export interface AuthError {
  message: string
  status?: number
  data?: any
}
