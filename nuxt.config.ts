import tailwindcss from "@tailwindcss/vite"

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  future: {
    compatibilityVersion: 4,
  },

  // ✅ Runtime Config untuk API
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:5084/api',
      apiVersion: '/v1',
    }
  },

  plugins: [
    '~/plugins/auth-init.client.ts'
  ],

  // ✅ SSR ENABLED (default)
  ssr: true,

  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  // ✅ Hapus nitro dan app config yang terkait Tauri
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
        pathPrefix: false,  // ✅ Jangan pakai prefix
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
