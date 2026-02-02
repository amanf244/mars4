<!-- components/MarketplaceFooter.vue -->
<template>
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
            Tempat terpercaya untuk sparepart handphone original dengan harga terbaik.
          </p>
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
</template>

<script setup lang="ts">
const store = useProductStore()
const categories = computed(() => store.productTypes || [])
</script>
