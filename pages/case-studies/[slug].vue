<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
    <!-- Background Particles (Client Only) -->
    <ClientOnly>
      <div class="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          v-for="i in 15" 
          :key="i"
          class="absolute w-1 h-1 bg-purple-500/20 rounded-full"
          :style="getParticleStyle()"
        ></div>
      </div>
    </ClientOnly>

    <div class="max-w-6xl mx-auto relative z-10">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <NuxtLink to="/" class="hover:text-purple-400 transition-colors">Beranda</NuxtLink>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
        <NuxtLink to="/case-studies" class="hover:text-purple-400 transition-colors">Galeri</NuxtLink>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
        <span class="text-purple-400 truncate max-w-xs">{{ item?.title }}</span>
      </nav>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
        <p class="text-gray-300">Memuat detail pekerjaan...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="!item" class="text-center py-20">
        <div class="text-red-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-white mb-2">Item tidak ditemukan</h2>
        <p class="text-gray-400 mb-6">Pekerjaan yang Anda cari tidak ditemukan dalam galeri kami.</p>
        <NuxtLink 
          to="/case-studies"
          class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Kembali ke Galeri
        </NuxtLink>
      </div>

      <!-- Main Content -->
      <div v-else class="space-y-8">
        <!-- Hero Section -->
        <div class="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
          <div class="grid lg:grid-cols-2 gap-8">
            <!-- Carousel Foto -->
            <div class="space-y-4">
              <!-- Main Carousel -->
              <div class="relative h-80 md:h-96 rounded-xl overflow-hidden bg-gray-800/30">
                <div 
                  class="absolute inset-0 flex transition-transform duration-500 ease-out"
                  :style="{ transform: `translateX(-${currentPhotoIndex * 100}%)` }"
                >
                  <div 
                    v-for="(photo, index) in item.photos" 
                    :key="index"
                    class="relative min-w-full h-full"
                  >
                    <img 
                      :src="photo.url" 
                      :alt="`${item.title} - Foto ${index + 1}`"
                      class="w-full h-full object-cover"
                    />
                    <div 
                      v-if="photo.caption"
                      class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4"
                    >
                      <p class="text-white text-sm">{{ photo.caption }}</p>
                    </div>
                  </div>
                </div>
                
                <!-- Navigation Arrows -->
                <button
                  @click="prevPhoto"
                  class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all hover:scale-110"
                  :disabled="currentPhotoIndex === 0"
                  :class="{ 'opacity-50 cursor-not-allowed': currentPhotoIndex === 0 }"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                  </svg>
                </button>
                <button
                  @click="nextPhoto"
                  class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all hover:scale-110"
                  :disabled="currentPhotoIndex === item.photos.length - 1"
                  :class="{ 'opacity-50 cursor-not-allowed': currentPhotoIndex === item.photos.length - 1 }"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
                
                <!-- Photo Counter -->
                <div class="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-sm rounded-full">
                  {{ currentPhotoIndex + 1 }} / {{ item.photos.length }}
                </div>
              </div>
              
              <!-- Thumbnail Strip -->
              <div class="flex gap-2 overflow-x-auto pb-2">
                <button
                  v-for="(photo, index) in item.photos"
                  :key="index"
                  @click="currentPhotoIndex = index"
                  class="flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all"
                  :class="currentPhotoIndex === index 
                    ? 'border-purple-500 scale-105' 
                    : 'border-gray-700 hover:border-gray-500'"
                >
                  <img 
                    :src="photo.url" 
                    :alt="`Thumbnail ${index + 1}`"
                    class="w-full h-full object-cover"
                  />
                </button>
              </div>
            </div>
            
            <!-- Info Detail -->
            <div>
              <div class="flex flex-wrap gap-2 mb-4">
                <span class="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm font-medium">
                  {{ item.category }}
                </span>
                <span class="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm">
                  {{ item.duration }}
                </span>
                <span class="px-3 py-1 bg-green-600/20 text-green-300 rounded-full text-sm">
                  {{ item.date }}
                </span>
              </div>
              
              <h1 class="text-3xl md:text-4xl font-bold text-white mb-4">{{ item.title }}</h1>
              <h2 class="text-xl text-gray-300 mb-6">{{ item.caption }}</h2>
              
              <p class="text-gray-300 mb-6">{{ item.text }}</p>
              
              <!-- Stats -->
              <div class="grid grid-cols-2 gap-4 mb-6">
                <div class="bg-gray-800/30 rounded-lg p-4">
                  <div class="text-2xl font-bold text-white mb-1">{{ item.photos.length }}</div>
                  <div class="text-sm text-gray-400">Jumlah Foto</div>
                </div>
                <div class="bg-gray-800/30 rounded-lg p-4">
                  <div class="text-2xl font-bold text-white mb-1">{{ getComplexityLevel(item) }}</div>
                  <div class="text-sm text-gray-400">Tingkat Kesulitan</div>
                </div>
              </div>
              
              <!-- CTA Buttons -->
              <div class="flex flex-wrap gap-3">
                <button
                  @click="contactAbout(item)"
                  class="flex-1 min-w-[140px] py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  Konsultasi Serupa
                </button>
                <button
                  @click="shareItem"
                  class="flex-1 min-w-[140px] py-3 px-6 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl border border-gray-600 transition-all flex items-center justify-center gap-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                  </svg>
                  Bagikan
                </button>
                <button
                  @click="$router.back()"
                  class="flex-1 min-w-[140px] py-3 px-6 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 font-semibold rounded-xl border border-gray-700 transition-all flex items-center justify-center gap-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                  </svg>
                  Kembali
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Detail Section -->
        <div class="grid lg:grid-cols-3 gap-8">
          <!-- Detail Teknis -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Deskripsi Lengkap -->
            <section class="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
              <h3 class="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Deskripsi Lengkap Pekerjaan
              </h3>
              <div class="prose prose-invert max-w-none">
                <p class="text-gray-300 mb-4">{{ item.fullText || item.text }}</p>
                
                <!-- Proses Pengerjaan -->
                <div class="mt-8">
                  <h4 class="text-xl font-bold text-white mb-4">Proses Pengerjaan:</h4>
                  <div class="space-y-4">
                    <div 
                      v-for="(step, index) in getProcessSteps(item)"
                      :key="index"
                      class="flex items-start gap-4 p-4 bg-gray-800/30 rounded-xl"
                    >
                      <div class="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                        {{ index + 1 }}
                      </div>
                      <div>
                        <h5 class="font-semibold text-white mb-1">{{ step.title }}</h5>
                        <p class="text-gray-400 text-sm">{{ step.description }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Galeri Foto -->
            <section class="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
              <h3 class="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                Galeri Foto
              </h3>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                <button
                  v-for="(photo, index) in item.photos"
                  :key="index"
                  @click="openLightbox(index)"
                  class="group relative aspect-square overflow-hidden rounded-lg bg-gray-800/30 border border-gray-700 hover:border-purple-500 transition-all"
                >
                  <img 
                    :src="photo.url" 
                    :alt="`Foto ${index + 1}`"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/>
                    </svg>
                  </div>
                  <div 
                    v-if="photo.caption"
                    class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2"
                  >
                    <p class="text-white text-xs truncate">{{ photo.caption }}</p>
                  </div>
                </button>
              </div>
            </section>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Info Teknis -->
            <div class="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
              <h4 class="text-xl font-bold text-white mb-4">Info Teknis</h4>
              <div class="space-y-3">
                <div class="flex justify-between items-center py-2 border-b border-gray-700/50">
                  <span class="text-gray-400">Kategori</span>
                  <span class="text-white font-medium">{{ item.category }}</span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-gray-700/50">
                  <span class="text-gray-400">Durasi</span>
                  <span class="text-white font-medium">{{ item.duration }}</span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-gray-700/50">
                  <span class="text-gray-400">Tanggal</span>
                  <span class="text-white font-medium">{{ item.date }}</span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-gray-700/50">
                  <span class="text-gray-400">Jumlah Foto</span>
                  <span class="text-white font-medium">{{ item.photos.length }}</span>
                </div>
                <div class="flex justify-between items-center py-2">
                  <span class="text-gray-400">ID Pekerjaan</span>
                  <span class="text-purple-300 font-mono">#{{ item.id.toString().padStart(3, '0') }}</span>
                </div>
              </div>
            </div>

            <!-- Alat yang Digunakan -->
            <div class="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
              <h4 class="text-xl font-bold text-white mb-4">Alat yang Digunakan</h4>
              <ul class="space-y-2">
                <li v-for="tool in getToolsUsed(item)" :key="tool" class="flex items-center gap-2 text-gray-300">
                  <svg class="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  {{ tool }}
                </li>
              </ul>
            </div>

            <!-- Pekerjaan Serupa -->
            <div class="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
              <h4 class="text-xl font-bold text-white mb-4">Pekerjaan Serupa</h4>
              <div class="space-y-3">
                <NuxtLink
                  v-for="related in relatedItems"
                  :key="related.id"
                  :to="`/case-studies/${slugify(related.title)}`"
                  class="flex items-center gap-3 p-3 bg-gray-800/30 hover:bg-gray-800/50 rounded-lg transition-colors group"
                >
                  <div class="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                    <img 
                      :src="related.photos[0].url" 
                      :alt="related.title"
                      class="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <div class="flex-1 min-w-0">
                    <h5 class="text-white font-medium truncate">{{ related.title }}</h5>
                    <p class="text-gray-400 text-xs truncate">{{ related.caption }}</p>
                  </div>
                  <svg class="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <!-- CTA Section -->
        <div class="text-center py-8">
          <h3 class="text-2xl font-bold text-white mb-4">Butuh Layanan Serupa?</h3>
          <p class="text-gray-300 mb-6 max-w-2xl mx-auto">
            Hubungi kami sekarang untuk konsultasi gratis dan penawaran spesial untuk perbaikan device Anda.
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <button
              @click="contactAbout(item)"
              class="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all"
            >
              Hubungi Kami
            </button>
            <NuxtLink
              to="/case-studies"
              class="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl border border-gray-600 transition-all"
            >
              Lihat Galeri Lainnya
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox Modal -->
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
                :alt="`Foto ${index + 1}`"
                class="max-w-full max-h-full object-contain rounded-lg"
              />
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const route = useRoute()
const router = useRouter()
const slug = route.params.slug // Pakai slug, bukan id

// State
const loading = ref(false)
const currentPhotoIndex = ref(0)
const lightbox = ref({
  active: false,
  photos: [],
  currentIndex: 0
})

// Mock data (sama dengan di halaman galeri)
const allCaseStudiesItems = [
  { 
    id: 1,
    title: 'Redmi 9', 
    caption: 'Pergantian eMMC', 
    text: 'Upgrade kapasitas eMMC menjadi 128GB untuk performa lebih cepat dan penyimpanan lebih besar.', 
    fullText: 'Proses pergantian eMMC pada Redmi 9 membutuhkan keahlian khusus karena chip terintegrasi dengan board. Kami menggunakan hot air gun dengan suhu terkontrol untuk melepas chip lama dan memasang chip baru dengan kapasitas 128GB. Setelah pemasangan, dilakukan flashing firmware dan testing menyeluruh untuk memastikan semua fungsi berjalan normal.',
    photos: [
      { url: '/case-studies/redmi9_emmc_1.jpg', caption: 'Kondisi eMMC sebelum diganti' },
      { url: '/case-studies/redmi9_emmc_2.jpg', caption: 'Proses penggantian eMMC' },
      { url: '/case-studies/redmi9_emmc_3.jpg', caption: 'Hasil akhir setelah penggantian' }
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
      { url: '/case-studies/perbaikan_emmc_1.jpeg', caption: 'EMMC lama yang sudah mati' },
      { url: '/case-studies/perbaikan_emmc_2.jpeg', caption: 'Proses pemasangan eMMC baru' }
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
      { url: '/case-studies/perbaikan_konektor_lcd_1.jpeg', caption: 'Konektor LCD yang rusak' },
      { url: '/case-studies/perbaikan_konektor_lcd_2.jpeg', caption: 'Proses repair microsoldering' },
      { url: '/case-studies/perbaikan_konektor_lcd_3.jpeg', caption: 'Hasil setelah diperbaiki' }
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
      { url: '/case-studies/Reball_chipset_1.jpeg', caption: 'Chipset sebelum direball' },
      { url: '/case-studies/Reball_chipset_2.jpeg', caption: 'Proses reballing chipset' },
      { url: '/case-studies/Reball_chipset_3.jpeg', caption: 'Chipset setelah direball' }
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
      { url: '/case-studies/perbaikkan_jalur_pad_1.jpeg', caption: 'Pad IC yang terkelupas' },
      { url: '/case-studies/perbaikkan_jalur_pad_2.jpeg', caption: 'Proses microsoldering' },
      { url: '/case-studies/perbaikkan_jalur_pad_3.jpeg', caption: 'Hasil perbaikan jalur' }
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
      { url: '/case-studies/water_damage_1.jpg', caption: 'Kondisi sebelum dibersihkan' },
      { url: '/case-studies/water_damage_2.jpg', caption: 'Proses ultrasonic cleaning' },
      { url: '/case-studies/water_damage_3.jpg', caption: 'Hasil setelah diperbaiki' }
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
      { url: '/case-studies/bga_rework_1.jpg', caption: 'Chip A12 sebelum rework' },
      { url: '/case-studies/bga_rework_2.jpg', caption: 'Proses BGA rework' },
      { url: '/case-studies/bga_rework_3.jpg', caption: 'Chip setelah dipasang kembali' }
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
      { url: '/case-studies/data_recovery_1.jpg', caption: 'SSD yang tidak terdeteksi' },
      { url: '/case-studies/data_recovery_2.jpg', caption: 'Proses recovery data' },
      { url: '/case-studies/data_recovery_3.jpg', caption: 'Data berhasil direcovery' }
    ],
    category: 'Data Recovery',
    date: '30 Nov 2023',
    duration: '10 jam'
  }
]

// Fetch item berdasarkan ID
const item = computed(() => {
  // Cari berdasarkan slug yang di-generate dari title
  return allCaseStudiesItems.find(item => 
    slugify(item.title) === slug
  )
})

// Related items (kategori yang sama)
const relatedItems = computed(() => {
  if (!item.value) return []
  return allCaseStudiesItems
    .filter(i => i.id !== item.value.id && i.category === item.value.category)
    .slice(0, 3)
})

// Helper functions
const getParticleStyle = () => {
  if (typeof window === 'undefined') {
    return {}
  }
  
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animation: `float ${3 + Math.random() * 4}s infinite ease-in-out ${Math.random() * 2}s`
  }
}

