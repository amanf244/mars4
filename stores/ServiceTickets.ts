// stores/serviceTicket.ts
import { defineStore } from 'pinia'
import type {
  KerusakanUpdateRequest,
  ServiceTicketKerusakanResponse
} from '~/composables/UseServiceTickets'

interface ServiceTicketState {
  // Data utama
  serviceTickets: ServiceTicket[]
  currentServiceTicket: ServiceTicket | null

  // Data referensi
  teknisiList: Teknisi[]
  kerusakanList: ServiceTicketKerusakanResponse[]
  deviceModelsList: DeviceModel[]

  // Pagination
  pagination: {
    page: number
    pageSize: number
    total: number
    pages: number
  }

  // Filter
  filters: {
    search: string
    teknisiId: number | null
    status: string | null
    startDate: string | null
    endDate: string | null
  }

  // Loading states
  loading: {
    serviceTickets: boolean
    detail: boolean
    teknisi: boolean
    kerusakan: boolean
    deviceModels: boolean
    action: boolean
  }

  // Error
  error: string | null
}

export const useServiceTicketStore = defineStore('serviceTicket', {
  state: (): ServiceTicketState => ({
    serviceTickets: [],
    currentServiceTicket: null,
    teknisiList: [],
    kerusakanList: [],
    deviceModelsList: [],
    pagination: {
      page: 1,
      pageSize: 20,
      total: 0,
      pages: 0
    },
    filters: {
      search: '',
      teknisiId: null,
      status: null,
      startDate: null,
      endDate: null
    },
    loading: {
      serviceTickets: false,
      detail: false,
      teknisi: false,
      kerusakan: false,
      deviceModels: false,
      action: false
    },
    error: null
  }),

  getters: {
    // Mendapatkan ticket berdasarkan ID
    getServiceTicketById: (state) => (id: number) => {
      return state.serviceTickets.find(t => t.id === id)
    },

    // Cek apakah ada data
    hasServiceTickets: (state) => state.serviceTickets.length > 0,

    // Apakah sedang loading apapun
    isLoading: (state) => Object.values(state.loading).some(v => v),

    // Filter ticket berdasarkan status
    pendingTickets: (state) => state.serviceTickets.filter(t => t.status === 'pending'),
    inProgressTickets: (state) => state.serviceTickets.filter(t => t.status === 'in_progress'),
    completedTickets: (state) => state.serviceTickets.filter(t => t.status === 'completed'),

    // Rekap
    totalTickets: (state) => state.pagination.total,
    totalPending: (state) => state.serviceTickets.filter(t => t.status === 'pending').length,
    totalCompleted: (state) => state.serviceTickets.filter(t => t.status === 'completed').length,

    // Total pendapatan dan pengeluaran dari ticket yang tampil
    totalPendapatan: (state) => state.serviceTickets.reduce((sum, t) => sum + t.pendapatan, 0),
    totalPengeluaran: (state) => state.serviceTickets.reduce((sum, t) => sum + t.pengeluaran, 0),
    totalProfit: (state) => state.serviceTickets.reduce((sum, t) => sum + (t.pendapatan - t.pengeluaran), 0),

    // Mendapatkan nama teknisi dari ID
    getTeknisiName: (state) => (id: number) => {
      const teknisi = state.teknisiList.find(t => t.id === id)
      return teknisi?.namaTeknisi || 'Unknown'
    },
    getDeviceModelName: (state) => (id: number) => {
      const deviceModel = state.deviceModelsList.find(d => d.id === id)
      return deviceModel?.fullName || 'Unknown'
    }
  },

  actions: {
    // ========== SERVICE TICKETS ==========
    async fetchServiceTickets(params?: {
      page?: number
      pageSize?: number
      search?: string
      teknisiId?: number
      status?: string
      startDate?: string
      endDate?: string
      append?: boolean
    }) {
      this.loading.serviceTickets = true
      this.error = null

      try {
        const api = useServiceTickets()

        const queryParams = {
          page: params?.page ?? this.pagination.page,
          pageSize: params?.pageSize ?? this.pagination.pageSize,
          search: params?.search ?? this.filters.search,
          teknisiId: params?.teknisiId ?? this.filters.teknisiId ?? undefined,
          status: params?.status ?? this.filters.status ?? undefined,
          startDate: params?.startDate ?? this.filters.startDate ?? undefined,
          endDate: params?.endDate ?? this.filters.endDate ?? undefined
        }

        const response = await api.fetchServiceTickets(queryParams)

        // Asumsi response berupa array ServiceTicket[], bukan object pagination.
        // Jika API mengembalikan pagination, sesuaikan. Untuk sementara kita asumsikan array.
        const tickets = response as any // karena fetchServiceTickets mengembalikan ServiceTicket[]

        // Handle pagination jika API mengembalikan data terpisah
        // Kita perlu tahu total data. Mungkin API mengembalikan header X-Total-Count.
        // Untuk sementara kita asumsikan tidak ada pagination dari server, kita handle di client.
        // Atau kita modifikasi composable agar mengembalikan { data, total }.
        // Untuk contoh ini, kita asumsikan API mengembalikan semua data tanpa pagination,
        // jadi kita set total sesuai panjang array.
        const total = tickets.length
        this.pagination.total = total
        this.pagination.pages = Math.ceil(total / this.pagination.pageSize)

        const shouldAppend = params?.append === true

        if (!shouldAppend) {
          this.serviceTickets = tickets
        } else {
          const existingIds = new Set(this.serviceTickets.map(t => t.id))
          const newTickets = tickets.filter((t: ServiceTicket) => !existingIds.has(t.id))
          this.serviceTickets = [...this.serviceTickets, ...newTickets]
        }

        return tickets
      } catch (error: any) {
        this.error = error.message || 'Gagal memuat service tickets'
        throw error
      } finally {
        this.loading.serviceTickets = false
      }
    },

    async fetchServiceTicketById(id: number) {
      this.loading.detail = true
      this.error = null

      try {
        const api = useServiceTickets()
        const ticket = await api.fetchServiceTicketById(id)
        this.currentServiceTicket = ticket
        return ticket
      } catch (error: any) {
        this.error = error.message || 'Gagal memuat detail service ticket'
        throw error
      } finally {
        this.loading.detail = false
      }
    },

    async createServiceTicket(data: ServiceTicketCreateRequest) {
      this.loading.action = true
      this.error = null

      try {
        const api = useServiceTickets()
        const ticket = await api.createServiceTicket(data)

        // Refresh list
        await this.fetchServiceTickets({ page: 1 })

        return ticket
      } catch (error: any) {
        this.error = error.data?.message || 'Gagal membuat service ticket'
        throw error
      } finally {
        this.loading.action = false
      }
    },

    async updateServiceTicket(id: number, data: ServiceTicketUpdateRequest) {
      this.loading.action = true
      this.error = null

      try {
        const api = useServiceTickets()
        await api.updateServiceTicket(id, data)

        // Update di list
        const index = this.serviceTickets.findIndex(t => t.id === id)
        if (index !== -1) {
          // Refresh data dengan fetch ulang atau update manual
          // Untuk sederhana, kita fetch ulang list
          await this.fetchServiceTickets({ page: this.pagination.page })
        }

        // Update current jika sama
        if (this.currentServiceTicket?.id === id) {
          this.currentServiceTicket = await api.fetchServiceTicketById(id)
        }
      } catch (error: any) {
        this.error = error.data?.message || 'Gagal mengupdate service ticket'
        throw error
      } finally {
        this.loading.action = false
      }
    },

    async deleteServiceTicket(id: number) {
      this.loading.action = true
      this.error = null

      try {
        const api = useServiceTickets()
        await api.deleteServiceTicket(id)

        // Hapus dari list
        this.serviceTickets = this.serviceTickets.filter(t => t.id !== id)
        this.pagination.total = Math.max(0, this.pagination.total - 1)
        this.pagination.pages = Math.ceil(this.pagination.total / this.pagination.pageSize)

        if (this.currentServiceTicket?.id === id) {
          this.currentServiceTicket = null
        }
      } catch (error: any) {
        this.error = error.data?.message || 'Gagal menghapus service ticket'
        throw error
      } finally {
        this.loading.action = false
      }
    },

    // ========== TEKNISI ==========
    async fetchTeknisi() {
      this.loading.teknisi = true
      this.error = null

      try {
        const api = useServiceTickets()
        const teknisi = await api.fetchTeknisi()
        this.teknisiList = teknisi
        return teknisi
      } catch (error: any) {
        this.error = error.message || 'Gagal memuat data teknisi'
        throw error
      } finally {
        this.loading.teknisi = false
      }
    },

    async createTeknisi(data: TeknisiCreateRequest) {
      this.loading.action = true
      this.error = null

      try {
        const api = useServiceTickets()
        const teknisi = await api.createTeknisi(data)
        this.teknisiList.push(teknisi)
        return teknisi
      } catch (error: any) {
        this.error = error.data?.message || 'Gagal membuat teknisi'
        throw error
      } finally {
        this.loading.action = false
      }
    },

    async updateTeknisi(id: number, data: TeknisiUpdateRequest) {
      this.loading.action = true
      this.error = null

      try {
        const api = useServiceTickets()
        await api.updateTeknisi(id, data)

        const index = this.teknisiList.findIndex(t => t.id === id)
        if (index !== -1) {
          // Refresh data teknisi
          const updated = await api.fetchTeknisiById(id)
          this.teknisiList[index] = updated
        }
      } catch (error: any) {
        this.error = error.data?.message || 'Gagal mengupdate teknisi'
        throw error
      } finally {
        this.loading.action = false
      }
    },

    async deleteTeknisi(id: number) {
      this.loading.action = true
      this.error = null

      try {
        const api = useServiceTickets()
        await api.deleteTeknisi(id)

        this.teknisiList = this.teknisiList.filter(t => t.id !== id)
      } catch (error: any) {
        this.error = error.data?.message || 'Gagal menghapus teknisi'
        throw error
      } finally {
        this.loading.action = false
      }
    },

    // ========== DEVICE MODELS ==========
    async fetchDeviceModels() {
      this.loading.deviceModels = true
      this.error = null

      try {
        const api = useServiceTickets()
        const deviceModels = await api.fetchDeviceModels()
        this.deviceModelsList = deviceModels
        return deviceModels
      } catch (error: any) {
        this.error = error.message || 'Gagal memuat data device models'
        throw error
      } finally {
        this.loading.action = false
      }
    },

    // ========== KERUSAKAN ==========
    async fetchKerusakan(params?: { serviceTicketId?: number }) {
      this.loading.kerusakan = true
      this.error = null

      try {
        const api = useServiceTickets()
        const kerusakan: ServiceTicketKerusakanResponse[] =
          await api.fetchKerusakan(params)
        this.kerusakanList = kerusakan
        return kerusakan
      } catch (error: any) {
        this.error = error.message || 'Gagal memuat data kerusakan'
        throw error
      } finally {
        this.loading.kerusakan = false
      }
    },

   async createKerusakan(serviceTicketId: number, kerusakanField: string) {
  this.loading.action = true
  this.error = null

  try {
    const api = useServiceTickets()

    const kerusakan = await api.createKerusakan(serviceTicketId, {
      kerusakanField
    })

    // Update currentServiceTicket jika sedang dibuka
    if (this.currentServiceTicket?.id === serviceTicketId) {
      if (!this.currentServiceTicket.kerusakan) {
        this.currentServiceTicket.kerusakan = []
      }

      this.currentServiceTicket.kerusakan.push({
        id: kerusakan.id,
        masterKerusakanId: 0,
        namaKerusakan: '',
        biaya: 0,
        catatan: null,
        kerusakanField: kerusakan.kerusakanField
      })
    }

    return kerusakan
  } catch (error: any) {
    this.error = error.data?.message || 'Gagal membuat kerusakan'
    throw error
  } finally {
    this.loading.action = false
  }
},

    async updateKerusakan(id: number, data: KerusakanUpdateRequest) {
      this.loading.action = true
      this.error = null

      try {
        const api = useServiceTickets()
        await api.updateKerusakan(id, data)

        const index = this.kerusakanList.findIndex(k => k.id === id)
        if (index !== -1) {
          const current = this.kerusakanList[index]
          this.kerusakanList[index] = {
            ...current,
            kerusakanField: data.kerusakanField
          } as ServiceTicketKerusakanResponse
        }

        // Update di currentServiceTicket jika ada
        if (this.currentServiceTicket) {
          const kerusakanIndex = this.currentServiceTicket.kerusakan.findIndex(k => k.id === id)
          const item = kerusakanIndex !== -1 ? this.currentServiceTicket.kerusakan[kerusakanIndex] : undefined
          if (item) item.kerusakanField = data.kerusakanField
        }
      } catch (error: any) {
        this.error = error.data?.message || 'Gagal mengupdate kerusakan'
        throw error
      } finally {
        this.loading.action = false
      }
      
    },

   async deleteKerusakan(serviceTicketId: number, kerusakanId: number) {
  this.loading.action = true
  this.error = null

  try {
    const api = useServiceTickets()
    await api.deleteKerusakan(serviceTicketId, kerusakanId)

    if (this.currentServiceTicket) {
      this.currentServiceTicket.kerusakan =
        this.currentServiceTicket.kerusakan.filter(k => k.id !== kerusakanId)
    }
  } catch (error: any) {
    this.error = error.data?.message || 'Gagal menghapus kerusakan'
    throw error
  } finally {
    this.loading.action = false
  }
},

    // ========== FILTER & PAGINATION ==========
    setFilters(filters: Partial<ServiceTicketState['filters']>) {
      this.filters = { ...this.filters, ...filters }
      this.pagination.page = 1
    },

    resetFilters() {
      this.filters = {
        search: '',
        teknisiId: null,
        status: null,
        startDate: null,
        endDate: null
      }
      this.pagination.page = 1
    },

    setPage(page: number) {
      this.pagination.page = page
    },

    setPageSize(pageSize: number) {
      this.pagination.pageSize = pageSize
      this.pagination.page = 1
    },

    // ========== UTILITY ==========
    clearError() {
      this.error = null
    },

    clearCurrentServiceTicket() {
      this.currentServiceTicket = null
    },

    clearServiceTickets() {
      this.serviceTickets = []
      this.pagination = {
        page: 1,
        pageSize: this.pagination.pageSize || 20,
        total: 0,
        pages: 0
      }
    },

    reset() {
      this.$reset()
    }
  }
})