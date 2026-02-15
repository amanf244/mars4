export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const router = useRouter()

  if (!config.public.gaId) return

  // Load GA script
  const script = document.createElement('script')
  script.src = `https://www.googletagmanager.com/gtag/js?id=${config.public.gaId}`
  script.async = true
  document.head.appendChild(script)

  // Init dataLayer
  window.dataLayer = window.dataLayer || []

  window.gtag = function (...args: any[]) {
    window.dataLayer.push(args)
  }

  window.gtag('js', new Date())
  window.gtag('config', config.public.gaId)

  // Track SPA navigation
  router.afterEach((to) => {
    window.gtag('config', config.public.gaId, {
      page_path: to.fullPath,
    })
  })
})
