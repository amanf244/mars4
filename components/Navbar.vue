<template>
  <nav 
    class="fixed w-full z-50 transition-all duration-500"
    :class="{
      'bg-black/80 backdrop-blur-lg': activeSection && activeSection !== 'home',
      'bg-transparent backdrop-blur-none': !activeSection || activeSection === 'home'
    }"
  >
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
import { ref, onMounted, onUnmounted } from 'vue'

const isOpen = ref(false)
const activeSection = ref(null)
const sections = {
  services: 'Layanan',
  gallery: 'Galeri',
  about: 'Tentang',
  contact: 'Kontak'
}

const handleClick = (id) => {
  const element = document.getElementById(id)
  if (element) {
    const yOffset = -64
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
    window.scrollTo({ top: y, behavior: 'smooth' })
    activeSection.value = id
  }
  isOpen.value = false
}

const observer = ref(null)

onMounted(() => {
  observer.value = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id === 'home' ? null : entry.target.id
        }
      })
    },
    {
      threshold: 0.2,
      rootMargin: '-25% 0px -25% 0px'
    }
  )

  // Observe semua section termasuk home
  const allSections = ['home', ...Object.keys(sections)]
  allSections.forEach(id => {
    const section = document.getElementById(id)
    if (section) observer.value.observe(section)
  })
})

onUnmounted(() => {
  if (observer.value) observer.value.disconnect()
})
</script>