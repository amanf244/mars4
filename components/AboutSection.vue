<template>
  <client-only>
    <section 
      id="about" 
      class="overflow-x-hidden min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black px-4 py-16 md:px-6 md:py-20"
      ref="sectionRef"
    >
      <div class="container mx-auto max-w-6xl">
        <div class="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <!-- 3D Model Container -->
          <div 
            class="relative group h-80 md:h-96 w-full"
            data-aos="fade-right"
            ref="modelContainer"
          >
            <!-- Loading State -->
            <div 
              v-if="loadingState !== 'loaded'"
              class="absolute inset-0 flex flex-col items-center justify-center z-10 bg-gray-900/80 rounded-xl"
            >
              <div v-if="loadingState === 'loading'" class="text-center">
                <div class="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-purple-400 mx-auto mb-3"></div>
                <p class="text-gray-300 text-sm md:text-base">Memuat model 3D...</p>
                <p class="text-gray-400 text-xs mt-1" v-if="loadProgress > 0">{{ loadProgress }}%</p>
              </div>
              
              <div v-else-if="loadingState === 'error'" class="text-center p-4">
                <div class="w-12 h-12 mx-auto mb-3 text-red-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <p class="text-gray-300 mb-2">Model 3D tidak dapat dimuat</p>
                <button 
                  @click="retryLoadModel"
                  class="text-purple-400 hover:text-purple-300 text-sm font-medium"
                >
                  Coba Lagi
                </button>
              </div>
            </div>
            
            <!-- Fallback Image -->
            <div 
              v-show="loadingState !== 'loaded'"
              class="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-xl flex items-center justify-center"
            >
              <div class="text-center">
                <div class="w-20 h-20 mx-auto mb-4 text-purple-400/50">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <!-- Background decorative element -->
            <div class="absolute inset-0 bg-white/5 rounded-xl transform rotate-6 group-hover:rotate-3 transition-all duration-300 shadow-xl shadow-blue-400/10"></div>
          </div>
  
          <!-- Konten -->
          <div data-aos="fade-left" class="px-2 md:px-0">
            <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-purple-400 mb-4 md:mb-6">
              Tentang Aldep 4
            </h2>
            <p class="text-gray-300 text-base md:text-lg leading-relaxed mb-6">
              Aldep 4 adalah Cabang keempat dari Aldep celluler yang telah berpengalaman selama 16 tahun dalam bidang perbaikan dan servis perangkat elektronik.
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
              <div class="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-lg">
                <div class="w-10 h-10 bg-purple-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span class="text-purple-400 text-lg">📱</span>
                </div>
                <div>
                  <p class="text-gray-300 font-medium">16 Tahun</p>
                  <p class="text-gray-400 text-sm">Pengalaman</p>
                </div>
              </div>
              <div class="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-lg">
                <div class="w-10 h-10 bg-purple-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span class="text-purple-400 text-lg">🔧</span>
                </div>
                <div>
                  <p class="text-gray-300 font-medium">1000+</p>
                  <p class="text-gray-400 text-sm">Perbaikan</p>
                </div>
              </div>
            </div>
            <button 
              @click="scrollToContact"
              class="bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-black px-6 py-3 md:px-8 md:py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl shadow-purple-400/20"
            >
              Hubungi Kami
            </button>
            
            <!-- Performance info -->
            <div v-if="showDebug" class="mt-6 p-3 bg-gray-800/50 rounded-lg">
              <p class="text-gray-400 text-xs mb-2">Debug Info:</p>
              <div class="space-y-1">
                <div class="flex items-center justify-between">
                  <span class="text-gray-300 text-sm">FPS: {{ Math.round(currentFPS) }}</span>
                  <span class="text-gray-400 text-xs">{{ performanceStatus }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-300 text-sm">Status: {{ loadingState }}</span>
                  <button @click="toggleAutoRotate" class="text-xs px-2 py-1 bg-gray-700 rounded">
                    {{ controls?.autoRotate ? 'Stop' : 'Rotate' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </client-only>
</template>
  
<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, computed } from 'vue'

// Refs
const modelContainer = ref(null)
const sectionRef = ref(null)
const loadingState = ref('idle') // 'idle', 'loading', 'loaded', 'error'
const loadProgress = ref(0)
const currentFPS = ref(0)
const showDebug = ref(false)

// Computed
const performanceStatus = computed(() => {
  if (currentFPS.value > 55) return 'Excellent'
  if (currentFPS.value > 45) return 'Good'
  if (currentFPS.value > 30) return 'Fair'
  return 'Poor'
})

// Three.js variables
let scene = null
let camera = null
let renderer = null
let controls = null
let mixer = null
let clock = null
let model = null

// Performance variables
let animationFrameId = null
let isMounted = false
let lastFrameTime = 0
let frameCount = 0
let lastFPSUpdate = 0
let resizeObserver = null
let intersectionObserver = null
let isVisible = false

// Performance configuration
const performanceConfig = {
  targetFPS: 60,
  frameTime: 1000 / 60,
  lowPowerMode: false,
  isSafari: false,
  isFirefox: false
}

// Initialize device detection
const initDeviceDetection = () => {
  if (process.client) {
    const ua = navigator.userAgent
    performanceConfig.isSafari = /^((?!chrome|android).)*safari/i.test(ua)
    performanceConfig.isFirefox = ua.includes('Firefox')
    
    // Check for low power mode on iOS
    if (performanceConfig.isSafari) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      performanceConfig.lowPowerMode = mediaQuery.matches
      
      // Listen for changes
      mediaQuery.addEventListener('change', (e) => {
        performanceConfig.lowPowerMode = e.matches
        updatePerformanceSettings()
      })
    }
  }
}

// Update performance settings based on device
const updatePerformanceSettings = () => {
  const isMobile = window.innerWidth < 768
  const isLowEnd = detectLowEndDevice()
  
  if (performanceConfig.lowPowerMode || isLowEnd) {
    performanceConfig.targetFPS = 30
    performanceConfig.frameTime = 1000 / 30
  } else if (isMobile) {
    performanceConfig.targetFPS = 45
    performanceConfig.frameTime = 1000 / 45
  } else {
    performanceConfig.targetFPS = 60
    performanceConfig.frameTime = 1000 / 60
  }
}

// Kontak scroll handler
const scrollToContact = () => {
  if (process.client) {
    const contactSection = document.getElementById('contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
}

// Retry model loading
const retryLoadModel = async () => {
  if (modelContainer.value && isMounted) {
    cleanupThreeJS()
    loadingState.value = 'loading'
    loadProgress.value = 0
    await nextTick()
    loadModel()
  }
}

// Toggle auto rotate
const toggleAutoRotate = () => {
  if (controls) {
    controls.autoRotate = !controls.autoRotate
    if (controls.autoRotate) {
      controls.autoRotateSpeed = 0.5
    }
  }
}

// Load 3D model - Optimized version
const loadModel = async () => {
  if (!process.client || !modelContainer.value || !isMounted) {
    return
  }

  try {
    // Initialize device detection
    initDeviceDetection()
    updatePerformanceSettings()

    // Dynamic imports with error handling
    let THREE, OrbitControls, GLTFLoader
    
    try {
      const threeModule = await import('three')
      THREE = threeModule.default || threeModule
      
      const controlsModule = await import('three/examples/jsm/controls/OrbitControls')
      OrbitControls = controlsModule.OrbitControls || controlsModule.default
      
      const loaderModule = await import('three/examples/jsm/loaders/GLTFLoader')
      GLTFLoader = loaderModule.GLTFLoader || loaderModule.default
    } catch (importError) {
      console.error('Failed to import Three.js modules:', importError)
      loadingState.value = 'error'
      return
    }

    const container = modelContainer.value
    if (!container || container.clientWidth === 0 || container.clientHeight === 0) {
      console.error('Invalid container dimensions')
      loadingState.value = 'error'
      return
    }

    // Initialize clock
    clock = new THREE.Clock()

    // Detect device for optimization
    const isMobile = window.innerWidth < 768
    const isLowEndDevice = detectLowEndDevice()

    // Create scene with optimized settings
    scene = new THREE.Scene()
    
    // Use simpler background for mobile/low-end
    if (isLowEndDevice || isMobile) {
      scene.background = null // No background for better performance
    } else {
      scene.background = new THREE.Color(0x0f172a)
    }

    // Create camera with optimized settings
    camera = new THREE.PerspectiveCamera(
      isMobile ? 45 : 60,
      container.clientWidth / container.clientHeight,
      0.1,
      50
    )
    camera.position.set(0, 0.1, isMobile ? 3.5 : 2.8)

    // Create renderer with aggressive optimization
    const rendererConfig = {
      alpha: true,
      powerPreference: 'high-performance',
      antialias: !isLowEndDevice && !isMobile,
      precision: isLowEndDevice ? 'lowp' : 'highp',
      logarithmicDepthBuffer: false,
      stencil: false,
      depth: true,
      preserveDrawingBuffer: false
    }

    try {
      renderer = new THREE.WebGLRenderer(rendererConfig)
    } catch (rendererError) {
      console.error('WebGL initialization failed:', rendererError)
      loadingState.value = 'error'
      return
    }

    // Optimize renderer settings
    const pixelRatio = isLowEndDevice ? 1 : Math.min(window.devicePixelRatio, isMobile ? 1.2 : 1.5)
    renderer.setPixelRatio(pixelRatio)
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    
    // Simplified tone mapping for performance
    renderer.toneMapping = THREE.LinearToneMapping
    renderer.toneMappingExposure = 1.0
    
    // Disable expensive features
    renderer.shadowMap.enabled = false
    renderer.shadowMap.type = THREE.BasicShadowMap
    renderer.physicallyCorrectLights = false
    renderer.localClippingEnabled = false
    renderer.sortObjects = true

    // Add canvas to container
    container.appendChild(renderer.domElement)

    // Optimized lighting setup (minimal lights)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(1, 2, 1)
    directionalLight.castShadow = false
    scene.add(directionalLight)

    // Load 3D model with improved error handling
    const loader = new GLTFLoader()
    
    // Set up loading timeout
    const loadingTimeout = setTimeout(() => {
      if (loadingState.value === 'loading') {
        console.warn('Model loading timeout')
        loadingState.value = 'error'
      }
    }, 30000) // 30 second timeout

    loader.load(
      '/models/soldering_iron.glb',
      (gltf) => {
        clearTimeout(loadingTimeout)
        
        if (!isMounted || !scene) return
        
        model = gltf.scene
        
        // Aggressive model optimization
        model.traverse((child) => {
          if (child.isMesh) {
            // Performance optimizations
            child.castShadow = false
            child.receiveShadow = false
            child.frustumCulled = true
            
            // Material optimizations
            if (child.material) {
              // Convert to basic material for low-end devices
              if (isLowEndDevice) {
                const basicMaterial = new THREE.MeshBasicMaterial()
                if (child.material.map) {
                  basicMaterial.map = child.material.map
                  basicMaterial.map.anisotropy = 0
                }
                basicMaterial.color.copy(child.material.color)
                child.material = basicMaterial
              } else {
                // Optimize existing material
                child.material.precision = isLowEndDevice ? 'lowp' : 'highp'
                child.material.depthWrite = true
                child.material.depthTest = true
                child.material.transparent = false
                
                // Disable features for performance
                child.material.vertexColors = false
                child.material.skinning = false
                child.material.morphTargets = false
                child.material.morphNormals = false
                
                // Reduce texture quality
                if (child.material.map) {
                  child.material.map.anisotropy = renderer.capabilities.getMaxAnisotropy()
                  child.material.map.generateMipmaps = true
                  child.material.map.minFilter = THREE.LinearMipmapLinearFilter
                  child.material.map.magFilter = THREE.LinearFilter
                }
              }
            }
            
            // Simplify geometry if possible
            if (child.geometry && child.geometry.attributes.position && 
                child.geometry.attributes.position.count > 10000) {
              console.warn('High polygon count detected:', child.geometry.attributes.position.count)
            }
          }
        })
        
        // Scale and position model
        const scale = isMobile ? 3 : 3.5
        model.scale.set(scale, scale, scale)
        model.position.set(0, -0.3, 0)
        model.rotation.y = Math.PI * 0.25
        
        // Add animation only if not low-end
        if (!isLowEndDevice && gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model)
          const action = mixer.clipAction(gltf.animations[0])
          action.timeScale = 0.5 // Slow down animation
          action.play()
        }
        
        scene.add(model)
        loadingState.value = 'loaded'
        
        // Initialize controls
        initControls(THREE, OrbitControls, isMobile, isLowEndDevice)
        
        // Setup observers
        setupObservers()
        
        // Start animation loop
        requestAnimationFrame(animate)
      },
      (xhr) => {
        if (isMounted) {
          const percentComplete = xhr.total > 0 ? (xhr.loaded / xhr.total) * 100 : 0
          loadProgress.value = Math.min(99, Math.round(percentComplete))
        }
      },
      (error) => {
        clearTimeout(loadingTimeout)
        console.error('Error loading 3D model:', error)
        if (isMounted) {
          loadingState.value = 'error'
        }
        createFallbackGeometry(THREE)
      }
    )

  } catch (error) {
    console.error('Failed to initialize 3D:', error)
    loadingState.value = 'error'
  }
}

// Initialize controls
const initControls = (THREE, OrbitControls, isMobile, isLowEndDevice) => {
  if (!camera || !renderer) return
  
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = isMobile ? 0.1 : 0.05
  controls.autoRotate = !isLowEndDevice
  controls.autoRotateSpeed = 0.5
  controls.enableZoom = true
  controls.enablePan = false
  controls.minDistance = 1.5
  controls.maxDistance = 6
  controls.maxPolarAngle = Math.PI / 2.1
  controls.minPolarAngle = 0
  controls.target.set(0, 0.1, 0)
  
  // Disable controls for low-end devices
  if (isLowEndDevice) {
    controls.enabled = false
  }
}

// Setup observers
const setupObservers = () => {
  // Clean up existing observers
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
  if (intersectionObserver) {
    intersectionObserver.disconnect()
  }
  
  // Resize observer with throttling
  let resizeTimeout
  const handleResize = () => {
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(onWindowResize, 200)
  }
  
  window.addEventListener('resize', handleResize)
  
  // Intersection observer for visibility
  if (sectionRef.value) {
    intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          isVisible = entry.isIntersecting
          if (!isVisible && animationFrameId) {
            cancelAnimationFrame(animationFrameId)
            animationFrameId = null
          } else if (isVisible && !animationFrameId && isMounted) {
            requestAnimationFrame(animate)
          }
        })
      },
      { threshold: 0.1 }
    )
    intersectionObserver.observe(sectionRef.value)
  }
}

