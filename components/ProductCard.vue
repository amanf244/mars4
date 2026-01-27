<!--  components/ProductCard.vue -->

<template>
  <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group">
    <!-- Image Section -->
    <div class="relative h-48 bg-gray-100 overflow-hidden">
      <img
        v-if="product.imageUrl"
        :src="product.imageUrl"
        :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      >
      <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
        <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      
      <!-- Stock Badge -->
      <div class="absolute top-3 left-3">
        <span
          :class="[
            'px-2 py-1 rounded-full text-xs font-medium',
            product.stock === 0 ? 'bg-red-100 text-red-800' :
            product.stock <= 5 ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          ]"
        >
          {{ product.stock === 0 ? 'Habis' : `${product.stock} stok` }}
        </span>
      </div>
      
      <!-- Status Badge -->
      <div class="absolute top-3 right-3">
        <span
          :class="[
            'px-2 py-1 rounded-full text-xs font-medium',
            product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          ]"
        >
          {{ product.isActive ? 'Aktif' : 'Nonaktif' }}
        </span>
      </div>
      
      <!-- Quick Actions Overlay -->
      <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
        <div class="flex gap-2">
          <button
            @click="$emit('view', product.id)"
            class="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
          >
            <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            @click="$emit('edit', product.id)"
            class="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
          >
            <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Content Section -->
    <div class="p-4">
      <!-- SKU -->
      <div class="text-xs text-gray-500 font-mono mb-1">{{ product.sku }}</div>
      
      <!-- Product Name -->
      <h3 class="font-medium text-gray-900 line-clamp-2 mb-2 hover:text-primary-600 cursor-pointer">
        {{ product.name }}
      </h3>
      
      <!-- Product Info -->
      <div class="flex items-center gap-2 mb-3">
        <span class="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
          {{ product.deviceModel }}
        </span>
        <span class="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded">
          {{ product.productType }}
        </span>
      </div>
      
      <!-- Brand & Quality -->
      <div class="flex items-center justify-between text-sm text-gray-600 mb-4">
        <div class="flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span>{{ product.partBrand }}</span>
        </div>
        <div class="flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ product.qualityGrade }}</span>
        </div>
      </div>
      
      <!-- Price & Action -->
      <div class="flex items-center justify-between pt-4 border-t border-gray-100">
        <div>
          <div class="font-bold text-lg text-gray-900">
            Rp {{ product.price.toLocaleString('id-ID') }}
          </div>
          <div class="text-xs text-gray-500">per unit</div>
        </div>
        <button
          @click="$emit('delete', product)"
          class="p-2 text-gray-400 hover:text-red-600 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  product: {
    type: Object,
    required: true
  }
})

defineEmits(['view', 'edit', 'delete'])
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>