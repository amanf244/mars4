<script setup lang="ts">
import GalleryCard from '@/components/admin/GalleryCard.vue'
import { debounce } from 'lodash-es'

definePageMeta({
 middleware: 'auth',
  requiresAuth: true,
  role: 'admin'
})

// Layout state
const darkMode = ref(false)
const isSidebarCollapsed = ref(false)

// Gallery store
const galleryStore = useGalleryStore()
const authStore = useAuthStore()
const toast = useToast()

// Filter state
const filters = reactive({
  status: 'all',
  search: '',
  category: '',
  page: 1,
  limit: 12,
  sortBy: 'created_at',
  sortOrder: 'desc'
})

// Statistics
const statistics = ref<any>(null)

// Fetch data dengan debounce untuk search
const fetchData = async () => {
  try {
    await galleryStore.fetchGalleryItems({
      ...filters,
      isAdmin: true
    })
  } catch (error) {
    console.error('Failed to fetch gallery items:', error)
  }
}

// Debounced search
const debouncedSearch = debounce(fetchData, 500)

// Watch untuk filter changes
watch(() => filters.search, () => {
  filters.page = 1
  debouncedSearch()
})

watch(() => [filters.status, filters.category, filters.sortBy, filters.sortOrder], () => {
  filters.page = 1
  fetchData()
}, { deep: true })

watch(() => filters.page, fetchData)

watch(() => filters.limit, () => {
  filters.page = 1
  fetchData()
})

// Handle item actions
const handleView = (id: number) => {
  navigateTo(`/admin/gallery/${id}`)
}

const handleEdit = (id: number) => {
  navigateTo(`/admin/gallery/edit/${id}`)
}

const handleDelete = async (id: number) => {
  if (confirm('Are you sure you want to delete this gallery item? This action cannot be undone.')) {
    try {
      await galleryStore.deleteGalleryItem(id)
      toast.success('Gallery item deleted successfully')
    } catch (error) {
      console.error('Failed to delete gallery item:', error)
    }
  }
}

const handlePublish = async (id: number) => {
  try {
    await galleryStore.updateGalleryItem(id, { status: 'published' })
    toast.success('Gallery item published successfully')
  } catch (error) {
    console.error('Failed to publish gallery item:', error)
  }
}

const handleArchive = async (id: number) => {
  try {
    await galleryStore.updateGalleryItem(id, { status: 'archived' })
    toast.success('Gallery item archived successfully')
  } catch (error) {
    console.error('Failed to archive gallery item:', error)
  }
}

// Bulk actions
const selectedItems = ref<number[]>([])
const isBulkActionLoading = ref(false)

const handleSelectAll = () => {
  if (selectedItems.value.length === galleryStore.items.length) {
    selectedItems.value = []
  } else {
    selectedItems.value = galleryStore.items.map(item => item.id!).filter(Boolean)
  }
}

const handleBulkPublish = async () => {
  if (selectedItems.value.length === 0) return
  
  if (confirm(`Publish ${selectedItems.value.length} selected items?`)) {
    isBulkActionLoading.value = true
    try {
      await galleryStore.bulkUpdateStatus(selectedItems.value, 'published')
      selectedItems.value = []
      toast.success('Selected items published successfully')
    } catch (error) {
      console.error('Failed to bulk publish:', error)
    } finally {
      isBulkActionLoading.value = false
    }
  }
}

const handleBulkDelete = async () => {
  if (selectedItems.value.length === 0) return
  
  if (confirm(`Delete ${selectedItems.value.length} selected items? This action cannot be undone.`)) {
    isBulkActionLoading.value = true
    try {
      // Delete items one by one for better error handling
      for (const id of selectedItems.value) {
        await galleryStore.deleteGalleryItem(id)
      }
      selectedItems.value = []
      toast.success('Selected items deleted successfully')
    } catch (error) {
      console.error('Failed to bulk delete:', error)
    } finally {
      isBulkActionLoading.value = false
    }
  }
}

// Fetch statistics
const fetchStatistics = async () => {
  try {
    statistics.value = await galleryStore.getStatistics()
  } catch (error) {
    console.error('Failed to fetch statistics:', error)
  }
}

// Fetch initial data
onMounted(async () => {
  await Promise.all([fetchData(), fetchStatistics()])
  
  // Check screen width for sidebar
  if (process.client && window.innerWidth < 1024) {
    isSidebarCollapsed.value = true
  }
})