// Create fallback geometry
const createFallbackGeometry = async (THREE) => {
  if (!isMounted || !scene || !THREE) return
  
  try {
    // Create a much simpler geometry for fallback
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      wireframe: true
    })
    
    const cube = new THREE.Mesh(geometry, material)
    cube.rotation.x = Math.PI / 4
    cube.rotation.y = Math.PI / 4
    
    scene.add(cube)
    loadingState.value = 'loaded'
    
    console.log('Using fallback geometry')
  } catch (error) {
    console.error('Failed to create fallback geometry:', error)
  }
}

// Detect low-end device
const detectLowEndDevice = () => {
  if (!process.client) return false
  
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  const memory = navigator.deviceMemory || 4
  const cores = navigator.hardwareConcurrency || 4
  
  return isMobile || memory < 4 || cores < 4
}

// Window resize handler
const onWindowResize = () => {
  if (!modelContainer.value || !camera || !renderer) return
  
  const container = modelContainer.value
  const isMobile = window.innerWidth < 768
  
  camera.aspect = container.clientWidth / container.clientHeight
  camera.updateProjectionMatrix()
  
  const pixelRatio = isMobile ? 1 : Math.min(window.devicePixelRatio, 1.5)
  renderer.setPixelRatio(pixelRatio)
  renderer.setSize(container.clientWidth, container.clientHeight)
}

