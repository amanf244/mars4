<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
    <!-- Background Particles (Client Only) -->
    <ClientOnly>
      <div class="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          v-for="i in 20" 
          :key="i"
          class="absolute w-1 h-1 bg-purple-500/20 rounded-full"
          :style="getParticleStyle()"
        ></div>
      </div>
    </ClientOnly>

    <div class="max-w-7xl mx-auto relative z-10">
      <!-- Header dengan Breadcrumb -->
      <div class="mb-12">
        <nav class="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <NuxtLink to="/" class="hover:text-purple-400 transition-colors">Beranda</NuxtLink>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
          <span class="text-purple-400">Galeri Lengkap</span>
        </nav>
        
        <div class="text-center">
          <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
            <span class="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Galeri Pekerjaan
            </span>
          </h1>
          <p class="text-gray-300 text-lg max-w-3xl mx-auto">
            Jelajahi koleksi lengkap hasil reparasi dan modifikasi yang telah kami selesaikan dengan presisi tinggi
          </p>
          
          <!-- Stats Counter -->
          <div class="flex flex-wrap justify-center gap-6 mt-8">
            <div class="text-center px-4 py-2 bg-white/5 rounded-xl backdrop-blur-sm">
              <div class="text-2xl font-bold text-white">{{ totalItems }}+</div>
              <div class="text-sm text-gray-400">Total Pekerjaan</div>
            </div>
            <div class="text-center px-4 py-2 bg-white/5 rounded-xl backdrop-blur-sm">
              <div class="text-2xl font-bold text-white">{{ totalPhotos }}+</div>
              <div class="text-sm text-gray-400">Total Foto</div>
            </div>
            <div class="text-center px-4 py-2 bg-white/5 rounded-xl backdrop-blur-sm">
              <div class="text-2xl font-bold text-white">{{ categories.length }}</div>
              <div class="text-sm text-gray-400">Kategori</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filter Kategori -->
      <div class="mb-10">
        <div class="flex flex-wrap gap-3 justify-center">
          <button
            v-for="cat in categories"
            :key="cat"
            @click="filterCategory = filterCategory === cat ? null : cat"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
              filterCategory === cat 
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30' 
                : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
            ]"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <!-- Grid Galeri Lengkap -->
      <div 
        ref="galleryGrid"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12"
      >
        <div 
          v-for="(item, itemIndex) in paginatedItems"
          :key="item.id"
          class="group gallery-item relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 hover:border-purple-500/30 backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover:z-10"
        >
          <!-- Carousel Mini untuk Multiple Foto -->
          <div class="relative h-64 overflow-hidden">
            <!-- Foto Container dengan Slide -->
            <div 
              class="absolute inset-0 flex transition-transform duration-500 ease-out"
              :style="{ transform: `translateX(-${currentPhotoIndex[item.id] * 100}%)` }"
            >
              <div 
                v-for="(photo, photoIndex) in item.photos" 
                :key="photoIndex"
                class="relative min-w-full h-full"
              >
                <img 
                  :src="photo.url" 
                  :alt="`${item.title} - Foto ${photoIndex + 1}`"
                  loading="lazy"
                  class="w-full h-full object-cover"
                  @click="openLightbox(item.id, photoIndex)"
                />
                
                <!-- Caption untuk Foto Individual -->
                <div 
                  v-if="photo.caption"
                  class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  {{ photo.caption }}
                </div>
              </div>
            </div>
            
            <!-- Badge Kategori dan Jumlah Foto -->
            <div class="absolute top-3 left-3 flex items-center gap-2">
              <span class="px-3 py-1 bg-black/70 backdrop-blur-sm text-xs font-medium text-white rounded-full">
                {{ item.category }}
              </span>
              <span 
                v-if="item.photos.length > 1"
                class="px-2 py-1 bg-black/50 backdrop-blur-sm text-xs text-white rounded-full"
              >
                {{ currentPhotoIndex[item.id] + 1 }}/{{ item.photos.length }}
              </span>
            </div>
            
            <!-- Navigation Arrows -->
            <div 
              v-if="item.photos.length > 1"
              class="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <button
                @click.stop="prevPhoto(item.id)"
                class="w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all hover:scale-110"
                :disabled="currentPhotoIndex[item.id] === 0"
                :class="{ 'opacity-50 cursor-not-allowed': currentPhotoIndex[item.id] === 0 }"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
              <button
                @click.stop="nextPhoto(item.id)"
                class="w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all hover:scale-110"
                :disabled="currentPhotoIndex[item.id] === item.photos.length - 1"
                :class="{ 'opacity-50 cursor-not-allowed': currentPhotoIndex[item.id] === item.photos.length - 1 }"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
            
            <!-- Photo Dots Indicator -->
            <div 
              v-if="item.photos.length > 1"
              class="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5"
            >
              <button
                v-for="(photo, dotIndex) in item.photos"
                :key="dotIndex"
                @click.stop="goToPhoto(item.id, dotIndex)"
                class="w-2 h-2 rounded-full transition-all duration-300"
                :class="currentPhotoIndex[item.id] === dotIndex 
                  ? 'bg-white w-4' 
                  : 'bg-white/40 hover:bg-white/60'"
              ></button>
            </div>
            
            <!-- Overlay Hover -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div class="absolute bottom-0 left-0 right-0 p-5">
                <h3 class="text-white font-bold text-xl mb-1">{{ item.title }}</h3>
                <p class="text-gray-200 text-sm mb-2">{{ item.caption }}</p>
                <p class="text-gray-400 text-xs line-clamp-3">{{ item.text }}</p>
                
                <!-- Action Buttons -->
                <div class="flex gap-2 mt-3">
                  <NuxtLink 
                    :to="`/gallery/${item.id}/${slugify(item.title)}`"
                    class="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs rounded-lg backdrop-blur-sm transition-colors flex items-center gap-1"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/>
                    </svg>
                    Lihat Detail
                  </NuxtLink>
                  <button 
                    @click.stop="shareItem(item)"
                    class="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs rounded-lg backdrop-blur-sm transition-colors flex items-center gap-1"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                    </svg>
                    Bagikan
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Info Bawah Card -->
          <div class="p-4">
            <div class="flex justify-between items-start mb-2">
              <div>
                <h4 class="text-white font-semibold">{{ item.title }}</h4>
                <p class="text-gray-400 text-sm">{{ item.caption }}</p>
              </div>
              <span class="text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded">
                {{ item.date }}
              </span>
            </div>
            
            <p class="text-gray-300 text-sm mb-4 line-clamp-2">{{ item.text }}</p>
            
            <!-- Info Jumlah Foto -->
            <div class="flex items-center justify-between text-xs text-gray-500 mb-3">
              <div class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <span>{{ item.photos.length }} foto</span>
              </div>
              <div class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>{{ item.duration }}</span>
              </div>
            </div>
            
            <!-- Tombol Baca Selengkapnya (Link ke halaman detail) -->
            <NuxtLink
              :to="`/gallery/${item.id}/${slugify(item.title)}`"
              class="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 text-purple-300 hover:text-white font-medium rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 flex items-center justify-center gap-2 group/readmore"
            >
              <span>Baca Selengkapnya</span>
              <svg 
                class="w-4 h-4 group-hover/readmore:translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="showPagination" class="flex justify-center items-center gap-4">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          :class="[
            'px-4 py-2 rounded-lg flex items-center gap-2 transition-all',
            currentPage === 1 
              ? 'opacity-50 cursor-not-allowed text-gray-500' 
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          ]"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Sebelumnya
        </button>
        
        <div class="flex gap-2">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="currentPage = page"
            :class="[
              'w-10 h-10 rounded-lg font-medium transition-all',
              currentPage === page 
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                : 'text-gray-300 hover:bg-white/5'
            ]"
          >
            {{ page }}
          </button>
        </div>
        
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          :class="[
            'px-4 py-2 rounded-lg flex items-center gap-2 transition-all',
            currentPage === totalPages 
              ? 'opacity-50 cursor-not-allowed text-gray-500' 
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          ]"
        >
          Selanjutnya
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>

      <!-- CTA Back to Home -->
      <div class="text-center mt-16 pt-8 border-t border-white/10">
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 text-white font-bold rounded-2xl border border-white/10 backdrop-blur-sm hover:backdrop-blur-md transition-all duration-300 transform hover:scale-105 group"
        >
          <svg class="w-6 h-6 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Kembali ke Beranda
        </NuxtLink>
      </div>
    </div>

    <!-- Lightbox Modal untuk Multiple Foto -->
    <div 
      v-if="lightbox.active"
      class="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
      @click="closeLightbox"
    >
      <div class="relative max-w-5xl max-h-[90vh] w-full" @click.stop>
        <!-- Close Button -->
        <button
          @click="closeLightbox"
          class="absolute -top-5 right-0 text-white hover:text-purple-400 transition-colors z-10"
        >
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
        
        <!-- Main Image -->
        <div class="relative h-[70vh]">
          <div 
            class="absolute inset-0 flex transition-transform duration-500 ease-out"
            :style="{ transform: `translateX(-${lightbox.currentIndex * 100}%)` }"
          >
            <div 
              v-for="(photo, index) in lightbox.photos" 
              :key="index"
              class="relative min-w-full h-full flex items-center justify-center p-4"
            >
              <img 
                :src="photo.url" 
                :alt="`Foto ${index + 1} - ${lightbox.title}`"
                class="max-w-full max-h-full object-contain rounded-lg"
              />
              <!-- Caption untuk foto di lightbox -->
              <div 
                v-if="photo.caption"
                class="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm text-white text-sm p-3 rounded-lg"
              >
                {{ photo.caption }}
              </div>
            </div>
          </div>
          
          <!-- Navigation Arrows -->
          <button
            @click.stop="prevLightbox"
            class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all hover:scale-110"
            :disabled="lightbox.currentIndex === 0"
            :class="{ 'opacity-50 cursor-not-allowed': lightbox.currentIndex === 0 }"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <button
            @click.stop="nextLightbox"
            class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all hover:scale-110"
            :disabled="lightbox.currentIndex === lightbox.photos.length - 1"
            :class="{ 'opacity-50 cursor-not-allowed': lightbox.currentIndex === lightbox.photos.length - 1 }"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
          
          <!-- Photo Counter -->
          <div class="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-sm text-white text-sm rounded-full">
            {{ lightbox.currentIndex + 1 }} / {{ lightbox.photos.length }}
          </div>
        </div>
        
        <!-- Thumbnail Strip -->
        <div class="mt-4 overflow-x-auto">
          <div class="flex gap-2 px-4 py-2">
            <button
              v-for="(photo, index) in lightbox.photos"
              :key="index"
              @click="lightbox.currentIndex = index"
              class="flex-shrink-0 w-20 h-16 rounded overflow-hidden border-2 transition-all"
              :class="lightbox.currentIndex === index 
                ? 'border-purple-500 scale-105' 
                : 'border-transparent opacity-60 hover:opacity-100'"
            >
              <img 
                :src="photo.url" 
                :alt="`Thumbnail ${index + 1}`"
                class="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>
        
        <!-- Caption -->
        <div class="mt-4 p-6 bg-gradient-to-t from-black/90 to-transparent rounded-b-lg">
          <h3 class="text-white text-xl font-bold">{{ lightbox.title }}</h3>
          <p class="text-gray-300">{{ lightbox.caption }}</p>
          <p class="text-gray-400 text-sm mt-2">{{ lightbox.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Data partikel di client side
const particles = ref([])

// Fungsi untuk generate style partikel di client side
const getParticleStyle = () => {
  // Hanya dijalankan di client
  if (typeof window === 'undefined') {
    return {}
  }
  
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animation: `float ${3 + Math.random() * 4}s infinite ease-in-out ${Math.random() * 2}s`
  }
}

gsap.registerPlugin(ScrollTrigger)

// State untuk tracking foto aktif di setiap card
const currentPhotoIndex = ref({})

// Data dengan multiple photos per item
const allGalleryItems = ref([
  { 
    id: 1,
    title: 'Redmi 9', 
    caption: 'Pergantian eMMC', 
    text: 'Upgrade kapasitas eMMC menjadi 128GB untuk performa lebih cepat dan penyimpanan lebih besar.', 
    fullText: 'Proses pergantian eMMC pada Redmi 9 membutuhkan keahlian khusus karena chip terintegrasi dengan board. Kami menggunakan hot air gun dengan suhu terkontrol untuk melepas chip lama dan memasang chip baru dengan kapasitas 128GB. Setelah pemasangan, dilakukan flashing firmware dan testing menyeluruh untuk memastikan semua fungsi berjalan normal.',
    photos: [
      { url: '/gallery/redmi9_emmc_1.jpg', caption: 'Kondisi eMMC sebelum diganti' },
      { url: '/gallery/redmi9_emmc_2.jpg', caption: 'Proses penggantian eMMC' },
      { url: '/gallery/redmi9_emmc_3.jpg', caption: 'Hasil akhir setelah penggantian' }
    ],
    category: 'eMMC Repair',
    date: '15 Jan 2024',
    duration: '3 jam'
  },
  { 
    id: 2,
    title: 'Vivo Y20', 
    caption: 'Pergantian eMMC Mati', 
    text: 'Ganti eMMC yang sudah tidak terdeteksi dengan chip baru original.', 
    fullText: 'EMMC pada Vivo Y20 mengalami kerusakan total sehingga tidak terdeteksi oleh sistem. Kami melakukan penggantian dengan chip baru original yang memiliki kompatibilitas sempurna. Setelah penggantian, dilakukan flashing ulang sistem operasi dan testing semua fungsi hardware.',
    photos: [
      { url: '/gallery/perbaikan_emmc_1.jpeg', caption: 'EMMC lama yang sudah mati' },
      { url: '/gallery/perbaikan_emmc_2.jpeg', caption: 'Proses pemasangan eMMC baru' }
    ],
    category: 'eMMC Repair',
    date: '10 Jan 2024',
    duration: '2 jam'
  },
  { 
    id: 3,
    title: 'Oppo A5s', 
    caption: 'Perbaikan Jalur Konektor LCD', 
    text: 'Repair jalur flex cable LCD yang putus akibat benturan.', 
    fullText: 'Konektor LCD pada Oppo A5s mengalami kerusakan fisik akibat benturan. Kami melakukan perbaikan jalur dengan teknik microsoldering untuk menyambungkan kembali jalur yang putus. Setelah perbaikan, dilakukan testing tampilan LCD dengan berbagai warna untuk memastikan kualitas gambar.',
    photos: [
      { url: '/gallery/perbaikan_konektor_lcd_1.jpeg', caption: 'Konektor LCD yang rusak' },
      { url: '/gallery/perbaikan_konektor_lcd_2.jpeg', caption: 'Proses repair microsoldering' },
      { url: '/gallery/perbaikan_konektor_lcd_3.jpeg', caption: 'Hasil setelah diperbaiki' }
    ],
    category: 'LCD Repair',
    date: '5 Jan 2024',
    duration: '4 jam'
  },
  { 
    id: 4,
    title: 'Samsung A51', 
    caption: 'Reball Chipset Snapdragon', 
    text: 'Proses reballing chipset utama untuk mengatasi masalah hang dan restart.', 
    fullText: 'Chipset Snapdragon pada Samsung A51 mengalami cold joint yang menyebabkan device sering hang dan restart. Kami melakukan proses reballing dengan menggunakan BGA rework station untuk melepas chipset, membersihkan bola solder, dan memasang kembali dengan solder baru berkualitas tinggi.',
    photos: [
      { url: '/gallery/Reball_chipset_1.jpeg', caption: 'Chipset sebelum direball' },
      { url: '/gallery/Reball_chipset_2.jpeg', caption: 'Proses reballing chipset' },
      { url: '/gallery/Reball_chipset_3.jpeg', caption: 'Chipset setelah direball' }
    ],
    category: 'Chipset',
    date: '28 Des 2023',
    duration: '5 jam'
  },
  { 
    id: 5,
    title: 'iPhone X', 
    caption: 'Perbaikan Jalur Pad IC Power', 
    text: 'Microsoldering jalur pad IC power yang terkelupas.', 
    fullText: 'IC Power pada iPhone X mengalami kerusakan pad akibat percikan air. Kami melakukan perbaikan dengan teknik microsoldering untuk menyambungkan kembali jalur yang terkelupas menggunakan kabel jumper ultra tipis. Setelah perbaikan, dilakukan pengukuran voltase untuk memastikan semua jalur berfungsi normal.',
    photos: [
      { url: '/gallery/perbaikkan_jalur_pad_1.jpeg', caption: 'Pad IC yang terkelupas' },
      { url: '/gallery/perbaikkan_jalur_pad_2.jpeg', caption: 'Proses microsoldering' },
      { url: '/gallery/perbaikkan_jalur_pad_3.jpeg', caption: 'Hasil perbaikan jalur' }
    ],
    category: 'Microsoldering',
    date: '20 Des 2023',
    duration: '6 jam'
  },
  { 
    id: 6,
    title: 'iPhone 11', 
    caption: 'Water Damage Repair', 
    text: 'Pembersihan korosi akibat air dan penggantian komponen yang rusak.', 
    fullText: 'iPhone 11 terkena air sehingga menyebabkan korosi pada beberapa komponen utama. Kami melakukan ultrasonic cleaning untuk membersihkan korosi, kemudian mengganti komponen yang sudah rusak seperti charging port dan speaker. Setelah perbaikan, device berfungsi normal kembali.',
    photos: [
      { url: '/gallery/water_damage_1.jpg', caption: 'Kondisi sebelum dibersihkan' },
      { url: '/gallery/water_damage_2.jpg', caption: 'Proses ultrasonic cleaning' },
      { url: '/gallery/water_damage_3.jpg', caption: 'Hasil setelah diperbaiki' }
    ],
    category: 'Water Damage',
    date: '12 Des 2023',
    duration: '8 jam'
  },
  { 
    id: 7,
    title: 'iPad Air 3', 
    caption: 'BGA Rework CPU', 
    text: 'Proses BGA rework pada chip A12 Bionic.', 
    fullText: 'Chip A12 Bionic pada iPad Air 3 mengalami masalah akibat overheating. Kami melakukan BGA rework untuk melepas chip, mengganti thermal paste, dan memasang kembali dengan presisi tinggi menggunakan BGA rework station. Setelah proses, dilakukan stress test untuk memastikan chip bekerja optimal.',
    photos: [
      { url: '/gallery/bga_rework_1.jpg', caption: 'Chip A12 sebelum rework' },
      { url: '/gallery/bga_rework_2.jpg', caption: 'Proses BGA rework' },
      { url: '/gallery/bga_rework_3.jpg', caption: 'Chip setelah dipasang kembali' }
    ],
    category: 'BGA',
    date: '5 Des 2023',
    duration: '7 jam'
  },
  { 
    id: 8,
    title: 'HP Envy', 
    caption: 'Data Recovery SSD', 
    text: 'Recovery data dari SSD yang tidak terdeteksi.', 
    fullText: 'SSD pada HP Envy tidak terdeteksi oleh sistem sehingga data penting tidak bisa diakses. Kami menggunakan alat khusus untuk membaca chip flash memory secara langsung, kemudian melakukan recovery data dengan software khusus. Berhasil menyelamatkan 95% data penting klien.',
    photos: [
      { url: '/gallery/data_recovery_1.jpg', caption: 'SSD yang tidak terdeteksi' },
      { url: '/gallery/data_recovery_2.jpg', caption: 'Proses recovery data' },
      { url: '/gallery/data_recovery_3.jpg', caption: 'Data berhasil direcovery' }
    ],
    category: 'Data Recovery',
    date: '30 Nov 2023',
    duration: '10 jam'
  }
])

// Fungsi untuk navigasi foto dalam card
const nextPhoto = (itemId) => {
  const currentIndex = currentPhotoIndex.value[itemId] || 0
  const item = allGalleryItems.value.find(i => i.id === itemId)
  if (currentIndex < item.photos.length - 1) {
    currentPhotoIndex.value = {
      ...currentPhotoIndex.value,
      [itemId]: currentIndex + 1
    }
  }
}

const prevPhoto = (itemId) => {
  const currentIndex = currentPhotoIndex.value[itemId] || 0
  if (currentIndex > 0) {
    currentPhotoIndex.value = {
      ...currentPhotoIndex.value,
      [itemId]: currentIndex - 1
    }
  }
}

const goToPhoto = (itemId, photoIndex) => {
  currentPhotoIndex.value = {
    ...currentPhotoIndex.value,
    [itemId]: photoIndex
  }
}

// Helper function untuk membuat slug
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

// Categories
const categories = computed(() => {
  return [...new Set(allGalleryItems.value.map(item => item.category))]
})

// Filter state
const filterCategory = ref(null)
const currentPage = ref(1)
const itemsPerPage = 8

// Filtered items
const filteredItems = computed(() => {
  let items = allGalleryItems.value
  
  if (filterCategory.value) {
    items = items.filter(item => item.category === filterCategory.value)
  }
  
  // Inisialisasi currentPhotoIndex untuk setiap item
  items.forEach(item => {
    if (currentPhotoIndex.value[item.id] === undefined) {
      currentPhotoIndex.value[item.id] = 0
    }
  })
  
  return items
})

// Pagination
const totalItems = computed(() => allGalleryItems.value.length)
const totalPhotos = computed(() => {
  return allGalleryItems.value.reduce((total, item) => total + item.photos.length, 0)
})
const totalPages = computed(() => Math.ceil(filteredItems.value.length / itemsPerPage))
const showPagination = computed(() => totalPages.value > 1)
const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredItems.value.slice(start, end)
})

