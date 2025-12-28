<template>
  <!-- Gunakan <client-only> agar hanya dirender di client side -->
  <client-only>
    <section 
      id="about" 
      class="overflow-x-hidden min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black px-6 py-20 pt-20 pb-20"
    >
      <div class="container mx-auto max-w-6xl">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <!-- 3D Model Container dengan efek hover Tailwind -->
          <div 
            class="relative group h-96 w-full"
            data-aos="fade-right"
            ref="modelContainer"
          >
            <!-- Loading Overlay -->
            <div 
              v-if="isLoading || loadError"
              class="absolute inset-0 flex flex-col items-center justify-center z-10 bg-gray-900/90 backdrop-blur-sm rounded-xl border border-purple-400/20"
            >
              <!-- Loading Spinner -->
              <div v-if="isLoading" class="relative">
                <!-- Outer Spinner -->
                <div class="w-20 h-20 border-4 border-purple-400/30 border-t-purple-400 rounded-full animate-spin"></div>
                <!-- Inner Spinner -->
                <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 border-3 border-blue-400/30 border-t-blue-400 rounded-full animate-spin animation-delay-500"></div>
                <!-- Center Dot -->
                <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"></div>
                
                <!-- Loading Text -->
                <div class="mt-8 text-center">
                  <p class="text-purple-400 font-semibold text-lg mb-2">{{ currentMessage }}</p>
                  <p class="text-purple-300 text-sm mt-4 font-mono">
                    <span v-if="isIndeterminate">Memuat...</span>
                    <span v-else>{{ Math.min(loadingProgress, 100) }}%</span>
                  </p>
                  
                  <!-- Progress Bar -->
                  <div class="mt-3 w-56 h-2 bg-gray-800 rounded-full overflow-hidden mx-auto">
                    <div 
                      v-if="!isIndeterminate"
                      class="h-full bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 transition-all duration-300 relative"
                      :style="{ width: Math.min(loadingProgress, 100) + '%' }"
                    >
                      <!-- Shimmer effect on progress bar -->
                      <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                    </div>
                    <div 
                      v-else
                      class="h-full bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 animate-indeterminate"
                    ></div>
                  </div>
                  
                  <!-- Dots animation -->
                  <div class="flex justify-center mt-4 space-x-1">
                    <div class="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style="animation-delay: 0s"></div>
                    <div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                    <div class="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
                  </div>
                </div>
              </div>

              <!-- Error State -->
              <div v-if="loadError" class="text-center p-6">
                <div class="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-400/20">
                  <span class="text-3xl text-red-400">⚠️</span>
                </div>
                <p class="text-red-400 font-semibold text-xl mb-3">Gagal Memuat Model</p>
                <p class="text-gray-400 text-sm mb-2">{{ errorMessage }}</p>
                <p class="text-gray-500 text-xs mb-6">Pastikan file model tersedia di path: /models/soldering_iron.glb</p>
                <button 
                  @click="retryLoadModel"
                  class="px-6 py-3 bg-gradient-to-r from-purple-400/20 to-blue-400/20 text-purple-300 rounded-lg hover:from-purple-400/30 hover:to-blue-400/30 transition-all transform hover:scale-105 border border-purple-400/30 flex items-center space-x-2 mx-auto"
                >
                  <span>Coba Lagi</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                </button>
                <p class="text-gray-500 text-xs mt-4">Atau gunakan model default</p>
                <button 
                  @click="loadDefaultModel"
                  class="px-4 py-2 text-xs text-gray-400 hover:text-gray-300 mt-2"
                >
                  Gunakan Model Default
                </button>
              </div>
            </div>

            <!-- Model Container -->
            <div 
              :class="[
                'absolute inset-0 rounded-xl overflow-hidden transition-all duration-700',
                { 'opacity-0 scale-95': isLoading || loadError, 'opacity-100 scale-100': !isLoading && !loadError }
              ]"
            >
              <!-- Background effect -->
              <div class="absolute inset-0 bg-gradient-to-br from-purple-400/5 via-transparent to-blue-400/5 transform rotate-6 group-hover:rotate-3 transition-all duration-500 shadow-2xl shadow-blue-400/10"></div>
              <!-- Glow effect on hover -->
              <div class="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-purple-400/5 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>
  
          <!-- Konten -->
          <div data-aos="fade-left" class="px-4">
            <h2 class="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-6">
              Tentang <span class="text-white">Aldep 4</span>
            </h2>
            <p class="text-gray-300 text-lg leading-relaxed mb-6 bg-gray-900/30 p-4 rounded-lg border-l-4 border-purple-400">
              Aldep 4 adalah Cabang keempat dari Aldep celluler yang berfokus pada perbaikan dan servis perangkat elektronik dengan teknologi terkini.
            </p>
            <div class="grid grid-cols-2 gap-4 mb-8">
              <div class="flex items-center space-x-3 p-3 bg-gray-900/40 rounded-lg hover:bg-gray-800/60 transition-all group">
                <div class="w-10 h-10 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span class="text-xl text-purple-400">📱</span>
                </div>
                <div>
                  <span class="text-gray-300 block font-semibold">16 Tahun</span>
                  <span class="text-gray-400 text-sm">Pengalaman</span>
                </div>
              </div>
              <div class="flex items-center space-x-3 p-3 bg-gray-900/40 rounded-lg hover:bg-gray-800/60 transition-all group">
                <div class="w-10 h-10 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span class="text-xl text-blue-400">🔧</span>
                </div>
                <div>
                  <span class="text-gray-300 block font-semibold">1000+</span>
                  <span class="text-gray-400 text-sm">Perbaikan</span>
                </div>
              </div>
              <div class="flex items-center space-x-3 p-3 bg-gray-900/40 rounded-lg hover:bg-gray-800/60 transition-all group">
                <div class="w-10 h-10 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span class="text-xl text-purple-400">⭐</span>
                </div>
                <div>
                  <span class="text-gray-300 block font-semibold">98%</span>
                  <span class="text-gray-400 text-sm">Kepuasan</span>
                </div>
              </div>
              <div class="flex items-center space-x-3 p-3 bg-gray-900/40 rounded-lg hover:bg-gray-800/60 transition-all group">
                <div class="w-10 h-10 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span class="text-xl text-blue-400">⚡</span>
                </div>
                <div>
                  <span class="text-gray-300 block font-semibold">24 Jam</span>
                  <span class="text-gray-400 text-sm">Servis Cepat</span>
                </div>
              </div>
            </div>
            <div class="flex space-x-4">
              <button 
                @click="handleClick('contact')"
                class="bg-gradient-to-r from-purple-400 to-blue-400 hover:from-purple-500 hover:to-blue-500 text-black px-8 py-3 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg shadow-purple-400/25 flex items-center space-x-2"
              >
                <span>Hubungi Kami</span>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </button>
              <button 
                @click="handleClick('services')"
                class="px-6 py-3 border border-purple-400/30 text-purple-300 rounded-full font-semibold hover:bg-purple-400/10 transition-all transform hover:scale-105"
              >
                Layanan Kami
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </client-only>
</template>
  