// Optimized animation loop
const animate = (currentTime = 0) => {
  if (!isMounted || !isVisible) {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }
    return
  }
  
  animationFrameId = requestAnimationFrame(animate)
  
  // FPS calculation
  frameCount++
  if (currentTime - lastFPSUpdate >= 1000) {
    currentFPS.value = (frameCount * 1000) / (currentTime - lastFPSUpdate)
    frameCount = 0
    lastFPSUpdate = currentTime
  }
  
  // Frame limiting based on device capability
  const deltaTime = currentTime - lastFrameTime
  if (deltaTime < performanceConfig.frameTime) return
  
  lastFrameTime = currentTime - (deltaTime % performanceConfig.frameTime)
  
  // Update animations
  if (mixer && clock) {
    const delta = clock.getDelta()
    mixer.update(delta)
  }
  
  // Update controls
  if (controls) {
    controls.update()
  }
  
  // Render scene
  if (renderer && scene && camera) {
    renderer.render(scene, camera)
  }
}

// Cleanup Three.js resources
const cleanupThreeJS = () => {
  // Stop animation
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
  
  // Remove observers
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  
  if (intersectionObserver) {
    intersectionObserver.disconnect()
    intersectionObserver = null
  }
  
  // Clean up Three.js
  if (controls) {
    controls.dispose()
    controls = null
  }
  
  if (mixer) {
    mixer.stopAllAction()
    mixer.uncacheRoot(mixer.getRoot())
    mixer = null
  }
  
  if (model) {
    model.traverse((child) => {
      if (child.isMesh) {
        if (child.geometry) {
          child.geometry.dispose()
        }
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => mat.dispose())
          } else {
            child.material.dispose()
          }
        }
      }
    })
    model = null
  }
  
  if (scene) {
    while(scene.children.length > 0) {
      const object = scene.children[0]
      scene.remove(object)
    }
    scene = null
  }
  
  if (renderer) {
    renderer.dispose()
    renderer.forceContextLoss()
    
    // Remove canvas from DOM
    const canvas = renderer.domElement
    if (canvas && canvas.parentNode) {
      canvas.parentNode.removeChild(canvas)
    }
    renderer = null
  }
  
  camera = null
  clock = null
  
  // Remove window event listeners
  window.removeEventListener('resize', onWindowResize)
}

