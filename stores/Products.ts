// stores/product.ts
import { defineStore } from 'pinia'
import type {
  Product,
  ProductDetail,
  ProductListResponse,
  CreateProductRequest,
  UpdateProductRequest,
  DeviceModel,
  ProductType,
  PartBrand,
  QualityGrade
} from '~/composables/useProductApi'

interface ProductState {
  products: Product[]
  currentProduct: ProductDetail | null

  deviceModels: DeviceModel[]
  productTypes: ProductType[]
  partBrands: PartBrand[]
  qualityGrades: QualityGrade[]

  pagination: {
    page: number
    pageSize: number
    total: number
    pages: number
  }

  filters: {
    search: string
    typeId: number | null
    brandId: number | null
    deviceId: number | null
  }

  loading: {
    products: boolean
    detail: boolean
    references: boolean
    action: boolean
  }

  error: string | null
}

export const useProductStore = defineStore('product', {
  state: (): ProductState => ({
    products: [],
    currentProduct: null,

    deviceModels: [],
    productTypes: [],
    partBrands: [],
    qualityGrades: [],

    pagination: {
      page: 1,
      pageSize: 20,
      total: 0,
      pages: 0
    },

    filters: {
      search: '',
      typeId: null,
      brandId: null,
      deviceId: null
    },

    loading: {
      products: false,
      detail: false,
      references: false,
      action: false
    },

    error: null
  }),

  getters: {
    getProductById: (state) => (id: number) => {
      return state.products.find(p => p.id === id)
    },

    hasProducts: (state) => state.products.length > 0,

    isLoading: (state) => Object.values(state.loading).some(v => v),

    activeProducts: (state) => state.products.filter(p => p.isActive),

    lowStockProducts: (state) => state.products.filter(p => p.stock <= 5),

    uniqueProducts: (state) => {
      const seen = new Set<number>()
      return state.products.filter(product => {
        if (seen.has(product.id)) {
          console.warn(`[Store] Duplicate product ID removed: ${product.id}`)
          return false
        }
        seen.add(product.id)
        return true
      })
    },

    productsByType(): Record<string, Product[]> {
      const grouped: Record<string, Product[]> = {}

      this.uniqueProducts.forEach(product => {
        const productType = typeof product.productType === 'string'
          ? product.productType
          : 'Uncategorized'

        if (!grouped[productType]) {
          grouped[productType] = []
        }

        grouped[productType]!.push(product)
      })
      return grouped
    },

    // Rekap
    totalProducts: (state) => state.pagination.total,
    totalStock: (state) =>
      state.products.reduce((sum, p) => sum + (p.stock ?? 0), 0),
    activeCount: (state) => state.products.filter(p => p.isActive).length,
    inactiveCount: (state) => state.products.filter(p => !p.isActive).length
  },

  actions: {
    // ===== FETCH PRODUCTS =====
    // mode:
    // - admin:  append = false (default) -> REPLACE data (pagination biasa)
    // - user:   append = true  -> APPEND data (infinity scroll)
    async fetchProducts(params?: {
      page?: number
      pageSize?: number
      search?: string
      typeId?: number
      brandId?: number
      deviceId?: number
      append?: boolean
    }) {
      this.loading.products = true
      this.error = null

      try {
        const productApi = useProductApi()

        const queryParams = {
          page: params?.page ?? this.pagination.page,
          pageSize: params?.pageSize ?? this.pagination.pageSize,
          search: params?.search ?? this.filters.search,
          typeId: params?.typeId ?? this.filters.typeId ?? undefined,
          brandId: params?.brandId ?? this.filters.brandId ?? undefined,
          deviceId: params?.deviceId ?? this.filters.deviceId ?? undefined
        }

        console.log('[Store] Fetching products with params:', queryParams)

        const response: ProductListResponse = await productApi.fetchProducts(queryParams)

        const shouldAppend = params?.append === true

        if (!shouldAppend) {
          // NORMAL PAGINATION (admin) -> replace
          console.log('[Store] Replace products (normal pagination)')
          this.products = response.data
        } else {
          // INFINITY SCROLL (user) -> append + filter duplikat
          console.log('[Store] Append products (infinity scroll)')
          const existingIds = new Set(this.products.map(p => p.id))
          const newProducts = response.data.filter(p => !existingIds.has(p.id))

          const duplicateCount = response.data.length - newProducts.length
          if (duplicateCount > 0) {
            console.warn(`[Store] Filtered ${duplicateCount} duplicate products`)
          }

          this.products = [...this.products, ...newProducts]
        }

        this.pagination = {
          page: response.pagination.page,
          pageSize: response.pagination.pageSize,
          total: response.pagination.total,
          pages: response.pagination.pages
        }

        console.log('[Store] Pagination updated:', this.pagination)

        return response
      } catch (error: any) {
        this.error = error.message || 'Gagal memuat daftar produk'
        console.error('[Store] Error fetching products:', error)
        throw error
      } finally {
        this.loading.products = false
      }
    },

    // ===== INFINITY SCROLL HELPERS (untuk halaman user) =====
    async loadNextPage() {
      if (this.pagination.page < this.pagination.pages) {
        const nextPage = this.pagination.page + 1
        console.log(`[Store] Loading next page (frontend): ${nextPage}`)

        await this.fetchProducts({
          page: nextPage,
          append: true
        })

        return true
      }

      console.log('[Store] No more pages to load (frontend)')
      return false
    },

    hasMorePages(): boolean {
      return this.pagination.page < this.pagination.pages
    },

    // ===== FETCH PRODUCT DETAIL =====
    async fetchProductById(id: number) {
      this.loading.detail = true
      this.error = null

      try {
        const productApi = useProductApi()
        const product = await productApi.fetchProductById(id)

        this.currentProduct = product

        return product
      } catch (error: any) {
        this.error = error.message || 'Gagal memuat detail produk'
        console.error('Error fetching product detail:', error)
        throw error
      } finally {
        this.loading.detail = false
      }
    },

    // ===== CREATE PRODUCT =====
    async createProduct(data: CreateProductRequest) {
      this.loading.action = true
      this.error = null

      try {
        const productApi = useProductApi()
        const product = await productApi.createProduct(data)

        this.pagination.page = 1
        await this.fetchProducts({ page: 1 })

        return product
      } catch (error: any) {
        this.error = error.data?.message || 'Gagal membuat produk'
        console.error('Error creating product:', error)
        throw error
      } finally {
        this.loading.action = false
      }
    },

    // ===== UPDATE PRODUCT =====
    async updateProduct(id: number, data: UpdateProductRequest) {
      this.loading.action = true
      this.error = null

      try {
        const productApi = useProductApi()
        const product = await productApi.updateProduct(id, data)

        const index = this.products.findIndex(p => p.id === id)
        if (index !== -1) {
          this.products[index] = {
            ...this.products[index],
            id: product.id,
            name: product.name,
            sku: product.sku,
            deviceModel: product.deviceModel,
            productType: product.productType,
            partBrand: product.partBrand,
            qualityGrade: product.qualityGrade,
            stock: product.stock,
            price: product.retailPrice,
            imageUrl: product.imageUrl,
            isActive: product.isActive,
            lastUpdatedAt: product.lastUpdatedAt
          }
        }

        if (this.currentProduct?.id === id) {
          this.currentProduct = product
        }

        return product
      } catch (error: any) {
        this.error = error.data?.message || 'Gagal mengupdate produk'
        console.error('Error updating product:', error)
        throw error
      } finally {
        this.loading.action = false
      }
    },

    // ===== DELETE PRODUCT =====
    async deleteProduct(id: number) {
      this.loading.action = true
      this.error = null

      try {
        const productApi = useProductApi()
        await productApi.deleteProduct(id)

        const initialLength = this.products.length
        this.products = this.products.filter(p => p.id !== id)

        if (this.products.length < initialLength) {
          this.pagination.total = Math.max(0, this.pagination.total - 1)
          this.pagination.pages = Math.ceil(this.pagination.total / this.pagination.pageSize)
        }

        if (this.currentProduct?.id === id) {
          this.currentProduct = null
        }
      } catch (error: any) {
        this.error = error.data?.message || 'Gagal menghapus produk'
        console.error('Error deleting product:', error)
        throw error
      } finally {
        this.loading.action = false
      }
    },

    async bulkDeleteProducts(productIds: number[]) {
  this.loading.action = true
  this.error = null

  try {
    const productApi = useProductApi()
    await productApi.bulkDeleteProducts(productIds)

    // Remove dari list
    this.products = this.products.filter(p => !productIds.includes(p.id))
    this.pagination.total = Math.max(0, this.pagination.total - productIds.length)

    return true
  } catch (error: any) {
    this.error = error.data?.message || 'Gagal menghapus produk'
    throw error
  } finally {
    this.loading.action = false
  }
},


    // ===== UPDATE STOCK =====
    async updateStock(id: number, newStock: number) {
      this.loading.action = true
      this.error = null

      try {
        const productApi = useProductApi()
        const result = await productApi.updateStock(id, newStock)

        const product = this.products.find(p => p.id === id)
        if (product) {
          product.stock = result.newStock
        }

        if (this.currentProduct?.id === id) {
          this.currentProduct.stock = result.newStock
          this.currentProduct.isLowStock = result.isLowStock
        }

        return result
      } catch (error: any) {
        this.error = error.data?.message || 'Gagal mengupdate stok'
        console.error('Error updating stock:', error)
        throw error
      } finally {
        this.loading.action = false
      }
    },

    // ===== UPDATE STATUS =====
    async updateStatus(id: number, isActive: boolean) {
      this.loading.action = true
      this.error = null

      try {
        const productApi = useProductApi()
        const result = await productApi.updateStatus(id, isActive)

        const product = this.products.find(p => p.id === id)
        if (product) {
          product.isActive = result.isActive
        }

        if (this.currentProduct?.id === id) {
          this.currentProduct.isActive = result.isActive
        }

        return result
      } catch (error: any) {
        this.error = error.data?.message || 'Gagal mengupdate status'
        console.error('Error updating status:', error)
        throw error
      } finally {
        this.loading.action = false
      }
    },

    // ===== MASTER DATA ACTIONS =====
    async createDeviceModel(deviceBrand: string, modelName: string) {
      this.loading.action = true
      this.error = null

      try {
        const api = useProductApi()
        const model = await api.createDeviceModel({ deviceBrand, modelName })

        const fullName = (model as any).fullName ?? `${deviceBrand} ${modelName}`

        this.deviceModels.push({
          ...model,
          fullName
        })

        return { ...model, fullName }
      } catch (error: any) {
        this.error = error.message || 'Gagal membuat model perangkat'
        throw error
      } finally {
        this.loading.action = false
      }
    },

    async createProductType(name: string, description?: string) {
      this.loading.action = true
      this.error = null

      try {
        const api = useProductApi()
        const type = await api.createProductType({ name, description })
        this.productTypes.push(type)
        return type
      } catch (error: any) {
        this.error = error.message || 'Gagal membuat tipe produk'
        throw error
      } finally {
        this.loading.action = false
      }
    },

    async createPartBrand(name: string, description?: string) {
      this.loading.action = true
      this.error = null

      try {
        const api = useProductApi()
        const brand = await api.createPartBrand({ name, notes: description })
        this.partBrands.push(brand)
        return brand
      } catch (error: any) {
        this.error = error.message || 'Gagal membuat merek spare part'
        throw error
      } finally {
        this.loading.action = false
      }
    },

    async createQualityGrade(name: string, description?: string) {
      this.loading.action = true
      this.error = null

      try {
        const api = useProductApi()
        const grade = await api.createQualityGrade({ name, description })
        this.qualityGrades.push(grade)
        return grade
      } catch (error: any) {
        this.error = error.message || 'Gagal membuat kualitas'
        throw error
      } finally {
        this.loading.action = false
      }
    },

    async updatePartBrand(id: number, data: { name?: string; description?: string }) {
      this.loading.action = true
      this.error = null

      try {
        const api = useProductApi()
        const updated = await api.updatePartBrand(id, {
          name: data.name,
          notes: data.description
        })

        const index = this.partBrands.findIndex(b => b.id === id)
        if (index !== -1) {
          this.partBrands[index] = updated
        }

        return updated
      } catch (error: any) {
        this.error = error.message || 'Gagal mengupdate merek spare part'
        throw error
      } finally {
        this.loading.action = false
      }
    },

    async deletePartBrand(id: number) {
      this.loading.action = true
      this.error = null

      try {
        const api = useProductApi()
        await api.deletePartBrand(id)

        this.partBrands = this.partBrands.filter(b => b.id !== id)

        if (this.currentProduct?.partBrandId === id) {
          this.currentProduct.partBrandId = 0 as any
        }
      } catch (error: any) {
        this.error = error.message || 'Gagal menghapus merek spare part'
        throw error
      } finally {
        this.loading.action = false
      }
    },

    // ===== FETCH REFERENCE DATA =====
    async fetchReferences() {
      this.loading.references = true
      this.error = null

      try {
        const productApi = useProductApi()

        console.log('[Store] Fetching references...')

        const [devices, types, brands, grades] = await Promise.all([
          productApi.fetchDeviceModels(),
          productApi.fetchProductTypes(),
          productApi.fetchPartBrands(),
          productApi.fetchQualityGrades()
        ])

        console.log('[Store] Device Models:', devices.length)
        console.log('[Store] Product Types:', types.length)
        console.log('[Store] Part Brands:', brands.length)
        console.log('[Store] Quality Grades:', grades.length)

        this.deviceModels = devices
        this.productTypes = types
        this.partBrands = brands
        this.qualityGrades = grades

      } catch (error: any) {
        console.error('[Store] Error fetching references:', error)
        this.error = error.message || 'Gagal memuat data referensi'
        throw error
      } finally {
        this.loading.references = false
      }
    },

    // ===== FILTER ACTIONS =====
    setFilters(filters: Partial<ProductState['filters']>) {
      this.filters = { ...this.filters, ...filters }
      this.pagination.page = 1
    },

    resetFilters() {
      this.filters = {
        search: '',
        typeId: null,
        brandId: null,
        deviceId: null
      }
      this.pagination.page = 1
    },

    // ===== PAGINATION ACTIONS =====
    setPage(page: number) {
      this.pagination.page = page
    },

    setPageSize(pageSize: number) {
      this.pagination.pageSize = pageSize
      this.pagination.page = 1
    },

    // ===== UTILITY ACTIONS =====
    clearError() {
      this.error = null
    },

    clearCurrentProduct() {
      this.currentProduct = null
    },

    clearProducts() {
      this.products = []
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
