// nuxt.config.ts
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  
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
    }
  },
  
  build: {
    transpile: ['gsap', 'three'],
  },
  
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxtjs/leaflet',
    '@nuxt/icon',
    '@nuxtjs/color-mode'  // Add this
  ],
  
  // Color Mode Configuration
  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: '',
  },
  
  // ui: {
  //   primary: 'blue',
  //   gray: 'slate'
  // },
  
  ssr: true,
  
  experimental: {
    payloadExtraction: false,
    renderJsonPayloads: true,
  }
})