const getComplexityLevel = (item) => {
  const durationHours = parseInt(item.duration)
  if (durationHours >= 8) return 'Sangat Tinggi'
  if (durationHours >= 5) return 'Tinggi'
  if (durationHours >= 3) return 'Menengah'
  return 'Rendah'
}

const getToolsUsed = (item) => {
  const tools = {
    'eMMC Repair': ['Hot Air Gun', 'Solder Station', 'Multimeter', 'BGA Rework Station'],
    'LCD Repair': ['Microscope', 'Hot Plate', 'Precision Tools', 'UV Light'],
    'Chipset': ['BGA Rework Station', 'Hot Air Gun', 'Solder Paste', 'Flux'],
    'Microsoldering': ['Microscope', 'Jumper Wires', 'Solder Iron', 'UV Glue'],
    'Water Damage': ['Ultrasonic Cleaner', 'Isopropyl Alcohol', 'Hot Air Gun', 'Multimeter'],
    'BGA': ['BGA Rework Station', 'Stencil', 'Solder Paste', 'Hot Plate'],
    'Data Recovery': ['PC-3000', 'Flash Reader', 'Soldering Tools', 'Data Recovery Software']
  }
  return tools[item.category] || ['Hot Air Gun', 'Solder Station', 'Multimeter']
}

