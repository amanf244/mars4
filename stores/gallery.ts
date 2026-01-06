import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

export interface GalleryPhoto {
  url: string
  caption: string
}

export interface ProcessStep {
  title: string
  description: string
}

export interface GalleryItem {
  id?: number
  title: string
  caption: string
  text: string
  fullText: string
  photos: GalleryPhoto[]
  category: string
  date: string
  duration: string
  status: 'draft' | 'published' | 'archived'
  toolsUsed: string[]
  processSteps: ProcessStep[]
  complexityLevel: 'rendah' | 'menengah' | 'tinggi' | 'sangat_tinggi'
  tags: string
  slug?: string
  createdAt?: string
  updatedAt?: string
  createdBy?: number
}

export interface GalleryResponse {
  success: boolean
  message: string
  data: {
    items: GalleryItem[]
    meta: {
      total: number
      perPage: number
      currentPage: number
      lastPage: number
      firstPage: number
      firstPageUrl: string | null
      lastPageUrl: string | null
      nextPageUrl: string | null
      previousPageUrl: string | null
      categories?: string[]
    }
  }
}

interface GalleryState {
  items: GalleryItem[]
  currentItem: GalleryItem | null
  isLoading: boolean
  isSubmitting: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  filters: {
    status: string
    category: string
    search: string
    sortBy: string
    sortOrder: string
  }
}

// Helper function untuk headers dengan auth
function getAuthHeaders(): Record<string, string> {
  const authStore = useAuthStore()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
  
  if (authStore.token) {
    headers['Authorization'] = `Bearer ${authStore.token}`
  }
  
  return headers
}

// Generic error handler
function handleApiError(error: any): string {
  const toast = useToast()
  
  if (error.status === 401) {
    toast.error('Session expired. Please login again.')
    return 'Session expired. Please login again.'
  }
  
  if (error.status === 403) {
    toast.error('You do not have permission to perform this action.')
    return 'Access denied.'
  }
  
  if (error.data?.message) {
    const message = error.data.message
    toast.error(message)
    return message
  }
  
  if (error.message) {
    toast.error(error.message)
    return error.message
  }
  
  const defaultMessage = 'An unexpected error occurred. Please try again.'
  toast.error(defaultMessage)
  return defaultMessage
}