<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, computed } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import AOS from 'aos'
import 'aos/dist/aos.css'

// Refs
const modelContainer = ref(null)
const isLoading = ref(true)
const loadError = ref(false)
const loadingProgress = ref(0)
const currentMessageIndex = ref(0)
const isIndeterminate = ref(false)
const errorMessage = ref('')

// Loading messages
const loadingMessages = ref([
  "Menyiapkan model 3D...",
  "Memuat tekstur...",
  "Mengoptimasi rendering...",
  "Hampir selesai..."
])

// Computed
const currentMessage = computed(() => {
  return loadingMessages.value[currentMessageIndex.value]
})

// Three.js variables
let scene = null
let camera = null
let renderer = null
let controls = null
let mixer = null
let model = null
let animationFrameId = null
let loadingInterval = null
let retryCount = 0

// Handle click navigation
const handleClick = (section) => {
  const element = document.getElementById(section)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

// Retry loading model
const retryLoadModel = () => {
  retryCount++
  loadError.value = false
  isLoading.value = true
  loadingProgress.value = 0
  currentMessageIndex.value = 0
  errorMessage.value = ''
  
  // Clear previous model
  if (model && scene) {
    scene.remove(model)
    model = null
  }
  
  // Clear any existing loading interval
  if (loadingInterval) {
    clearInterval(loadingInterval)
    loadingInterval = null
  }
  
  // Start loading
  loadModel()
}

// Load default primitive model
const loadDefaultModel = () => {
  loadError.value = false
  isLoading.value = true
  loadingProgress.value = 10
  isIndeterminate.value = false
  
  // Clear any existing loading interval
  if (loadingInterval) {
    clearInterval(loadingInterval)
  }
  
  // Simulate loading with controlled progress
  loadingInterval = setInterval(() => {
    if (loadingProgress.value < 90) {
      // Increment progress, but ensure it doesn't go too fast
      loadingProgress.value += Math.random() * 15 + 5
      
      // Clamp at 90%
      if (loadingProgress.value > 90) {
        loadingProgress.value = 90
      }
      
      // Update message based on progress
      if (loadingProgress.value < 30) {
        currentMessageIndex.value = 0
      } else if (loadingProgress.value < 60) {
        currentMessageIndex.value = 1
      } else if (loadingProgress.value < 90) {
        currentMessageIndex.value = 2
      }
    }
  }, 300)
  
  setTimeout(() => {
    if (loadingInterval) {
      clearInterval(loadingInterval)
      loadingInterval = null
    }
    
    // Set to 100% for completion
    loadingProgress.value = 100
    currentMessageIndex.value = 3
    
    // Create a default 3D object (a simple phone model)
    createDefaultPhoneModel()
    
    setTimeout(() => {
      isLoading.value = false
    }, 800)
  }, 2000)
}

// Create a default phone model
const createDefaultPhoneModel = () => {
  // Clear existing model
  if (model && scene) {
    scene.remove(model)
    model = null
  }
  
  try {
    // Create a group for the phone
    const phoneGroup = new THREE.Group()
    
    // Phone body
    const phoneGeometry = new THREE.BoxGeometry(0.8, 1.6, 0.1)
    const phoneMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x333333,
      metalness: 0.8,
      roughness: 0.2,
      clearcoat: 0.5,
      clearcoatRoughness: 0.1
    })
    const phoneBody = new THREE.Mesh(phoneGeometry, phoneMaterial)
    phoneGroup.add(phoneBody)
    
    // Screen
    const screenGeometry = new THREE.PlaneGeometry(0.7, 1.5)
    const screenMaterial = new THREE.MeshBasicMaterial({
      color: 0x000011,
      emissive: 0x001133,
      emissiveIntensity: 0.5
    })
    const screen = new THREE.Mesh(screenGeometry, screenMaterial)
    screen.position.z = 0.051
    phoneGroup.add(screen)
    
    // Camera bump
    const cameraGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.02, 16)
    const cameraMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x111111,
      metalness: 0.9,
      roughness: 0.1
    })
    const cameraBump = new THREE.Mesh(cameraGeometry, cameraMaterial)
    cameraBump.position.set(0, 0.6, 0.06)
    phoneGroup.add(cameraBump)
    
    // Home button
    const buttonGeometry = new THREE.CircleGeometry(0.04, 16)
    const buttonMaterial = new THREE.MeshBasicMaterial({ color: 0x444444 })
    const homeButton = new THREE.Mesh(buttonGeometry, buttonMaterial)
    homeButton.position.set(0, -0.65, 0.051)
    phoneGroup.add(homeButton)
    
    // Scale and position
    phoneGroup.scale.set(2, 2, 2)
    phoneGroup.position.set(0, 0, 0)
    phoneGroup.rotation.x = -0.2
    phoneGroup.rotation.y = 0.5
    
    // Add to scene
    scene.add(phoneGroup)
    model = phoneGroup
    
    // Add rotation animation
    const animateRotation = () => {
      if (phoneGroup) {
        phoneGroup.rotation.y += 0.005
      }
    }
    
    // Store reference to animation function
    phoneGroup.userData.animate = animateRotation
    
  } catch (error) {
    console.error('Error creating default model:', error)
    errorMessage.value = 'Gagal membuat model default: ' + error.message
    loadError.value = true
    isLoading.value = false
  }
}

