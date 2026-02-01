<!-- pages/products/[id].vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button
              type="button"
              @click="$router.back()"
              class="p-2 rounded-lg text-gray-600 bg-gray-100
                     hover:bg-amber-500 hover:text-white
                     transition"
              aria-label="Kembali"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 class="text-xl font-bold text-gray-900">{{ product?.name || 'Loading...' }}</h1>
              <p class="text-gray-500 text-sm">{{ product?.sku }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <button class="p-2 hover:bg-gray-100 rounded-lg">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 py-6">
      <!-- Loading State -->
      <div v-if="store.loading.detail" class="bg-white rounded-xl shadow-sm p-8">
        <div class="animate-pulse space-y-6">
          <div class="flex flex-col lg:flex-row gap-8">
            <!-- Image Skeleton -->
            <div class="lg:w-1/2">
              <div class="aspect-square bg-gray-200 rounded-xl"></div>
            </div>
            <!-- Details Skeleton -->
            <div class="lg:w-1/2 space-y-4">
              <div class="h-8 bg-gray-200 rounded w-3/4"></div>
              <div class="h-4 bg-gray-200 rounded w-1/2"></div>
              <div class="h-12 bg-gray-200 rounded w-1/4"></div>
              <div class="h-4 bg-gray-200 rounded w-full"></div>
              <div class="h-4 bg-gray-200 rounded w-full"></div>
              <div class="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Product Detail -->
      <div v-else-if="product" class="bg-white rounded-xl shadow-sm overflow-hidden">

        <!-- Inactive banner -->
        <div
          v-if="!product.isActive"
          class="mx-8 mt-4 mb-2 flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3"
        >
          <svg class="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
          </svg>
          <div>
            <p class="font-semibold text-yellow-800">Produk sedang dinonaktifkan</p>
            <p class="text-sm text-yellow-700">
              Produk ini tidak lagi tersedia untuk dibeli. Informasi di bawah hanya untuk referensi.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          <!-- Left Column - Images -->
          <div>
            <!-- Main Image -->
            <div class="relative bg-gray-100 rounded-xl overflow-hidden mb-4">
              <div class="aspect-square">
                <img
                  v-if="activeImageUrl"
                  :src="getImageUrl(activeImageUrl)"
                  :alt="product.name"
                  class="w-full h-full object-contain"
                >
                <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                  <svg class="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Thumbnails -->
            <div v-if="imageUrls.length > 1" class="flex gap-2 mt-2 overflow-x-auto">
              <button
                v-for="(img, index) in imageUrls"
                :key="index"
                @click="activeImageIndex = index"
                :class="[
                  'w-16 h-16 rounded-lg overflow-hidden border',
                  index === activeImageIndex
                    ? 'border-primary-500'
                    : 'border-gray-200'
                ]"
              >
                <img
                  :src="getImageUrl(img)"
                  :alt="product.name"
                  class="w-full h-full object-cover"
                >
              </button>
            </div>

            <!-- Stock Alert -->
            <div
              v-if="product.stock <= 5 && product.stock > 0"
              class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6"
            >
              <div class="flex items-center gap-3">
                <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5" />
                </svg>
                <div>
                  <p class="font-medium text-yellow-800">Stok terbatas!</p>
                  <p class="text-sm text-yellow-700">Hanya tersisa {{ product.stock }} unit</p>
                </div>
              </div>
            </div>
            <div
              v-else-if="product.stock === 0"
              class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
            >
              <div class="flex items-center gap-3">
                <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p class="font-medium text-red-800">Stok habis!</p>
                  <p class="text-sm text-red-700">Produk ini sedang tidak tersedia</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column - Details -->
          <div>
            <!-- Breadcrumb -->
            <div class="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <span>Sparepart</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
              <span>{{ product.productType }}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
              <span>{{ product.deviceModel }}</span>
            </div>

            <!-- Product Name -->
            <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ product.name }}</h1>

            <!-- SKU -->
            <div class="text-gray-500 font-mono mb-4">{{ product.sku }}</div>

            <!-- Rating & Sold -->
            <div class="flex items-center gap-6 mb-6">
              <div class="flex items-center gap-2">
                <div class="flex text-yellow-400">
                  <svg
                    v-for="i in 5"
                    :key="i"
                    class="w-5 h-5"
                    :class="i <= 4 ? 'fill-current' : ''"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </div>
                <span class="text-gray-700">4.5</span>
              </div>
              <div class="text-gray-500">•</div>
              <div class="text-gray-500">Terjual 100+</div>
            </div>

            <!-- Price -->
            <div class="bg-gray-50 rounded-xl p-6 mb-6">
              <div class="text-4xl font-bold text-gray-900 mb-2">
                Rp {{ formatPrice(product.retailPrice) }}
              </div>
              <div class="text-gray-500">Harga retail</div>
            </div>

            <!-- Product Specs -->
            <div class="space-y-4 mb-8">
              <div class="flex">
                <div class="w-32 text-gray-700">Model HP</div>
                <div class="font-medium text-gray-900">{{ product.deviceModel }}</div>
              </div>
              <div class="flex">
                <div class="w-32 text-gray-700">Jenis Sparepart</div>
                <div class="font-medium text-gray-900">{{ product.productType }}</div>
              </div>
              <div class="flex">
                <div class="w-32 text-gray-700">Merek</div>
                <div class="font-medium text-gray-900">{{ product.partBrand }}</div>
              </div>
              <div class="flex">
                <div class="w-32 text-gray-700">Kualitas</div>
                <div class="font-medium text-gray-900">{{ product.qualityGrade }}</div>
              </div>
              <div class="flex">
                <div class="w-32 text-gray-700">Stok</div>
                <div
                  :class="[
                    'font-medium',
                    product.stock === 0 ? 'text-red-600' :
                    product.stock <= 5 ? 'text-yellow-600' :
                    'text-green-600'
                  ]"
                >
                  {{ product.stock }} unit
                </div>
              </div>
              <div v-if="product.warrantyDays" class="flex">
                <div class="w-32 text-gray-700">Garansi</div>
                <div class="font-medium text-gray-900">{{ product.warrantyDays }} hari</div>
              </div>
            </div>

            <!-- Description -->
            <div v-if="product.description" class="mb-8">
              <h3 class="font-bold text-gray-900 mb-4">Deskripsi Produk</h3>
              <div class="text-gray-600 whitespace-pre-line">{{ product.description }}</div>
            </div>

            <!-- Add to Cart -->
            <div class="border-t border-gray-200 pt-6">
              <div class="flex items-center gap-4">
                <div class="flex-1">
                  <div class="text-sm text-gray-900 mb-2">Jumlah</div>
                  <div class="flex items-center border border-gray-300 rounded-lg">
                    <button
                      @click="quantity = Math.max(1, quantity - 1)"
                      :disabled="quantity <= 1"
                      class="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                      </svg>
                    </button>
                    <input
                      v-model.number="quantity"
                      type="number"
                      min="1"
                      :max="product.stock"
                      class="w-16 text-center border-x border-gray-300 py-2 text-zinc-950 focus:outline-none"
                    >
                    <button
                      @click="quantity = Math.min(product.stock, quantity + 1)"
                      :disabled="quantity >= product.stock"
                      class="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div class="flex-1">
                  <div class="text-sm text-gray-500 mb-2">Subtotal</div>
                  <div class="text-2xl font-bold text-gray-900">
                    Rp {{ formatPrice(product.retailPrice * quantity) }}
                  </div>
                </div>
              </div>

              <div class="flex gap-3 mt-6">
                <button
                  @click="handleAddToCartClick"
                  :disabled="product.stock === 0 || !product.isActive"
                  :class="[
                    'flex-1 py-3 rounded-lg font-medium flex items-center justify-center gap-2',
                    product.stock === 0 || !product.isActive
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                  ]"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Tambah ke Keranjang
                </button>

                <button
                  @click="buyNow"
                  :disabled="product.stock === 0 || !product.isActive"
                  :class="[
                    'flex-1 py-3 rounded-lg font-medium',
                    product.stock === 0 || !product.isActive
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-primary-600 hover:bg-primary-700 text-white'
                  ]"
                >
                  Beli Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

     <!-- Error State -->
