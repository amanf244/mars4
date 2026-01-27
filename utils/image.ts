const getImageUrl = (fileName: string | null | undefined) => {
  if (!fileName) return ''
  // backend serve di: http://localhost:5084/uploads/products/<fileName>
  return `http://localhost:5084/uploads/products/${fileName}`
}


export { getImageUrl }