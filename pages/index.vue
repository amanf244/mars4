<template>
    <!-- <div class="min-h-screen bg-gradient-to-b from-gray-900 to-purple-900"> -->
    <div class="min-h-screen bg-gray-900">
      <Navbar />
      <HeroSection />
      <ServicesSection :services="services" />
      <!-- <ProductsSection :products="products" /> -->
      <GallerySection />
      <AboutSection />
      <CtaSection />
    </div>
  </template>
  
  <script setup>
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
  
  const services = [
  { 
    icon: DevicePhoneMobileIcon,
    title: 'Ganti Layar',
    description: 'Layar berkualitas premium dengan garansi resmi'
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