// Load GLTF model
const loadModel = () => {
  // Clear any existing loading interval
  if (loadingInterval) {
    clearInterval(loadingInterval)
    loadingInterval = null
  }
  
  // Start with indeterminate progress
  isIndeterminate.value = true
  loadingProgress.value = 0
  
  const loader = new GLTFLoader()
  
  // Optional: Add DRACO loader for compressed models
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.5/')
  loader.setDRACOLoader(dracoLoader)
  
  // Update loading messages
  loadingInterval = setInterval(() => {
    if (isLoading.value && !loadError.value && isIndeterminate.value) {
      currentMessageIndex.value = (currentMessageIndex.value + 1) % loadingMessages.value.length
    }
  }, 2500)
  
  // Track loading progress
  loader.load(
    '/models/soldering_iron.glb',
    (gltf) => {
      if (loadingInterval) {
        clearInterval(loadingInterval)
        loadingInterval = null
      }
      
      isIndeterminate.value = false
      loadingProgress.value = 100
      
      // Remove previous model
      if (model && scene) {
        scene.remove(model)
      }
      
      // Setup new model
      model = gltf.scene
      model.scale.set(5, 5, 5)
      model.position.set(0, 0, 0)
      
      // Add animations if available
      if (gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(model)
        const action = mixer.clipAction(gltf.animations[0])
        action.play()
      }
      
      // Add model to scene
      scene.add(model)
      
      // Complete loading
      setTimeout(() => {
        isLoading.value = false
        
        // Enable auto rotation after load
        if (controls) {
          controls.autoRotate = true
        }
      }, 500)
    },
    (xhr) => {
      // Switch to determinate progress
      isIndeterminate.value = false
      
      // Safely calculate progress
      if (xhr.total > 0) {
        const progress = (xhr.loaded / xhr.total) * 100
        // Clamp progress between 0 and 100
        loadingProgress.value = Math.min(Math.max(0, progress), 100)
      } else {
        // If total is unknown, use a simulated progress
        loadingProgress.value = Math.min(loadingProgress.value + 10, 90)
      }
      
      // Update message based on progress
      if (loadingProgress.value < 30) {
        currentMessageIndex.value = 0
      } else if (loadingProgress.value < 60) {
        currentMessageIndex.value = 1
      } else if (loadingProgress.value < 90) {
        currentMessageIndex.value = 2
      } else {
        currentMessageIndex.value = 3
      }
    },
    (error) => {
      if (loadingInterval) {
        clearInterval(loadingInterval)
        loadingInterval = null
      }
      
      console.error('Error loading model:', error)
      errorMessage.value = error.message || 'Tidak dapat memuat model 3D'
      loadError.value = true
      isLoading.value = false
      
      // If we've tried too many times, fall back to default model
      if (retryCount >= 2) {
        console.log('Max retries reached, falling back to default model...')
        setTimeout(() => {
          loadDefaultModel()
        }, 500)
      }
    }
  )
}

