import { useAuthStore } from '~/stores/auth'

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export const useGalleryApi = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  const toast = useToast?.() || null

  const baseHeaders = computed(() => ({
    'Content-Type': 'application/json',
    ...(authStore.token ? { Authorization: `Bearer ${authStore.token}` } : {})
  }))

  const handleResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
    const data = await response.json()
    
    if (!response.ok) {
      if (response.status === 401) {
        authStore.logout()
        navigateTo('/login')
      }
      throw new Error(data.message || 'Request failed')
    }
    
    return data
  }

  const gallery = {
    // Get all gallery items with pagination
    async getAll(params?: { page?: number; limit?: number; status?: string }) {
      try {
        const response = await $fetch('/gallery', {
          baseURL: config.public.apiBase,
          params,
          headers: baseHeaders.value
        })
        return response
      } catch (error: any) {
        toast?.error(error.message || 'Failed to fetch gallery items')
        throw error
      }
    },

    // Get single gallery item
    async getById(id: number) {
      try {
        const response = await $fetch(`/gallery/${id}`, {
          baseURL: config.public.apiBase,
          headers: baseHeaders.value
        })
        return response
      } catch (error: any) {
        toast?.error(error.message || 'Failed to fetch gallery item')
        throw error
      }
    },

    // Create gallery item
    async create(data: any) {
      try {
        const response = await $fetch('/gallery', {
          baseURL: config.public.apiBase,
          method: 'POST',
          body: JSON.stringify(data),
          headers: baseHeaders.value
        })
        toast?.success('Gallery item created successfully')
        return response
      } catch (error: any) {
        toast?.error(error.message || 'Failed to create gallery item')
        throw error
      }
    },

    // Update gallery item
    async update(id: number, data: any) {
      try {
        const response = await $fetch(`/gallery/${id}`, {
          baseURL: config.public.apiBase,
          method: 'PUT',
          body: JSON.stringify(data),
          headers: baseHeaders.value
        })
        toast?.success('Gallery item updated successfully')
        return response
      } catch (error: any) {
        toast?.error(error.message || 'Failed to update gallery item')
        throw error
      }
    },

    // Delete gallery item
    async delete(id: number) {
      try {
        await $fetch(`/gallery/${id}`, {
          baseURL: config.public.apiBase,
          method: 'DELETE',
          headers: baseHeaders.value
        })
        toast?.success('Gallery item deleted successfully')
      } catch (error: any) {
        toast?.error(error.message || 'Failed to delete gallery item')
        throw error
      }
    },

    // Upload image
    async uploadImage(file: File) {
      try {
        const formData = new FormData()
        formData.append('image', file)
        
        const response = await $fetch('/gallery/upload', {
          baseURL: config.public.apiBase,
          method: 'POST',
          body: formData,
          headers: {
            ...baseHeaders.value,
            'Content-Type': 'multipart/form-data'
          }
        })
        
        return response
      } catch (error: any) {
        toast?.error(error.message || 'Failed to upload image')
        throw error
      }
    }
  }

  return { gallery }
}

// Toast utility (create if not exists)
export const useToast = () => {
  const toast = ref<any>(null)
  
  const show = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    // Implement your toast notification system
    console.log(`[${type.toUpperCase()}] ${message}`)
  }
  
  return {
    success: (message: string) => show(message, 'success'),
    error: (message: string) => show(message, 'error'),
    info: (message: string) => show(message, 'info')
  }
}