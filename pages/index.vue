<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Tampilkan loading state saat isLoading true -->
    <div v-if="isLoading" class="flex justify-center items-center h-screen">
      <!-- Anda dapat mengganti teks ini dengan komponen spinner yang lebih menarik -->
      <div class="text-white text-xl">Loading...</div>
    </div>
    <!-- Tampilkan konten utama setelah loading selesai -->
    <div v-else>
      <Navbar />
      <HeroSection />
      <ServicesSection :services="services" />
      <AboutSection />
      <GallerySection />
      <CtaSection />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Import ikon dari Heroicons
import {
  DevicePhoneMobileIcon,
  Battery100Icon,
  CloudArrowDownIcon,
  WrenchScrewdriverIcon,
  CpuChipIcon,
  CameraIcon,
  ShieldCheckIcon,
  SpeakerWaveIcon,
  BoltSlashIcon,
  CommandLineIcon,
  GlobeAltIcon
} from '@heroicons/vue/24/outline'

gsap.registerPlugin(ScrollTrigger)

// Variabel untuk loading state
const isLoading = ref(true)

onMounted(() => {
  // Pilihan 1: Gunakan event 'load' untuk memastikan semua aset telah terunduh
  // window.addEventListener('load', () => {
  //   isLoading.value = false
  // })
  isLoading.value = false

  // Pilihan 2: Jika Anda ingin mensimulasikan dengan delay
  // setTimeout(() => {
  //   isLoading.value = false
  // }, 2000)
})

const services = [
  { 
    icon: DevicePhoneMobileIcon,
    title: 'Ganti Layar',
    description: 'Layar berkualitas premium dengan garansi resmi',
    startingPrice: '150K'
  },
  { 
    icon: Battery100Icon,
    title: 'Perbaikan Baterai',
    description: 'Baterai original untuk daya tahan lebih lama'
  },
  { 
    icon: CloudArrowDownIcon,
    title: 'Kerusakan Air',
    description: 'Penanganan profesional kerusakan cairan'
  },
  { 
    icon: WrenchScrewdriverIcon,
    title: 'Servis Umum',
    description: 'Perawatan menyeluruh untuk perangkat'
  },
  { 
    icon: CpuChipIcon,
    title: 'Perbaikan Motherboard',
    description: 'Perbaikan komponen inti dan sirkuit perangkat'
  },
  { 
    icon: CameraIcon,
    title: 'Perbaikan Kamera',
    description: 'Servis modul kamera dan fokus utama'
  },
  { 
    icon: BoltSlashIcon,
    title: 'Port Charging',
    description: 'Perbaikan port pengisian daya dan wireless charging'
  },
  { 
    icon: ShieldCheckIcon,
    title: 'Pemulihan Data',
    description: 'Penyelamatan data penting dari perangkat rusak'
  },
  { 
    icon: SpeakerWaveIcon,
    title: 'Speaker & Mikrofon',
    description: 'Perbaikan sistem audio dan input suara'
  },
  { 
    icon: CommandLineIcon,
    title: 'Perbaikan Software',
    description: 'Diagnosa dan perbaikan masalah sistem operasi & aplikasi'
  },
  { 
    icon: GlobeAltIcon,
    title: 'Perbaikan lainnya',
    description: 'Penanganan kerusakan perangkat lainnya'
  }
]

const products = [
  { name: 'OLED Display', price: '$99' },
  { name: 'Wireless Charger', price: '$29' },
  { name: 'Protective Case', price: '$15' },
  { name: 'Premium Cables', price: '$12' }
]
</script>
