<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
    <div class="text-center max-w-lg mx-auto">
      <!-- Ilustrasi 404 (menggunakan ikon dari Heroicons via Tailwind) -->
      <div class="mb-8 flex justify-center">
        <svg class="w-40 h-40 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>

      <!-- Angka 404 besar -->
      <h1 class="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500 mb-4">
        404
      </h1>

      <!-- Pesan error -->
      <h2 class="text-3xl font-semibold text-gray-800 dark:text-white mb-3">
        Halaman Tidak Ditemukan
      </h2>
      <p class="text-gray-600 dark:text-gray-300 mb-8 text-lg">
        {{ error.message || 'Halaman yang Anda cari mungkin telah dipindah, dihapus, atau tidak pernah ada.' }}
      </p>

      <!-- Tombol navigasi -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <NuxtLink 
          to="/" 
          class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          Kembali ke Beranda
        </NuxtLink>
        <button 
          @click="goBack" 
          class="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium rounded-xl shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          Kembali ke Halaman Sebelumnya
        </button>
      </div>

      <!-- Opsi tambahan: bantuan atau pencarian (opsional) -->
      <p class="mt-8 text-sm text-gray-500 dark:text-gray-400">
        Butuh bantuan? <a href="#" class="text-indigo-600 dark:text-indigo-400 hover:underline">Hubungi Kami</a>
      </p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  error: {
    type: Object,
    default: () => ({})
  }
})

// Fungsi untuk kembali ke halaman sebelumnya
const goBack = () => {
  if (process.client) {
    window.history.back()
  }
}

// Opsional: catat error ke layanan logging jika perlu
onMounted(() => {
  console.error('Error 404:', props.error)
})
</script>

<style scoped>
/* Jika ingin menambahkan sedikit animasi kustom */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>