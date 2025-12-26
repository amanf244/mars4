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
              class="absolute inset-0 flex flex-col items-center justify-center z-10 bg-gray-900/90 rounded-xl"
            >
              <!-- Loading Spinner -->
              <div v-if="isLoading" class="relative">
                <!-- Outer Spinner -->
                <div class="w-16 h-16 border-4 border-purple-400/20 border-t-purple-400 rounded-full animate-spin"></div>
                <!-- Inner Spinner -->
                <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-2 border-blue-400/20 border-t-blue-400 rounded-full animate-spin animation-delay-500"></div>
                <!-- Loading Text -->
                <div class="mt-6 text-center">
                  <p class="text-purple-400 font-semibold">Memuat Model 3D...</p>
                  <p class="text-gray-400 text-sm mt-2">{{ loadingProgress }}%</p>
                  <!-- Progress Bar -->
                  <div class="mt-3 w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      class="h-full bg-gradient-to-r from-purple-400 to-blue-400 transition-all duration-300"
                      :style="{ width: loadingProgress + '%' }"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- Error State -->
              <div v-if="loadError" class="text-center">
                <div class="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span class="text-2xl text-red-400">⚠️</span>
                </div>
                <p class="text-red-400 font-semibold mb-2">Gagal Memuat Model</p>
                <p class="text-gray-400 text-sm mb-4">Model 3D tidak dapat dimuat</p>
                <button 
                  @click="retryLoadModel"
                  class="px-4 py-2 bg-purple-400/20 text-purple-400 rounded-lg hover:bg-purple-400/30 transition-colors"
                >
                  Coba Lagi
                </button>
              </div>
            </div>

            <!-- Model Container -->
            <div 
              :class="[
                'absolute inset-0 rounded-xl overflow-hidden',
                { 'opacity-0': isLoading, 'opacity-100': !isLoading }
              ]"
            >
              <div class="absolute inset-0 bg-white/5 transform rotate-6 group-hover:rotate-3 transition-all shadow-xl shadow-blue-400/10"></div>
            </div>
          </div>
  
          <!-- Konten -->
          <div data-aos="fade-left">
            <h2 class="text-4xl md:text-5xl font-bold text-purple-400 mb-6">
              Tentang Aldep 4
            </h2>
            <p class="text-gray-300 text-lg leading-relaxed mb-6">
              Aldep 4 adalah Cabang keempat dari Aldep celluler
            </p>
            <div class="grid grid-cols-2 gap-4 mb-8">
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-purple-400/20 rounded-full flex items-center justify-center">
                  <span class="text-purple-400">📱</span>
                </div>
                <span class="text-gray-300">16 Tahun Pengalaman</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-purple-400/20 rounded-full flex items-center justify-center">
                  <span class="text-purple-400">🔧</span>
                </div>
                <span class="text-gray-300">1000+ Perbaikan</span>
              </div>
            </div>
            <button 
              @click="handleClick('contact')"
              class="bg-purple-400 hover:bg-purple-500 text-black px-8 py-3 rounded-full font-semibold transition-all transform hover:scale-105"
            >
              Hubungi Kami
            </button>
          </div>
        </div>
      </div>
    </section>
  </client-only>
</template>
  
<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import AOS from 'aos'
import 'aos/dist/aos.css'

const modelContainer = ref(null)
const isLoading = ref(true)
const loadError = ref(false)
const loadingProgress = ref(0)

let scene, camera, renderer, controls, mixer

const handleClick = (section) => {
  // Navigasi ke section yang dituju
  const element = document.getElementById(section)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const retryLoadModel = () => {
  loadError.value = false
  isLoading.value = true
  loadingProgress.value = 0
  loadModel()
}

const loadModel = () => {
  const loader = new GLTFLoader()
  
  // Track loading progress
  loader.load(
    '/models/soldering_iron.glb',
    (gltf) => {
      const model = gltf.scene
      model.scale.set(5, 5, 5)
      model.position.set(0, 0, 0)
      
      if (gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(model)
        const action = mixer.clipAction(gltf.animations[0])
        action.play()
      }
      
      scene.add(model)
      isLoading.value = false
      
      // Small delay for smooth transition
      setTimeout(() => {
        if (controls) {
          controls.autoRotate = true
        }
      }, 500)
    },
    (xhr) => {
      // Update progress
      loadingProgress.value = Math.round((xhr.loaded / xhr.total) * 100)
    },
    (error) => {
      console.error('Error loading model:', error)
      loadError.value = true
      isLoading.value = false
    }
  )
}

onMounted(async () => {
  AOS.init({
    duration: 1000,
    once: true
  })

  // Pastikan DOM sudah dirender
  await nextTick()

  const container = modelContainer.value
  if (!container) {
    console.error('modelContainer tidak ditemukan')
    loadError.value = true
    isLoading.value = false
    return
  }

  if (container.clientWidth === 0 || container.clientHeight === 0) {
    console.error('Ukuran container tidak valid:', container.clientWidth, container.clientHeight)
    loadError.value = true
    isLoading.value = false
    return
  }

  try {
    // Buat scene
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0f172a)

    // Buat kamera
    camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    )
    camera.position.set(0, 0, 2)

    // Inisialisasi renderer
    renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    })
    
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Tambahkan lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    // Tambahkan point lights untuk efek lebih baik
    const pointLight1 = new THREE.PointLight(0x6d28d9, 0.5, 10)
    pointLight1.position.set(2, 2, 2)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0x3b82f6, 0.5, 10)
    pointLight2.position.set(-2, -1, 1)
    scene.add(pointLight2)

    // Inisialisasi OrbitControls
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.autoRotate = false // Matikan dulu sampai model selesai load
    controls.autoRotateSpeed = 0.5
    controls.enableZoom = true
    controls.minDistance = 0.5
    controls.maxDistance = 2
    controls.target.set(0, 0, 0)

    window.addEventListener('resize', onWindowResize)
    
    // Load model
    loadModel()
    
    animate()
  } catch (error) {
    console.error('Gagal menginisialisasi Three.js:', error)
    loadError.value = true
    isLoading.value = false
  }
})

function onWindowResize() {
  const container = modelContainer.value
  if (!container) return
  camera.aspect = container.clientWidth / container.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(container.clientWidth, container.clientHeight)
}

function animate() {
  requestAnimationFrame(animate)
  
  if (mixer) mixer.update(0.0167)
  if (controls) controls.update()
  if (renderer && scene && camera) renderer.render(scene, camera)
}

onBeforeUnmount(() => {
  window.removeEventListener('resize', onWindowResize)
  if (controls) controls.dispose()
  if (renderer) {
    renderer.dispose()
    renderer.forceContextLoss()
  }
  if (mixer) mixer.stopAllAction()
})
</script>
  
<style scoped>
/* Animation delay for inner spinner */
.animation-delay-500 {
  animation-delay: 0.5s;
}

/* Smooth transition for opacity */
.opacity-0 {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.opacity-100 {
  opacity: 1;
  transition: opacity 0.3s ease 0.2s; /* Delay for smooth reveal */
}

/* Custom scrollbar for loading bar */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #a78bfa, #60a5fa);
  border-radius: 2px;
}
</style>