<script setup lang="ts">
import type { GalleryItem } from '~/stores/gallery'

interface Props {
  item: GalleryItem
  showActions?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  view: [id: number]
  edit: [id: number]
  delete: [id: number]
  publish: [id: number]
}>()

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  } catch {
    return dateString
  }
}

const getComplexityColor = (level: string) => {
  switch (level) {
    case 'rendah': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    case 'sedang': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
    case 'tinggi': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🖼️</text></svg>'
}
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-300">
    <!-- Image Section -->
    <div class="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-900">
      <img
        v-if="item.photos?.[0]?.url"
        :src="item.photos[0].url"
        :alt="item.title"
        class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        @error="handleImageError"
      />
      <div v-else class="flex items-center justify-center h-full text-gray-400">
        <span class="text-4xl">🖼️</span>
      </div>
      
      <!-- Status Badge -->
      <div class="absolute top-3 right-3">
        <span :class="[
          'px-3 py-1 rounded-full text-xs font-semibold',
          item.status === 'published' 
            ? 'bg-green-500 text-white' 
            : 'bg-yellow-500 text-white'
        ]">
          {{ item.status === 'published' ? 'Published' : 'Draft' }}
        </span>
      </div>
      
      <!-- Category Badge -->
      <div class="absolute bottom-3 left-3">
        <span class="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
          {{ item.category }}
        </span>
      </div>
    </div>
    
    <!-- Content Section -->
    <div class="p-5">
      <!-- Title & Complexity -->
      <div class="flex justify-between items-start mb-3">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">
          {{ item.title }}
        </h3>
        <span :class="['px-2 py-1 text-xs font-medium rounded-full', getComplexityColor(item.complexityLevel)]">
          {{ item.complexityLevel }}
        </span>
      </div>
      
      <!-- Caption -->
      <p class="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
        {{ item.caption }}
      </p>
      
      <!-- Meta Information -->
      <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
        <div class="flex items-center space-x-4">
          <div class="flex items-center">
            <span class="mr-1">📅</span>
            {{ formatDate(item.date) }}
          </div>
          <div class="flex items-center">
            <span class="mr-1">⏱️</span>
            {{ item.duration }}
          </div>
        </div>
        <div class="flex items-center">
          <span class="mr-1">🖼️</span>
          {{ item.photos?.length || 0 }} photos
        </div>
      </div>
      
      <!-- Tags -->
      <div class="mb-4">
        <div class="flex flex-wrap gap-1">
          <span
            v-for="(tag, index) in item.tags?.split(',').slice(0, 3)"
            :key="index"
            class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
          >
            {{ tag.trim() }}
          </span>
          <span v-if="item.tags?.split(',').length > 3" class="px-2 py-1 text-gray-500 text-xs">
            +{{ item.tags.split(',').length - 3 }}
          </span>
        </div>
      </div>
      
      <!-- Actions -->
      <div v-if="showActions" class="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
        <button
          @click="emit('view', item.id!)"
          class="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
        >
          View
        </button>
        
        <div class="flex items-center space-x-2">
          <button
            v-if="item.status === 'draft'"
            @click="emit('publish', item.id!)"
            class="px-3 py-1.5 text-sm font-medium text-green-600 hover:text-green-800 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
          >
            Publish
          </button>
          
          <button
            @click="emit('edit', item.id!)"
            class="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Edit
          </button>
          
          <button
            @click="emit('delete', item.id!)"
            class="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  line-clamp: 1;
}

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}
</style>