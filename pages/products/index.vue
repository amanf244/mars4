<!-- pages/products/index.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Marketplace -->
    <header class="sticky top-0 z-50 bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <span class="text-xl font-bold text-gray-900">Mars4<span class="text-primary-600">Mart</span></span>
          </div>

          <!-- Search Bar -->
          <div class="flex-1 max-w-2xl mx-8">
            <div class="relative">
              <input
                v-model="searchQuery"
                @input="debouncedSearch"
                type="text"
                placeholder="Cari sparepart handphone..."
                class="w-full pl-12 pr-4 py-2.5 bg-gray-100 text-gray-900 placeholder-gray-600 rounded-full
                       focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition"
              />
              <svg class="w-5 h-5 text-gray-400 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <!-- User Actions -->
          <div class="flex items-center gap-4">
            <!-- <button class="p-2 hover:bg-gray-100 rounded-full relative">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span v-if="cartCount > 0" class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {{ cartCount }}
              </span>
            </button> -->
            <NuxtLink to="/login" class="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-medium">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Login
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <!-- Categories Navigation -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center gap-6 overflow-x-auto py-3">
          <button
            v-for="category in categories"
            :key="category.id"
            @click="selectCategory(category.id)"
            :class="[
              'flex-shrink-0 px-4 py-2 rounded-full font-medium transition-colors',
              selectedCategory === category.id
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ category.name }}
          </button>
        </div>
      </div>
    </div>

    <!-- Hero Banner -->
    <div class="bg-gradient-to-r from-primary-500 to-primary-700">
      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div class="text-white">
            <h2 class="text-3xl font-bold mb-4">Sparepart Original & Berkualitas</h2>
            <p class="text-primary-100 mb-6">LCD, Baterai, Charger, dan berbagai sparepart handphone lainnya</p>
            <div class="flex flex-wrap gap-3">
              <span class="px-3 py-1 bg-white/20 rounded-full text-sm">Free Ongkir</span>
              <span class="px-3 py-1 bg-white/20 rounded-full text-sm">Garansi 1 Bulan</span>
              <span class="px-3 py-1 bg-white/20 rounded-full text-sm">Ready Stock</span>
            </div>
          </div>
          <div class="w-full lg:w-1/3">
            <div class="bg-white rounded-xl p-6 shadow-lg">
              <h3 class="font-bold text-gray-900 mb-3">Cek Ketersediaan</h3>
              <div class="space-y-4">
                <USelectMenu
                  v-model="selectedDevice"
                  :items="deviceItems"
                  searchable
                  placeholder="Pilih Model HP"
                  class="w-full"
                />
                <USelectMenu
                  v-model="selectedType"
                  :items="productTypesItems"
                  searchable
                  placeholder="Pilih Jenis Sparepart"
                  class="w-full"
                />
                <button
                  @click="applyQuickSearch"
                  class="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium"
                >
                  Cari Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 py-6">
      <!-- Real-time Notification -->
      <Transition name="slide-down">
        <div
          v-if="realtimeNotification.show"
          class="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[300px] max-w-md"
        >
          <div class="p-4">
            <div class="flex items-center gap-3">
              <div :class="[
                'w-8 h-8 rounded-full flex items-center justify-center',
                realtimeNotification.type === 'stock' ? 'bg-blue-100 text-blue-600' :
                realtimeNotification.type === 'price' ? 'bg-green-100 text-green-600' :
                realtimeNotification.type === 'status' ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600'
              ]">
                <svg v-if="realtimeNotification.type === 'stock'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <svg v-else-if="realtimeNotification.type === 'price'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="flex-1">
                <p class="font-medium text-gray-900">{{ realtimeNotification.title }}</p>
                <p class="text-sm text-gray-600">{{ realtimeNotification.message }}</p>
              </div>
              <button @click="realtimeNotification.show = false" class="text-gray-400 hover:text-gray-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
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
              Update real-time • 
              Menampilkan {{ store.products.length }} dari {{ pagination.total }} produk
            </p>
          </div>
          <div class="flex items-center gap-3">
            <button @click="toggleSort" class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
              </svg>
              <span>{{ sortOptions.find(s => s.value === sortBy)?.label }}</span>
            </button>
          </div>
        </div>

        <!-- Loading State (Initial) -->
        <div v-if="store.loading.products && store.products.length === 0" 
             class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <div v-for="i in 10" :key="i" class="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
            <div class="h-48 bg-gray-200"></div>
            <div class="p-3 space-y-2">
              <div class="h-4 bg-gray-200 rounded w-3/4"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2"></div>
              <div class="h-6 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>

        <!-- Products -->
        <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <ProductCardMarketplace
            v-for="product in sortedProducts"
            :key="product.id"
            :product="product"
            @add-to-cart="addToCart(product)"
          />
        </div>

        <!-- ===== INFINITY SCROLL TRIGGER ===== -->
        <div 
          ref="loadMoreTrigger" 
          class="py-8 flex justify-center"
        >
          <!-- Loading More Spinner -->
          <div v-if="isLoadingMore" class="flex flex-col items-center gap-3">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
            <p class="text-sm text-gray-600 font-medium">Memuat lebih banyak produk...</p>
          </div>
          
          <!-- End of List -->
          <div v-else-if="!hasMore && store.products.length > 0" 
               class="text-center">
            <div class="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-600">
              <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Semua produk telah ditampilkan ({{ pagination.total }} produk)
            </div>
          </div>
        </div>

                <!-- Empty State -->
        <div v-if="!store.loading.products && store.products.length === 0" class="text-center py-12">
          <div class="mx-auto w-24 h-24 text-gray-300 mb-4">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Tidak ada produk ditemukan</h3>
          <p class="text-gray-500 mb-6">Coba ubah filter pencarian Anda</p>
          <button @click="resetFilters" class="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium">
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
            @click="selectCategory(category.id)"
            class="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow cursor-pointer"
          >
            <div class="w-12 h-12 mx-auto mb-3 rounded-lg bg-primary-100 flex items-center justify-center">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
    </main>

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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="space-y-3 max-h-64 overflow-y-auto">
            <div v-for="item in cartItems" :key="item.id" class="flex items-center gap-3">
              <img :src="item.imageUrl || '/placeholder-product.jpg'" :alt="item.name" class="w-12 h-12 object-cover rounded-lg">
              <div class="flex-1">
                <h4 class="text-sm font-medium text-gray-900 line-clamp-1">{{ item.name }}</h4>
                <p class="text-xs text-gray-500">Qty: {{ item.quantity }}</p>
              </div>
              <div class="text-right">
                <div class="text-sm font-medium text-gray-900">Rp {{ (item.price * item.quantity).toLocaleString('id-ID') }}</div>
              </div>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-gray-200">
            <div class="flex justify-between mb-3">
              <span class="text-gray-600">Total</span>
              <span class="font-bold text-gray-900">Rp {{ cartTotal.toLocaleString('id-ID') }}</span>
            </div>
            <button class="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium">
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
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      <span class="font-medium">{{ cartCount }}</span>
    </button>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white mt-12">
      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div class="flex items-center gap-2 mb-4">
              <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <span class="text-xl font-bold">SparePart<span class="text-primary-400">Mart</span></span>
            </div>
            <p class="text-gray-400">Tempat terpercaya untuk sparepart handphone original dengan harga terbaik.</p>
          </div>
          <div>
            <h4 class="font-bold mb-4">Kategori</h4>
            <ul class="space-y-2 text-gray-400">
              <li v-for="category in categories.slice(0, 5)" :key="category.id">
                <a href="#" class="hover:text-white">{{ category.name }}</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold mb-4">Layanan</h4>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#" class="hover:text-white">Garansi 1 Bulan</a></li>
              <li><a href="#" class="hover:text-white">Free Ongkir</a></li>
              <li><a href="#" class="hover:text-white">Bantuan 24/7</a></li>
              <li><a href="#" class="hover:text-white">Return & Refund</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold mb-4">Kontak</h4>
            <ul class="space-y-2 text-gray-400">
              <li>📞 089630534368</li>
              <li>✉️ support@mars4.com</li>
              <li>📍 Banten, Indonesia</li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© 2026 Mars4, Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'

