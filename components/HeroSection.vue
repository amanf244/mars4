<template>
  <div>
    <section id="home" ref="container" class="relative bg-gray-900 text-white h-screen overflow-hidden flex items-center">
      <!-- Dynamic Gradient Background -->
      <div class="absolute inset-0 hero-gradient opacity-60"></div>
      
      <!-- Animated Grid Background -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0 grid-pattern"></div>
      </div>
      
      <!-- Enhanced Floating Particles -->
      <div class="absolute inset-0 opacity-40 pointer-events-none">
        <canvas ref="particleCanvas" class="absolute inset-0"></canvas>
      </div>

      <!-- Interactive Glow Effects -->
      <div class="absolute left-1/4 top-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute right-1/4 bottom-1/3 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <!-- Left Phone with Enhanced 3D -->
        <!--
      <div ref="phoneLeft" 
           class="absolute left-10 w-44 h-80 md:w-52 md:h-88 bg-gradient-to-b from-gray-800 to-gray-900 rounded-[2.5rem] border-8 border-gray-700/50 shadow-2xl phone-3d cursor-pointer"
           @mouseenter="hoverDevice('phoneLeft')"
           @mouseleave="unhoverDevice('phoneLeft')"
           @click="repairDevice('phoneLeft')">
        <div class="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-1.5 bg-gray-600/80 rounded-full"></div>
        <div class="absolute top-24 left-1/2 -translate-x-1/2 w-6 h-6 bg-gray-600/50 rounded-full"></div>
        <div class="absolute inset-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-[1.8rem] overflow-hidden border border-gray-700/30">
          
          <div ref="crackLeft" class="absolute w-full h-full">
            <div class="absolute w-1 h-12 bg-red-500 right-1/3 top-1/4 rotate-45 animate-pulse" style="filter: drop-shadow(0 0 8px rgba(239,68,68,0.6));"></div>
            <div class="absolute w-1 h-8 bg-red-500 left-1/3 top-2/3 -rotate-45 animate-pulse" style="filter: drop-shadow(0 0 8px rgba(239,68,68,0.6));"></div>
            <div class="absolute w-0.5 h-6 bg-red-400/70 top-1/2 left-1/2 rotate-90 animate-pulse delay-300"></div>
          </div>
         
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-center p-4">
              <div class="text-red-400 text-xs md:text-sm font-bold mb-2">LAYAR RUSAK</div>
              
            </div>
          </div>
        </div>
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-gray-700/50 rounded-full border border-gray-600/30"></div>
      </div>
 -->
      <!-- Enhanced Laptop Center -->

         <!--
      <div ref="laptop" 
           class="absolute left-1/2 transform -translate-x-1/2 w-60 h-44 md:w-72 md:h-52 bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl laptop-3d cursor-pointer shadow-2xl"
           @mouseenter="hoverDevice('laptop')"
           @mouseleave="unhoverDevice('laptop')"
           @click="repairDevice('laptop')">
        
        <div class="absolute -top-7 left-0 w-full h-7 bg-gradient-to-b from-gray-800 to-gray-900 rounded-t-xl border-2 border-gray-700/50 border-b-0">
          <div class="absolute top-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-gray-600 rounded-full"></div>
          <div class="absolute top-2.5 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-gray-700/50 rounded-full"></div>
        </div>
        
        
        <div class="absolute -top-7 left-0 w-full h-7 bg-gradient-to-b from-gray-900 to-gray-800 rounded-t-xl flex items-center justify-center">
          <div class="w-12 h-1 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full"></div>
        </div>
        
        
        <div class="absolute bottom-0 left-0 w-full h-36 md:h-40 bg-gradient-to-t from-gray-800 to-gray-900 rounded-xl border-2 border-gray-700/50 border-t-0">
         
          <div class="absolute inset-3 bg-gray-900/80 rounded-lg p-2">
            <div class="grid grid-cols-7 gap-1">
              <div v-for="i in 14" :key="i" class="h-2 bg-gray-700/70 rounded-sm"></div>
            </div>
            <div class="mt-2 grid grid-cols-6 gap-1">
              <div v-for="i in 12" :key="i" class="h-2 bg-gray-700/70 rounded-sm"></div>
            </div>
          </div>
          
          
          <div class="absolute bottom-3 left-1/2 -translate-x-1/2 w-20 h-3 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full"></div>
          
          
          <div ref="crackLaptop" class="absolute w-full h-full">
            <div class="absolute w-1.5 h-16 bg-red-500 left-1/3 top-1/4 rotate-12 animate-pulse" style="filter: drop-shadow(0 0 10px rgba(239,68,68,0.7));"></div>
            <div class="absolute w-1 h-10 bg-red-500 right-1/3 top-1/2 -rotate-6 animate-pulse delay-500" style="filter: drop-shadow(0 0 10px rgba(239,68,68,0.7));"></div>
            <div class="absolute w-0.5 h-8 bg-red-400/80 top-3/4 left-2/5 rotate-45 animate-pulse delay-700"></div>
          </div>
          
          
          <div class="absolute top-2 right-2 flex items-center">
            <div class="w-2 h-2 bg-red-500 rounded-full animate-ping mr-1"></div>
            <span class="text-xs text-red-400">REPAIR NEEDED</span>
          </div>
        </div>
      </div>
      -->

      <!-- Right Phone with Enhanced 3D -->

       <!--
      <div ref="phoneRight" 
           class="absolute right-10 w-44 h-80 md:w-52 md:h-88 bg-gradient-to-b from-gray-800 to-gray-900 rounded-[2.5rem] border-8 border-gray-700/50 shadow-2xl phone-3d cursor-pointer"
           @mouseenter="hoverDevice('phoneRight')"
           @mouseleave="unhoverDevice('phoneRight')"
           @click="repairDevice('phoneRight')">
        <div class="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-1.5 bg-gray-600/80 rounded-full"></div>
        <div class="absolute top-24 left-1/2 -translate-x-1/2 w-6 h-6 bg-gray-600/50 rounded-full"></div>
        <div class="absolute inset-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-[1.8rem] overflow-hidden border border-gray-700/30">
          
          <div ref="crackRight" class="absolute w-full h-full">
            <div class="absolute w-1 h-12 bg-red-500 left-1/3 top-1/4 rotate-45 animate-pulse" style="filter: drop-shadow(0 0 8px rgba(239,68,68,0.6));"></div>
            <div class="absolute w-1 h-8 bg-red-500 right-1/3 top-2/3 -rotate-45 animate-pulse" style="filter: drop-shadow(0 0 8px rgba(239,68,68,0.6));"></div>
            <div class="absolute w-0.5 h-6 bg-red-400/70 top-1/3 left-2/5 rotate-12 animate-pulse delay-500"></div>
          </div>
          
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-center p-4">
              <div class="text-red-400 text-xs md:text-sm font-bold mb-2">KERUSAKAN BATERAI</div>
              
            </div>
          </div>
        </div>
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-gray-700/50 rounded-full border border-gray-600/30"></div>
      </div>
      -->

      <!-- Floating Repair Parts with Enhanced Design -->
      <div v-for="(part, index) in repairParts" 
           :key="part.id"
           :ref="`part${index}`"
           class="absolute w-16 h-16 cursor-pointer part-hover"
           :style="{ left: `${part.position.x}%`, top: `${part.position.y}%` }"
           @click="usePart(part)">
        <!-- Tools -->
        <div v-if="part.type === 'tools'" class="relative w-full h-full">
          <div class="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl rotate-45 shadow-lg shadow-blue-500/30"></div>
          <svg class="absolute inset-2 text-white w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
          <div class="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
        </div>
        
        <!-- Battery -->
        <div v-else-if="part.type === 'battery'" class="relative w-full h-full">
          <div class="absolute inset-0 bg-gradient-to-br from-green-500 to-green-700 rounded-xl shadow-lg shadow-green-500/30 flex items-center justify-center">
            <div class="w-10 h-6 bg-green-300/20 rounded border border-green-400/50">
              <div class="h-full w-3/4 bg-green-400 rounded-sm animate-pulse"></div>
            </div>
          </div>
          <div class="absolute -bottom-2 -right-2 text-xs bg-green-800 text-green-200 px-2 py-1 rounded-full">
            +85%
          </div>
        </div>
        
        <!-- Screen -->
        <div v-else-if="part.type === 'screen'" class="relative w-full h-full">
          <div class="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl shadow-lg shadow-cyan-500/30">
            <div class="absolute inset-1 bg-black/20 rounded-lg border border-cyan-300/30"></div>
          </div>
          <div class="absolute -top-2 text-xs bg-cyan-800 text-cyan-200 px-2 py-1 rounded-full">
            OLED
          </div>
        </div>
        
        <!-- Chip -->
        <div v-else-if="part.type === 'chip'" class="relative w-full h-full">
          <div class="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl shadow-lg shadow-purple-500/30">
            <div class="absolute inset-2 grid grid-cols-3 gap-1">
              <div v-for="i in 9" :key="i" class="bg-white/30 rounded-sm"></div>
            </div>
          </div>
          <div class="absolute -bottom-2 text-xs bg-purple-800 text-purple-200 px-2 py-1 rounded-full">
            A15
          </div>
        </div>
        
        <!-- Keyboard -->
        <div v-else-if="part.type === 'keyboard'" class="relative w-full h-full">
          <div class="absolute inset-0 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-xl shadow-lg shadow-yellow-500/30">
            <div class="absolute inset-2 grid grid-cols-3 gap-0.5">
              <div v-for="i in 9" :key="i" class="bg-white/30 rounded"></div>
            </div>
          </div>
          <div class="absolute -top-2 -left-2 text-xs bg-yellow-800 text-yellow-200 px-2 py-1 rounded-full">
            RGB
          </div>
        </div>
      </div>

      <!-- Repair Progress Indicator -->
      <div v-if="repairProgress > 0" class="absolute top-8 left-1/2 transform -translate-x-1/2 w-64 md:w-96 bg-gray-800/80 backdrop-blur-sm rounded-full p-1 border border-gray-700/50 z-20">
        <div class="text-xs text-center text-gray-300 mb-1">Repair Progress</div>
        <div class="w-full h-3 bg-gray-700/50 rounded-full overflow-hidden">
          <div class="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-500" 
               :style="{ width: `${repairProgress}%` }"></div>
        </div>
        <div class="text-xs text-center text-gray-400 mt-1">{{ repairStatus }}</div>
      </div>

      <!-- Enhanced Content -->
      <div class="relative container mx-auto px-5 text-center z-10">
        <div class="mb-8">
          <h1 ref="title" class="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 opacity-0 title-glow">
            <span class="bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 bg-clip-text text-transparent animate-gradient">
              Tech<span class="text-white">Repair</span>
            </span>
          </h1>
          
          <p ref="subtitle" class="text-xl md:text-2xl text-gray-300 mb-2 opacity-0">
            Professional <span class="text-blue-400 font-semibold">Smartphone</span> & 
            <span class="text-green-400 font-semibold">Laptop</span> Services
          </p>
          
          <div ref="tagline" class="text-gray-400 mb-8 opacity-0">
            <span class="inline-flex items-center mx-2"><span class="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span> Fast Repair</span>
            <span class="inline-flex items-center mx-2"><span class="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse delay-300"></span> Genuine Parts</span>
            <span class="inline-flex items-center mx-2"><span class="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse delay-700"></span> Warranty</span>
          </div>
        </div>

        <!-- Interactive Repair Counter -->
        <div class="inline-flex items-center bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 mb-8 border border-gray-700/30 shadow-lg">
          <div class="text-left mr-6">
            <div class="text-3xl font-bold text-white">{{ devicesRepaired }}</div>
            <div class="text-sm text-gray-400">Perangkat yang Diperbaiki</div>
          </div>
          <div class="text-left">
            <div class="text-3xl font-bold text-green-400">{{ partsAvailable }}</div>
            <div class="text-sm text-gray-400">Suku Cadang Tersedia</div>
          </div>
          <div class="ml-6 px-3 py-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full text-xs font-bold animate-pulse">
            LIVE
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col md:flex-row gap-4 justify-center">
          <button @click="startEmergencyRepair" class="btn-hover bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg shadow-blue-500/30 transform transition-all duration-300 hover:scale-105">
            <span class="mr-3 group-hover:rotate-90 transition-transform duration-300">🛠</span>
            <span>Perbaikan Darurat</span>
            <span class="ml-3 text-xs bg-white/20 px-2 py-1 rounded-full animate-pulse">24/7</span>
          </button>
          
          <button @click="showPartsCatalog" class="btn-hover bg-gradient-to-r from-gray-800 to-gray-900 border-2 border-cyan-500/50 hover:border-cyan-400 text-cyan-300 hover:text-cyan-200 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg shadow-cyan-500/20 transform transition-all duration-300 hover:scale-105">
            <span class="mr-3 group-hover:scale-110 transition-transform duration-300">💻</span>
            <span>Telusuri Katalog Suku Cadang</span>
          </button>
        </div>
        
        <!-- Quick Stats -->
        <div class="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div class="bg-gray-800/30 backdrop-blur-sm p-3 rounded-xl border border-gray-700/30">
            <div class="text-2xl font-bold text-blue-400">30min</div>
            <div class="text-gray-400">Perbaikan Rata-Rata</div>
          </div>
          <div class="bg-gray-800/30 backdrop-blur-sm p-3 rounded-xl border border-gray-700/30">
            <div class="text-2xl font-bold text-green-400">98%</div>
            <div class="text-gray-400">Tingkat Keberhasilan</div>
          </div>
          <div class="bg-gray-800/30 backdrop-blur-sm p-3 rounded-xl border border-gray-700/30">
            <div class="text-2xl font-bold text-purple-400">500+</div>
            <div class="text-gray-400">Jenis Suku Cadang</div>
          </div>
          <div class="bg-gray-800/30 backdrop-blur-sm p-3 rounded-xl border border-gray-700/30">
            <div class="text-2xl font-bold text-cyan-400">6bln</div>
            <div class="text-gray-400">Garansi</div>
          </div>
        </div>
      </div>

      <!-- Repair Notification -->
      <div v-if="showNotification" class="fixed top-4 right-4 bg-gradient-to-r from-green-600 to-emerald-500 text-white px-6 py-4 rounded-xl shadow-2xl z-50 animate-slide-in">
        <div class="flex items-center">
          <div class="text-2xl mr-3">✅</div>
          <div>
            <div class="font-bold">Repair Completed!</div>
            <div class="text-sm opacity-90">{{ notificationMessage }}</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)

