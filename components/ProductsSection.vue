<template>
    <section id="products" class="py-20 px-6">
      <div class="container mx-auto">
        <h2 class="text-4xl font-bold text-white text-center mb-12">Premium Accessories</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div 
            v-for="(product, index) in products" 
            :key="index" 
            class="product-card bg-gray-800 rounded-xl p-6 hover:shadow-xl transition-shadow"
          >
            <div class="aspect-square bg-gray-700 rounded-lg mb-4"></div>
            <h3 class="text-white font-semibold mb-2">{{ product.name }}</h3>
            <p class="text-purple-400 font-bold">{{ product.price }}</p>
            <button class="mt-4 w-full bg-gray-700 hover:bg-purple-500 text-white py-2 rounded-lg transition">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  import { gsap } from 'gsap'
  import { ScrollTrigger } from 'gsap/ScrollTrigger'
  
  const props = defineProps(['products'])
  
  onMounted(() => {
    gsap.from('.product-card', {
      scrollTrigger: {
        trigger: '#products',
        start: 'top center'
      },
      opacity: 0,
      x: -50,
      stagger: 0.2,
      duration: 1
    })
  })
  </script>