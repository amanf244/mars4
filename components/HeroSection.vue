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

      <!-- Phone Left -->
      <div ref="phoneLeft" class="absolute left-10 w-40 h-72 md:w-48 md:h-80 bg-gray-800 rounded-3xl border-4 border-gray-700 transform-gpu phone-3d shadow-2xl">
        <div class="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-1 bg-gray-600 rounded"></div>
        <div class="absolute inset-2 bg-gray-700 rounded-xl overflow-hidden">
          <div ref="crackLeft" class="absolute w-full h-full">
            <div class="absolute w-1 h-8 bg-red-500/80 right-1/4 top-1/3 rotate-45 animate-pulse"></div>
            <div class="absolute w-1 h-8 bg-red-500/80 left-1/4 top-2/3 -rotate-45 animate-pulse"></div>
          </div>
        </div>
      </div>

      <!-- Phone Right -->
      <div ref="phoneRight" class="absolute right-10 w-40 h-72 md:w-48 md:h-80 bg-gray-800 rounded-3xl border-4 border-gray-700 transform-gpu phone-3d shadow-2xl">
        <div class="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-1 bg-gray-600 rounded"></div>
        <div class="absolute inset-2 bg-gray-700 rounded-xl overflow-hidden">
          <div ref="crackRight" class="absolute w-full h-full">
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
            Perbaikan Smartphone<br>& Pembelian Sparepart
          </span>
        </h1>
        
        <p ref="subtitle" class="text-lg md:text-xl text-gray-300 mb-8 opacity-0">
          Service cepat • Part original • Bergaransi
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
    const phoneLeft = ref(null)
    const phoneRight = ref(null)
    const tools = ref(null)
    const crackLeft = ref(null)
    const crackRight = ref(null)
    const battery = ref(null)
    const screen = ref(null)

    const initAnimations = () => {
      const isMobile = window.innerWidth < 768
      const masterTL = gsap.timeline()

     // Animate both phones simultaneously
     masterTL.from([phoneLeft.value, phoneRight.value], {
        x: isMobile ? 100 : 300,
        rotate: isMobile ? 10 : 20,
        duration: 1.5,
        ease: "elastic.out(1, 0.3)",
        stagger: 0 // Remove stagger for simultaneous animation
      })

      // Animate cracks for both phones
      masterTL.from([crackLeft.value.children, crackRight.value.children], {
        scaleY: 0,
        stagger: 0,
        duration: 1,
        ease: "power4.out"
      }, "<") // Start with previous animation

      masterTL.to(title.value, { opacity: 1, y: 0, duration: 1, ease: "power4.out" })
      masterTL.to(subtitle.value, { opacity: 1, duration: 1 }, "-=0.5")
    }

    onMounted(() => initAnimations())

    return { container, title, subtitle, phoneLeft, tools, crackLeft, crackRight, battery, screen, phoneRight }
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
