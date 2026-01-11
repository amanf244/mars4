<template>
  <div :class="darkMode ? 'dark' : ''">
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <!-- Fixed Header dengan Nav -->
      <header class="fixed top-0 w-full z-50 bg-white dark:bg-gray-800 shadow-md">
        <div class="container mx-auto px-4 py-4 flex justify-between items-center">
          <div class="flex items-center space-x-6">
            <NuxtLink to="/" class="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Blog Kami
            </NuxtLink>
            <!-- Menu Navigasi untuk layar md ke atas -->
            <nav class="hidden md:flex space-x-4">
              <NuxtLink to="/" class="text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors">
                Beranda
              </NuxtLink>
              <NuxtLink to="/about" class="text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors">
                Tentang
              </NuxtLink>
              <NuxtLink to="/contact" class="text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors">
                Kontak
              </NuxtLink>
            </nav>
          </div>
          <div class="flex items-center space-x-4">
            <button 
                @click="toggleDarkMode"
                class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <svg v-if="darkMode" class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"/>
                </svg>
                <svg v-else class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                </svg>
              </button>
            <!-- Tombol hamburger untuk mobile -->
            <button 
              @click="toggleMobileNav"
              class="md:hidden focus:outline-none"
            >
              <svg v-if="!mobileNavOpen" class="w-6 h-6 text-gray-800 dark:text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
              <svg v-else class="w-6 h-6 text-gray-800 dark:text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
        <!-- Mobile Navigation Menu -->
        <nav v-if="mobileNavOpen" class="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div class="container mx-auto px-4 py-4 space-y-2">
            <NuxtLink to="/" class="block text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors" @click="toggleMobileNav">
              Beranda
            </NuxtLink>
            <NuxtLink to="/about" class="block text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors" @click="toggleMobileNav">
              Tentang
            </NuxtLink>
            <NuxtLink to="/contact" class="block text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors" @click="toggleMobileNav">
              Kontak
            </NuxtLink>
          </div>
        </nav>
      </header>
      
      <!-- Konten Utama -->
      <!-- Beri padding top agar konten tidak tertutup header fixed -->
      <main class="pt-24 container mx-auto px-4 py-8">
        <div class="max-w-4xl mx-auto">
          <div class="grid gap-6 md:grid-cols-2">
            <article 
              v-for="post in posts" 
              :key="post.slug"
              class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
            >
              <NuxtLink :to="`/blog/${post.slug}`">
                <img 
                  :src="post.image" 
                  :alt="post.title"
                  class="w-full h-48 object-cover"
                />
                <div class="p-6">
                  <div class="flex items-center mb-2">
                    <span class="text-sm text-blue-500 font-semibold">{{ post.date }}</span>
                    <span class="mx-2 text-gray-400">•</span>
                    <span class="text-sm text-gray-500">{{ post.readTime }} membaca</span>
                  </div>
                  <h2 class="text-xl font-bold mb-3">{{ post.title }}</h2>
                  <p class="text-gray-600 dark:text-gray-300 line-clamp-3">{{ post.excerpt }}</p>
                  <div class="mt-4 flex items-center">
                    <div class="flex items-center text-blue-500 hover:text-blue-600">
                      <span class="mr-2">Baca selengkapnya</span>
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </NuxtLink>
            </article>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

// Variabel reaktif untuk dark mode dan mobile nav
const darkMode = ref(false)
const mobileNavOpen = ref(false)

// Pastikan akses ke localStorage hanya dijalankan di sisi klien
onMounted(() => {
  if (process.client) {
    const storedDarkMode = localStorage.getItem('darkMode')
    if (storedDarkMode !== null) {
      darkMode.value = storedDarkMode === 'true'
    }
  }
})

// Simpan setiap perubahan darkMode ke localStorage (hanya di sisi klien)
watch(darkMode, (newVal) => {
  if (process.client) {
    localStorage.setItem('darkMode', newVal)
  }
})

// Fungsi toggle dark mode
function toggleDarkMode() {
  darkMode.value = !darkMode.value
}

// Fungsi toggle mobile navigation
function toggleMobileNav() {
  mobileNavOpen.value = !mobileNavOpen.value
}

// Data dummy untuk postingan blog
const posts = [
  {
    slug: 'contoh-artikel-1',
    title: 'Panduan Lengkap Belajar Pemrograman Modern',
    excerpt: 'Pelajari dasar-dasar pemrograman dengan metode terkini yang menyenangkan dan mudah dipahami untuk pemula. Mulai dari konsep dasar hingga membangun aplikasi pertama Anda.',
    date: '15 Maret 2024',
    readTime: '5 menit',
    image: 'https://picsum.photos/600/400?random=1'
  },
  {
    slug: 'contoh-artikel-2',
    title: '10 Framework JavaScript Terbaik 2024',
    excerpt: 'Eksplorasi framework JavaScript paling populer tahun ini beserta kelebihan dan kekurangannya. Temukan tools terbaik untuk proyek pengembangan web Anda berikutnya.',
    date: '14 Maret 2024',
    readTime: '8 menit',
    image: 'https://picsum.photos/600/400?random=2'
  },
]
</script>

<style>
/* Membatasi teks hingga 3 baris */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Transition untuk efek hover */
.transition-transform {
  transition-property: transform;
}
</style>