// Handle window resize
if (process.client) {
  window.addEventListener('resize', () => {
    if (window.innerWidth < 1024) {
      isSidebarCollapsed.value = true
    }
  })
}
</script>

<template>
  <AdminLayout
    :darkMode="darkMode"
    :isSidebarCollapsed="isSidebarCollapsed"
    :user="authStore.user"
    pageTitle="Gallery Management"
    pageDescription="Manage all repair device galleries"
    @toggleSidebar="isSidebarCollapsed = !isSidebarCollapsed"
    @toggleDarkMode="darkMode = !darkMode"
  >
    <!-- Statistics Cards -->
    <div v-if="statistics" class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <div class="flex items-center">
          <div class="p-3 rounded-lg bg-blue-100 dark:bg-blue-800 mr-4">
            <span class="text-2xl">📊</span>
          </div>
          <div>
            <p class="text-sm text-blue-700 dark:text-blue-300">Total Items</p>
            <p class="text-3xl font-bold text-blue-900 dark:text-white">{{ statistics.total }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl p-6 border border-green-200 dark:border-green-800">
        <div class="flex items-center">
          <div class="p-3 rounded-lg bg-green-100 dark:bg-green-800 mr-4">
            <span class="text-2xl">✅</span>
          </div>
          <div>
            <p class="text-sm text-green-700 dark:text-green-300">Published</p>
            <p class="text-3xl font-bold text-green-900 dark:text-white">{{ statistics.published }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800">
        <div class="flex items-center">
          <div class="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-800 mr-4">
            <span class="text-2xl">📝</span>
          </div>
          <div>
            <p class="text-sm text-yellow-700 dark:text-yellow-300">Draft</p>
            <p class="text-3xl font-bold text-yellow-900 dark:text-white">{{ statistics.draft }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
        <div class="flex items-center">
          <div class="p-3 rounded-lg bg-purple-100 dark:bg-purple-800 mr-4">
            <span class="text-2xl">🗂️</span>
          </div>
          <div>
            <p class="text-sm text-purple-700 dark:text-purple-300">Categories</p>
            <p class="text-3xl font-bold text-purple-900 dark:text-white">{{ statistics.byCategory?.length || 0 }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Header dengan filter dan search -->
    <div class="mb-8 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Gallery Management</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">
            Manage all repair galleries with advanced filtering and bulk actions
          </p>
        </div>
        
        <div class="flex items-center space-x-4">
          <!-- Bulk Actions -->
          <div v-if="selectedItems.length > 0" class="flex items-center space-x-2 mr-4">
            <span class="text-sm text-gray-600 dark:text-gray-400">
              {{ selectedItems.length }} selected
            </span>
            <button
              @click="handleBulkPublish"
              :disabled="isBulkActionLoading"
              class="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {{ isBulkActionLoading ? 'Processing...' : 'Publish' }}
            </button>
            <button
              @click="handleBulkDelete"
              :disabled="isBulkActionLoading"
              class="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {{ isBulkActionLoading ? 'Processing...' : 'Delete' }}
            </button>
          </div>
          
          <!-- Create Button -->
          <NuxtLink
            to="/admin/gallery/create"
            class="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm hover:shadow flex items-center"
          >
            <span class="mr-2">+</span> New Gallery
          </NuxtLink>
        </div>
      </div>
      
      <!-- Filter Controls -->
      <div class="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Search -->
        <div class="relative">
          <input
            v-model="filters.search"
            type="text"
            placeholder="Search titles, captions, tags..."
            class="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
          <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>
        
        <!-- Status Filter -->
        <select
          v-model="filters.status"
          class="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
        
        <!-- Category Filter -->
        <select
          v-model="filters.category"
          class="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
        >
          <option value="">All Categories</option>
          <option v-for="cat in statistics?.byCategory || []" :key="cat.category" :value="cat.category">
            {{ cat.category }} ({{ cat.count }})
          </option>
        </select>
        
        <!-- Sort -->
        <select
          v-model="filters.sortBy"
          class="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
        >
          <option value="created_at">Sort by Date</option>
          <option value="title">Sort by Title</option>
          <option value="category">Sort by Category</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="galleryStore.isLoading && !galleryStore.items.length" class="py-20 text-center">
      <div class="inline-flex flex-col items-center">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-400">Loading gallery items...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="galleryStore.error" class="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
      <div class="flex items-start">
        <span class="text-red-600 dark:text-red-400 mr-3 mt-0.5">⚠️</span>
        <div>
          <p class="text-red-800 dark:text-red-300 font-medium">{{ galleryStore.error }}</p>
          <button
            @click="galleryStore.clearError(); fetchData()"
            class="mt-2 text-sm text-red-700 dark:text-red-400 hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!galleryStore.items.length" class="py-16 text-center bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700">
      <span class="text-6xl mb-4 block opacity-50">🖼️</span>
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No gallery items found</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
        {{ filters.search ? 'Try adjusting your search or filter' : 'Get started by creating your first gallery item' }}
      </p>
      <NuxtLink
        to="/admin/gallery/create"
        class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm hover:shadow"
      >
        <span class="mr-2">+</span> Create New Gallery
      </NuxtLink>
    </div>

    <!-- Gallery Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <GalleryCard
        v-for="item in galleryStore.items"
        :key="item.id"
        :item="item"
        :show-actions="true"
        :is-selected="selectedItems.includes(item.id!)"
        @select="selectedItems.includes(item.id!) ? selectedItems = selectedItems.filter(id => id !== item.id) : selectedItems.push(item.id!)"
        @view="handleView"
        @edit="handleEdit"
        @delete="handleDelete"
        @publish="handlePublish"
        @archive="handleArchive"
      />
    </div>

    <!-- Pagination -->
    <div v-if="galleryStore.pagination.totalPages > 1" class="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="text-sm text-gray-600 dark:text-gray-400">
        Showing {{ galleryStore.items.length }} of {{ galleryStore.pagination.total }} items
        (Page {{ galleryStore.pagination.page }} of {{ galleryStore.pagination.totalPages }})
      </div>
      
      <div class="flex items-center space-x-2">
        <button
          :disabled="galleryStore.pagination.page === 1"
          @click="filters.page = galleryStore.pagination.page - 1"
          :class="[
            'px-4 py-2 rounded-lg border transition-colors flex items-center',
            galleryStore.pagination.page === 1
              ? 'border-gray-300 dark:border-gray-700 text-gray-400 cursor-not-allowed'
              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
          ]"
        >
          <span class="mr-2">←</span> Previous
        </button>
        
        <div class="flex items-center space-x-1">
          <!-- First page -->
          <button
            v-if="galleryStore.pagination.page > 3"
            @click="filters.page = 1"
            :class="[
              'w-10 h-10 rounded-lg transition-colors',
              galleryStore.pagination.page === 1
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            ]"
          >
            1
          </button>
          
          <!-- Ellipsis -->
          <span v-if="galleryStore.pagination.page > 4" class="text-gray-400">...</span>
          
          <!-- Pages around current -->
          <template v-for="page in galleryStore.pagination.totalPages" :key="page">
            <button
              v-if="Math.abs(page - galleryStore.pagination.page) <= 2"
              @click="filters.page = page"
              :class="[
                'w-10 h-10 rounded-lg transition-colors',
                galleryStore.pagination.page === page
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              ]"
            >
              {{ page }}
            </button>
          </template>
          
          <!-- Ellipsis -->
          <span v-if="galleryStore.pagination.page < galleryStore.pagination.totalPages - 3" class="text-gray-400">...</span>
          
          <!-- Last page -->
          <button
            v-if="galleryStore.pagination.page < galleryStore.pagination.totalPages - 2"
            @click="filters.page = galleryStore.pagination.totalPages"
            :class="[
              'w-10 h-10 rounded-lg transition-colors',
              galleryStore.pagination.page === galleryStore.pagination.totalPages
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            ]"
          >
            {{ galleryStore.pagination.totalPages }}
          </button>
        </div>
        
        <button
          :disabled="galleryStore.pagination.page === galleryStore.pagination.totalPages"
          @click="filters.page = galleryStore.pagination.page + 1"
          :class="[
            'px-4 py-2 rounded-lg border transition-colors flex items-center',
            galleryStore.pagination.page === galleryStore.pagination.totalPages
              ? 'border-gray-300 dark:border-gray-700 text-gray-400 cursor-not-allowed'
              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
          ]"
        >
          Next <span class="ml-2">→</span>
        </button>
      </div>
      
      <!-- Items per page selector -->
      <div class="flex items-center space-x-2">
        <span class="text-sm text-gray-600 dark:text-gray-400">Items per page:</span>
        <select
          v-model="filters.limit"
          class="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm"
        >
          <option value="12">12</option>
          <option value="24">24</option>
          <option value="48">48</option>
          <option value="96">96</option>
        </select>
      </div>
    </div>
  </AdminLayout>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>