import { defineStore } from 'pinia'
import type { MasterKerusakan, MasterKerusakanCreateRequest, MasterKerusakanUpdateRequest } from '~/composables/useMasterKerusakan'

interface MasterKerusakanState {
  items: MasterKerusakan[]
  currentItem: MasterKerusakan | null
  pagination: {
    page: number
    pageSize: number
    total: number
    pages: number
  }
  filters: {
    search: string
  }
  loading: {
    list: boolean
    detail: boolean
    action: boolean
  }
  error: string | null
}

export const useMasterKerusakanStore = defineStore('masterKerusakan', {
  state: (): MasterKerusakanState => ({
    items: [],
    currentItem: null,
    pagination: {
      page: 1,
      pageSize: 20,
      total: 0,
      pages: 0
    },
    filters: {
      search: ''
    },
    loading: {
      list: false,
      detail: false,
      action: false
    },
    error: null
  }),

  getters: {
  filteredItems: (state) => {
    const items = state.items || []
    const search = (state.filters.search || '').toLowerCase().trim()

    if (!search) return items

    return items.filter(item =>
      (item.nama || '').toLowerCase().includes(search) ||
      (item.deskripsi || '').toLowerCase().includes(search)
    )
  },

  paginatedItems(): MasterKerusakan[] {
    const start = (this.pagination.page - 1) * this.pagination.pageSize
    const end = start + this.pagination.pageSize
    return this.filteredItems.slice(start, end)
  },

  totalFiltered(): number {
    return this.filteredItems.length
  },

  totalPages(): number {
    return Math.ceil(this.totalFiltered / this.pagination.pageSize)
  }
},

  actions: {
    async fetchAll() {
      this.loading.list = true
      this.error = null
      try {
        const api = useMasterKerusakan()
        const items = await api.fetchAll()
        this.items = items || []
        this.pagination.total = items.length
        this.pagination.pages = Math.ceil(items.length / this.pagination.pageSize)
        this.pagination.page = 1
      } catch (error: any) {
        this.error = error.message || 'Gagal memuat data'
        throw error
      } finally {
        this.loading.list = false
      }
    },

    async fetchById(id: number) {
      this.loading.detail = true
      this.error = null
      try {
        const api = useMasterKerusakan()
        const item = await api.fetchById(id)
        this.currentItem = item
        return item
      } catch (error: any) {
        this.error = error.message || 'Gagal memuat detail'
        throw error
      } finally {
        this.loading.detail = false
      }
    },

    async create(data: MasterKerusakanCreateRequest) {
      this.loading.action = true
      this.error = null
      try {
        const api = useMasterKerusakan()
        await api.create(data)
        await this.fetchAll()
      } catch (error: any) {
        this.error = error.data?.message || 'Gagal membuat data'
        throw error
      } finally {
        this.loading.action = false
      }
    },

    async update(id: number, data: MasterKerusakanUpdateRequest) {
      this.loading.action = true
      this.error = null
      try {
        const api = useMasterKerusakan()
        await api.update(id, data)
        await this.fetchAll()
      } catch (error: any) {
        this.error = error.data?.message || 'Gagal mengupdate data'
        throw error
      } finally {
        this.loading.action = false
      }
    },

    async delete(id: number) {
      this.loading.action = true
      this.error = null
      try {
        const api = useMasterKerusakan()
        await api.remove(id)
        this.items = this.items.filter(item => item.id !== id)
        this.pagination.total = this.items.length
        this.pagination.pages = Math.ceil(this.items.length / this.pagination.pageSize)
      } catch (error: any) {
        this.error = error.data?.message || 'Gagal menghapus data'
        throw error
      } finally {
        this.loading.action = false
      }
    },

    setPage(page: number) {
      this.pagination.page = page
    },

    setPageSize(size: number) {
      this.pagination.pageSize = size
      this.pagination.page = 1
    },

    setSearch(search: string) {
      this.filters.search = search
      this.pagination.page = 1
    },

    resetFilters() {
      this.filters.search = ''
      this.pagination.page = 1
    },

    clearError() {
      this.error = null
    },

    reset() {
      this.$reset()
    }
  }
})