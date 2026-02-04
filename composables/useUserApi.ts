// composables/useUserApi.ts

export interface User {
  id: number
  email: string
  fullName: string
  phoneNumber: string
  address: string
  isEmailVerified: boolean
  role: string
  isActive: boolean
  isTechnician: boolean
  lastLoginAt: string | null
  createdAt: string
  lastPasswordChangedAt: string | null
}

export interface CreateUserRequest {
  email: string
  password: string
  fullName: string
  phoneNumber?: string
  address?: string,
  isTechnician?: boolean
  role: 'Admin' | 'User'
}

export interface UpdateUserRequest {
  email?: string
  password?: string
  fullName?: string
  phoneNumber?: string
  address?: string
  role?: 'Admin' | 'User'
  isTechnician?: boolean
  isActive?: boolean
}

export interface UpdateMyProfileRequest {
  fullName?: string
  phoneNumber?: string
}

export const useUserApi = () => {
  // ⬇️ DIPINDAH KE DALAM FUNGSI
  const config = useRuntimeConfig()
  const auth = useAuthStore()

  const apiBase = config.public.apiBase || 'http://localhost:5084/api/v1'

  // ===== USERS =====
  const fetchUsers = async (page = 1, search = ''): Promise<User[]> => {
    const query = new URLSearchParams()
    if (page) query.append('page', page.toString())
    if (search) query.append('search', search)

    const response = await $fetch<User[]>(`${apiBase}/users?${query}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    })
    return response
  }

  const fetchUser = async (id: number): Promise<User> => {
    const response = await $fetch<User>(`${apiBase}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    })
    return response
  }

  const searchTechnicians = async (q: string): Promise<User[]> => {
    const response = await $fetch<User[]>(
      `${apiBase}/users/search/technicians?q=${encodeURIComponent(q)}`,
      {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      }
    )
    return response
  }

  const createUser = async (data: CreateUserRequest): Promise<User> => {
    const response = await $fetch<User>(`${apiBase}/users`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${auth.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    return response
  }

  const updateUser = async (id: number, data: UpdateUserRequest): Promise<User> => {
    const response = await $fetch<User>(`${apiBase}/users/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${auth.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    return response
  }

  const deleteUser = async (id: number): Promise<void> => {
    await $fetch(`${apiBase}/users/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    })
  }

  // ===== PROFILE =====
  const getMyProfile = async (): Promise<User> => {
    const response = await $fetch<User>(`${apiBase}/users/profile/me`, {
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    })
    return response
  }

  const updateMyProfile = async (data: UpdateMyProfileRequest): Promise<User> => {
    const response = await $fetch<User>(`${apiBase}/users/profile/me`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${auth.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    return response
  }

  return {
    // User Management (Admin)
    fetchUsers,
    fetchUser,
    searchTechnicians,
    createUser,
    updateUser,
    deleteUser,

    // Profile (User)
    getMyProfile,
    updateMyProfile
  }
}