<div v-else class="bg-white rounded-xl shadow-sm p-8 text-center">
  <div class="text-red-500 mb-4">Produk tidak ditemukan</div>

  <NuxtLink
    to="/"
    class="inline-block text-primary-600 hover:text-primary-800 font-medium"
  >
    ← Kembali ke beranda
  </NuxtLink>
</div>


      <!-- Related Products -->
      <div v-if="product && relatedProducts.length > 0" class="mt-8">
        <h3 class="text-2xl font-bold text-gray-900 mb-6">Produk Serupa</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <ProductCardMarketplace
            v-for="related in relatedProducts"
            :key="related.id"
            :product="related"
            @add-to-cart="addProductToCart(related, 1)"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { ProductDetail, Product } from '~/composables/useProductApi'
import { useSignalR } from '~/composables/useSignalR'

const route = useRoute()
const router = useRouter()
const store = useProductStore()
const { connect, disconnect } = useSignalR()

// State
const quantity = ref(1)
const activeImageIndex = ref(0)

// Computed
const product = computed<ProductDetail | null>(() => store.currentProduct)

const relatedProducts = computed<Product[]>(() => {
  const current = product.value
  if (!current || !store.products.length) return []

  return store.products
    .filter(p =>
      p.id !== current.id &&
      p.deviceModel === current.deviceModel &&
      p.isActive
    )
    .slice(0, 5)
})