interface RepairPart {
  id: number
  type: 'tools' | 'battery' | 'screen' | 'chip' | 'keyboard'
  position: { x: number; y: number }
  targetDevice?: 'phoneLeft' | 'phoneRight' | 'laptop'
}

export default {
  setup() {
    // Refs for DOM elements
    const container = ref<HTMLElement | null>(null)
    const title = ref<HTMLElement | null>(null)
    const subtitle = ref<HTMLElement | null>(null)
    const tagline = ref<HTMLElement | null>(null)
    const phoneLeft = ref<HTMLElement | null>(null)
    const phoneRight = ref<HTMLElement | null>(null)
    const laptop = ref<HTMLElement | null>(null)
    const crackLeft = ref<HTMLElement | null>(null)
    const crackRight = ref<HTMLElement | null>(null)
    const crackLaptop = ref<HTMLElement | null>(null)
    const particleCanvas = ref<HTMLCanvasElement | null>(null)

      const router = useRouter()

    // State
    const repairParts = ref<RepairPart[]>([
      { id: 1, type: 'tools', position: { x: 15, y: 30 } },
      { id: 2, type: 'battery', position: { x: 85, y: 25 } },
      { id: 3, type: 'screen', position: { x: 20, y: 70 } },
      { id: 4, type: 'chip', position: { x: 75, y: 65 } },
      { id: 5, type: 'keyboard', position: { x: 50, y: 80 } }
    ])
    
    const repairProgress = ref(0)
    const repairStatus = ref('')
    const devicesRepaired = ref(1247)
    const partsAvailable = ref(532)
    const showNotification = ref(false)
    const notificationMessage = ref('')
    
    // Canvas particle system
    let canvasCtx: CanvasRenderingContext2D | null = null
    let particles: Array<{
      x: number; y: number; size: number; speedX: number; speedY: number; color: string; opacity: number
    }> = []
    let animationId: number

    const initParticleSystem = () => {
      if (!particleCanvas.value) return
      
      canvasCtx = particleCanvas.value.getContext('2d')
      if (!canvasCtx) return
      
      particleCanvas.value.width = window.innerWidth
      particleCanvas.value.height = window.innerHeight
      
      // Create particles
      particles = []
      for (let i = 0; i < 150; i++) {
        particles.push({
          x: Math.random() * particleCanvas.value.width,
          y: Math.random() * particleCanvas.value.height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          color: `rgba(${Math.random() > 0.5 ? '100, 200, 255' : '100, 255, 200'}, ${Math.random() * 0.3 + 0.1})`,
          opacity: Math.random() * 0.5 + 0.1
        })
      }
      
      // Start animation
      animateParticles()
    }
    
    const animateParticles = () => {
      if (!canvasCtx || !particleCanvas.value) return
      
      // Clear with fade effect
      canvasCtx.fillStyle = 'rgba(17, 24, 39, 0.05)'
      canvasCtx.fillRect(0, 0, particleCanvas.value.width, particleCanvas.value.height)
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.x += particle.speedX
        particle.y += particle.speedY
        
        // Bounce off edges
        if (particle.x < 0 || particle.x > particleCanvas.value!.width) particle.speedX *= -1
        if (particle.y < 0 || particle.y > particleCanvas.value!.height) particle.speedY *= -1
        
        // Draw particle
        canvasCtx!.beginPath()
        canvasCtx!.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        canvasCtx!.fillStyle = particle.color
        canvasCtx!.globalAlpha = particle.opacity
        canvasCtx!.fill()
        
        // Create connections
        particles.forEach(otherParticle => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 100) {
            canvasCtx!.beginPath()
            canvasCtx!.strokeStyle = `rgba(100, 200, 255, ${0.1 * (1 - distance / 100)})`
            canvasCtx!.lineWidth = 0.5
            canvasCtx!.moveTo(particle.x, particle.y)
            canvasCtx!.lineTo(otherParticle.x, otherParticle.y)
            canvasCtx!.stroke()
          }
        })
      })
      
      canvasCtx!.globalAlpha = 1
      animationId = requestAnimationFrame(animateParticles)
    }

    const initAnimations = () => {
      const masterTL = gsap.timeline()
      
      // Initial device entrance with enhanced effects
      masterTL.from([phoneLeft.value, phoneRight.value], {
        x: (i) => i === 0 ? -400 : 400,
        rotation: (i) => i === 0 ? -30 : 30,
        scale: 0.8,
        duration: 1.8,
        ease: "elastic.out(1, 0.4)",
        stagger: 0.2
      })

     masterTL.from('.btn-hover', {
  y: 20,
  opacity: 1,
  duration: 1,
  stagger: 0.1,
  ease: 'power3.out'
}, '-=0.5')

      
      masterTL.from(laptop.value, {
        y: 300,
        rotation: -15,
        scale: 0.7,
        duration: 1.5,
        ease: "back.out(2.5)",
        opacity: 0
      }, "-=1.2")
      
      // Enhanced crack animations
      masterTL.from([crackLeft.value?.children, crackRight.value?.children, crackLaptop.value?.children], {
        scaleY: 0,
        transformOrigin: "center center",
        stagger: 0.1,
        duration: 0.8,
        ease: "power4.out"
      }, "-=0.8")
      
      // Title animations
      masterTL.from(title.value, {
        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out"
      })
      
      masterTL.from([subtitle.value, tagline.value], {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
      }, "-=0.8")
      
      // Floating parts animation
      repairParts.value.forEach((part, index) => {
        // Get the ref from $refs
        const partElement = (component as any).$refs[`part${index}`]
        if (partElement) {
          masterTL.from(partElement, {
            scale: 0,
            rotation: 180,
            opacity: 0,
            duration: 0.8,
            ease: "back.out(1.7)"
          }, `-=${0.5 + index * 0.1}`)
          
          // Add floating animation to each part
          gsap.to(partElement, {
            y: "+=10",
            rotation: "+=5",
            duration: 2 + Math.random() * 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: index * 0.3
          })
        }
      })
      
      // Add continuous subtle animations to devices
      gsap.to([phoneLeft.value, phoneRight.value], {
        y: "+=5",
        rotation: "+=1",
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.5
      })
      
      gsap.to(laptop.value, {
        y: "+=8",
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })
    }
    
    const hoverDevice = (device: string) => {
      const el = device === 'phoneLeft' ? phoneLeft.value : 
                 device === 'phoneRight' ? phoneRight.value : laptop.value
      
      if (el) {
        gsap.to(el, {
          scale: 1.05,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          duration: 0.3,
          ease: "power2.out"
        })
      }
    }
    
    const unhoverDevice = (device: string) => {
      const el = device === 'phoneLeft' ? phoneLeft.value : 
                 device === 'phoneRight' ? phoneRight.value : laptop.value
      
      if (el) {
        gsap.to(el, {
          scale: 1,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          duration: 0.3,
          ease: "power2.out"
        })
      }
    }
    
    const repairDevice = async (device: string) => {
      repairProgress.value = 0
      repairStatus.value = 'Diagnosing issue...'
      
      // Simulate repair process
      const interval = setInterval(() => {
        if (repairProgress.value < 100) {
          repairProgress.value += 10
          
          if (repairProgress.value < 30) repairStatus.value = 'Replacing components...'
          else if (repairProgress.value < 60) repairStatus.value = 'Testing functionality...'
          else if (repairProgress.value < 90) repairStatus.value = 'Final calibration...'
          else repairStatus.value = 'Almost done...'
        } else {
          clearInterval(interval)
          repairStatus.value = 'Repair completed!'
          devicesRepaired.value++
          
          // Hide cracks
          const crackEl = device === 'phoneLeft' ? crackLeft.value : 
                         device === 'phoneRight' ? crackRight.value : crackLaptop.value
          
          if (crackEl) {
            gsap.to(crackEl.children, {
              opacity: 0,
              scale: 0,
              duration: 0.5,
              stagger: 0.1
            })
          }
          
          // Show notification
          notificationMessage.value = `${device === 'laptop' ? 'Laptop' : 'Smartphone'} successfully repaired!`
          showNotification.value = true
          
          setTimeout(() => {
            showNotification.value = false
          }, 3000)
          
          // Reset progress after delay
          setTimeout(() => {
            repairProgress.value = 0
            repairStatus.value = ''
          }, 2000)
        }
      }, 200)
    }
    
    const usePart = (part: RepairPart) => {
      // Animate part being used
      const partIndex = repairParts.value.findIndex(p => p.id === part.id)
      const partElement = (component as any).$refs[`part${partIndex}`]
      
      if (partElement) {
        gsap.to(partElement, {
          scale: 1.5,
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            // Move part to random new position
            repairParts.value[partIndex].position = {
              x: Math.random() * 80 + 10,
              y: Math.random() * 70 + 15
            }
            
            // Reset part appearance
            setTimeout(() => {
              gsap.to(partElement, {
                scale: 1,
                opacity: 1,
                duration: 0.5
              })
            }, 100)
            
            partsAvailable.value--
          }
        })
      }
    }
    
    const startEmergencyRepair = () => {
      // Simulate emergency repair start
      repairProgress.value = 10
      repairStatus.value = 'Emergency repair initiated...'
      
      setTimeout(() => {
        notificationMessage.value = 'Technician dispatched to your location!'
        showNotification.value = true
        
        setTimeout(() => {
          showNotification.value = false
          repairProgress.value = 0
          repairStatus.value = ''
        }, 3000)
      }, 1000)
    }
    
    const showPartsCatalog = () => {
      // notificationMessage.value = 'Parts catalog opened in new window!'
      // showNotification.value = true
      
      // setTimeout(() => {
      //   showNotification.value = false
      // }, 2000)
      router.push('/products')
    }
    
    // Component instance reference for accessing refs in loops
    let component: any
    
    onMounted(() => {
      component = this as any
      
      initParticleSystem()
      
      // Use nextTick to ensure all refs are available
      nextTick(() => {
        initAnimations()
      })
      
      // Handle window resize
      window.addEventListener('resize', () => {
        if (particleCanvas.value) {
          particleCanvas.value.width = window.innerWidth
          particleCanvas.value.height = window.innerHeight
        }
      })
      
      // Auto-increment repaired devices counter (for demo effect)
      setInterval(() => {
        if (Math.random() > 0.7 && devicesRepaired.value < 2000) {
          devicesRepaired.value++
        }
      }, 5000)
    })
    
    onUnmounted(() => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    })

    return { 
      container, title, subtitle, tagline,
      phoneLeft, phoneRight, laptop,
      crackLeft, crackRight, crackLaptop,
      particleCanvas,
      repairParts, repairProgress, repairStatus,
      devicesRepaired, partsAvailable,
      showNotification, notificationMessage,
      hoverDevice, unhoverDevice, repairDevice,
      usePart, startEmergencyRepair, showPartsCatalog
    }
  }
}
</script>

