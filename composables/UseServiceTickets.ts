// composables/useServiceTickets.ts
import { useAuthStore } from '~/stores/auth'

// ====================================================
// TIPE DATA (sesuai response backend C# ServiceTicketResponse)
// ====================================================

export interface Teknisi {
  id: number
  namaTeknisi: string
  jenisKelamin?: string
  gajiPokok?: number
  statusTeknisi?: string
  createdAt: string
  updatedAt: string
}

export interface ServiceTicketKerusakanResponse {
  id: number
  masterKerusakanId: number
  namaKerusakan: string
  biaya: number
  catatan: string | null
  /** Optional; present when created via createKerusakan (kerusakanField API) */
  kerusakanField?: string
}

export interface ServiceTicket {
  id: number
  nama: string
  nomor: string
  teknisiId: number
  namaTeknisi?: string | null
  status: string
  deviceModelId?: number | null
  namaDeviceModel?: string | null
  pengeluaran: number
  pendapatan: number
  tanggalMasuk: string
  tanggalDiambil?: string | null
  createdAt: string
  updatedAt: string
  kerusakan: ServiceTicketKerusakanResponse[]
}

// ====================================================
// REQUEST TYPES (sesuai ServiceTicketCreateRequest / UpdateRequest C#)
// ====================================================

export interface TeknisiCreateRequest {
  namaTeknisi: string
  jenisKelamin?: string
  gajiPokok?: number
  statusTeknisi?: string
}

export interface TeknisiUpdateRequest extends TeknisiCreateRequest {
  id: number
}

export interface ServiceTicketKerusakanRequest {
  masterKerusakanId: number
  biaya: number
  catatan: string | null
}

export interface KerusakanUpdateRequest {
  kerusakanField: string
}

export interface ServiceTicketCreateRequest {
  nama: string
  nomor: string
  teknisiId: number
  status?: string // default "pending"
  deviceModelId?: number | null
  pengeluaran: number
  pendapatan: number
  tanggalMasuk: string // ISO string atau "yyyy-MM-dd" yang bisa dibaca backend
  tanggalDiambil?: string | null
  kerusakan: ServiceTicketKerusakanRequest[]
}

export interface ServiceTicketUpdateRequest extends ServiceTicketCreateRequest {
  id: number
}

// (OPSIONAL) kalau endpoint /kerusakan lama masih dipakai, bisa didefinisikan ulang di bawah,
// tapi kalau kamu sudah full pindah ke desain baru (pivot di dalam /service-tickets), bagian ini
// boleh tidak dipakai.

// ====================================================
// COMPOSABLE
// ====================================================

export const useServiceTickets = () => {
  const config = useRuntimeConfig()
  const auth = useAuthStore()
  const apiBase = config.public.apiBase || 'http://localhost:5084/api/v1'

  // ========== TEKNISI ==========
  const fetchTeknisi = async (): Promise<Teknisi[]> => {
    return await $fetch<Teknisi[]>(`${apiBase}/teknisi`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
  }

  const fetchTeknisiById = async (id: number): Promise<Teknisi> => {
    return await $fetch<Teknisi>(`${apiBase}/teknisi/${id}`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
  }

  // ========== DEVICE MODELS ==========
  const fetchDeviceModels = async (): Promise<DeviceModel[]> => {
    return await $fetch<DeviceModel[]>(`${apiBase}/device-models`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
  }

  const createTeknisi = async (data: TeknisiCreateRequest): Promise<Teknisi> => {
    return await $fetch<Teknisi>(`${apiBase}/teknisi`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${auth.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
  }

  const updateTeknisi = async (id: number, data: TeknisiUpdateRequest): Promise<void> => {
    await $fetch(`${apiBase}/teknisi/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${auth.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
  }

  const deleteTeknisi = async (id: number): Promise<void> => {
    await $fetch(`${apiBase}/teknisi/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${auth.token}` }
    })
  }

  // ========== SERVICE TICKETS ==========
  const fetchServiceTickets = async (params?: {
    teknisiId?: number
    status?: string
    startDate?: string
    endDate?: string
    search?: string
    page?: number
    pageSize?: number
  }): Promise<ServiceTicket[]> => {
    const query = new URLSearchParams()
    if (params?.teknisiId) query.append('teknisiId', params.teknisiId.toString())
    if (params?.status) query.append('status', params.status)
    if (params?.startDate) query.append('startDate', params.startDate)
    if (params?.endDate) query.append('endDate', params.endDate)
    if (params?.search) query.append('search', params.search)
    if (params?.page) query.append('page', params.page.toString())
    if (params?.pageSize) query.append('pageSize', params.pageSize.toString())

    const url = query.toString()
      ? `${apiBase}/service-tickets?${query.toString()}`
      : `${apiBase}/service-tickets`

    return await $fetch<ServiceTicket[]>(url, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
  }

  const fetchServiceTicketById = async (id: number): Promise<ServiceTicket> => {
    return await $fetch<ServiceTicket>(`${apiBase}/service-tickets/${id}`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
  }

  const createServiceTicket = async (
    data: ServiceTicketCreateRequest
  ): Promise<ServiceTicket> => {
    return await $fetch<ServiceTicket>(`${apiBase}/service-tickets`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${auth.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
  }

  const updateServiceTicket = async (
    id: number,
    data: ServiceTicketUpdateRequest
  ): Promise<void> => {
    console.log(`Updating service ticket with ID ${id}...`)
    console.log('Request payload:', data)

    await $fetch(`${apiBase}/service-tickets/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${auth.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    console.log(`Service ticket with ID ${id} updated successfully.`)
  }

  const deleteServiceTicket = async (id: number): Promise<void> => {
    await $fetch(`${apiBase}/service-tickets/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${auth.token}` }
    })
  }

  // ========== KERUSAKAN ==========
  const fetchKerusakan = async (params?: {
    serviceTicketId?: number
  }): Promise<ServiceTicketKerusakanResponse[]> => {
    const query = new URLSearchParams()
    if (params?.serviceTicketId)
      query.append('serviceTicketId', params.serviceTicketId.toString())
    const url = query.toString()
      ? `${apiBase}/kerusakan?${query.toString()}`
      : `${apiBase}/kerusakan`
    return await $fetch<ServiceTicketKerusakanResponse[]>(url, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
  }

  const createKerusakan = async (
    serviceTicketId: number,
    data: { kerusakanField: string }
  ): Promise<{ id: number; kerusakanField: string }> => {
    return await $fetch(`${apiBase}/service-tickets/${serviceTicketId}/kerusakan`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${auth.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
  }

  const updateKerusakan = async (
    id: number,
    data: KerusakanUpdateRequest
  ): Promise<void> => {
    await $fetch(`${apiBase}/kerusakan/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${auth.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
  }

  const deleteKerusakan = async (
    serviceTicketId: number,
    kerusakanId: number
  ): Promise<void> => {
    await $fetch(
      `${apiBase}/service-tickets/${serviceTicketId}/kerusakan/${kerusakanId}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${auth.token}` }
      }
    )
  }

  return {
    // Teknisi
    fetchTeknisi,
    fetchTeknisiById,
    createTeknisi,
    updateTeknisi,
    deleteTeknisi,
    // Service Tickets
    fetchServiceTickets,
    fetchServiceTicketById,
    createServiceTicket,
    updateServiceTicket,
    deleteServiceTicket,
    // Device Models
    fetchDeviceModels,
    // Kerusakan
    fetchKerusakan,
    createKerusakan,
    updateKerusakan,
    deleteKerusakan
  }
}
