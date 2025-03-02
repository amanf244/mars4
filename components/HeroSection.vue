<template>
  <div>
    <section ref="container" class="relative bg-gray-900 text-white h-screen overflow-hidden flex items-center">
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 hero-gradient opacity-50"></div>
      
      <!-- Floating Particles -->
      <div class="absolute inset-0 opacity-30 pointer-events-none">
        <div v-for="(_, i) in 50" :key="i" 
             class="absolute w-1 h-1 bg-white/50 rounded-full"
             :ref="`particle${i}`"></div>
      </div>

      <!-- Screw (Sekrup) -->
      <div ref="screw" class="absolute left-10 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-gray-700 rounded-full shadow-xl cursor-pointer flex items-center justify-center">
        <svg class="w-6 h-6 text-white" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" stroke="white" stroke-width="10" fill="none"/>
          <line x1="20" y1="50" x2="80" y2="50" stroke="white" stroke-width="10"/>
          <line x1="50" y1="20" x2="50" y2="80" stroke="white" stroke-width="10"/>
        </svg>
      </div>

      <!-- Phone -->
      <div ref="phone" class="absolute right-10 w-40 h-72 md:w-48 md:h-80 bg-gray-800 rounded-3xl border-4 border-gray-700 transform-gpu phone-3d shadow-2xl">
        <div class="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-1 bg-gray-600 rounded"></div>
        <div class="absolute inset-2 bg-gray-700 rounded-xl overflow-hidden">
          <div ref="crack" class="absolute w-full h-full">
            <div class="absolute w-1 h-8 bg-red-500/80 left-1/4 top-1/3 rotate-45 animate-pulse"></div>
            <div class="absolute w-1 h-8 bg-red-500/80 right-1/4 top-2/3 -rotate-45 animate-pulse"></div>
          </div>
        </div>
      </div>

      <!-- Tools & Parts -->
      <div ref="tools" class="absolute w-12 h-12 opacity-0 cursor-pointer">
        <svg class="absolute text-blue-500 w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
        </svg>
      </div>

      <div ref="battery" class="absolute w-16 h-8 bg-green-500/80 rounded-lg opacity-0 cursor-pointer"></div>
      <div ref="screen" class="absolute w-20 h-24 bg-blue-500/80 rounded-lg opacity-0 cursor-pointer"></div>

      <!-- Content -->
      <div class="relative container mx-auto px-5 text-center z-10">
        <h1 ref="title" class="text-4xl md:text-6xl font-bold mb-6 opacity-0">
          <span class="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
            Smartphone Repair<br>& Sparepart Specialist
          </span>
        </h1>
        
        <p ref="subtitle" class="text-lg md:text-xl text-gray-300 mb-8 opacity-0">
          Fast Repair Service • Original Parts • 6 Months Warranty
        </p>

        <div class="flex flex-col md:flex-row gap-4 justify-center">
          <a href="#services" class="btn-hover bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold">
            <span class="mr-2">🛠</span>Emergency Repair
          </a>
          <a href="#parts" class="btn-hover border-2 border-blue-600 text-blue-400 hover:bg-blue-600/10 px-8 py-3 rounded-lg">
            <span class="mr-2">📱</span>Buy Spareparts
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default {
  setup() {
    const container = ref(null)
    const title = ref(null)
    const subtitle = ref(null)
    const phone = ref(null)
    const tools = ref(null)
    const crack = ref(null)
    const battery = ref(null)
    const screen = ref(null)
    const screw = ref(null)  // Tambahan screw

    const initAnimations = () => {
      const isMobile = window.innerWidth < 768
      const masterTL = gsap.timeline()

      masterTL.from(phone.value, { x: isMobile ? 100 : 300, rotate: isMobile ? 10 : 20, duration: 1.5, ease: "elastic.out(1, 0.3)" })

      masterTL.from(crack.value.children, { scaleY: 0, stagger: 0.3, duration: 0.8, ease: "power4.out" })

      masterTL.from([tools.value, battery.value, screen.value, screw.value], { opacity: 0, y: 50, stagger: 0.2, duration: 0.8, ease: "back.out(1.7)" })

      masterTL.to(title.value, { opacity: 1, y: 0, duration: 1, ease: "power4.out" })
      masterTL.to(subtitle.value, { opacity: 1, duration: 1 }, "-=0.5")

      gsap.to(screw.value, { rotation: 360, duration: 5, repeat: -1, ease: "linear", transformOrigin: "center center" })
    }

    onMounted(() => initAnimations())

    return { container, title, subtitle, phone, tools, crack, battery, screen, screw }
  }
}
</script>

<style>
.phone-3d {
  transform: perspective(1000px) rotateX(10deg) rotateY(-15deg);
}

.hero-gradient {
  background: linear-gradient(45deg, rgba(17, 24, 39, 0.8), rgba(37, 99, 235, 0.2), rgba(16, 185, 129, 0.2));
  animation: gradient-pulse 15s ease infinite;
}

@keyframes gradient-pulse {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.btn-hover {
  transition: all 0.3s ease;
}

.btn-hover:hover {
  filter: brightness(110%);
}
</style>
