import tailwindcss from "@tailwindcss/vite"

const isTauri = process.env.TAURI === 'true'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  future: {
    compatibilityVersion: 4,
  },

  // ✅ LANGSUNG KE BACKEND ASP.NET
  runtimeConfig: {
    // Server-side (tidak dipakai karena client langsung call backend)
    apiBase: process.env.API_BASE || 'http://localhost:5084/api',
    public: {
      // Client-side - PENTING: Full URL ke backend ASP.NET
      apiBase: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:5084/api/v1'
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