const getProcessSteps = (item) => {
  return [
    { title: 'Diagnosis Awal', description: 'Memeriksa kondisi device dan mengidentifikasi masalah utama.' },
    { title: 'Persiapan Alat', description: 'Menyiapkan semua peralatan yang dibutuhkan sesuai dengan jenis perbaikan.' },
    { title: 'Proses Perbaikan', description: 'Melakukan perbaikan dengan teknik yang tepat sesuai spesifikasi.' },
    { title: 'Quality Control', description: 'Menguji semua fungsi untuk memastikan perbaikan berhasil.' },
    { title: 'Finishing', description: 'Membersihkan device dan melakukan final check sebelum diserahkan.' }
  ]
}

// Carousel functions
const nextPhoto = () => {
  if (currentPhotoIndex.value < item.value.photos.length - 1) {
    currentPhotoIndex.value++
  }
}

const prevPhoto = () => {
  if (currentPhotoIndex.value > 0) {
    currentPhotoIndex.value--
  }
}

// Lightbox functions
const openLightbox = (index = 0) => {
  lightbox.value = {
    active: true,
    photos: item.value.photos,
    currentIndex: index
  }
  document.body.style.overflow = 'hidden'
}

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

// Share function
const shareItem = () => {
  const itemUrl = window.location.href
  const shareText = `${item.value.title} - ${item.value.caption}`
  
  if (navigator.share) {
    navigator.share({
      title: shareText,
      text: item.value.text,
      url: itemUrl
    })
  } else {
    navigator.clipboard.writeText(`${shareText}\n${item.value.text}\n${itemUrl}`)
    alert('Link berhasil disalin ke clipboard!')
  }
}

