// utils/image.ts
export const getImageUrl = (fileName: string | null | undefined) => {
  if (!fileName) return ''

  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase || 'http://localhost:5084/api/v1'
  const apiRoot = apiBase.replace(/\/api\/v1\/?$/, '')

  return `${apiRoot}/uploads/products/${fileName}`
}
