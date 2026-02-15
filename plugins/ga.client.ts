export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const router = useRouter()

  if (!config.public.gaId) return

  // Inject script
  const script = document.createElement('script')
  script.src = `https://www.googletagmanager.com/gtag/js?id=${config.public.gaId}`
  script.async = true
  document.head.appendChild(script)

  // Setup global function (SEBELUM script load)
  window.dataLayer = window.dataLayer || []
  function gtag(...args: any[]) {
    window.dataLayer.push(args)
  }
  window.gtag = gtag

  gtag('js', new Date())
  gtag('config', config.public.gaId, {
    send_page_view: true
  })

  // Track SPA navigation
  router.afterEach((to) => {
    window.gtag('config', config.public.gaId, {
      page_path: to.fullPath,
    })
  })
})
