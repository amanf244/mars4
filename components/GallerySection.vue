<template>
  <section id="gallery" class="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900">
    <div class="max-w-7xl mx-auto">
      <h2 class="text-3xl font-bold text-white mb-12 text-center">
        <span class="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
          Hasil Pekerjaan Kami
        </span>
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <div 
          v-for="(item, index) in galleryItems" 
          :key="index"
          class="group relative overflow-hidden rounded-xl transform transition-all duration-500 hover:z-10"
          style="perspective: 1000px;"
        >
          <div class="relative h-64 transform transition-all duration-500 group-hover:scale-[1.02] will-change-transform">
            <img 
              :src="item.image" 
              :alt="item.caption"
              :data-zoom-caption="`${item.title}\n${item.caption}\n${item.text}`"
              loading="lazy"
              class="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110 cursor-zoom-in"
              style="transform-origin: center center;"
            />
            <!-- Overlay dengan judul, caption dan teks deskripsi -->
            <div class="overlay-text absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent p-4 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
              <h3 class="text-white text-xl font-bold mb-1">{{ item.title }}</h3>
              <p class="text-white text-lg mb-1">{{ item.caption }}</p>
              <p class="text-gray-300 text-sm">{{ item.text }}</p>
            </div>
            <div class="absolute inset-0 border-2 border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
  
<script setup>
import { onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import mediumZoom from 'medium-zoom'
gsap.registerPlugin(ScrollTrigger)

const galleryItems = [
  { 
    image: '/gallery/redmi9_emmc.jpg', 
    title: 'Judul Pekerjaan 1', 
    caption: 'Pergantian eMMC Redmi 9', 
    text: 'Upgrade 6/128 untuk performa lebih baik.' 
  },
  {
    image: '/gallery/perbaikan_emmc.jpeg', 
    title: 'Judul Pekerjaan 2', 
    caption: 'Pergantian eMMC', 
    text: 'Pergantian eMMc yang sudah mati.'
  },
  {
    image: '/gallery/perbaikan_konektor_lcd.jpeg', 
    title: 'Judul Pekerjaan 3', 
    caption: 'Perbaikan Jalur Konektor LCD', 
    text: 'Perbaikan jalur konektor LCD yang putus.'
  }, 
  {
    image: '/gallery/Reball_chipset.jpeg', 
    title: 'Judul Pekerjaan 4', 
    caption: 'Reball Chipset', 
    text: 'Reball chipset yang cold joint.'
  },
  {
    image: '/gallery/perbaikkan_jalur_pad.jpeg', 
    title: 'Judul Pekerjaan 5', 
    caption: 'Perbaikan Jalur Pad ic', 
    text: 'Perbaikan jalur pad ic yang rusak.'
  }
]

onMounted(() => {
  gsap.fromTo('.group', 
    {
      opacity: 0,
      y: 40,
      scale: 0.95
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      stagger: 0.3,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: '#gallery',
        start: 'top center+=100',
        end: 'bottom center',
        toggleActions: 'play none none none'
      }
    }
  )
  
  // Inisialisasi medium-zoom dengan delay untuk memastikan semua gambar telah termuat
  setTimeout(() => {
    const zoom = mediumZoom('.group img', {
      margin: 24,
      background: '#000'
    })
    // Sembunyikan overlay saat zoom dibuka
    zoom.on('open', (event) => {
      const overlay = event.target.parentElement.querySelector('.overlay-text')
      if (overlay) {
        overlay.style.display = 'none'
      }
    })
    // Tampilkan kembali overlay saat zoom ditutup
    zoom.on('close', (event) => {
      const overlay = event.target.parentElement.querySelector('.overlay-text')
      if (overlay) {
        overlay.style.display = ''
      }
    })
  }, 500)
})
</script>