// Cleanup everything
const cleanup = () => {
  cleanupThreeJS()
}

// Component lifecycle
onMounted(async () => {
  isMounted = true
  
  if (process.client) {
    // Initialize AOS with lazy loading
    try {
      const AOS = await import('aos')
      AOS.default?.init?.({
        duration: 800,
        once: true,
        offset: 50,
        delay: 50,
        easing: 'ease-out-cubic',
        disable: window.innerWidth < 768
      })
    } catch (e) {
      console.warn('AOS not available, continuing without animations')
    }
    
    await nextTick()
    
    // Start loading model after component is mounted
    if (modelContainer.value) {
      loadingState.value = 'loading'
      // Small delay to ensure DOM is ready and prioritize other content
      setTimeout(() => {
        if (isMounted && loadingState.value === 'loading') {
          loadModel()
        }
      }, 500)
    }
    
    // Debug shortcut (Ctrl+Alt+D)
    window.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.altKey && e.key === 'd') {
        showDebug.value = !showDebug.value
        e.preventDefault()
      }
    })
  }
})

onBeforeUnmount(() => {
  isMounted = false
  cleanup()
  
  // Remove debug shortcut listener
  if (process.client) {
    window.removeEventListener('keydown', (e) => {
      if (e.ctrlKey && e.altKey && e.key === 'd') {
        showDebug.value = !showDebug.value
      }
    })
  }
})
</script>
  
<style scoped>
/* Optimized CSS for performance */
section {
  contain: content;
  content-visibility: auto;
  contain-intrinsic-size: 800px;
}

/* Hardware acceleration for 3D container */
.model-container {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000;
  transform-style: preserve-3d;
  will-change: transform;
  isolation: isolate;
}

/* Optimized transitions */
.transition-all {
  transition-property: transform, opacity, box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Reduce motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  .transition-all,
  .transform,
  .animate-spin,
  .group-hover\:rotate-3 {
    transition: none !important;
    animation: none !important;
    transform: none !important;
  }
  
  section [data-aos] {
    opacity: 1 !important;
    transform: none !important;
  }
}

/* Optimize animations for mobile */
@media (max-width: 768px) {
  .model-container {
    transform: translate3d(0, 0, 0);
  }
  
  /* Reduce shadow complexity on mobile */
  .shadow-xl {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
}

/* Performance optimizations */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

/* Optimize image rendering */
img, canvas {
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}
</style>