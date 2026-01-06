export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data: T
}

export interface PaginatedResponse<T = any> {
  items: T[]
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ApiError {
  status?: number
  message: string
  errors?: Record<string, string[]>
}