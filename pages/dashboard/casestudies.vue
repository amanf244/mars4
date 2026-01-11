<!-- pages/dashboard/gallery.vue -->
<script setup lang="ts">
definePageMeta({
  requiresAuth: true,
  layout: 'dashboard'
})

const images = ref([
  { id: 1, title: 'Image 1', url: 'https://picsum.photos/400/300?random=1' },
  { id: 2, title: 'Image 2', url: 'https://picsum.photos/400/300?random=2' },
  { id: 3, title: 'Image 3', url: 'https://picsum.photos/400/300?random=3' },
  { id: 4, title: 'Image 4', url: 'https://picsum.photos/400/300?random=4' },
  { id: 5, title: 'Image 5', url: 'https://picsum.photos/400/300?random=5' },
  { id: 6, title: 'Image 6', url: 'https://picsum.photos/400/300?random=6' },
])
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">Gallery</h1>
        <p class="text-slate-600 dark:text-slate-400">Browse and manage your image collection</p>
      </div>
      <UButton color="primary" icon="i-heroicons-plus">
        Upload Image
      </UButton>
    </div>

    <!-- Gallery Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="image in images"
        :key="image.id"
        class="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
      >
        <div class="aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            :src="image.url"
            :alt="image.title"
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        <div class="p-4">
          <h3 class="font-medium text-slate-900 dark:text-white">{{ image.title }}</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Added recently</p>
        </div>
        <!-- Overlay Actions -->
        <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <UButton color="neutral" icon="i-heroicons-eye" size="sm" />
          <UButton color="error" icon="i-heroicons-trash" size="sm" />
        </div>
      </div>
    </div>
  </div>
</template>
