export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  site: {
    url: 'https://mars4.my.id',
    name: 'Mars4',
    description: 'Jual sparepart dan jasa service elektronik di Serang, Banten. Melayani perbaikan smartphone, laptop, dan perangkat elektronik.',
    defaultLocale: 'id',
    identity: {
      type: 'Organization',
      logo: 'https://mars4.my.id/logo.png'  // opsional, ganti dengan logo asli
    }
  },

  sitemap: {
    sources: ['/api/__sitemap__/urls']
  },
  
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:5084/api/v1',
      appName: process.env.NUXT_PUBLIC_APP_NAME || 'Mars4',
      appVersion: process.env.NUXT_PUBLIC_APP_VERSION || '1.0.0',
      authEndpoint: process.env.NUXT_PUBLIC_AUTH_ENDPOINT || '/auth',
      tokenKey: process.env.NUXT_PUBLIC_TOKEN_KEY || 'mars4_token',
      refreshTokenKey: process.env.NUXT_PUBLIC_REFRESH_TOKEN_KEY || 'mars4_refresh_token',
      gaID: process.env.NUXT_PUBLIC_GA_ID
    }
  },

  build: {
    transpile: ['gsap', 'three']
  },

  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxtjs/leaflet',
    '@nuxt/icon',
    '@nuxtjs/color-mode',
    '@nuxtjs/seo'
  ],

  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: ''
  },

  ssr: true,

  experimental: {
    payloadExtraction: false,
    renderJsonPayloads: true
  }
})