const imageUrls = computed(() => {
  const imgs = product.value?.images ?? []
  if (!imgs.length && product.value?.imageUrl) {
    return [product.value.imageUrl]
  }
  return imgs
    .slice()
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
    .map(i => i.imageUrl)
})

const activeImageUrl = computed(() => {
  return imageUrls.value[activeImageIndex.value] ?? product.value?.imageUrl ?? null
})

const getImageUrl = (fileName: string | null | undefined) => {
  if (!fileName) return ''
  return `http://localhost:5084/uploads/products/${fileName}`
}

// Helper format price
const formatPrice = (price: number | null | undefined): string => {
  if (!price && price !== 0) return '0'
  try {
    return price.toLocaleString('id-ID')
  } catch (error) {
    console.error('Error formatting price:', price, error)
    return '0'
  }
}

// Methods
const loadProduct = async () => {
  try {
    const id = parseInt(route.params.id as string)
    if (isNaN(id)) {
      throw new Error('ID produk tidak valid')
    }
    await store.fetchProductById(id)
    activeImageIndex.value = 0
  } catch (error) {
    console.error('Error loading product:', error)
  }
}

const addProductToCart = (item: Product | ProductDetail, qty: number) => {
  if (!item || item.stock === 0 || !item.isActive) return
  window.alert(`Ditambahkan ke keranjang: ${item.name} (${qty}x)`)
}

const handleAddToCartClick = () => {
  if (!product.value) return
  addProductToCart(product.value, quantity.value)
}

const buyNow = () => {
  if (!product.value || product.value.stock === 0 || !product.value.isActive) return
  window.alert(`Beli sekarang: ${product.value.name} (${quantity.value}x)`)
}

// SignalR handlers khusus halaman detail
const registerSignalREvents = (connection: any) => {
  const currentId = () => {
    const id = parseInt(route.params.id as string)
    return isNaN(id) ? null : id
  }

  connection.on('StockUpdated', (data: any) => {
    const id = currentId()
    if (!id || !product.value || data.productId !== id) return
    product.value.stock = data.newStock
  })

  connection.on('PriceUpdated', (data: any) => {
    const id = currentId()
    if (!id || !product.value || data.productId !== id) return
    product.value.retailPrice = data.retailPrice
  })

  connection.on('ProductStatusChanged', (data: any) => {
    const id = currentId()
    if (!id || !product.value || data.productId !== id) return
    product.value.isActive = data.isActive

    // kalau mau auto redirect saat nonaktif, bisa aktifkan:
    // if (!data.isActive) {
    //   router.push('/')
    // }
  })

  connection.on('ProductDeleted', (data: any) => {
    const id = currentId()
    if (!id || data.productId !== id) return
    navigateTo('/')
  })

  connection.on('ProductUpdated', (updated: any) => {
    const id = currentId()
    if (!id || !product.value || updated.id !== id) return

    // sinkron info dasar
    product.value.name = updated.name
    product.value.deviceModel = updated.deviceModel
    product.value.productType = updated.productType
    product.value.partBrand = updated.partBrand
    product.value.qualityGrade = updated.qualityGrade
    product.value.stock = updated.stock
    product.value.retailPrice = updated.price
    product.value.isActive = updated.isActive

    if (updated.images && Array.isArray(updated.images)) {
      product.value.images = updated.images.map((i: any) => ({
        id: i.id,
        imageUrl: i.imageUrl,
        displayOrder: i.displayOrder,
        isPrimary: i.isPrimary
      }))
      product.value.imageUrl =
        updated.images.find((i: any) => i.isPrimary)?.imageUrl ??
        updated.images[0]?.imageUrl ??
        product.value.imageUrl
      activeImageIndex.value = 0
    }
  })
}

// Initialize
onMounted(async () => {
  await loadProduct()
  const connection = await connect()
  if (connection) {
    registerSignalREvents(connection)
  }
})

// Reset product when leaving page
onUnmounted(() => {
  store.clearCurrentProduct()
  disconnect()
})
</script>

<style scoped>
/* Custom styles if needed */
</style>
