// composables/useAdminGallery.ts
/**
 * Composable untuk Admin Gallery operations
 */

export const useAdminGallery = () => {
  const api = useApiClient()
  const loading = ref(false)
  const error = ref<string | null>(null)
  const galleries = ref<any[]>([])
  const stats = ref<any>(null)

  /**
   * Fetch galleries untuk admin
   */
  const fetchGalleries = async (params?: any) => {
    loading.value = true
    error.value = null

    try {
      galleries.value = await api.adminGallery.list(params)
      console.log('✅ Admin galleries fetched:', galleries.value.length)
    } catch (err: any) {
      error.value = err?.message || 'Failed to fetch galleries'
      console.error('❌ Fetch admin galleries error:', error.value)
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
      const result = await api.adminGallery.detail(id)
      console.log('✅ Admin gallery fetched:', id)
      return result
    } catch (err: any) {
      error.value = err?.message || 'Failed to fetch gallery'
      console.error('❌ Get admin gallery error:', error.value)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Create gallery
   */
  const createGallery = async (body: any) => {
    loading.value = true
    error.value = null

    try {
      const result = await api.adminGallery.create(body)
      console.log('✅ Gallery created')
      // Refresh list
      await fetchGalleries()
      return result
    } catch (err: any) {
      error.value = err?.message || 'Failed to create gallery'
      console.error('❌ Create gallery error:', error.value)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Update gallery
   */
  const updateGallery = async (id: number | string, body: any) => {
    loading.value = true
    error.value = null

    try {
      const result = await api.adminGallery.update(id, body)
      console.log('✅ Gallery updated:', id)
      // Refresh list
      await fetchGalleries()
      return result
    } catch (err: any) {
      error.value = err?.message || 'Failed to update gallery'
      console.error('❌ Update gallery error:', error.value)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Delete gallery
   */
  const deleteGallery = async (id: number | string) => {
    loading.value = true
    error.value = null

    try {
      const result = await api.adminGallery.delete(id)
      console.log('✅ Gallery deleted:', id)
      // Refresh list
      await fetchGalleries()
      return result
    } catch (err: any) {
      error.value = err?.message || 'Failed to delete gallery'
      console.error('❌ Delete gallery error:', error.value)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Bulk update status
   */
  const bulkUpdateStatus = async (body: any) => {
    loading.value = true
    error.value = null

    try {
      const result = await api.adminGallery.bulkUpdate(body)
      console.log('✅ Galleries bulk updated')
      // Refresh list
      await fetchGalleries()
      return result
    } catch (err: any) {
      error.value = err?.message || 'Failed to bulk update'
      console.error('❌ Bulk update error:', error.value)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Get stats
   */
  const fetchStats = async () => {
    loading.value = true
    error.value = null

    try {
      stats.value = await api.adminGallery.stats()
      console.log('✅ Gallery stats fetched')
      return stats.value
    } catch (err: any) {
      error.value = err?.message || 'Failed to fetch stats'
      console.error('❌ Fetch stats error:', error.value)
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    galleries,
    stats,
    loading,
    error,
    fetchGalleries,
    getGallery,
    createGallery,
    updateGallery,
    deleteGallery,
    bulkUpdateStatus,
    fetchStats,
  }
}
