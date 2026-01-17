// composables/useCaseStudies.ts

import type { CaseStudiesItem, CaseStudiesListData, CreateCaseStudiesPayload, ApiResponse } from '~/types/caseStudies'

export const useCaseStudies = () => {
  const config = useRuntimeConfig()
  const auth = useAuthStore()
  
  const baseUrl = `${config.public.apiBase}/case-studies`

  // ========== GET ALL ==========
  const list = async (params?: {
    page?: number
    limit?: number
    status?: string
    category?: string
    search?: string
    sortBy?: string
    sortOrder?: string
  }) => {
    try {
      const response = await $fetch<ApiResponse<CaseStudiesListData>>(baseUrl, {
        method: 'GET',
        query: {
          page: params?.page || 1,
          limit: params?.limit || 12,
          status: params?.status || 'published',
          category: params?.category,
          search: params?.search,
          sortBy: params?.sortBy || 'created_at',
          sortOrder: params?.sortOrder || 'desc'
        }
      })
      
      return response.data
    } catch (err: any) {
      const errorMsg = err?.data?.message || err?.message || 'Failed to fetch case studies'
      console.error('❌ List case studies error:', errorMsg)
      throw err
    }
  }

  // ========== GET BY ID ==========
  const getById = async (id: number) => {
    try {
      const response = await $fetch<ApiResponse<{ item: CaseStudiesItem }>>(`${baseUrl}/${id}`, {
        method: 'GET'
      })
      
      return response.data?.item
    } catch (err: any) {
      const errorMsg = err?.data?.message || err?.message || 'Failed to fetch case study'
      console.error('❌ Get case study error:', errorMsg)
      throw err
    }
  }

  // ========== CREATE ==========
  const create = async (payload: CreateCaseStudiesPayload) => {
    try {
      if (!auth.token) {
        throw new Error('Not authenticated')
      }

      const response = await $fetch<ApiResponse<CaseStudiesItem>>(baseUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${auth.token}`
        },
        body: payload
      })

      console.log('✅ Case study created:', response.data?.id)
      return response.data
    } catch (err: any) {
      const errorMsg = err?.data?.message || err?.message || 'Failed to create case study'
      console.error('❌ Create case study error:', errorMsg)
      throw err
    }
  }

  // ========== UPDATE (if available) ==========
  const update = async (id: number, payload: Partial<CreateCaseStudiesPayload>) => {
    try {
      if (!auth.token) {
        throw new Error('Not authenticated')
      }

      const response = await $fetch<ApiResponse<CaseStudiesItem>>(`${baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${auth.token}`
        },
        body: payload
      })

      console.log('✅ Case study updated:', response.data?.id)
      return response.data
    } catch (err: any) {
      const errorMsg = err?.data?.message || err?.message || 'Failed to update case study'
      console.error('❌ Update case study error:', errorMsg)
      throw err
    }
  }

  // ========== DELETE (if available) ==========
  const deleteItem = async (id: number) => {
    try {
      if (!auth.token) {
        throw new Error('Not authenticated')
      }

      const response = await $fetch<ApiResponse<null>>(`${baseUrl}/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      })

      console.log('✅ Case study deleted:', id)
      return true
    } catch (err: any) {
      const errorMsg = err?.data?.message || err?.message || 'Failed to delete case study'
      console.error('❌ Delete case study error:', errorMsg)
      throw err
    }
  }

  return {
    list,
    getById,
    create,
    update,
    deleteItem
  }
}
