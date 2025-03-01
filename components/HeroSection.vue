<template>
  <section class="pt-32 pb-20 px-6 min-h-screen">
    <div class="container mx-auto text-center">
      <h1 class="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
        Your Gadget<br>
        <span class="text-purple-400">Hidupkan Kembali Gadget Kesayangan Anda!</span>
      </h1>
      <p class="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
        Kami hadir dengan perbaikan profesional & aksesori premium untuk membuat perangkat Anda kembali prima. Karena setiap gadget layak mendapatkan kesempatan kedua! 
      </p>
      <button class="bg-purple-500 hover:bg-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-transform transform hover:scale-105">
        Hubungi Sekarang
      </button>
    </div>
  </section>
</template>

<script setup>
import { gsap } from 'gsap'

onMounted(() => {
  gsap.from('h1, p, button', {
    duration: 1,
    y: 50,
    opacity: 0,
    stagger: 0.3,
    ease: 'power3.out'
  })
})
</script>