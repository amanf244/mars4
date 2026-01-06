import tailwindcss from "@tailwindcss/vite";


const isTauri = process.env.TAURI === 'true';
console.log('🔧 Tauri Environment Check:');
console.log('TAURI env:', process.env.TAURI);
console.log('isTauri:', isTauri);

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

   runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:5084/api'
    }
  },

  ssr: !isTauri,

  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  nitro: isTauri
    ? { preset: 'static' }
    : undefined,

  app: isTauri
    ? { baseURL: './' }
    : undefined,

  build: {
    transpile: ['gsap', 'three'],
  },

  vite: {
    plugins: [tailwindcss()],
  },

  modules: ['@pinia/nuxt', '@nuxtjs/leaflet', '@nuxt/icon'],
})
