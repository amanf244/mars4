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

  const apiUrl = config.public.apiUrl || 'http://localhost:5084'

  const uploadFile = async (file: File): Promise<FileUploadResponse> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await $fetch<FileUploadResponse>(`${apiUrl}/api/v1/files/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${auth.token}`
      },
      body: formData
    })

    return response
  }

  const uploadMultipleFile = async (
    files: File[]
  ): Promise<FileUploadResponse> => {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file)
    })

    return await $fetch<FileUploadResponse>(
      `${apiUrl}/api/v1/files/upload-multiple`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${auth.token}`
        },
        body: formData
      }
    )
  }

  // Delete berdasarkan NAMA FILE (bukan URL)
  const deleteFile = async (fileName: string): Promise<void> => {
    await $fetch(`${apiUrl}/api/v1/files/images/${fileName}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    })
  }

  // Terima fileName, kembalikan URL lengkap untuk img src
  const getFileUrl = (fileName: string | undefined): string => {
    if (!fileName) return ''

    // URL final: {apiUrl}/api/v1/files/images/{fileName}
    return `${apiUrl}/api/v1/files/images/${fileName}`
  }

  return {
    uploadFile,
    uploadMultipleFile,
    deleteFile,
    getFileUrl
  }
}
