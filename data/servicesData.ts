// ~/data/servicesData.ts
import { defineComponent, h } from 'vue'

// Komponen icon sederhana (bisa diganti dengan library icon seperti Heroicons)
const RepairIcon = defineComponent({
  setup() {
    return () => h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      class: 'h-6 w-6',
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
      }),
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z'
      })
    ])
  }
})

const ScreenIcon = defineComponent({
  setup() {
    return () => h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      class: 'h-6 w-6',
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
      })
    ])
  }
})

const BatteryIcon = defineComponent({
  setup() {
    return () => h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      class: 'h-6 w-6',
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M13 10V3L4 14h7v7l9-11h-7z'
      })
    ])
  }
})

const ChipIcon = defineComponent({
  setup() {
    return () => h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      class: 'h-6 w-6',
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z'
      })
    ])
  }
})

const SoftwareIcon = defineComponent({
  setup() {
    return () => h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      class: 'h-6 w-6',
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4'
      })
    ])
  }
})

const UpgradeIcon = defineComponent({
  setup() {
    return () => h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      class: 'h-6 w-6',
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M13 10V3L4 14h7v7l9-11h-7z'
      })
    ])
  }
})

export interface ServicePlan {
  name: string
  price: string
  features: string
  discount?: string
}

export interface Service {
  title: string
  description: string
  icon: any // Komponen Vue untuk icon
  startingPrice?: string
  plans: ServicePlan[]
  features: string[]
  rating?: number
}

// Data layanan repair dengan icon
export const servicesData: Service[] = [
  {
    title: 'Ganti Layar',
    description: 'Perbaikan dan penggantian layar smartphone/laptop dengan berbagai tipe.',
    icon: ScreenIcon,
    startingPrice: 'Rp 150.000',
    plans: [
      { name: 'Standar', price: 'Rp 150.000', features: 'Layar LCD standar, cek touchscreen' },
      { name: 'Premium', price: 'Rp 250.000 - 350.000', features: 'Layar kualitas tinggi, kalibrasi warna, cek touchscreen' },
      { name: 'OLED', price: 'Rp 600.000 - 2.000.000', features: 'Layar OLED original, kalibrasi warna, proteksi anti-gores' }
    ],
    features: [
      'Diagnosa layar & touchscreen',
      'Suku cadang original',
      'Perbaikan cepat & aman',
      'Garansi 7 hari'
    ],
    rating: 5
  },
  {
    title: 'Ganti Baterai',
    description: 'Penggantian baterai smartphone/laptop dengan kualitas terbaik.',
    icon: BatteryIcon,
    startingPrice: 'Rp 100.000',
    plans: [
      { name: 'Standar', price: 'Rp 150.000', features: 'Baterai standar' },
      { name: 'Double Power', price: 'Rp 200.000', features: 'Baterai original & fast charging' }
    ],
    features: [
      'Cek kondisi baterai',
      'Suku cadang original',
      'Perbaikan cepat & aman',
      'Garansi 30 hari'
    ],
    rating: 5
  },
  {
    title: 'Servis Motherboard',
    description: 'Perbaikan masalah motherboard dan komponen internal laptop/smartphone.',
    icon: ChipIcon,
    startingPrice: 'Rp 300.000',
    plans: [
      { name: 'Diagnosa & Minor', price: 'Rp 300.000 - 500.000', features: 'Pembersihan & solder minor' },
      { name: 'Major', price: 'Rp 500.000 - 1.500.000', features: 'Perbaikan/replace komponen utama' }
    ],
    features: [
      'Cek kerusakan secara menyeluruh',
      'Penggantian komponen asli',
      'Perbaikan cepat & aman',
      'Garansi 30 hari'
    ],
    rating: 4
  },
  {
    title: 'Software & Optimasi',
    description: 'Perbaikan software, instal ulang OS, dan optimasi performa perangkat.',
    icon: SoftwareIcon,
    startingPrice: 'Rp 100.000',
    plans: [
      { name: 'Dasar', price: 'Rp 100.000', features: 'Instal ulang OS & update driver' },
      { name: 'Lanjutan', price: 'Rp 200.000 - 400.000', features: 'Optimasi performa, backup & restore data' }
    ],
    features: [
      'Backup data penting',
      'Instal ulang & update software',
      'Optimasi sistem & performa',
      'Garansi 7 hari'
    ],
    rating: 5
  },
  {
    title: 'Upgrade Hardware',
    description: 'Upgrade RAM, SSD, atau komponen laptop/smartphone untuk performa lebih baik.',
    icon: UpgradeIcon,
    startingPrice: 'Rp 150.000',
    plans: [
      { name: 'RAM', price: 'Rp 150.000 - 500.000', features: 'Upgrade kapasitas RAM sesuai tipe perangkat' },
      { name: 'SSD', price: 'Rp 400.000 - 1.500.000', features: 'Upgrade SSD & cloning data' },
      { name: 'Lainnya', price: 'Rp 200.000 - 2.000.000', features: 'Upgrade komponen tambahan lain' }
    ],
    features: [
      'Pemasangan komponen asli & kompatibel',
      'Backup & restore data jika perlu',
      'Perbaikan cepat & aman',
      'Garansi 30 hari'
    ],
    rating: 5
  }
]