declare global {
  interface Window {
    searchTimeout?: number
  }
}

const store = useProductStore()
const router = useRouter()
const { connect, disconnect } = useSignalR()

type CartItem = Product & { quantity: number }
type SortOptionValue = 'newest' | 'price-low' | 'price-high' | 'name'

// ===== STATE =====
const searchQuery = ref<string>('')
const selectedCategory = ref<number | null>(null)
const selectedDevice = ref<{ label: string; value: string } | null>(null)
const selectedType = ref<{ label: string; value: string } | null>(null)
const selectedBrand = ref<string | null>(null)
const sortBy = ref<SortOptionValue>('newest')
const showCartPreview = ref<boolean>(false)
const cartItems = ref<CartItem[]>([])

// ===== INFINITY SCROLL STATE =====
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

// ===== COMPUTED =====
const categories = computed(() => store.productTypes || [])

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

// ===== UPDATED: Use store's hasMorePages =====
const hasMore = computed(() => store.hasMorePages())

// ===== UPDATED: Use uniqueProducts from store =====
const sortedProducts = computed<Product[]>(() => {
  // Gunakan uniqueProducts dari getter untuk avoid duplicate keys
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

// ===== METHODS =====
const debouncedSearch = () => {
  if (window.searchTimeout) {
    clearTimeout(window.searchTimeout)
  }
  window.searchTimeout = window.setTimeout(() => {
    store.clearProducts()
    applyFilters()
  }, 500)
}

// ===== UPDATED: Simplified applyFilters =====
const applyFilters = async (loadMore = false) => {
  if (!loadMore) {
    // Clear products dan reset ke page 1
    store.clearProducts()
  }
  
  try {
    const response = await store.fetchProducts({
      search: searchQuery.value,
      typeId: selectedCategory.value ?? undefined,
      deviceId: selectedDevice.value ? parseInt(selectedDevice.value.value) : undefined,
      page: loadMore ? store.pagination.page + 1 : 1,
      pageSize: pagination.value.pageSize
    })
    
    // Update local pagination dari store
    if (response?.pagination) {
      pagination.value = { ...response.pagination }
    }
    
  } catch (error) {
    console.error('[Component] Error fetching products:', error)
  }
}

// ===== UPDATED: Simplified loadMoreProducts with debounce =====
let loadMoreTimeout: NodeJS.Timeout | null = null

const loadMoreProducts = async () => {
  if (isLoadingMore.value || !hasMore.value || store.loading.products) {
    console.log('[Component] Skip load more:', { 
      isLoadingMore: isLoadingMore.value, 
      hasMore: hasMore.value, 
      loading: store.loading.products 
    })
    return
  }
  
  // Debounce to prevent rapid calls
  if (loadMoreTimeout) {
    clearTimeout(loadMoreTimeout)
  }
  
  loadMoreTimeout = setTimeout(async () => {
    isLoadingMore.value = true
    console.log('[Component] Loading more products...')
    
    try {
      const hasLoaded = await store.loadNextPage()
      
      if (hasLoaded) {
        pagination.value = { ...store.pagination }
        console.log('[Component] Loaded page:', store.pagination.page)
      }
    } catch (error) {
      console.error('[Component] Error loading more:', error)
    } finally {
      isLoadingMore.value = false
    }
  }, 200)
}

const applyQuickSearch = () => {
  selectedCategory.value = selectedType.value
    ? parseInt(selectedType.value.value)
    : null
  
  store.clearProducts()
  applyFilters()
}

const selectCategory = (categoryId: number | string) => {
  selectedCategory.value =
    selectedCategory.value === categoryId ? null : Number(categoryId)
  
  store.clearProducts()
  applyFilters()
}

const filterByBrand = (brandName: string) => {
  selectedBrand.value = selectedBrand.value === brandName ? null : brandName
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = null
  selectedDevice.value = null
  selectedType.value = null
  selectedBrand.value = null
  
  store.resetFilters()
  store.clearProducts()
  applyFilters()
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

// ===== SIGNALR HANDLERS - Updated with duplicate prevention =====
const registerSignalREvents = (connection: any) => {
  connection.on('ProductCreated', (product: any) => {
    console.log('[SignalR] ProductCreated:', product)
    
    // Check if already exists (prevent duplicate)
    const exists = store.products.some(p => p.id === product.id)
    if (!exists) {
      store.products.unshift(product)
      pagination.value.total += 1
      showNotification('info', 'Produk Baru', `${product.name} baru saja ditambahkan!`)
    } else {
      console.warn('[SignalR] Product already exists, skipping:', product.id)
    }
  })

  connection.on('StockUpdated', (data: any) => {
    console.log('[SignalR] StockUpdated:', data)
    const product = store.products.find(p => p.id === data.productId)
    if (product) {
      product.stock = data.newStock
      showNotification('stock', 'Stok Diupdate', `${data.productName}: Stok ${data.oldStock} → ${data.newStock}`)
    }
  })

  connection.on('PriceUpdated', (data: any) => {
    console.log('[SignalR] PriceUpdated:', data)
    const product = store.products.find(p => p.id === data.productId)
    if (product) {
      product.price = data.retailPrice
      showNotification('price', 'Harga Diupdate', `${data.productName}: Rp ${data.retailPrice.toLocaleString('id-ID')}`)
    }
  })

  connection.on('ProductStatusChanged', (data: any) => {
    console.log('[SignalR] ProductStatusChanged:', data)
    if (!data.isActive) {
      const initialLength = store.products.length
      store.products = store.products.filter(p => p.id !== data.productId)
      
      if (store.products.length < initialLength) {
        pagination.value.total = Math.max(0, pagination.value.total - 1)
        showNotification('status', 'Produk Dinonaktifkan', `${data.productName} tidak tersedia lagi`)
      }
    } else {
      applyFilters()
      showNotification('status', 'Produk Diaktifkan', `${data.productName} kini tersedia kembali`)
    }
  })

  connection.on('ProductDeleted', (data: any) => {
    console.log('[SignalR] ProductDeleted:', data)
    const initialLength = store.products.length
    store.products = store.products.filter(p => p.id !== data.productId)
    
    if (store.products.length < initialLength) {
      pagination.value.total = Math.max(0, pagination.value.total - 1)
      showNotification('status', 'Produk Dihapus', `${data.productName} telah dihapus`)
    }
  })

  connection.on('ProductUpdated', (product: any) => {
    console.log('[SignalR] ProductUpdated:', product)
    const index = store.products.findIndex(p => p.id === product.id)
    if (index !== -1) {
      // Proper reactive update
      store.products[index] = { ...product }
      showNotification('info', 'Produk Diperbarui', `${product.name} telah diperbarui`)
    }
  })
}

// ===== INFINITY SCROLL SETUP - Optimized =====
useIntersectionObserver(
  loadMoreTrigger,
  ([{ isIntersecting }]) => {
    console.log('[IntersectionObserver]', { 
      isIntersecting, 
      hasMore: hasMore.value, 
      loading: store.loading.products,
      isLoadingMore: isLoadingMore.value 
    })
    
    if (isIntersecting && hasMore.value && !isLoadingMore.value && !store.loading.products) {
      console.log('[IntersectionObserver] Triggering load more')
      loadMoreProducts()
    }
  },
  { 
    threshold: 0.1,
    rootMargin: '200px'
  }
)

// ===== LIFECYCLE =====
onMounted(async () => {
  console.log('[Component] Mounted - Initializing...')
  
  await Promise.all([
    store.fetchProducts().then(response => {
      if (response?.pagination) {
        pagination.value = response.pagination
        console.log('[Component] Initial pagination:', pagination.value)
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
  console.log('[Component] Unmounting...')
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

