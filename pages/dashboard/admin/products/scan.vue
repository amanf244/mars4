<script setup lang="ts">
import type { ProductDetail } from '~/composables/useProductApi'

definePageMeta({
  requiresAuth: true,
  middleware: 'admin',
  layout: 'dashboard'
})

const productApi = useProductApi()

const sku = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const product = ref<ProductDetail | null>(null)

const handleLookup = async () => {
  error.value = null
  product.value = null

  const trimmed = sku.value.trim()
  if (!trimmed) {
    error.value = 'SKU tidak boleh kosong'
    return
  }

  try {
    loading.value = true
    const result = await productApi.fetchProductBySku(trimmed)
    product.value = result
  } catch (err: any) {
    if (err?.status === 404) {
      error.value = 'Produk tidak ditemukan'
    } else {
      error.value = err?.data?.message || 'Gagal mengambil data produk'
    }
  } finally {
    loading.value = false
  }
}

// allow enter key to trigger lookup
const onEnter = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    handleLookup()
  }
}
</script>

<template>
  <div class="space-y-6">
    <header class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-semibold">Scan & Lookup SKU</h1>
        <p class="text-sm text-slate-500">
          Arahkan scanner ke barcode/QR, SKU akan masuk ke input lalu tekan Enter atau Scan otomatis.
        </p>
      </div>
    </header>

    <UCard>
      <div class="flex flex-col md:flex-row gap-4 items-start md:items-end">
        <div class="flex-1 space-y-1">
          <label class="text-sm font-medium text-slate-700 dark:text-slate-300">
            SKU
          </label>
          <UInput
            v-model="sku"
            size="lg"
            placeholder="Scan atau ketik SKU, lalu Enter"
            @keyup="onEnter"
            autofocus
          />
          <p class="text-xs text-slate-500">
            Scanner barcode/QR biasanya akan mengisi input ini otomatis.
          </p>
        </div>

        <UButton
          color="primary"
          size="lg"
          icon="i-heroicons-magnifying-glass"
          :loading="loading"
          @click="handleLookup"
        >
          Lookup
        </UButton>
      </div>

      <p v-if="error" class="mt-3 text-sm text-red-500">
        {{ error }}
      </p>
    </UCard>

    <UCard v-if="product">
      <div class="flex flex-col md:flex-row gap-6">
        <div class="flex-1 space-y-2">
          <h2 class="text-lg font-semibold">
            {{ product.name }}
          </h2>
          <p class="font-mono text-sm text-slate-600">
            SKU: {{ product.sku }}
          </p>
          <p class="text-sm text-slate-500">
            {{ product.deviceModel }} • {{ product.productType }} • {{ product.partBrand }} •
            {{ product.qualityGrade }}
          </p>

          <div class="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div>
              <p class="text-slate-500 text-xs">Stok</p>
              <p class="font-semibold">
                {{ product.stock }}
                <span v-if="product.isLowStock" class="text-xs text-red-500">(Low stock)</span>
              </p>
            </div>
            <div>
              <p class="text-slate-500 text-xs">Harga Retail</p>
              <p class="font-semibold">
                Rp {{ product.retailPrice.toLocaleString('id-ID') }}
              </p>
            </div>
          </div>
        </div>

        <div class="flex flex-col items-center gap-4">
          <!-- Barcode dari SKU -->
          <ProductBarcode :value="product.sku" :height="50" :display-value="false" />

          <!-- QR bisa pakai SKU atau URL detail -->
          <ProductQr :value="product.sku" :size="96" />
        </div>
      </div>
    </UCard>
  </div>
</template>
