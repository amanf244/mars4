// stores/users.ts
import { defineStore } from 'pinia'
import { useUserApi, type User, type CreateUserRequest, type UpdateUserRequest, type UpdateMyProfileRequest } from '~/composables/useUserApi'
import { useAuthStore } from '~/stores/auth'

export interface UsersFilters {
  search: string
  page: number
}

export const useUsersStore = defineStore('users', () => {
  const api = useUserApi()

  // ===== STATE =====
  const users = ref<User[]>([])
  const selectedUser: Ref<User | null> = ref(null)

  const loading = reactive({
    list: false,
    detail: false,
    action: false
  })

  const error = ref<string | null>(null)

  const filters = reactive<UsersFilters>({
    search: '',
    page: 1
  })

  const pagination = reactive({
    page: 1,
    pageSize: 20,
    total: 0,
    pages: 1
  })

  // ===== GETTERS =====
  const totalUsers = computed(() => users.value.length)
  const activeCount = computed(() => users.value.filter(u => u.isActive).length)
  const inactiveCount = computed(() => users.value.filter(u => !u.isActive).length)
  const verifiedCount = computed(() => users.value.filter(u => u.isEmailVerified).length)
  const adminCount = computed(() => users.value.filter(u => u.role === 'Admin' || u.role === 'admin').length)

  // ===== ACTIONS - LIST =====
  const fetchUsers = async (page?: number, search?: string) => {
    loading.list = true
    error.value = null

    if (page !== undefined) filters.page = page
    if (search !== undefined) filters.search = search

    try {
      const data = await api.fetchUsers(filters.page, filters.search)
      users.value = data
    } catch (err: any) {
      error.value = err?.data?.message || err?.message || 'Gagal memuat data user'
      console.error('fetchUsers error:', err)
      throw err
    } finally {
      loading.list = false
    }
  }

  // ===== ACTIONS - DETAIL =====
  const fetchUserById = async (id: number) => {
    loading.detail = true
    error.value = null
    try {
      const data = await api.fetchUser(id)
      selectedUser.value = data
      return data
    } catch (err: any) {
      error.value = err?.data?.message || err?.message || 'Gagal memuat detail user'
      console.error('fetchUserById error:', err)
      throw err
    } finally {
      loading.detail = false
    }
  }

  // ===== ACTIONS - CRUD ADMIN =====
  const createUser = async (payload: CreateUserRequest) => {
    loading.action = true
    error.value = null
    try {
      const created = await api.createUser(payload)
      if (filters.page === 1) {
        users.value.unshift(created)
      }
      return created
    } catch (err: any) {
      error.value = err?.data?.message || err?.message || 'Gagal membuat user'
      console.error('createUser error:', err)
      throw err
    } finally {
      loading.action = false
    }
  }

  const updateUser = async (id: number, payload: UpdateUserRequest) => {
    loading.action = true
    error.value = null
    try {
      const updated = await api.updateUser(id, payload)
      const idx = users.value.findIndex(u => u.id === id)
      if (idx !== -1) {
        users.value[idx] = updated
      }
      if (selectedUser.value?.id === id) {
        selectedUser.value = updated
      }
      return updated
    } catch (err: any) {
      error.value = err?.data?.message || err?.message || 'Gagal mengupdate user'
      console.error('updateUser error:', err)
      throw err
    } finally {
      loading.action = false
    }
  }

  const deleteUser = async (id: number) => {
    loading.action = true
    error.value = null
    try {
      await api.deleteUser(id)
      users.value = users.value.filter(u => u.id !== id)
      if (selectedUser.value?.id === id) {
        selectedUser.value = null
      }
    } catch (err: any) {
      error.value = err?.data?.message || err?.message || 'Gagal menghapus user'
      console.error('deleteUser error:', err)
      throw err
    } finally {
      loading.action = false
    }
  }

  const toggleActive = async (id: number) => {
    const target = users.value.find(u => u.id === id)
    if (!target) return
    await updateUser(id, { isActive: !target.isActive })
  }

  // ===== PROFILE (USER SENDIRI) =====
  const myProfile: Ref<User | null> = ref(null)

  const fetchMyProfile = async () => {
    loading.detail = true
    error.value = null
    try {
      const data = await api.getMyProfile()
      myProfile.value = data
      return data
    } catch (err: any) {
      error.value = err?.data?.message || err?.message || 'Gagal memuat profil'
      console.error('fetchMyProfile error:', err)
      throw err
    } finally {
      loading.detail = false
    }
  }

  const updateMyProfile = async (payload: UpdateMyProfileRequest) => {
    loading.action = true
    error.value = null
    try {
      const updated = await api.updateMyProfile(payload)
      myProfile.value = updated

      const auth = useAuthStore()
      if (auth.user && auth.user.id === updated.id) {
        auth.user = {
          ...auth.user,
          name: updated.fullName,
          phoneNumber: updated.phoneNumber,
          address: updated.address
        } as any
      }
      return updated
    } catch (err: any) {
      error.value = err?.data?.message || err?.message || 'Gagal mengupdate profil'
      console.error('updateMyProfile error:', err)
      throw err
    } finally {
      loading.action = false
    }
  }

  // ===== SEARCH TECHNICIANS =====
  const technicians = ref<User[]>([])

  const searchTechnicians = async (q: string) => {
    if (!q.trim()) {
      technicians.value = []
      return []
    }
    loading.list = true
    error.value = null
    try {
      const result = await api.searchTechnicians(q)
      technicians.value = result
      return result
    } catch (err: any) {
      error.value = err?.data?.message || err?.message || 'Gagal mencari teknisi'
      console.error('searchTechnicians error:', err)
      throw err
    } finally {
      loading.list = false
    }
  }

  return {
    // state
    users,
    selectedUser,
    myProfile,
    technicians,
    loading,
    error,
    filters,
    pagination,

    // getters
    totalUsers,
    activeCount,
    inactiveCount,
    verifiedCount,
    adminCount,

    // actions
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
    toggleActive,
    fetchMyProfile,
    updateMyProfile,
    searchTechnicians
  }
})
