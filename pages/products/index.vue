<!-- pages/products/index.vue -->
<template>

  <!-- Real-time Notification -->
  <Transition name="slide-down">
    <div
      v-if="realtimeNotification.show"
      class="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[300px] max-w-md"
    >
      <div class="p-4">
        <div class="flex items-center gap-3">
          <div
            :class="[
              'w-8 h-8 rounded-full flex items-center justify-center',
              realtimeNotification.type === 'stock'
                ? 'bg-blue-100 text-blue-600'
                : realtimeNotification.type === 'price'
                ? 'bg-green-100 text-green-600'
                : realtimeNotification.type === 'status'
                ? 'bg-yellow-100 text-yellow-600'
                : 'bg-gray-100 text-gray-600'
            ]"
          >
            <svg
              v-if="realtimeNotification.type === 'stock'"
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <svg
              v-else-if="realtimeNotification.type === 'price'"
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="flex-1">
            <p class="font-medium text-gray-900">{{ realtimeNotification.title }}</p>
            <p class="text-sm text-gray-600">{{ realtimeNotification.message }}</p>
          </div>
          <button @click="realtimeNotification.show = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Product Grid -->
  <div class="mb-8">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Produk Terbaru</h2>
        <p class="text-gray-600 mt-1">
          Update real-time • Menampilkan {{ store.products.length }} dari {{ pagination.total }} produk
        </p>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="toggleSort"
          class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
          </svg>
          <span>{{ sortOptions.find(s => s.value === sortBy)?.label }}</span>
        </button>
      </div>
    </div>

    <!-- Loading State (Initial) -->
    <div
      v-if="store.loading.products && store.products.length === 0"
      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
    >
      <div
        v-for="i in 10"
        :key="i"
        class="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse"
      >
        <div class="h-48 bg-gray-200"></div>
        <div class="p-3 space-y-2">
          <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          <div class="h-3 bg-gray-200 rounded w-1/2"></div>
          <div class="h-6 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    </div>

    <!-- Products -->
    <div
      v-else
      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
    >
      <ProductCardMarketplace
        v-for="product in sortedProducts"
        :key="product.id"
        :product="product"
        @add-to-cart="addToCart(product)"
      />
    </div>

    <!-- Infinity Scroll Trigger -->
    <div ref="loadMoreTrigger" class="py-8 flex justify-center">
      <!-- Loading More Spinner -->
      <div v-if="isLoadingMore" class="flex flex-col items-center gap-3">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
        <p class="text-sm text-gray-600 font-medium">Memuat lebih banyak produk...</p>
      </div>

      <!-- End of List -->
      <div
        v-else-if="!hasMore && store.products.length > 0"
        class="text-center"
      >
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-600">
          <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M5 13l4 4L19 7" />
          </svg>
          Semua produk telah ditampilkan ({{ pagination.total }} produk)
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="!store.loading.products && store.products.length === 0"
      class="text-center py-12"
    >
      <div class="mx-auto w-24 h-24 text-gray-300 mb-4">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Tidak ada produk ditemukan</h3>
      <p class="text-gray-500 mb-6">Coba ubah filter pencarian Anda</p>
      <button
        @click="resetFiltersFromPage"
        class="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium"
      >
        Reset Filter
      </button>
    </div>
  </div>

  <!-- Categories Section -->
  <div class="mb-8">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Kategori Populer</h2>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div
        v-for="category in popularCategories"
        :key="category.id"
        @click="handleSelectCategoryFromSection(category.id)"
        class="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow cursor-pointer"
      >
        <div class="w-12 h-12 mx-auto mb-3 rounded-lg bg-primary-100 flex items-center justify-center">
          <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="font-medium text-gray-900">{{ category.name }}</h3>
        <p class="text-sm text-gray-500 mt-1">{{ category.count }} produk</p>
      </div>
    </div>
  </div>

  <!-- Brand Section -->
  <div class="mb-8">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Merek Terpopuler</h2>
    <div class="flex flex-wrap gap-3">
      <button
        v-for="brand in popularBrands"
        :key="brand.id"
        @click="filterByBrand(brand.id)"
        :class="[
          'px-4 py-2 rounded-lg border font-medium transition-colors',
          selectedBrand === brand.id
            ? 'bg-primary-600 text-white border-primary-600'
            : 'bg-white text-gray-700 border-gray-300 hover:border-primary-500 hover:text-primary-600'
        ]"
      >
        {{ brand.name }}
      </button>
    </div>
  </div>

  <!-- Floating Cart -->
  <Transition name="slide-up">
    <div
      v-if="showCartPreview"
      class="fixed bottom-20 right-6 bg-white rounded-xl shadow-xl border border-gray-200 w-80 z-40"
    >
      <div class="p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold text-gray-900">Keranjang</h3>
          <button @click="showCartPreview = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="space-y-3 max-h-64 overflow-y-auto">
          <div v-for="item in cartItems" :key="item.id" class="flex items-center gap-3">
            <img
              :src="item.imageUrl || '/placeholder-product.jpg'"
              :alt="item.name"
              class="w-12 h-12 object-cover rounded-lg"
            >
            <div class="flex-1">
              <h4 class="text-sm font-medium text-gray-900 line-clamp-1">{{ item.name }}</h4>
              <p class="text-xs text-gray-500">Qty: {{ item.quantity }}</p>
            </div>
            <div class="text-right">
              <div class="text-sm font-medium text-gray-900">
                Rp {{ (item.price * item.quantity).toLocaleString('id-ID') }}
              </div>
            </div>
          </div>
        </div>
        <div class="mt-4 pt-4 border-t border-gray-200">
          <div class="flex justify-between mb-3">
            <span class="text-gray-600">Total</span>
            <span class="font-bold text-gray-900">
              Rp {{ cartTotal.toLocaleString('id-ID') }}
            </span>
          </div>
          <button @click="checkout" class="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium">
            Checkout
          </button>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Cart Button -->
  <button
    @click="toggleCartPreview"
    class="fixed bottom-6 right-6 bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-full shadow-lg z-30 flex items-center gap-2"
  >
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
    <span class="font-medium">{{ cartCount }}</span>
  </button>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'

