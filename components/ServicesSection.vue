<template>
  <section id="services" class="py-20 px-6 bg-black/20">
    <h2 class="text-4xl font-bold text-white text-center mb-12">Layanan Kami</h2>
    <div class="container mx-auto grid md:grid-cols-3 gap-12">
      <div 
        v-for="(service, index) in services" 
        :key="index" 
        class="service-card p-8 bg-gray-800 rounded-xl transform hover:-translate-y-2 transition duration-300 flex items-start gap-6"
      >
        <!-- Icon Container -->
        <div class="text-gray-400 text-4xl flex-shrink-0">
          <component 
            :is="service.icon" 
            class="h-12 w-12 transform transition-all duration-300 hover:scale-125"
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
//import { ScrollTrigger } from 'gsap/ScrollTrigger'

const props = defineProps(['services'])

onMounted(() => {
  gsap.from('.service-card', {
    scrollTrigger: {
      trigger: '#services',
      start: 'top center'
    },
    opacity: 1,
    y: 0,
    stagger: 0.2,
    duration: 1
  })
})
</script>

<style scoped>
.service-card:hover .text-4xl {
  animation: bounce 0.8s ease infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
</style>