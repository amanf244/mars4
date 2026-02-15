export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const router = useRouter()

  if (!config.public.gaId) return

  const script = document.createElement('script')
  script.src = `https://www.googletagmanager.com/gtag/js?id=${config.public.gaId}`
  script.async = true

  script.onload = () => {
    window.dataLayer = window.dataLayer || []

    function gtag(...args: any[]) {
      window.dataLayer.push(args)
    }

    window.gtag = gtag

    window.gtag('js', new Date())
    window.gtag('config', config.public.gaId)

    // SPA tracking
    router.afterEach((to) => {
      window.gtag('config', config.public.gaId, {
        page_path: to.fullPath,
      })
    })
  }

  document.head.appendChild(script)
})
