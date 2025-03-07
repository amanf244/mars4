<template>
  <section id="services" class="py-20 px-6 bg-black/20">
    <h2 class="text-4xl font-bold text-white text-center mb-12 opacity-0 services-title">
      Layanan Kami
    </h2>
    <div class="container mx-auto grid md:grid-cols-3 gap-12">
      <div 
        v-for="(service, index) in services" 
        :key="index" 
        class="service-card opacity-0 translate-y-8 p-8 bg-gray-800 rounded-xl transform transition duration-300 flex items-start gap-6"
      >
        <!-- Icon Container -->
        <div class="text-gray-400 text-4xl flex-shrink-0 icon-container">
          <component 
            :is="service.icon" 
            class="h-12 w-12 transform transition-all duration-300"
          />
        </div>

        <!-- Text Container -->
        <div class="flex-1">
          <h3 class="text-xl font-bold text-white mb-3">{{ service.title }}</h3>
          <p class="text-gray-400">{{ service.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onMounted, onUnmounted } from 'vue'

const props = defineProps(['services'])

let ctx, hoverAnimations = []

const initAnimations = () => {
  ctx = gsap.context(() => {
    // Title animation
    gsap.from('.services-title', {
      scrollTrigger: {
        trigger: '#services',
        start: 'top 80%'
      },
      opacity: 0,
      y: 40,
      duration: 1,
      ease: 'power3.out'
    })

    // Card stagger animation
    gsap.fromTo('.service-card', 
      {
        opacity: 0,
        y: 40
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.3,
        ease: 'back.out(1.2)',
        scrollTrigger: {
          trigger: '#services',
          start: 'top 80%'
        }
      }
    )

    // Hover animations for icons
    document.querySelectorAll('.icon-container').forEach((icon, index) => {
      const animation = gsap.to(icon, {
        paused: true,
        scale: 1.2,
        rotate: () => gsap.utils.random(-10, 10),
        duration: 0.4,
        ease: 'power2.out'
      })

      icon.addEventListener('mouseenter', () => animation.play())
      icon.addEventListener('mouseleave', () => animation.reverse())
      
      hoverAnimations.push(animation)
    })
  })
}

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)
  initAnimations()
})

onUnmounted(() => {
  ctx && ctx.revert()
  hoverAnimations.forEach(anim => anim.kill())
})
</script>

<style scoped>
.service-card {
  will-change: transform, opacity;
}

.icon-container {
  transition: filter 0.3s ease;
}

.service-card:hover .icon-container {
  filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.5));
}
</style>