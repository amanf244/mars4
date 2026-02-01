<script setup lang="ts">
import type { CaseStudiesItem, CaseStudiesListData } from '~/types/caseStudies'

definePageMeta({
  layout: 'dashboard',
  requiresAuth: true,
  middleware: 'admin',
})

const router = useRouter()
const toast = useToast()
const caseStudies = useCaseStudies()

const currentPage = ref(1)
const selectedCategory = ref('')
const searchQuery = ref('')
const isLoading = ref(false)
const isDeleting = ref(false)
const deleteModalOpen = ref(false)
const selectedItem = ref<CaseStudiesItem | null>(null)

const data = ref<CaseStudiesListData | null>(null)

const categories = computed(() => data.value?.meta.categories || [])

const filteredItems = computed(() => data.value?.items || [])

const fetchData = async () => {
  isLoading.value = true
  try {
    const result = await caseStudies.list({
      page: currentPage.value,
      category: selectedCategory.value || undefined,
      search: searchQuery.value || undefined,
      status: 'all',
      limit: 10
    })

    data.value = result ?? null
  } catch (err: any) {
    toast.add({
      title: 'Error',
      description: err?.message || 'Failed to load case studies',
      color: 'error',
      icon: 'i-heroicons-x-circle'
    })
  } finally {
    isLoading.value = false
  }
}


const handleDelete = (item: CaseStudiesItem) => {
  selectedItem.value = item
  deleteModalOpen.value = true
}

const confirmDelete = async () => {
  if (!selectedItem.value) return
  
  isDeleting.value = true
  try {
    await caseStudies.deleteItem(selectedItem.value.id)
    
    toast.add({
      title: 'Success',
      description: 'Case study deleted successfully',
      color: 'success',
      icon: 'i-heroicons-check-circle'
    })
    
    deleteModalOpen.value = false
    selectedItem.value = null
    await fetchData()
  } catch (err: any) {
    toast.add({
      title: 'Error',
      description: err?.message || 'Failed to delete case study',
      color: 'error',
      icon: 'i-heroicons-x-circle'
    })
  } finally {
    isDeleting.value = false
  }
}

const getStatusBadgeColor = (status: string) => {
  const colors: Record<string, string> = {
    'published': 'success',
    'draft': 'warning',
    'archived': 'gray'
  }
  return colors[status] || 'gray'
}

const getComplexityColor = (level: string) => {
  const colors: Record<string, string> = {
    'rendah': 'info',
    'sedang': 'warning',
    'tinggi': 'error'
  }
  return colors[level] || 'gray'
}

const goToEdit = (id: number) => {
  navigateTo(`/dashboard/admin/case-studies/${id}/edit`)
}

const rows = computed<CaseStudiesItem[]>(() => {
  return data.value?.items ?? []
})
const columns = [
  { accessorKey: 'title', header: 'Title' },
  { accessorKey: 'category', header: 'Category' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'complexityLevel', header: 'Complexity' },
  { accessorKey: 'date', header: 'Date' },
  { id: 'actions', header: 'Actions' }
]


const goToCreate = () => {
  navigateTo('/dashboard/admin/case-studies/create')
}


watch([currentPage, selectedCategory, searchQuery], () => {
  fetchData()
}, { immediate: true })
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Case Studies</h1>
        <p class="text-slate-600 dark:text-slate-400">Manage your case studies and portfolio items</p>
      </div>
      <UButton 
        @click="goToCreate"
        icon="i-heroicons-plus"
        size="lg"
        color="info"
      >
        New Case Study
      </UButton>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-slate-800 rounded-lg p-6 space-y-4 border border-slate-200 dark:border-slate-700">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UFormGroup label="Search" size="sm">
          <UInput 
            v-model="searchQuery"
            placeholder="Search by title, caption..."
            icon="i-heroicons-magnifying-glass"
            :disabled="isLoading"
          />
        </UFormGroup>

        <UFormGroup label="Category" size="sm">
          <USelect 
            v-model="selectedCategory"
            :options="categories"
            placeholder="All categories"
            clearable
            :disabled="isLoading"
          />
        </UFormGroup>

        <div class="flex items-end">
          <UButton 
            @click="fetchData"
            variant="outline"
            :disabled="isLoading"
            class="w-full"
            icon="i-heroicons-arrow-path"
          >
            Refresh
          </UButton>
        </div>
      </div>
    </div>

    <!-- Table -->
    <UTable
  :rows="rows"
  :columns="columns"
  :loading="isLoading"
  :empty-state="{
    icon: 'i-heroicons-folder-open',
    title: 'No case studies',
    description: 'Create your first case study to get started'
  }"
/>


    <!-- Pagination -->
    <div v-if="data?.meta && data.meta.lastPage > 1" class="flex items-center justify-between bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
      <div class="text-sm text-slate-600 dark:text-slate-400">
        Showing {{ (currentPage - 1) * 10 + 1 }} to {{ Math.min(currentPage * 10, data.meta.total) }} of {{ data.meta.total }} results
      </div>
      <div class="flex gap-2">
        <UButton 
          @click="currentPage = Math.max(1, currentPage - 1)"
          :disabled="currentPage === 1 || isLoading"
          variant="outline"
          icon="i-heroicons-chevron-left"
        >
          Previous
        </UButton>
        <UButton 
          @click="currentPage = Math.min(data.meta.lastPage, currentPage + 1)"
          :disabled="currentPage === data.meta.lastPage || isLoading"
          variant="outline"
          icon="i-heroicons-chevron-right"
        >
          Next
        </UButton>
      </div>
    </div>

    <!-- Delete Modal -->
    <UModal v-model="deleteModalOpen">
      <div class="p-6 space-y-4">
        <div class="flex items-center gap-3">
          <UIcon name="i-heroicons-exclamation-triangle" class="w-6 h-6 text-red-500" />
          <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Delete Case Study</h3>
        </div>
        
        <p class="text-slate-600 dark:text-slate-400">
          Are you sure you want to delete <strong>"{{ selectedItem?.title }}"</strong>? This action cannot be undone.
        </p>

        <div class="flex gap-3 pt-4">
          <UButton 
            @click="deleteModalOpen = false"
            variant="outline"
            class="flex-1"
            :disabled="isDeleting"
          >
            Cancel
          </UButton>
          <UButton 
            @click="confirmDelete"
            color="error"
            class="flex-1"
            :loading="isDeleting"
            icon="i-heroicons-trash"
          >
            Delete
          </UButton>
        </div>
      </div>
    </UModal>
  </div>
</template>