definePageMeta({
  layout: 'marketplace'
})

useSeoMeta({
  title: 'Jual Sparepart Handphone Original di Serang | Mars4Mart',
  description: 'Marketplace sparepart handphone original di Serang, Banten. Cari LCD, baterai, charger, dan berbagai sparepart lain dengan harga terbaik dan garansi.',
  ogTitle: 'Mars4Mart - Sparepart Handphone Original Serang',
  ogDescription: 'Belanja sparepart handphone original, bergaransi, dan ready stock di Mars4Mart Serang.',
  ogType: 'website'
})

declare global {
  interface Window {
    searchTimeout?: number
  }
}

const store = useProductStore()
const { connect, disconnect } = useSignalR()

type CartItem = Product & { quantity: number }
type SortOptionValue = 'newest' | 'price-low' | 'price-high' | 'name'

const heroSelectedDevice = ref<{ label: string; value: string } | null>(null)
const heroSelectedType = ref<{ label: string; value: string } | null>(null)

const selectedBrand = ref<string | null>(null)
const sortBy = ref<SortOptionValue>('newest')
const showCartPreview = ref<boolean>(false)
const cartItems = ref<CartItem[]>([])

const loadMoreTrigger = ref<HTMLElement | null>(null)
const isLoadingMore = ref(false)
const pagination = ref({
  page: 1,
  pageSize: 20,
  total: 0,
  pages: 1
})

const realtimeNotification = ref<{
  show: boolean
  type: string
  title: string
  message: string
}>({
  show: false,
  type: '',
  title: '',
  message: ''
})

const sortOptions: { value: SortOptionValue; label: string }[] = [
  { value: 'newest', label: 'Terbaru' },
  { value: 'price-low', label: 'Harga Terendah' },
  { value: 'price-high', label: 'Harga Tertinggi' },
  { value: 'name', label: 'Nama A-Z' }
]

const deviceItems = computed(() =>
  store.deviceModels?.map(device => ({
    label: device.fullName || device.name || `Device ${device.id}`,
    value: device.id.toString()
  })) || []
)

const productTypesItems = computed(() =>
  store.productTypes?.map(productType => ({
    label: productType.name || `Type ${productType.id}`,
    value: productType.id.toString()
  })) || []
)

const cartCount = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.quantity, 0)
})

const cartTotal = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
})

