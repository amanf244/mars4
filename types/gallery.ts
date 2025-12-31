export interface GalleryPhoto {
  url: string
  caption?: string
}

export interface GalleryItem {
  id: number
  title: string
  caption: string
  text: string
  fullText?: string
  photos: GalleryPhoto[]
  category: string
  date: string
  duration: string
}

export interface LightboxState {
  active: boolean
  photos: GalleryPhoto[]
  currentIndex: number
  title?: string
  caption?: string
  description?: string
}