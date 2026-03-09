// composables/useMasterKerusakan.ts
import { useAuthStore } from '~/stores/auth'

export interface MasterKerusakan {
  id: number
  nama: string
  deskripsi?: string | null
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export interface MasterKerusakanCreateRequest {
  nama: string
  deskripsi?: string | null
}

export interface MasterKerusakanUpdateRequest {
  id: number
  nama?: string
  deskripsi?: string | null
  isActive?: boolean
}

export const useMasterKerusakan = () => {
  const config = useRuntimeConfig()
  const auth = useAuthStore()
  const apiBase = config.public.apiBase || 'http://localhost:5084/api/v1'

  const fetchAll = async (): Promise<MasterKerusakan[]> => {
    return await $fetch<MasterKerusakan[]>(`${apiBase}/master-kerusakan`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
  }

  const fetchById = async (id: number): Promise<MasterKerusakan> => {
    return await $fetch<MasterKerusakan>(`${apiBase}/master-kerusakan/${id}`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
  }

  const create = async (data: MasterKerusakanCreateRequest): Promise<MasterKerusakan> => {
    return await $fetch<MasterKerusakan>(`${apiBase}/master-kerusakan`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${auth.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
  }

  const update = async (id: number, data: MasterKerusakanUpdateRequest): Promise<void> => {
    await $fetch(`${apiBase}/master-kerusakan/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${auth.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
  }

  const remove = async (id: number): Promise<void> => {
    await $fetch(`${apiBase}/master-kerusakan/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${auth.token}` }
    })
  }

  return {
    fetchAll,
    fetchById,
    create,
    update,
    remove
  }
}