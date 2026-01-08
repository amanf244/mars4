// composables/useGallery.ts
/**
 * Gallery operations composable
 */

export const useGallery = () => {
  const api = useApi()
  const loading = ref(false)
  const error = ref<string | null>(null)
  const galleries = ref<any[]>([])

  const fetchGalleries = async () => {
    loading.value = true
    error.value = null

    try {
      galleries.value = await api.gallery.list()
      console.log('✅ Galleries fetched:', galleries.value.length)
    } catch (err: any) {
      error.value = err?.message || 'Failed to fetch galleries'
      console.error('❌ Error:', error.value)
    } finally {
      loading.value = false
    }
  }

  const getGallery = async (id: number | string) => {
    loading.value = true
    error.value = null

    try {
      const result = await api.gallery.detail(id)
      console.log('✅ Gallery fetched:', id)
      return result
    } catch (err: any) {
      error.value = err?.message || 'Failed to fetch gallery'
      return null
    } finally {
      loading.value = false
    }
  }

  const uploadGallery = async (formData: FormData) => {
    loading.value = true
    error.value = null

    try {
      const result = await api.gallery.upload(formData)
      console.log('✅ Gallery uploaded')
      return result
    } catch (err: any) {
      error.value = err?.message || 'Failed to upload'
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
