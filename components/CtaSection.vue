<template>
  <section 
  id="contact"
    ref="ctaSection"
    class="cta-section relative overflow-hidden py-24 px-4 sm:px-6 bg-gradient-to-br from-purple-900/40 via-black to-blue-900/40"
  >
    <!-- Background Elements -->
    <div class="absolute inset-0 overflow-hidden">
      <!-- Animated Gradient Orbs -->
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <!-- Floating Particles -->
      <div 
        v-for="i in 15" 
        :key="i"
        class="absolute w-2 h-2 bg-white/20 rounded-full"
        :style="{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `float ${3 + Math.random() * 4}s infinite ease-in-out ${Math.random() * 2}s`
        }"
      ></div>
      
      <!-- Grid Pattern -->
      <div class="absolute inset-0 opacity-5 bg-[linear-gradient(90deg,#000_1px,transparent_1px),linear-gradient(#000_1px,transparent_1px)] bg-[size:40px_40px]"></div>
    </div>

    <div class="container mx-auto max-w-4xl relative z-10">
      <!-- Content Wrapper -->
      <div class="text-center space-y-10">
        <!-- Animated Badge -->
        <div class="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full border border-white/10 backdrop-blur-sm">
          <div class="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
          <span class="text-sm font-medium text-white">24/7 Support Available</span>
        </div>

        <!-- Main Heading -->
        <div class="space-y-6">
          <h2 class="text-4xl md:text-6xl font-bold text-white leading-tight">
            <span class="block mb-3">Butuh Bantuan</span>
            <span class="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Cepat & Profesional?
            </span>
          </h2>
          
          <p class="text-xl text-gray-300 max-w-2xl mx-auto">
            Tim kami siap membantu Anda 24/7. Respons dalam 
            <span class="text-green-400 font-bold">≤5 menit</span> untuk semua pertanyaan.
          </p>
        </div>

        <!-- Stats Counter -->
        <div class="flex justify-center items-center gap-8 md:gap-12">
          <div 
            v-for="stat in stats" 
            :key="stat.label"
            class="text-center"
          >
            <div class="text-3xl md:text-4xl font-bold text-white mb-2">
              <span ref="counterRefs" class="counter">{{ stat.value }}</span>
            </div>
            <div class="text-sm text-gray-400 uppercase tracking-wider">{{ stat.label }}</div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
          <!-- WhatsApp Button -->
          <button
            @click="handleContact('whatsapp')"
            @mouseenter="hoverButton('whatsapp')"
            @mouseleave="resetButton('whatsapp')"
            class="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-green-500/30 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto min-w-[280px]"
          >
            <!-- Glow effect -->
            <div class="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
            
            <!-- Button content -->
            <div class="relative flex items-center justify-center gap-3">
              <svg class="w-6 h-6 group-hover:animate-bounce" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.56 4.125 1.547 5.86L0 24l6.203-1.625A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
              </svg>
              <span class="text-lg">WhatsApp: {{ phoneNumber }}</span>
            </div>
            
            <!-- Call label -->
            <div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-3 py-1 rounded-full animate-pulse">
              Klik untuk Chat
            </div>
          </button>

          <!-- Live Chat Button -->
          <button
            @click="handleContact('chat')"
            @mouseenter="hoverButton('chat')"
            @mouseleave="resetButton('chat')"
            class="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto min-w-[280px]"
          >
            <!-- Glow effect -->
            <div class="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
            
            <!-- Button content -->
            <div class="relative flex items-center justify-center gap-3">
              <svg class="w-6 h-6 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
              <span class="text-lg">Live Chat Support</span>
            </div>
          </button>
        </div>

        <!-- Additional Contact Options -->
        <div class="pt-8 border-t border-white/10">
          <p class="text-gray-400 mb-4">Atau hubungi kami melalui:</p>
          <div class="flex flex-wrap justify-center gap-4">
            <button
              v-for="option in contactOptions"
              :key="option.type"
              @click="handleContact(option.type)"
              class="flex items-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 hover:text-white transition-all duration-200 group"
            >
              <Icon :name="option.icon" class="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>{{ option.label }}</span>
            </button>
          </div>
        </div>

        <!-- Trust Badges -->
        <div class="flex flex-wrap justify-center items-center gap-8 pt-12">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div>
              <div class="text-white font-semibold">100% Respon Cepat</div>
              <div class="text-sm text-gray-400">Rata-rata 3 menit</div>
            </div>
          </div>
          
          <div class="hidden sm:block w-px h-12 bg-white/10"></div>
          
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <div class="text-white font-semibold">Support 24 Jam</div>
              <div class="text-sm text-gray-400">Setiap hari, tanpa libur</div>
            </div>
          </div>
        </div>

      <!-- Lokasi Kami -->