// Lightbox state untuk multiple foto
const lightbox = ref({
  active: false,
  photos: [],
  currentIndex: 0,
  title: '',
  caption: '',
  description: ''
})

// Buka lightbox dengan semua foto dari item
const openLightbox = (itemId, photoIndex = 0) => {
  const item = allGalleryItems.value.find(i => i.id === itemId)
  if (!item) return
  
  lightbox.value = {
    active: true,
    photos: item.photos,
    currentIndex: photoIndex,
    title: item.title,
    caption: item.caption,
    description: item.text
  }
  document.body.style.overflow = 'hidden'
}

// Navigasi di lightbox
const nextLightbox = () => {
  if (lightbox.value.currentIndex < lightbox.value.photos.length - 1) {
    lightbox.value.currentIndex++
  }
}

const prevLightbox = () => {
  if (lightbox.value.currentIndex > 0) {
    lightbox.value.currentIndex--
  }
}

const closeLightbox = () => {
  lightbox.value.active = false
  document.body.style.overflow = ''
}

// Fungsi share item
const shareItem = (item) => {
  const itemUrl = `${window.location.origin}/gallery/${item.id}/${slugify(item.title)}`
  
  if (navigator.share) {
    navigator.share({
      title: `${item.title} - ${item.caption}`,
      text: item.text,
      url: itemUrl
    })
  } else {
    navigator.clipboard.writeText(`${item.title} - ${item.caption}\n${item.text}\n${itemUrl}`)
    alert('Link berhasil disalin ke clipboard!')
  }
}

