<!-- layouts/marketplace.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <MarketplaceHeader />

    <!-- Hero hanya di halaman /products -->
    <section
      v-if="$route.name === 'products'"
      class="bg-gradient-to-r from-primary-500 to-primary-700"
    >
      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div class="text-white">
            <h1 class="text-3xl font-bold mb-4">
              Sparepart Original & Berkualitas di Serang, Banten
            </h1>
            <p class="text-primary-100 mb-6">
              LCD, baterai, charger, dan berbagai sparepart handphone lainnya dengan harga terjangkau dan bergaransi.
            </p>
            <div class="flex flex-wrap gap-3">
              <span class="px-3 py-1 bg-white/20 rounded-full text-sm">Free Ongkir</span>
              <span class="px-3 py-1 bg-white/20 rounded-full text-sm">Garansi 1 Bulan</span>
              <span class="px-3 py-1 bg-white/20 rounded-full text-sm">Ready Stock</span>
            </div>
          </div>

          <!-- Cek ketersediaan -->
          <div class="w-full lg:w-1/3">
            <div class="bg-white rounded-xl p-6 shadow-lg">
              <h2 class="font-bold text-gray-900 mb-3">Cek Ketersediaan</h2>
              <div class="space-y-4">
                <USelectMenu
                  v-model="heroSelectedDevice"
                  :items="deviceItems"
                  searchable
                  placeholder="Pilih Model HP"
                  class="w-full"
                />
                <USelectMenu
                  v-model="heroSelectedType"
                  :items="productTypesItems"
                  searchable
                  placeholder="Pilih Jenis Sparepart"
                  class="w-full"
                />
                <button
                  @click="applyHeroQuickSearch"
                  class="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium"
                >
                  Cari Sekarang
                </button>
                <button
                  @click="resetHeroFilters"
                  class="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium"
                >
                  Reset Filter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <main class="max-w-7xl mx-auto px-4 py-6">
      <slot />
    </main>

    <footer class="bg-gray-900 text-white mt-12">
      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div class="flex items-center gap-2 mb-4">
              <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <span class="text-xl font-bold">
                Mars4<span class="text-primary-400">Mart</span>
              </span>
            </div>
            <p class="text-gray-400">
              Tempat terpercaya untuk sparepart handphone original dengan harga terbaik di Serang, Banten.
            </p>
          </div>

          <div>
            <h3 class="font-bold mb-4">Kategori</h3>
            <ul class="space-y-2 text-gray-400">
              <li
                v-for="category in categories.slice(0, 5)"
                :key="category.id"
              >
                <button
                  type="button"
                  class="hover:text-white"
                  @click="quickFilterCategory(category.id)"
                >
                  {{ category.name }}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 class="font-bold mb-4">Layanan</h3>
            <ul class="space-y-2 text-gray-400">
              <li>Garansi 1 Bulan</li>
              <li>Free Ongkir</li>
              <li>Bantuan 24/7</li>
              <li>Return & Refund</li>
            </ul>
          </div>

          <div>
            <h3 class="font-bold mb-4">Kontak</h3>
            <ul class="space-y-2 text-gray-400">
              <li>0896-3053-4368</li>
              <li>support@mars4.com</li>
              <li>Serang, Banten – Indonesia</li>
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
const store = useProductStore()

const heroSelectedDevice = ref<{ label: string; value: string } | null>(null)
const heroSelectedType = ref<{ label: string; value: string } | null>(null)

const categories = computed(() => store.productTypes || [])
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

const quickFilterCategory = async (id: number | string) => {
  store.setFilters({ typeId: Number(id) })
  store.clearProducts()
  await store.fetchProducts({ page: 1 })
}
</script>