<div class="mt-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

  <!-- Info Lokasi -->
  <div class="text-left space-y-6">
    <h3 class="text-3xl font-bold text-white">Lokasi Kami</h3>

    <p class="text-gray-300 leading-relaxed">
      Toko kami berlokasi di area strategis Kota Serang dan mudah diakses
      menggunakan kendaraan pribadi maupun transportasi umum.
    </p>

    <div class="space-y-4">
      <div class="flex items-start gap-3">
        <div class="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
          📍
        </div>
        <span class="text-gray-300">
          Lampu merah Warjok, Jl. KH Abdul Fatah Hasan No.42, Cipare, Kec. Serang, Kota Serang, Banten 42117
        </span>
      </div>

      <div class="flex items-start gap-3">
        <div class="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
          ⏰
        </div>
        <span class="text-gray-300">
          Senin – Minggu, 24 Jam
        </span>
      </div>
    </div>

    <!-- Button arah -->
    <a
      href="https://www.google.com/maps/place/Aldep+4/@-6.1255189,106.1642106,21z/data=!4m14!1m7!3m6!1s0x2e41f546bc68b4cb:0xc76df0cc1a934822!2sAldep+4!8m2!3d-6.125473!4d106.1642682!16s%2Fg%2F11mrnth9cf!3m5!1s0x2e41f546bc68b4cb:0xc76df0cc1a934822!8m2!3d-6.125473!4d106.1642682!16s%2Fg%2F11mrnth9cf?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D"
      target="_blank"
      class="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-xl hover:scale-105 transition-transform"
    >
      Lihat di Peta
    </a>
  </div>

  <!-- Map -->
  <div class="w-full h-[300px] md:h-[420px] rounded-xl">
     <LMap
     class="w-full h-[300px] md:h-[420px] rounded-xl"
      ref="map"
      :zoom="zoom"
      :center="[-6.125473, 106.1642682]"
      :use-global-leaflet="false"
    >
      <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
        layer-type="base"
        name="OpenStreetMap"
      />

       <LMarker :lat-lng="[-6.125473, 106.1642682]">
    <LTooltip> Disini lokasinya </LTooltip>
  </LMarker>

    </LMap>
    <!-- Overlay agar nyatu -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
  </div>

</div>


      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

const ctaSection = ref(null)
const counterRefs = ref([])
const phoneNumber = '62896-3053-4368'
const zoom = ref(100)

// Contact options data
const contactOptions = [
  { type: 'email', label: 'Email Support', icon: 'mdi:email' },
  { type: 'phone', label: 'Telepon Langsung', icon: 'mdi:phone' },
  { type: 'ticket', label: 'Buat Tiket', icon: 'mdi:ticket-confirmation' },
  { type: 'facebook', label: 'Facebook', icon: 'mdi:facebook' }
]


// Stats data
const stats = [
  { value: 98, suffix: '%', label: 'Kepuasan Klien' },
  { value: 5, suffix: 'mnt', label: 'Rata-rata Respon' },
  { value: 1000, suffix: '+', label: 'Klien Terbantu' }
]

// Button hover animations
const hoverButton = (type) => {
  const button = event.currentTarget
  gsap.to(button, {
    scale: 1.05,
    duration: 0.3,
    ease: 'power2.out'
  })
}

const resetButton = (type) => {
  const button = event.currentTarget
  gsap.to(button, {
    scale: 1,
    duration: 0.3,
    ease: 'power2.out'
  })
}

// Contact handler
const handleContact = (type) => {
  switch(type) {
    case 'whatsapp':
      window.open(`https://wa.me/${phoneNumber.replace(/-/g, '')}`, '_blank')
      break
    case 'chat':
      // Open chat widget or modal
      alert('Live Chat akan segera dimulai...')
      break
    case 'email':
      window.location.href = 'mailto:support@perusahaan.com'
      break
    case 'phone':
      window.location.href = `tel:${phoneNumber}`
      break
    case 'ticket':
      alert('Membuka form tiket support...')
      break
  }
  
  // Animation feedback
  gsap.to(event.currentTarget, {
    scale: 0.95,
    duration: 0.1,
    yoyo: true,
    repeat: 1
  })
}

// Counter animation
const animateCounters = () => {
  counterRefs.value.forEach((counter, index) => {
    const stat = stats[index]
    const value = stat.value
    const suffix = stat.suffix
    
    gsap.to(counter, {
      innerText: value,
      duration: 2,
      ease: 'power2.out',
      snap: { innerText: 1 },
      onUpdate: function() {
        counter.textContent = Math.floor(this.targets()[0].innerText) + suffix
      }
    })
  })
}

// On mounted animations
onMounted(() => {
  // Animated entrance
  gsap.fromTo(ctaSection.value.querySelectorAll('h2, p, button'),
    { y: 50, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: ctaSection.value,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    }
  )
  
  // Floating animation for main buttons
  gsap.to('.cta-section button.bg-gradient-to-r', {
    y: -10,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    stagger: 0.5
  })
  
  // Animate counter when in view
  ScrollTrigger.create({
    trigger: ctaSection.value,
    start: 'top 70%',
    onEnter: animateCounters
  })
  
  // Pulse animation for the badge
  gsap.to('.animate-ping', {
    scale: 1.5,
    duration: 1,
    repeat: -1,
    ease: 'power2.inOut'
  })
})
</script>

<style scoped>
.cta-section {
  position: relative;
  isolation: isolate;
}

/* Floating animation for particles */
@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  33% {
    transform: translateY(-20px) translateX(10px);
  }
  66% {
    transform: translateY(10px) translateX(-10px);
  }
}

/* Gradient text animation */
h2 span {
  background-size: 200% auto;
  animation: gradient 3s ease infinite;
}

@keyframes gradient {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

/* Button hover effects */
button {
  transition: all 0.3s ease;
}

button:hover {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .cta-section {
    padding-top: 3rem;
    padding-bottom: 3rem;
  }
  
  h2 {
    font-size: 2.5rem;
  }
  
  .flex-wrap {
    gap: 0.5rem;
  }
}

/* Glass effect for buttons */
button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(to bottom, rgba(255,255,255,0.1), transparent);
  border-radius: inherit;
  opacity: 0;
  transition: opacity 0.3s ease;
}

button:hover::before {
  opacity: 1;
}
</style>