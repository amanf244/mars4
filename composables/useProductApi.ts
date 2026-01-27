// composables/useProductApi.ts
export interface DeviceModel {
  id: number
  deviceBrand: string  // Tambahkan ini
  modelName: string    // Tambahkan ini
  fullName: string
  isActive: boolean    // Tambahkan ini
}

export interface ProductType {
  id: number
  name: string
  description?: string
}

export interface PartBrand {
  id: number
  name: string
  description?: string
}

export interface QualityGrade {
  id: number
  name: string
  description?: string
}

export interface Product {
  id: number
  sku: string
  name: string
  deviceModel: string
  productType: string
  partBrand: string
  qualityGrade: string
  stock: number
  price: number
  imageUrl?: string
  isActive: boolean
  lastUpdatedAt: string
}

export interface ProductDetail {
  id: number
  sku: string
  name: string
  deviceModelId: number
  productTypeId: number
  partBrandId: number
  qualityGradeId: number
  deviceModel: string
  productType: string
  partBrand: string
  qualityGrade: string
  description?: string
  stock: number
  isLowStock: boolean
  costPrice: number
  technicianPrice: number
  retailPrice: number
  imageUrl?: string
  warrantyDays?: number
  isActive: boolean
  lastUpdatedAt: string
  createdAt: string
}

export interface CreateProductRequest {
  deviceModelId: number
  productTypeId: number
  partBrandId: number
  qualityGradeId: number
  sku?: string
  name: string
  description?: string
  stock: number
  costPrice: number
  technicianPrice: number
  retailPrice: number
  imageUrls?: string[]
  warrantyDays?: number
}

export interface UpdateProductRequest {
  sku?: string
  name?: string
  description?: string
  deviceModelId?: number
  productTypeId?: number
  partBrandId?: number
  qualityGradeId?: number
  stock?: number
  costPrice?: number
  technicianPrice?: number
  retailPrice?: number
  imageUrl?: string
  warrantyDays?: number
  isActive?: boolean
}

export interface ProductListResponse {
  data: Product[]
  pagination: {
    page: number
    pageSize: number
    total: number
    pages: number
  }
}

export const useProductApi = () => {
  const config = useRuntimeConfig()
  const auth = useAuthStore()

  const apiUrl = config.public.apiUrl || 'http://localhost:5084'

  // Products
  const fetchProducts = async (params: {
    page?: number
    pageSize?: number
    search?: string
    typeId?: number
    brandId?: number
    deviceId?: number
  } = {}): Promise<ProductListResponse> => {
    const query = new URLSearchParams()
    if (params.page) query.append('page', params.page.toString())
    if (params.pageSize) query.append('pageSize', params.pageSize.toString())
    if (params.search) query.append('search', params.search)
    if (params.typeId) query.append('typeId', params.typeId.toString())
    if (params.brandId) query.append('brandId', params.brandId.toString())
    if (params.deviceId) query.append('deviceId', params.deviceId.toString())

    const response = await $fetch<ProductListResponse>(`${apiUrl}/api/v1/products?${query}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    })
    return response
  }

  const fetchProductById = async (id: number): Promise<ProductDetail> => {
    const response = await $fetch<ProductDetail>(`${apiUrl}/api/v1/products/${id}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    })
    return response
  }

  const fetchProductBySku = async (sku: string): Promise<ProductDetail> => {
  const response = await $fetch<ProductDetail>(`${apiUrl}/api/v1/products/by-sku/${encodeURIComponent(sku)}`, {
    headers: {
      Authorization: `Bearer ${auth.token}`
    }
  })
  return response
}


  const createProduct = async (data: CreateProductRequest): Promise<ProductDetail> => {
    const response = await $fetch<ProductDetail>(`${apiUrl}/api/v1/products`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${auth.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    return response
  }

  const updateProduct = async (id: number, data: UpdateProductRequest): Promise<ProductDetail> => {
    const response = await $fetch<ProductDetail>(`${apiUrl}/api/v1/products/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${auth.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    return response
  }

  const deleteProduct = async (id: number): Promise<void> => {
    await $fetch(`${apiUrl}/api/v1/products/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    })
  }

  const updateStock = async (id: number, newStock: number): Promise<{productId: number, newStock: number, isLowStock: boolean}> => {
    const response = await $fetch<{productId: number, newStock: number, isLowStock: boolean}>(`${apiUrl}/api/v1/products/${id}/stock`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${auth.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ newStock })
    })
    return response
  }

  const updateStatus = async (id: number, isActive: boolean): Promise<{productId: number, isActive: boolean}> => {
    const response = await $fetch<{productId: number, isActive: boolean}>(`${apiUrl}/api/v1/products/${id}/status`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${auth.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ isActive })
    })
    return response
  }

  // Device Models
  const fetchDeviceModels = async (): Promise<DeviceModel[]> => {
    const response = await $fetch<DeviceModel[]>(`${apiUrl}/api/v1/device-models`, {
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    })
    return response
  }

  // Product Types
  const fetchProductTypes = async (): Promise<ProductType[]> => {
    const response = await $fetch<ProductType[]>(`${apiUrl}/api/v1/product-types`, {
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    })
    return response
  }

  // Part Brands
  const fetchPartBrands = async (): Promise<PartBrand[]> => {
    const response = await $fetch<PartBrand[]>(`${apiUrl}/api/v1/part-brands`, {
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    })
    return response
  }

  // Quality Grades
  const fetchQualityGrades = async (): Promise<QualityGrade[]> => {
    const response = await $fetch<QualityGrade[]>(`${apiUrl}/api/v1/quality-grades`, {
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    })
    return response
  }

  // ===== DEVICE MODELS =====
