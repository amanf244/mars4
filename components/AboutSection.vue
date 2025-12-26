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
            <div class="absolute inset-0 bg-white/5 rounded-xl transform rotate-6 group-hover:rotate-3 transition-all shadow-xl shadow-blue-400/10"></div>
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

let scene, camera, renderer, controls, mixer

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
    return
  }

  if (container.clientWidth === 0 || container.clientHeight === 0) {
    console.error('Ukuran container tidak valid:', container.clientWidth, container.clientHeight)
    return
  }

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

  // Inisialisasi renderer dengan try-catch
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  } catch (error) {
    console.error('Gagal membuat WebGL context:', error)
    return
  }
  
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  container.appendChild(renderer.domElement)

  // Tambahkan lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
  scene.add(ambientLight)
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.set(5, 5, 5)
  scene.add(directionalLight)

  // Load model
  const loader = new GLTFLoader()
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
    },
    undefined,
    (error) => {
      console.error('Error loading model:', error)
    }
  )

  // Inisialisasi OrbitControls
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.autoRotate = true
  controls.autoRotateSpeed = 0.5
  controls.enableZoom = true
  controls.minDistance = 0.5
  controls.maxDistance = 2
  controls.target.set(0, 0, 0)

  window.addEventListener('resize', onWindowResize)
  animate()
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
  controls.update()
  renderer.render(scene, camera)
}

onBeforeUnmount(() => {
  window.removeEventListener('resize', onWindowResize)
  if (controls) controls.dispose()
  if (renderer) renderer.dispose()
})
</script>
  
<style scoped>
/* Jika diperlukan, Anda bisa menambahkan style tambahan di sini */
/* Namun, karena Tailwind sudah menyediakan efek group-hover, style custom tidak diperlukan */
</style>