const hasMore = computed(() => store.hasMorePages())

const sortedProducts = computed<Product[]>(() => {
  if (!store.uniqueProducts || store.uniqueProducts.length === 0) return []

  let products = [...store.uniqueProducts].filter(p => p.isActive)

  if (selectedBrand.value) {
    products = products.filter(p => p.partBrand === selectedBrand.value)
  }

  switch (sortBy.value) {
    case 'price-low':
      return products.sort((a, b) => (a.price || 0) - (b.price || 0))
    case 'price-high':
      return products.sort((a, b) => (b.price || 0) - (a.price || 0))
    case 'name':
      return products.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    default:
      return products.sort((a, b) => {
        const dateA = a.lastUpdatedAt ? new Date(a.lastUpdatedAt) : new Date(0)
        const dateB = b.lastUpdatedAt ? new Date(b.lastUpdatedAt) : new Date(0)
        return dateB.getTime() - dateA.getTime()
      })
  }
})

const popularCategories = computed(() => {
  const counts: Record<string, number> = {}
  store.uniqueProducts.forEach(product => {
    const key = product.productType ?? 'Lainnya'
    counts[key] = (counts[key] ?? 0) + 1
  })

  return Object.entries(counts)
    .map(([name, count]) => ({ id: name, name, count }))
    .slice(0, 4)
})

const popularBrands = computed(() => {
  const brandMap: Record<string, { id: string; name: string }> = {}

  store.uniqueProducts.forEach(product => {
    if (product.partBrand) {
      brandMap[product.partBrand] = {
        id: product.partBrand,
        name: product.partBrand
      }
    }
  })

  return Object.values(brandMap).slice(0, 8)
})

const checkout = () => {
  const phoneNumber = '6289630534368'

  const buyerName = 'Budi Santoso'
  const address = 'Jl. Merdeka No. 123, Jakarta'
  const note = 'Mohon dikemas dengan aman'

  let total = 0

  const items = cartItems.value
    .map(item => {
      const subtotal = item.price * item.quantity
      total += subtotal

      return `• ${item.quantity} x ${item.name}
  Harga    : Rp ${item.price.toLocaleString('id-ID')}
  Subtotal : Rp ${subtotal.toLocaleString('id-ID')}`
    })
    .join('\n\n')

  const finalMessage =
`Halo 👋

*INVOICE PEMBELIAN*

*Data Pembeli*
Nama    : ${buyerName}
Alamat  : ${address}

*Detail Pesanan*
${items}

--------------------
*TOTAL : Rp ${total.toLocaleString('id-ID')}*

Catatan:
${note}

Terima kasih 🙏
`

  window.open(
    `https://wa.me/${phoneNumber}?text=${encodeURIComponent(finalMessage)}`,
    '_blank'
  )
}




const applyHeroQuickSearch = async () => {
  const typeId = heroSelectedType.value ? parseInt(heroSelectedType.value.value) : null
  const deviceId = heroSelectedDevice.value ? parseInt(heroSelectedDevice.value.value) : null

  store.setFilters({
    typeId,
    deviceId
  })

  store.clearProducts()
  await store.fetchProducts({ page: 1 })
}

const resetHeroFilters = async () => {
  heroSelectedDevice.value = null
  heroSelectedType.value = null
  store.resetFilters()
  store.clearProducts()
  await store.fetchProducts({ page: 1 })
}

const toggleSort = () => {
  const currentIndex = sortOptions.findIndex(s => s.value === sortBy.value)
  const nextIndex = (currentIndex + 1) % sortOptions.length
  const next = sortOptions[nextIndex]
  if (next) {
    sortBy.value = next.value
  }
}

const addToCart = (product: Product) => {
  const existingItem = cartItems.value.find(item => item.id === product.id)

  if (existingItem) {
    existingItem.quantity++
  } else {
    cartItems.value.push({
      ...product,
      quantity: 1
    })
  }

  showNotification('success', 'Ditambahkan ke keranjang', `${product.name} telah ditambahkan ke keranjang`)
}

const toggleCartPreview = () => {
  showCartPreview.value = !showCartPreview.value
}

const showNotification = (type: string, title: string, message: string) => {
  realtimeNotification.value = {
    show: true,
    type,
    title,
    message
  }

  setTimeout(() => {
    realtimeNotification.value.show = false
  }, 3000)
}