const createDeviceModel = async (data: {
  deviceBrand: string
  modelName: string
}): Promise<DeviceModel> => {
  const response = await $fetch<DeviceModel>(`${apiUrl}/api/v1/device-models`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${auth.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  return response
}

const updateDeviceModel = async (
  id: number,
  data: { deviceBrand?: string; modelName?: string; isActive?: boolean }
): Promise<DeviceModel> => {
  const response = await $fetch<DeviceModel>(`${apiUrl}/api/v1/device-models/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${auth.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  return response
}

const deleteDeviceModel = async (id: number): Promise<void> => {
  await $fetch(`${apiUrl}/api/v1/device-models/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${auth.token}`
    }
  })
}

// ===== PRODUCT TYPES =====
const createProductType = async (data: {
  name: string
  description?: string
  icon?: string
}): Promise<ProductType> => {
  const response = await $fetch<ProductType>(`${apiUrl}/api/v1/product-types`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${auth.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  return response
}

const updateProductType = async (
  id: number,
  data: { name?: string; description?: string; icon?: string; isActive?: boolean }
): Promise<ProductType> => {
  const response = await $fetch<ProductType>(`${apiUrl}/api/v1/product-types/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${auth.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  return response
}

const deleteProductType = async (id: number): Promise<void> => {
  await $fetch(`${apiUrl}/api/v1/product-types/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${auth.token}`
    }
  })
}

// ===== PART BRANDS =====
const createPartBrand = async (data: {
  name: string
  originCountry?: string
  notes?: string
  logoUrl?: string
}): Promise<PartBrand> => {
  const response = await $fetch<PartBrand>(`${apiUrl}/api/v1/part-brands`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${auth.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  return response
}

const updatePartBrand = async (
  id: number,
  data: {
    name?: string
    originCountry?: string
    notes?: string
    logoUrl?: string
    isActive?: boolean
  }
): Promise<PartBrand> => {
  const response = await $fetch<PartBrand>(`${apiUrl}/api/v1/part-brands/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${auth.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  return response
}

const deletePartBrand = async (id: number): Promise<void> => {
  await $fetch(`${apiUrl}/api/v1/part-brands/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${auth.token}`
    }
  })
}

// ===== QUALITY GRADES =====
const createQualityGrade = async (data: {
  name: string
  description?: string
  sortOrder?: number
}): Promise<QualityGrade> => {
  const response = await $fetch<QualityGrade>(`${apiUrl}/api/v1/quality-grades`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${auth.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  return response
}

const updateQualityGrade = async (
  id: number,
  data: {
    name?: string
    description?: string
    sortOrder?: number
    isActive?: boolean
  }
): Promise<QualityGrade> => {
  const response = await $fetch<QualityGrade>(`${apiUrl}/api/v1/quality-grades/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${auth.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  return response
}

const deleteQualityGrade = async (id: number): Promise<void> => {
  await $fetch(`${apiUrl}/api/v1/quality-grades/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${auth.token}`
    }
  })
}


 return {
  // Products
  fetchProducts,
  fetchProductById,
  fetchProductBySku,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  updateStatus,
  // References
  fetchDeviceModels,
  fetchProductTypes,
  fetchPartBrands,
  fetchQualityGrades,
  // Masters CRUD
  createDeviceModel,
  updateDeviceModel,
  deleteDeviceModel,
  createProductType,
  updateProductType,
  deleteProductType,
  createPartBrand,
  updatePartBrand,
  deletePartBrand,
  createQualityGrade,
  updateQualityGrade,
  deleteQualityGrade
}
}