// Initialize Three.js
const initThreeJS = () => {
  const container = modelContainer.value
  if (!container) {
    errorMessage.value = 'Container tidak ditemukan'
    loadError.value = true
    isLoading.value = false
    return
  }

  try {
    // Create scene
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0f172a)
    scene.fog = new THREE.Fog(0x0f172a, 5, 15)

    // Create camera
    camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    )
    camera.position.set(0, 0, 3)

    // Create renderer
    renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    })
    
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    
    container.appendChild(renderer.domElement)

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(5, 5, 5)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    scene.add(directionalLight)

    // Add colorful point lights
    const pointLight1 = new THREE.PointLight(0x6d28d9, 0.8, 10)
    pointLight1.position.set(3, 2, 2)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0x3b82f6, 0.6, 10)
    pointLight2.position.set(-3, -1, 1)
    scene.add(pointLight2)

    const pointLight3 = new THREE.PointLight(0xec4899, 0.4, 8)
    pointLight3.position.set(0, 3, 2)
    scene.add(pointLight3)

    // Initialize OrbitControls
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.autoRotate = false // Start with auto-rotate off
    controls.autoRotateSpeed = 0.5
    controls.enableZoom = true
    controls.minDistance = 0.5
    controls.maxDistance = 5
    controls.target.set(0, 0, 0)
    controls.enablePan = false

    // Add window resize listener
    window.addEventListener('resize', onWindowResize)
    
    // Start loading model
    loadModel()
    
    // Start animation loop
    animate()
    
  } catch (error) {
    console.error('Gagal menginisialisasi Three.js:', error)
    errorMessage.value = 'Gagal menginisialisasi 3D engine: ' + error.message
    loadError.value = true
    isLoading.value = false
  }
}

