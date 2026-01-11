<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold text-gray-800 mb-6 hover:text-blue-600 transition-colors duration-300">
      {{ title }}
    </h1>
    <article class="prose max-w-none">
      <p class="text-lg">
        Selamat datang di blog kami. Artikel ini membahas tentang <span class="font-semibold">{{ slug }}</span>.
      </p>
      <p>
        Di sini Anda akan menemukan konten-konten menarik dan bermanfaat yang dikemas secara informatif dan mudah dipahami. Jangan lupa untuk kembali lagi untuk mendapatkan update terbaru.
      </p>
      <!-- Tambahkan konten blog lainnya sesuai kebutuhan -->
    </article>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Menggunakan computed property agar jika route berubah, nilai slug juga ikut berubah
const slug = computed(() => route.params.slug || 'default-slug')

// Judul dinamis berdasarkan slug
const title = computed(() => `Blog: ${slug.value}`)
</script>

<style scoped>
/* Custom styling tambahan untuk tampilan yang lebih menarik */
.container {
  max-width: 800px;
}

.prose {
  line-height: 1.8;
}
</style>
