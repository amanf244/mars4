// composables/useGallery.ts
/**
 * Composable untuk Gallery operations
 */

export const useGallery = () => {
  const api = useApiClient()
  const loading = ref(false)
  const error = ref<string | null>(null)
  const galleries = ref<any[]>([])

  /**
   * Fetch list gallery
   */
  const fetchGalleries = async () => {
    loading.value = true
    error.value = null

    try {
      galleries.value = await api.gallery.list()
      console.log('✅ Galleries fetched:', galleries.value.length)
    } catch (err: any) {
      error.value = err?.message || 'Failed to fetch galleries'
      console.error('❌ Fetch galleries error:', error.value)
    } finally {
      loading.value = false
    }
  }

  /**
   * Get single gallery
   */
  const getGallery = async (id: number | string) => {
    loading.value = true
    error.value = null

    try {
      const result = await api.gallery.detail(id)
      console.log('✅ Gallery fetched:', id)
      return result
    } catch (err: any) {
      error.value = err?.message || 'Failed to fetch gallery'
      console.error('❌ Get gallery error:', error.value)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Upload gallery image
   */
  const uploadGallery = async (formData: FormData) => {
    loading.value = true
    error.value = null

    try {
      const result = await api.gallery.upload(formData)
      console.log('✅ Gallery uploaded')
      return result
    } catch (err: any) {
      error.value = err?.message || 'Failed to upload gallery'
      console.error('❌ Upload error:', error.value)
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    galleries,
    loading,
    error,
    fetchGalleries,
    getGallery,
    uploadGallery,
  }
}
