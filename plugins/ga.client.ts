// plugins/ga.client.ts
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const gaId = config.public.gaId

  if (!gaId) return

  // Inisialisasi dataLayer dan gtag
  window.dataLayer = window.dataLayer || []
  window.gtag = function (...args: any[]) {
    window.dataLayer.push(args)
  }

  // Load script GA
  const script = document.createElement('script')
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
  script.async = true
  document.head.appendChild(script)

  // Kirim pageview awal
  window.gtag('js', new Date())
  window.gtag('config', gaId, { send_page_view: true })

  // Track navigasi SPA
  const router = useRouter()
  router.afterEach((to) => {
    window.gtag('config', gaId, { page_path: to.fullPath })
  })
})