// Contact function
const contactAbout = (item) => {
  const message = `Halo, saya tertarik dengan layanan ${item.title} (${item.caption}) yang ada di galeri Anda. Bisa saya konsultasi lebih lanjut?`
  const whatsappUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, '_blank')
}

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

  console.log('Slug dari URL:', slug)
  console.log('Item ditemukan:', item.value)
  console.log('Semua slug yang ada:', 
    allCaseStudiesItems.map(i => ({
      id: i.id,
      title: i.title,
      slug: slugify(i.title)
    }))
  )
})

// Set head untuk SEO
useHead({
  title: item.value ? `${item.value.title} - ${item.value.caption} | Galeri Pekerjaan` : 'Detail Pekerjaan',
  meta: [
    { 
      name: 'description', 
      content: item.value ? item.value.text : 'Detail lengkap pekerjaan reparasi dan modifikasi' 
    },
    { 
      property: 'og:title', 
      content: item.value ? `${item.value.title} - ${item.value.caption}` : 'Detail Pekerjaan' 
    },
    { 
      property: 'og:description', 
      content: item.value ? item.value.text : 'Detail lengkap pekerjaan reparasi dan modifikasi' 
    },
    { 
      property: 'og:image', 
      content: item.value ? item.value.photos[0].url : '/og-image.jpg' 
    },
    { 
      property: 'og:url', 
      content: process.client ? window.location.href : '' 
    }
  ]
})
</script>


<style scoped>
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

/* Glass effect */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #1f2937;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #4f46e5;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #7c3aed;
}

/* Thumbnail strip scrollbar */
.overflow-x-auto::-webkit-scrollbar {
  height: 4px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .grid-cols-2 {
    grid-template-columns: repeat(1, 1fr);
  }
  
  .text-3xl {
    font-size: 1.5rem;
  }
  
  .text-2xl {
    font-size: 1.25rem;
  }
}

/* Smooth transitions */
img {
  transition: transform 0.3s ease;
}

/* Improve focus states for accessibility */
button:focus-visible,
a:focus-visible {
  outline: 2px solid #8b5cf6;
  outline-offset: 2px;
}

/* Prose styling for content */
.prose-invert p {
  margin-bottom: 1rem;
  line-height: 1.6;
}

.prose-invert ul {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

.prose-invert li {
  margin-bottom: 0.5rem;
}
</style>