<style scoped>
.phone-3d {
  transform: perspective(1200px) rotateX(5deg) rotateY(-20deg) translateZ(0);
  transition: transform 0.5s ease, box-shadow 0.5s ease;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5),
              inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
}

.phone-3d:hover {
  transform: perspective(1200px) rotateX(0deg) rotateY(-15deg) translateZ(20px);
}

.laptop-3d {
  transform: perspective(1200px) rotateX(5deg) rotateY(0deg) translateZ(0);
  transition: transform 0.5s ease, box-shadow 0.5s ease;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5),
              inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
}

.laptop-3d:hover {
  transform: perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(30px);
}

.hero-gradient {
  background: linear-gradient(45deg, 
    rgba(17, 24, 39, 0.9) 0%,
    rgba(37, 99, 235, 0.3) 25%,
    rgba(16, 185, 129, 0.3) 50%,
    rgba(139, 92, 246, 0.3) 75%,
    rgba(17, 24, 39, 0.9) 100%);
  background-size: 400% 400%;
  animation: gradient-flow 20s ease infinite;
}

.grid-pattern {
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 50px 50px;
}

.title-glow {
  text-shadow: 0 0 40px rgba(59, 130, 246, 0.5),
               0 0 80px rgba(59, 130, 246, 0.3),
               0 0 120px rgba(59, 130, 246, 0.1);
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}

.part-hover {
  transition: all 0.3s ease;
  filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.3));
}

.part-hover:hover {
  transform: translateY(-5px) scale(1.1);
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.4));
}

.btn-hover {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.btn-hover::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.5);
  opacity: 0;
  border-radius: 100%;
  transform: scale(1, 1) translate(-50%);
  transform-origin: 50% 50%;
}

.btn-hover:focus:not(:active)::after {
  animation: ripple 1s ease-out;
}

@keyframes gradient-flow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes ripple {
  0% {
    transform: scale(0, 0);
    opacity: 0.5;
  }
  20% {
    transform: scale(25, 25);
    opacity: 0.3;
  }
  100% {
    opacity: 0;
    transform: scale(40, 40);
  }
}

@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slide-in 0.5s ease-out;
}

/* Custom scrollbar for the section */
#home::-webkit-scrollbar {
  width: 8px;
}

#home::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

#home::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #3b82f6, #10b981);
  border-radius: 4px;
}

/* Glass effect for devices */
.phone-3d::before,
.laptop-3d::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(255, 255, 255, 0.2) 50%, 
    transparent 100%);
  z-index: 2;
}
</style>