// Pagination methods
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    scrollToTop()
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    scrollToTop()
  }
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Animations
const galleryGrid = ref(null)

onMounted(() => {
  // Animasi masuk untuk item galeri
  gsap.fromTo('.gallery-item', 
    {
      opacity: 0,
      y: 30,
      scale: 0.95
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: galleryGrid.value,
        start: 'top center+=100',
        toggleActions: 'play none none none'
      }
    }
  )
  
  // Animasi floating untuk stats
  gsap.to('.text-center > div > div', {
    y: -5,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  })
  
  // Inisialisasi currentPhotoIndex untuk semua item
  allGalleryItems.value.forEach(item => {
    if (currentPhotoIndex.value[item.id] === undefined) {
      currentPhotoIndex.value[item.id] = 0
    }
  })
})

// Keyboard navigation untuk lightbox
onMounted(() => {
  const handleKeydown = (e) => {
    if (lightbox.value.active) {
      switch(e.key) {
        case 'Escape':
          closeLightbox()
          break
        case 'ArrowRight':
          nextLightbox()
          break
        case 'ArrowLeft':
          prevLightbox()
          break
      }
    }
  }
  
  window.addEventListener('keydown', handleKeydown)
  
  return () => {
    window.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  33% {
    transform: translateY(-10px) translateX(5px);
  }
  66% {
    transform: translateY(5px) translateX(-5px);
  }
}

/* Smooth transitions */
.gallery-item {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Glass effect */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #1f2937;
}

::-webkit-scrollbar-thumb {
  background: #4f46e5;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: #7c3aed;
}

/* Thumbnail strip scrollbar */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .gallery-item {
    margin-bottom: 1rem;
  }
  
  .text-4xl {
    font-size: 2rem;
  }
  
  .text-lg {
    font-size: 1rem;
  }
}

/* Smooth carousel transition */
.carousel-transition {
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Hover effects for better UX */
button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

/* Enhance image loading experience */
img {
  transition: opacity 0.3s ease;
}

img[loading="lazy"] {
  opacity: 0;
  animation: fadeIn 0.5s ease forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

/* Improve focus states for accessibility */
button:focus-visible,
a:focus-visible {
  outline: 2px solid #8b5cf6;
  outline-offset: 2px;
}
</style>