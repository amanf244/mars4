<template>
  <section id="services" ref="servicesSection" class="services-section py-20 px-4 sm:px-6 bg-gradient-to-b from-gray-900 to-black">
    <div class="container mx-auto max-w-6xl">
      <!-- Header dengan animasi -->
      <div class="text-center mb-16">
        <div class="inline-block relative">
          <span class="absolute -top-4 -left-4 w-8 h-8 bg-blue-500/20 rounded-full blur-sm"></span>
          <h2 class="text-4xl md:text-5xl font-bold text-white relative z-10 services-title">
            <span class="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Layanan Kami
            </span>
          </h2>
          <div class="mt-4 h-1 w-24 bg-gradient-to-r from-blue-500 to-cyan-400 mx-auto rounded-full"></div>
        </div>
        <p class="text-gray-300 mt-6 max-w-2xl mx-auto text-lg">
          Solusi lengkap dengan harga transparan dan fleksibel
        </p>
      </div>

      <!-- Grid Layanan -->
      <div class="grid lg:grid-cols-3 gap-6 md:gap-8">
        <div 
          v-for="(service, index) in services" 
          :key="index" 
          class="group relative"
          @mouseenter="hoveredCard = index"
          @mouseleave="hoveredCard = null"
        >
          <!-- Efek Glow Latar -->
          <div 
            class="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"
            :class="{ 'opacity-30': hoveredCard === index }"
          ></div>
          
          <!-- Kartu Layanan -->
          <div 
            class="relative p-6 md:p-8 bg-gray-900/90 backdrop-blur-sm rounded-2xl border border-gray-800/50 group-hover:border-blue-500/50 transition-all duration-300 h-full"
            :class="{ 'scale-[1.02]': hoveredCard === index }"
          >
            <!-- Bagian Ikon -->
            <div class="flex items-start justify-between mb-6">
              <div class="flex items-center gap-4">
                <div class="p-3 bg-gradient-to-br from-blue-900/30 to-cyan-900/20 rounded-xl group-hover:from-blue-900/40 group-hover:to-cyan-900/30 transition-all duration-300">
                  <component 
                    :is="service.icon" 
                    class="h-7 w-7 md:h-9 md:w-9 text-blue-400 group-hover:text-cyan-300 transition-colors duration-300"
                  />
                </div>
                <div>
                  <h3 class="text-xl md:text-2xl font-bold text-white">
                    {{ service.title }}
                  </h3>
                  <div class="flex items-center gap-2 mt-1">
                    <span 
                      v-for="n in service.rating || 5" 
                      :key="n" 
                      class="text-yellow-400 text-sm"
                    >
                      ★
                    </span>
                  </div>
                </div>
              </div>
              <span class="px-3 py-1 bg-blue-900/30 text-blue-300 text-sm font-medium rounded-full border border-blue-800/50">
                Populer
              </span>
            </div>

            <!-- Deskripsi -->
            <p class="text-gray-300 mb-8 leading-relaxed">
              {{ service.description }}
            </p>

            <!-- Bagian Harga -->
            <div class="mb-8">
              <div class="flex items-baseline gap-2 mb-4">
                <span class="text-3xl font-bold text-white">
                  {{ service.startingPrice || 'Rp 500K' }}
                </span>
                <span class="text-gray-400">/mulai</span>
              </div>
              
              <!-- Daftar Paket -->
              <div class="space-y-3">
                <div 
                  v-for="(plan, planIndex) in service.plans || getDefaultPlans(service.title)" 
                  :key="planIndex"
                  class="p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors duration-200 cursor-pointer"
                  @click="selectPlan(service, plan)"
                  :class="{ 'ring-2 ring-blue-500/50 bg-gray-800/60': selectedPlan === plan }"
                >
                  <div class="flex justify-between items-center">
                    <div>
                      <h4 class="font-medium text-white">{{ plan.name }}</h4>
                      <p class="text-xs text-gray-400 mt-1">{{ plan.features }}</p>
                    </div>
                    <div class="text-right">
                      <div class="text-lg font-bold text-white">{{ plan.price }}</div>
                      <div v-if="plan.discount" class="text-sm text-green-400">
                        Hemat {{ plan.discount }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Fitur Utama -->
            <div class="mb-8">
              <h4 class="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">Fitur Utama</h4>
              <ul class="space-y-2">
                <li 
                  v-for="(feature, featureIndex) in service.features || getDefaultFeatures(service.title)" 
                  :key="featureIndex"
                  class="flex items-center text-sm text-gray-300"
                >
                  <svg class="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  {{ feature }}
                </li>
              </ul>
            </div>

            <!-- Tombol Pesan -->
            <button 
              class="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-blue-500/25"
              @click="openOrderModal(service)"
            >
              Pesan Sekarang
              <span class="ml-2">→</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Footer Informasi -->
      <div class="mt-16 text-center">
        <div class="inline-flex items-center gap-6 text-sm text-gray-400 bg-gray-900/50 px-8 py-4 rounded-2xl border border-gray-800/30">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Garansi 100%</span>
          </div>
          <div class="hidden sm:block w-px h-6 bg-gray-700"></div>
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>Support 24/7</span>
          </div>
          <div class="hidden sm:block w-px h-6 bg-gray-700"></div>
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span>Revisi Gratis</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<!-- ServicesSection.vue - bagian script saja -->
<script setup>
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import { servicesData } from '~/data/servicesData'

const hoveredCard = ref(null)
const selectedPlan = ref(null)

// Gunakan data langsung dari servicesData
const services = servicesData

// Pilih paket
const selectPlan = (service, plan) => {
  selectedPlan.value = plan
  console.log(`Memilih ${plan.name} untuk ${service.title}: ${plan.price}`)
  
  // Animasi kecil saat memilih plan
  gsap.to(`.plan-${service.title.replace(/\s+/g, '-')}`, {
    scale: 0.95,
    duration: 0.1,
    yoyo: true,
    repeat: 1
  })
}

// Buka modal pemesanan
const openOrderModal = (service) => {
  alert(`Memesan layanan: ${service.title}\nHubungi kami di WhatsApp: 0896-3053-4368`)
  
  // Animasi tombol
  gsap.to('.cta-button', {
    scale: 0.95,
    duration: 0.2,
    yoyo: true,
    repeat: 1
  })
}

// Animasi saat mount
onMounted(() => {
  // Animasi judul
  gsap.fromTo('.services-title', 
    { opacity: 0, y: 50, scale: 0.9 },
    { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out' }
  )
  
  // Animasi kartu layanan
  gsap.fromTo('.group', 
    { 
      opacity: 0, 
      y: 80,
      rotationX: 10
    },
    { 
      opacity: 1, 
      y: 0,
      rotationX: 0,
      duration: 1,
      stagger: 0.2,
      delay: 0.3,
      ease: 'back.out(1.7)'
    }
  )
  
  // Animasi floating untuk footer info
  gsap.to('.inline-flex', {
    y: -10,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  })
})
</script>

<style scoped>
.services-section {
  position: relative;
  overflow: hidden;
}

.services-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent);
}

.group {
  perspective: 1000px;
}

.group:hover .group-hover\:rotate-3 {
  transform: rotate(3deg);
}

.plan-item {
  position: relative;
  overflow: hidden;
}

.plan-item::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
  transition: left 0.6s;
}

.plan-item:hover::after {
  left: 100%;
}

/* Efek glow saat hover kartu */
.glow-effect {
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.3),
              0 0 40px rgba(59, 130, 246, 0.2),
              0 0 60px rgba(59, 130, 246, 0.1);
}

/* Responsif */
@media (max-width: 768px) {
  .services-section {
    padding-top: 3rem;
    padding-bottom: 3rem;
  }
  
  .group {
    margin-bottom: 1.5rem;
  }
}
</style>