const filterByBrand = (brandName: string) => {
  selectedBrand.value = selectedBrand.value === brandName ? null : brandName
}

const resetFiltersFromPage = async () => {
  store.resetFilters()
  selectedBrand.value = null
  store.clearProducts()
  await store.fetchProducts({ page: 1 })
}

const handleSelectCategoryFromSection = async (categoryId: string) => {
  store.setFilters({ search: categoryId })
  store.clearProducts()
  await store.fetchProducts({ page: 1 })
}

let loadMoreTimeout: NodeJS.Timeout | null = null

const loadMoreProducts = async () => {
  if (isLoadingMore.value || !hasMore.value || store.loading.products) return

  if (loadMoreTimeout) {
    clearTimeout(loadMoreTimeout)
  }

  loadMoreTimeout = setTimeout(async () => {
    isLoadingMore.value = true

    try {
      const hasLoaded = await store.loadNextPage()

      if (hasLoaded) {
        pagination.value = { ...store.pagination }
      }
    } catch (error) {
      console.error('[Component] Error loading more:', error)
    } finally {
      isLoadingMore.value = false
    }
  }, 200)
}

const registerSignalREvents = (connection: any) => {
  connection.on('ProductCreated', (product: any) => {
    const exists = store.products.some(p => p.id === product.id)
    if (!exists) {
      store.products.unshift(product)
      pagination.value.total += 1
      showNotification('info', 'Produk Baru', `${product.name} baru saja ditambahkan!`)
    }
  })

  connection.on('StockUpdated', (data: any) => {
    const product = store.products.find(p => p.id === data.productId)
    if (product) {
      product.stock = data.newStock
      showNotification('stock', 'Stok Diupdate', `${data.productName}: Stok ${data.oldStock} → ${data.newStock}`)
    }
  })

  connection.on('PriceUpdated', (data: any) => {
    const product = store.products.find(p => p.id === data.productId)
    if (product) {
      product.price = data.retailPrice
      showNotification('price', 'Harga Diupdate', `${data.productName}: Rp ${data.retailPrice.toLocaleString('id-ID')}`)
    }
  })

  connection.on('ProductStatusChanged', (data: any) => {
    if (!data.isActive) {
      const initialLength = store.products.length
      store.products = store.products.filter(p => p.id !== data.productId)

      if (store.products.length < initialLength) {
        pagination.value.total = Math.max(0, pagination.value.total - 1)
        showNotification('status', 'Produk Dinonaktifkan', `${data.productName} tidak tersedia lagi`)
      }
    } else {
      store.clearProducts()
      store.fetchProducts({ page: 1 })
      showNotification('status', 'Produk Diaktifkan', `${data.productName} kini tersedia kembali`)
    }
  })

  connection.on('ProductDeleted', (data: any) => {
    const initialLength = store.products.length
    store.products = store.products.filter(p => p.id !== data.productId)

    if (store.products.length < initialLength) {
      pagination.value.total = Math.max(0, pagination.value.total - 1)
      showNotification('status', 'Produk Dihapus', `${data.productName} telah dihapus`)
    }
  })

  connection.on('ProductUpdated', (product: any) => {
    const index = store.products.findIndex(p => p.id === product.id)
    if (index !== -1) {
      store.products[index] = { ...product }
      showNotification('info', 'Produk Diperbarui', `${product.name} telah diperbarui`)
    }
  })
}

useIntersectionObserver(
  loadMoreTrigger,
  ([{ isIntersecting }]) => {
    if (isIntersecting && hasMore.value && !isLoadingMore.value && !store.loading.products) {
      loadMoreProducts()
    }
  },
  {
    threshold: 0.1,
    rootMargin: '200px'
  }
)

onMounted(async () => {
  await Promise.all([
    store.fetchProducts().then(response => {
      if (response?.pagination) {
        pagination.value = response.pagination
      }
    }),
    store.fetchReferences()
  ])

  const connection = await connect()
  if (connection) {
    registerSignalREvents(connection)
  }
})

onUnmounted(() => {
  disconnect()

  if (window.searchTimeout) {
    clearTimeout(window.searchTimeout)
  }

  if (loadMoreTimeout) {
    clearTimeout(loadMoreTimeout)
  }
})
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