export const useGalleryStore = defineStore('gallery', {
  state: (): GalleryState => ({
    items: [],
    currentItem: null,
    isLoading: false,
    isSubmitting: false,
    error: null,
    pagination: {
      page: 1,
      limit: 12,
      total: 0,
      totalPages: 0
    },
    filters: {
      status: 'all',
      category: '',
      search: '',
      sortBy: 'created_at',
      sortOrder: 'desc'
    }
  }),

  getters: {
    publishedItems: (state) => state.items.filter(item => item.status === 'published'),
    draftItems: (state) => state.items.filter(item => item.status === 'draft'),
    archivedItems: (state) => state.items.filter(item => item.status === 'archived'),
    itemsByCategory: (state) => (category: string) => 
      state.items.filter(item => item.category === category),
    getItemById: (state) => (id: number) => 
      state.items.find(item => item.id === id),
    
    // Get unique categories from current items
    uniqueCategories: (state) => {
      const categories = new Set(state.items.map(item => item.category))
      return Array.from(categories).sort()
    }
  },

  actions: {
    async fetchGalleryItems(params?: { 
      page?: number
      limit?: number
      status?: string
      search?: string
      category?: string
      sortBy?: string
      sortOrder?: string
      isAdmin?: boolean
    }) {
      this.isLoading = true
      this.error = null
      
      try {
        // Determine endpoint based on role
        const endpoint = params?.isAdmin ? '/api/v1/admin/gallery' : '/api/v1/gallery'
        
        const { data, error } = await useFetch(endpoint, {
          baseURL: useRuntimeConfig().public.apiBase || 'http://localhost:5084',
          params: {
            page: params?.page || this.pagination.page,
            limit: params?.limit || this.pagination.limit,
            status: params?.status || (params?.isAdmin ? this.filters.status : 'published'),
            search: params?.search || this.filters.search,
            category: params?.category || this.filters.category,
            sortBy: params?.sortBy || this.filters.sortBy,
            sortOrder: params?.sortOrder || this.filters.sortOrder,
          },
          headers: getAuthHeaders(),
          retry: 1,
          timeout: 50840 // 30 second timeout
        })
        
        if (error.value) {
          throw error.value
        }
        
        const response = data.value as GalleryResponse
        
        if (response?.success && response?.data) {
          this.items = response.data.items || []
          this.pagination = {
            page: response.data.meta.currentPage || 1,
            limit: response.data.meta.perPage || 12,
            total: response.data.meta.total || 0,
            totalPages: response.data.meta.lastPage || 0
          }
          
          // Update filters if provided
          if (params) {
            if (params.status !== undefined) this.filters.status = params.status
            if (params.search !== undefined) this.filters.search = params.search
            if (params.category !== undefined) this.filters.category = params.category
            if (params.sortBy !== undefined) this.filters.sortBy = params.sortBy
            if (params.sortOrder !== undefined) this.filters.sortOrder = params.sortOrder
          }
          
          return response
        } else {
          throw new Error('Invalid response format')
        }
      } catch (error: any) {
        this.error = handleApiError(error)
        console.error('Failed to fetch gallery items:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async fetchGalleryItem(id: number | string) {
      this.isLoading = true
      this.error = null
      
      try {
        const { data, error } = await useFetch(`/api/v1/gallery/${id}`, {
          baseURL: useRuntimeConfig().public.apiBase || 'http://localhost:5084',
          headers: getAuthHeaders(),
          retry: 1
        })
        
        if (error.value) {
          throw error.value
        }
        
        const response = data.value as any
        this.currentItem = response.data?.item || null
        
        // Add to items list if not already present
        if (this.currentItem && !this.items.find(item => item.id === this.currentItem?.id)) {
          this.items.unshift(this.currentItem)
        }
        
        return response.data
      } catch (error: any) {
        this.error = handleApiError(error)
        console.error('Failed to fetch gallery item:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async createGalleryItem(itemData: Omit<GalleryItem, 'id' | 'slug' | 'createdAt' | 'updatedAt'>) {
      this.isSubmitting = true
      this.error = null
      
      try {
        const response = await $fetch('/api/v1/gallery', {
          baseURL: useRuntimeConfig().public.apiBase || 'http://localhost:5084',
          method: 'POST',
          body: JSON.stringify(itemData),
          headers: getAuthHeaders()
        }) as any
        
        if (!response.success) {
          throw new Error(response.message || 'Failed to create gallery item')
        }
        
        const newItem = response.data as GalleryItem
        this.items.unshift(newItem)
        this.currentItem = newItem
        
        // Update pagination total
        this.pagination.total += 1
        this.pagination.totalPages = Math.ceil(this.pagination.total / this.pagination.limit)
        
        useToast().success('Gallery item created successfully')
        return newItem
      } catch (error: any) {
        this.error = handleApiError(error)
        console.error('Failed to create gallery item:', error)
        throw error
      } finally {
        this.isSubmitting = false
      }
    },

    async updateGalleryItem(id: number, itemData: Partial<GalleryItem>) {
      this.isSubmitting = true
      this.error = null
      
      try {
        const response = await $fetch(`/api/v1/gallery/${id}`, {
          baseURL: useRuntimeConfig().public.apiBase || 'http://localhost:5084',
          method: 'PUT',
          body: JSON.stringify(itemData),
          headers: getAuthHeaders()
        }) as any
        
        if (!response.success) {
          throw new Error(response.message || 'Failed to update gallery item')
        }
        
        const updatedItem = response.data as GalleryItem
        
        // Update in store
        const index = this.items.findIndex(item => item.id === id)
        if (index !== -1) {
          this.items[index] = updatedItem
        } else {
          this.items.unshift(updatedItem)
        }
        
        if (this.currentItem?.id === id) {
          this.currentItem = updatedItem
        }
        
        useToast().success('Gallery item updated successfully')
        return updatedItem
      } catch (error: any) {
        this.error = handleApiError(error)
        console.error('Failed to update gallery item:', error)
        throw error
      } finally {
        this.isSubmitting = false
      }
    },

    async deleteGalleryItem(id: number) {
      this.isSubmitting = true
      this.error = null
      
      try {
        const response = await $fetch(`/api/v1/gallery/${id}`, {
          baseURL: useRuntimeConfig().public.apiBase || 'http://localhost:5084',
          method: 'DELETE',
          headers: getAuthHeaders()
        }) as any
        
        if (!response.success) {
          throw new Error(response.message || 'Failed to delete gallery item')
        }
        
        // Remove from store
        this.items = this.items.filter(item => item.id !== id)
        if (this.currentItem?.id === id) {
          this.currentItem = null
        }
        
        // Update pagination
        this.pagination.total = Math.max(0, this.pagination.total - 1)
        this.pagination.totalPages = Math.ceil(this.pagination.total / this.pagination.limit)
        
        useToast().success('Gallery item deleted successfully')
      } catch (error: any) {
        this.error = handleApiError(error)
        console.error('Failed to delete gallery item:', error)
        throw error
      } finally {
        this.isSubmitting = false
      }
    },

    async bulkUpdateStatus(ids: number[], status: 'published' | 'draft' | 'archived') {
      this.isSubmitting = true
      this.error = null
      
      try {
        const response = await $fetch('/api/v1/gallery/bulk/status', {
          baseURL: useRuntimeConfig().public.apiBase || 'http://localhost:5084',
          method: 'PATCH',
          body: JSON.stringify({ ids, status }),
          headers: getAuthHeaders()
        }) as any
        
        if (!response.success) {
          throw new Error(response.message || 'Failed to update items')
        }
        
        // Update local items
        ids.forEach(id => {
          const item = this.items.find(item => item.id === id)
          if (item) {
            item.status = status
          }
        })
        
        useToast().success(`Updated ${response.data?.updated || 0} items`)
        return response.data
      } catch (error: any) {
        this.error = handleApiError(error)
        console.error('Failed to bulk update status:', error)
        throw error
      } finally {
        this.isSubmitting = false
      }
    },

    async getStatistics() {
      this.isLoading = true
      
      try {
        const response = await $fetch('/api/v1/gallery/statistics', {
          baseURL: useRuntimeConfig().public.apiBase || 'http://localhost:5084',
          headers: getAuthHeaders()
        }) as any
        
        return response.data
      } catch (error: any) {
        console.error('Failed to fetch statistics:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Utility methods
    setPage(page: number) {
      this.pagination.page = Math.max(1, Math.min(page, this.pagination.totalPages))
    },

    setLimit(limit: number) {
      this.pagination.limit = Math.max(1, Math.min(limit, 100))
    },

    setFilter(key: keyof typeof this.filters, value: string) {
      this.filters[key] = value
      this.pagination.page = 1 // Reset to first page on filter change
    },

    clearFilters() {
      this.filters = {
        status: 'all',
        category: '',
        search: '',
        sortBy: 'created_at',
        sortOrder: 'desc'
      }
      this.pagination.page = 1
    },

    clearCurrentItem() {
      this.currentItem = null
    },

    clearError() {
      this.error = null
    }
  }
})