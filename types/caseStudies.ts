// types/caseStudies.ts

export interface CaseStudiesPhoto {
  url: string
  caption: string
}

export interface CaseStudiesProcessStep {
  title: string
  description: string
}

export interface CreateCaseStudiesPayload {
  title: string
  caption: string
  text: string
  fullText: string
  photos?: CaseStudiesPhoto[]
  category: string
  date: string
  duration: string
  status: 'published' | 'draft' | 'archived'
  toolsUsed?: string[]
  processSteps?: CaseStudiesProcessStep[]
  complexityLevel: 'rendah' | 'sedang' | 'tinggi'
  tags: string
}

export interface CaseStudiesItem extends CreateCaseStudiesPayload {
  id: number
  createdAt?: string
  updatedAt?: string
}

export interface CaseStudiesMeta {
  total: number
  perPage: number
  currentPage: number
  lastPage: number
  firstPage: number
  firstPageUrl?: string
  lastPageUrl?: string
  nextPageUrl?: string
  previousPageUrl?: string
  categories: string[]
}

export interface CaseStudiesListData {
  items: CaseStudiesItem[]
  meta: CaseStudiesMeta
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
}
