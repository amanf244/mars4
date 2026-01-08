import tailwindcss from "@tailwindcss/vite"

const isTauri = process.env.TAURI === 'true'
console.log('🔧 Tauri Environment Check:')
console.log('TAURI env:', process.env.TAURI)
console.log('isTauri:', isTauri)

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  future: {
    compatibilityVersion: 4,
  },

  // ✅ PENTING: Runtime Config untuk API
  runtimeConfig: {
    public: {
      // API Base URL - dari environment variables
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:5084/api',
      // API Version - bisa diubah tanpa hardcode di setiap file
      apiVersion: '/v1',
    }
  },

  plugins: [
    '~/plugins/auth-init.client.ts'
  ],

  ssr: !isTauri,

  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  nitro: isTauri
    ? { preset: 'static' }
    : undefined,

  app: isTauri
    ? { baseURL: './' }
    : {
        layoutTransition: { name: 'layout', mode: 'out-in' },
        pageTransition: { name: 'page', mode: 'out-in' },
      },

  build: {
    transpile: ['gsap', 'three'],
  },

  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ['pinia'],
    },
  },

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/leaflet',
    '@nuxt/icon',
  ],

  components: {
    dirs: [
      {
        path: '~/components',
        pathPrefix: false,
      },
      {
        path: '~/components/admin',
        prefix: 'Admin',
      },
    ],
  },

  imports: {
    dirs: [
      '~/composables',
      '~/composables/**',
    ],
  },
})
