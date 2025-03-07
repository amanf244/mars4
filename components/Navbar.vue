<template>
  <nav class="fixed w-full z-50 bg-black/50 backdrop-blur-md">
    <div class="container mx-auto px-6 py-4 flex justify-between items-center">
      <div class="text-2xl font-bold text-purple-400">MARS4</div>

      <!-- Desktop Menu -->
      <div class="space-x-8 text-gray-300 hidden md:flex">
        <a 
          v-for="(section, id) in sections" 
          :key="id"
          :href="`#${id}`" 
          @click.prevent="handleClick(id)"
          :class="{'text-purple-400': activeSection === id}"
          class="hover:text-purple-400 transition"
        >
          {{ section }}
        </a>
      </div>

      <!-- Mobile Hamburger -->
      <button 
        @click="isOpen = !isOpen" 
        class="md:hidden text-gray-300 hover:text-purple-400 transition"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </div>

    <!-- Mobile Menu -->
    <div 
      v-if="isOpen" 
      class="md:hidden px-6 py-4 bg-black/50 backdrop-blur-sm"
    >
      <div class="flex flex-col space-y-4">
        <a 
          v-for="(section, id) in sections" 
          :key="id"
          :href="`#${id}`" 
          @click.prevent="handleClick(id)"
          :class="{'text-purple-400': activeSection === id}"
          class="text-gray-300 hover:text-purple-400 transition"
        >
          {{ section }}
        </a>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isOpen = ref(false)
const activeSection = ref(null)
const sections = {
  services: 'Layanan',
  products: 'Produk',
  about: 'Tentang',
  contact: 'Kontak'
}

// Handle smooth scroll dan update section aktif
const handleClick = (id) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
    activeSection.value = id
  }
  isOpen.value = false // Tutup menu mobile setelah klik
}

// Setup Intersection Observer untuk deteksi section aktif
onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          activeSection.value = entry.target.id
        }
      })
    },
    {
      threshold: 0.5,
      rootMargin: '0px 0px -50% 0px'
    }
  )

  // Observe semua section
  Object.keys(sections).forEach(id => {
    const section = document.getElementById(id)
    if (section) observer.observe(section)
  })
})
</script>