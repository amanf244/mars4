<script setup lang="ts">
import type { Product } from '~/composables/useProductApi'

const productApi = useProductApi()

const lowStockProducts = ref<Product[]>([]) // ADD TYPE HERE
const loading = ref(false)

const loadLowStockProducts = async () => {
  loading.value = true
  try {
    const response = await productApi.fetchProducts({
      pageSize: 5
    })
    lowStockProducts.value = response.data.filter(p => p.stock <= 5)
  } catch (error) {
    console.error('Failed to load low stock products:', error)
  } finally {
    loading.value = false
  }
}

// Map colors untuk Nuxt UI v4
const getStockBadgeColor = (stock: number): 'error' | 'warning' | 'success' => {
  if (stock === 0) return 'error'
  if (stock <= 5) return 'warning'
  return 'success'
}

onMounted(() => {
  loadLowStockProducts()
  setInterval(loadLowStockProducts, 5 * 60 * 1000)
})
</script>

<template>
  <UCard v-if="lowStockProducts.length > 0">
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5 text-orange-500" />
          <h3 class="font-semibold text-slate-900 dark:text-white">Low Stock Alert</h3>
        </div>
        <UBadge color="warning">{{ lowStockProducts.length }}</UBadge>
      </div>
    </template>

    <div class="space-y-3">
      <div
        v-for="product in lowStockProducts"
        :key="product.id"
        class="flex items-center justify-between p-3 rounded-lg bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800"
      >
        <div class="flex-1">
          <p class="font-medium text-slate-900 dark:text-white text-sm">{{ product.name }}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400">{{ product.deviceModel }}</p>
        </div>
        <div class="text-right">
          <UBadge :color="getStockBadgeColor(product.stock)" variant="soft">
            {{ product.stock }} pcs
          </UBadge>
        </div>
      </div>
    </div>

    <template #footer>
      <NuxtLink
        to="/dashboard/admin/products/inventory/low-stock"
        class="text-sm text-blue-600 dark:text-blue-400 hover:underline"
      >
        View all low stock items →
      </NuxtLink>
    </template>
  </UCard>
</template>
