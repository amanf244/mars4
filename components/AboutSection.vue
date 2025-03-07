<template>
    <section 
      id="about" 
      class="overflow-x-hidden min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black px-6 py-20"
    >
    <div class="container mx-auto max-w-6xl">
      <div class="grid md:grid-cols-2 gap-12 items-center">
        <!-- 3D Model Container -->
        <div 
          class="relative group h-96"
          data-aos="fade-right"
          ref="modelContainer"
        >
          <!-- <div class="absolute inset-0 bg-purple-400/20 rounded-xl transform rotate-6 group-hover:rotate-3 transition-all shadow-xl shadow-blue-400/10"></div> -->
        </div>
  
          <!-- Konten -->
          <div data-aos="fade-left">
            <h2 class="text-4xl md:text-5xl font-bold text-purple-400 mb-6">
              Tentang Aldep3
            </h2>
            <p class="text-gray-300 text-lg leading-relaxed mb-6">
              Aldep3 adalah Cabang ketiga dari Aldep celluler
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
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  import * as THREE from 'three'
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
  import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
  import AOS from 'aos'
  import 'aos/dist/aos.css'
  
  const modelContainer = ref(null)
  
  let scene, camera, renderer, controls, mixer
  
  onMounted(() => {
    AOS.init({
      duration: 1000,
      once: true
    })
  
    // Setup Three.js
    const container = modelContainer.value
    
    // Scene
    scene = new THREE.Scene()
    // scene.background = new THREE.Color(0x0f172a)
  
    // Camera
    camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    )
    camera.position.set(0, 0, 2) // Geser kamera mundur
  
    // Renderer
    renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    container.appendChild(renderer.domElement)
  
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)
  
    // Load model
    const loader = new GLTFLoader()
    loader.load(
      '/models/soldering_iron.glb', // Sesuaikan path model Anda
      (gltf) => {
        const model = gltf.scene
        
        // Scale dan posisi model
        model.scale.set(5, 5, 5) // Atau nilai yang lebih besar
        model.position.set(0, -0.5, 0)
        
        // Animasi jika ada
        if(gltf.animations.length > 0) {
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
  
    // Controls
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.5
    controls.enableZoom = true
    controls.minDistance = 0.5
    controls.maxDistance = 2
  
    // Handle resize
    window.addEventListener('resize', onWindowResize)
  
    animate()
  })
  
  function onWindowResize() {
    const container = modelContainer.value
    camera.aspect = container.clientWidth / container.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(container.clientWidth, container.clientHeight)
  }
  
  function animate() {
    requestAnimationFrame(animate)
    
    // Update animasi
    if(mixer) mixer.update(0.0167)
    
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
  /* Tambahkan style ini */
  .canvas-container {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 384px;
    border-radius: 1rem;
    overflow: hidden;
    transition: transform 0.3s ease;
  }
  
  .canvas-container:hover {
    transform: translateY(-0.5rem);
  }
  
  canvas {
    position: absolute;
    top: 0;
    left: 0;
    outline: none;
  }
  </style>