// composables/useProductFileUpload.ts
export interface UploadedFile {
  fileName: string   // nama file di server, contoh: "abc123.png"
  fileUrl: string    // path relatif atau full URL dari API
}

export interface FileUploadResponse {
  success: boolean
  files: UploadedFile[]
  message: string
}

export const useProductFileUpload = () => {
  const config = useRuntimeConfig()
  const auth = useAuthStore()

  const apiBase = config.public.apiBase || 'http://localhost:5084/api/v1'

  const authHeader = () => ({
    Authorization: `Bearer ${auth.token}`,
  })

  const uploadFile = async (file: File): Promise<FileUploadResponse> => {
    const formData = new FormData()
    formData.append('file', file)

    return await $fetch<FileUploadResponse>(`${apiBase}/files/upload`, {
      method: 'POST',
      headers: authHeader(),
      body: formData,
    })
  }

  const uploadMultipleFile = async (
    files: File[],
  ): Promise<FileUploadResponse> => {
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))

    return await $fetch<FileUploadResponse>(`${apiBase}/files/upload-multiple`, {
      method: 'POST',
      headers: authHeader(),
      body: formData,
    })
  }

  // Hapus image yang SUDAH tersimpan di DB (dipakai di halaman edit)
  const deleteFile = async (fileName: string): Promise<void> => {
    await $fetch(`${apiBase}/files/images/${fileName}`, {
      method: 'DELETE',
      headers: authHeader(),
    })
  }

  // Hapus image TEMP (baru upload, product belum disubmit)
  const deleteTempFile = async (fileName: string): Promise<void> => {
    await $fetch(`${apiBase}/files/temp-images/${fileName}`, {
      method: 'DELETE',
      headers: authHeader(),
    })
  }

  // Terima fileName, kembalikan URL lengkap untuk img src
  const getFileUrl = (fileName: string | undefined): string => {
    if (!fileName) return ''
    // Untuk sekarang, kita tetap pakai endpoint GET, boleh juga langsung /uploads/products
    return `${apiBase}/files/images/${fileName}`
  }

  return {
    uploadFile,
    uploadMultipleFile,
    deleteFile,
    deleteTempFile,
    getFileUrl,
  }
}
