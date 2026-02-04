const config = useRuntimeConfig()
const apiBase = config.public.apiBase || 'http://localhost:5084/api/v1'
const getImageUrl = (fileName: string | null | undefined) => {
  if (!fileName) return ''
  // backend serve di: http://localhost:5084/uploads/products/<fileName>
  return `${apiBase.replace(/\/api\/v1\/?$/, '')}/uploads/products/${fileName}`
  // return `http://localhost:5084/uploads/products/${fileName}`
}


export { getImageUrl }