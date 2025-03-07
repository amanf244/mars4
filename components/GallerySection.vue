<template>
    <section id="gallery" class="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-3xl font-bold text-white mb-12 text-center">
          <span class="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
            Hasil Pekerjaan Kami
          </span>
        </h2>
  
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <div 
            v-for="(item, index) in galleryItems" 
            :key="index"
            class="group relative overflow-hidden rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <img 
              :src="item.image" 
              :alt="item.caption"
              class="w-full h-64 object-cover transform transition-all duration-300 group-hover:brightness-75"
            />
            <div class="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p class="text-white text-sm font-medium">{{ item.caption }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  import { onMounted } from 'vue'
  import { gsap } from 'gsap'
  
  const galleryItems = [
    { 
      image: 'https://picsum.photos/400/300?random=1',
      caption: 'Penggantian Layar iPhone'
    },
    { 
      image: 'https://picsum.photos/400/300?random=2',
      caption: 'Reparasi Port Charging'
    },
    { 
      image: 'https://picsum.photos/400/300?random=3',
      caption: 'Pembersihan Internal'
    },
    { 
      image: 'https://picsum.photos/400/300?random=4',
      caption: 'Penggantian Baterai'
    },
    { 
      image: 'https://picsum.photos/400/300?random=5',
      caption: 'Reparasi Kamera'
    },
    { 
      image: 'https://picsum.photos/400/300?random=6',
      caption: 'Pemulihan Data'
    },
    { 
      image: 'https://picsum.photos/400/300?random=7',
      caption: 'Update Software'
    },
    { 
      image: 'https://picsum.photos/400/300?random=8',
      caption: 'Perbaikan Speaker'
    }
  ]
  
  onMounted(() => {
    // gsap.utils.toArray('.gallery-group').forEach((item, i) => {
    //   gsap.from(item, {
    //     scrollTrigger: {
    //       trigger: item,
    //       start: "top center+=100"
    //     },
    //     opacity: 0,
    //     y: 50,
    //     duration: 0.8,
    //     delay: i * 0.1
    //   })
    // })
    gsap.fromTo('.group', 
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
          trigger: '#gallery',
          start: 'top center+=100'
        }
      }
    )
  })
  </script>