// Handle window resize
function onWindowResize() {
  const container = modelContainer.value
  if (!container || !camera || !renderer) return
  
  camera.aspect = container.clientWidth / container.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(container.clientWidth, container.clientHeight)
}

// Animation loop
function animate() {
  animationFrameId = requestAnimationFrame(animate)
  
  // Update animation mixer
  if (mixer) mixer.update(0.0167)
  
  // Update controls
  if (controls) controls.update()
  
  // Update custom animations
  if (model && model.userData && model.userData.animate) {
    model.userData.animate()
  }
  
  // Render scene
  if (renderer && scene && camera) {
    renderer.render(scene, camera)
  }
}

// Cleanup function
const cleanup = () => {
  // Clear loading interval
  if (loadingInterval) {
    clearInterval(loadingInterval)
    loadingInterval = null
  }
  
  // Cancel animation frame
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  
  // Remove event listeners
  window.removeEventListener('resize', onWindowResize)
  
  // Dispose Three.js resources
  if (controls) {
    controls.dispose()
    controls = null
  }
  
  if (renderer) {
    renderer.dispose()
    renderer.forceContextLoss()
    renderer = null
  }
  
  if (scene) {
    // Dispose geometries and materials
    scene.traverse((object) => {
      if (object.isMesh) {
        if (object.geometry) object.geometry.dispose()
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose())
          } else {
            object.material.dispose()
          }
        }
      }
    })
    scene = null
  }
  
  if (mixer) {
    mixer.stopAllAction()
    mixer = null
  }
  
  model = null
}

// Initialize on mount
onMounted(async () => {
  // Initialize AOS (Animate On Scroll)
  AOS.init({
    duration: 1000,
    once: true,
    offset: 100
  })

  // Wait for DOM to be ready
  await nextTick()
  
  // Initialize Three.js
  initThreeJS()
})

// Cleanup on unmount
onBeforeUnmount(() => {
  cleanup()
})
</script>
  
<style scoped>
/* Custom animations */
.animation-delay-500 {
  animation-delay: 0.5s;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes indeterminate {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(200%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}

.animate-indeterminate {
  animation: indeterminate 1.5s infinite ease-in-out;
}

/* Smooth transitions */
.opacity-0 {
  opacity: 0;
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.opacity-100 {
  opacity: 1;
  transition: opacity 0.5s ease 0.3s, transform 0.5s ease 0.3s;
}

.scale-95 {
  transform: scale(0.95);
}

.scale-100 {
  transform: scale(1);
}

/* Custom border animation */
.border-l-4 {
  position: relative;
  overflow: hidden;
}

.border-l-4::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(to bottom, transparent, #a78bfa, transparent);
  animation: borderGlow 3s ease-in-out infinite;
}

@keyframes borderGlow {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #a78bfa, #60a5fa);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #8b5cf6, #3b82f6);
}
</style>