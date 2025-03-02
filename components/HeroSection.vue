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
        <div class="absolute w-6 h-6 bg-yellow-500/80 -bottom-2 -right-2 rotate-45 rounded-sm"></div>
      </div>

      <div ref="battery" class="absolute w-16 h-8 bg-green-500/80 rounded-lg opacity-0 cursor-pointer">
        <div class="absolute inset-1 bg-green-400/30 rounded-md"></div>
      </div>
      
      <div ref="screen" class="absolute w-20 h-24 bg-blue-500/80 rounded-lg opacity-0 cursor-pointer">
        <div class="absolute inset-1 bg-blue-400/30 rounded-md"></div>
      </div>

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
          <a href="#services" 
             class="btn-hover bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition-all
                    transform hover:scale-105 shadow-lg shadow-blue-500/20">
            <span class="mr-2">🛠</span>Emergency Repair
          </a>
          <a href="#parts" 
             class="btn-hover border-2 border-blue-600 text-blue-400 hover:bg-blue-600/10 px-8 py-3 rounded-lg
                    font-semibold transition-all transform hover:scale-105">
            <span class="mr-2">📱</span>Buy Spareparts
          </a>
        </div>
      </div>

      <!-- Stats -->
      <div class="absolute bottom-8 left-0 right-0 flex justify-center space-x-8 opacity-0" ref="stats">
        <div class="text-center">
          <div class="text-3xl font-bold text-blue-400">2,500+</div>
          <div class="text-sm text-gray-400">Devices Repaired</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-green-400">98%</div>
          <div class="text-sm text-gray-400">Success Rate</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-purple-400">30m</div>
          <div class="text-sm text-gray-400">Average Repair Time</div>
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
    const stats = ref(null)
    const particles = ref([])

    const createParticles = () => {
      gsap.utils.toArray(particles.value).forEach((particle: any, i) => {
        gsap.fromTo(particle, {
          x: gsap.utils.random(-200, 200),
          y: gsap.utils.random(-200, 200),
          scale: 0
        }, {
          scale: 1,
          duration: gsap.utils.random(1.5, 3),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.1
        })
      })
    }

    const initAnimations = () => {
      const isMobile = window.innerWidth < 768
      const masterTL = gsap.timeline()

      // Animasi masuk smartphone dari sisi kanan
      masterTL.from(phone.value, {
        x: isMobile ? 100 : 300,
        rotate: isMobile ? 10 : 20,
        duration: 1.5,
        ease: "elastic.out(1, 0.3)",
        immediateRender: false
      })

      // Animasi crack
      masterTL.addLabel('crackStart')
      masterTL.from(crack.value.children, {
        scaleY: 0,
        stagger: 0.3,
        duration: 0.8,
        ease: "power4.out"
      }, 'crackStart+=0.3')

      // Animasi tools dan parts
      masterTL.from([tools.value, battery.value, screen.value], { 
        opacity: 0,
        y: 50,
        stagger: 0.2,
        duration: 0.8,
        ease: "back.out(1.7)"
      }, 'crackStart+=1')

      // Animasi teks
      masterTL.addLabel('textStart')
      masterTL.to(title.value, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power4.out"
      }, 'textStart')

      masterTL.to(subtitle.value, {
        opacity: 1,
        duration: 1
      }, 'textStart+=0.3')

      // Animasi stats
      masterTL.to(stats.value, {
        opacity: 1,
        y: -20,
        duration: 1
      }, 'textStart+=0.6')

      // Animasi kontinu
      gsap.to(tools.value, {
        rotation: 360,
        duration: 8,
        repeat: -1,
        ease: "none",
        transformOrigin: "center center"
      })

      gsap.to([battery.value, screen.value], {
        y: "+=30",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })

      // Animasi berbasis scroll
      gsap.to(phone.value, {
        y: -50,
        scrollTrigger: {
          trigger: phone.value,
          scrub: true,
          start: "top bottom",
          end: "bottom top"
        }
      })

      gsap.to(phone.value, {
        rotateX: 15,
        rotateY: 30,
        scrollTrigger: {
          trigger: container.value,
          start: "top top",
          end: "+=500",
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress
            gsap.set(phone.value, {
              rotationY: -15 + (progress * 30),
              rotationX: 10 - (progress * 15),
              overwrite: 'auto'
            })
          }
        }
      })
    }

    const addHoverEffects = () => {
      const hoverAnimation = (element: any) => {
        gsap.to(element, {
          scale: 1.1,
          duration: 0.3,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut"
        })
      }

      if (battery.value) battery.value.addEventListener('mouseenter', () => hoverAnimation(battery.value))
      if (screen.value) screen.value.addEventListener('mouseenter', () => hoverAnimation(screen.value))
      if (tools.value) tools.value.addEventListener('mouseenter', () => hoverAnimation(tools.value))
    }

    onMounted(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if(entry.isIntersecting) {
            createParticles()
            initAnimations()
            addHoverEffects()
            observer.disconnect()
          }
        })
      })

      if (container.value) observer.observe(container.value)
    })

    return {
      container,
      title,
      subtitle,
      phone,
      tools,
      crack,
      battery,
      screen,
      stats,
      particles
    }
  }
}
</script>

<style>
.phone-3d {
  transform: perspective(1000px) rotateX(10deg) rotateY(-15deg);
  will-change: transform;
}

.hero-gradient {
  background: linear-gradient(
    45deg,
    rgba(17, 24, 39, 0.8),
    rgba(37, 99, 235, 0.2),
    rgba(16, 185, 129, 0.2)
  );
  background-size: 200% 200%;
  animation: gradient-pulse 15s ease infinite;
}

@keyframes gradient-pulse {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.btn-hover {
  transition: all 0.3s ease;
  will-change: transform;
}

.btn-hover:hover {
  filter: brightness(110%);
}

.animate-spin-slow {
  animation: spin 8s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
