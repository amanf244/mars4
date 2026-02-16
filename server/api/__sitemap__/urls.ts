import { defineSitemapEventHandler } from '#imports'
import { slugify } from '~/utils/slugify'

interface Product {
  id: number
  name: string
  lastUpdatedAt?: string
}

export default defineSitemapEventHandler(async () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase || 'https://api.mars4.my.id/api/v1'

  const response = await $fetch<{
    data: Product[]
  }>(`${apiBase}/products`)

  const products = response?.data ?? []

  console.log('Sitemap - fetched products:', products.length)

  return products.map((p) => ({
    loc: `/products/${p.id}/${slugify(p.name)}`,
    lastmod: p.lastUpdatedAt ?? new Date().toISOString(),
    changefreq: 'daily',
    priority: 0.8,
  }))
})
