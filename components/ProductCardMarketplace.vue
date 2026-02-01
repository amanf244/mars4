<!-- components/ProductCardMarketplace.vue -->

<template>
  <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group cursor-pointer">
    <!-- Badges -->
    <div class="absolute top-2 left-2 z-10 flex flex-col gap-1">
      <span v-if="product.stock <= 5 && product.stock > 0" class="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
        Hampir Habis
      </span>
      <span v-else-if="product.stock === 0" class="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
        Habis
      </span>
    </div>

    <!-- Wishlist Button -->
    <button 
      @click.stop="toggleWishlist"
      class="absolute top-2 right-2 z-10 p-1.5 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
    >
      <svg :class="[
        'w-5 h-5',
        isWishlisted ? 'text-red-500 fill-current' : 'text-gray-400'
      ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>

    <!-- Image -->
<NuxtLink
  :to="`/products/${product.id}`"
  class="relative h-48 bg-gray-100 overflow-hidden block group cursor-pointer"
>
  <img
    v-if="product.imageUrl"
    :src="getImageUrl(product.imageUrl)"
    :alt="product.name"
    class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
  >

  <div
    v-else
    class="w-full h-full flex items-center justify-center text-gray-400"
  >
    <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  </div>
</NuxtLink>


    <!-- Content -->
    <div class="p-3">
      <!-- SKU -->
      <div class="text-xs text-gray-500 font-mono mb-1">{{ product.sku }}</div>
      
     <!-- Product Name -->
<h3 class="font-medium text-gray-900 mb-2 min-h-[3rem]">
  <NuxtLink
    :to="`/products/${product.id}`"
    class="block line-clamp-2 hover:text-primary-600"
  >
    {{ product.name }}
  </NuxtLink>
</h3>


      <!-- Product Info -->
      <div class="flex items-center gap-2 mb-2 flex-wrap">
        <span class="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
          {{ product.deviceModel }}
        </span>
        <span class="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded">
          {{ product.productType }}
        </span>
      </div>

      <!-- Rating (placeholder) -->
      <div class="flex items-center gap-1 mb-3">
        <div class="flex text-yellow-400">
          <svg v-for="i in 5" :key="i" class="w-4 h-4" :class="i <= 4 ? 'fill-current' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </div>
        <span class="text-xs text-gray-500">(4.5)</span>
      </div>

      <!-- Price -->
      <div class="mb-3">
        <div class="font-bold text-lg text-gray-900">
          Rp {{ formatPrice(product.price) }}
        </div>
        <div v-if="product.stock > 0" class="text-xs text-gray-500">
          Stok: {{ product.stock }} unit
        </div>
        <div v-else class="text-xs text-red-500">
          Stok habis
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-2">
        <button
          @click.stop="addToCart"
          :disabled="product.stock === 0"
          :class="[
            'flex-1 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2',
            product.stock === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-primary-600 hover:bg-primary-700 text-white'
          ]"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>Beli</span>
        </button>
        <button
          @click.stop="toggleWishlist"
          :class="[
            'px-3 py-2 rounded-lg border transition-colors',
            isWishlisted
              ? 'border-red-500 bg-red-50 text-red-600'
              : 'border-gray-300 hover:border-primary-500 hover:text-primary-600 text-gray-700'
          ]"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true,
    default: () => ({
      id: 0,
      sku: '',
      name: '',
      deviceModel: '',
      productType: '',
      price: 0,
      stock: 0,
      imageUrl: '',
      isActive: true,
      partBrand: '',
      qualityGrade: ''
    })
  }
})

const emit = defineEmits(['add-to-cart'])

// Local state
const isWishlisted = ref(false)

// Helper function untuk format price
const formatPrice = (price: number) => {
  if (!price && price !== 0) return '0'
  try {
    return price.toLocaleString('id-ID')
  } catch (error) {
    console.error('Error formatting price:', price, error)
    return '0'
  }
}

// Methods
const toggleWishlist = () => {
  isWishlisted.value = !isWishlisted.value
}

const addToCart = () => {
  if (props.product.stock > 0) {
    emit('add-to-cart', props.product)
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.min-h-[3rem] {
  min-height: 3rem;
}
</style>