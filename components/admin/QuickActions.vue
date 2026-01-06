<script setup lang="ts">
interface QuickAction {
  name: string
  icon: string
  color: string
}

interface Props {
  actions: QuickAction[]
  darkMode: boolean
}

defineProps<Props>()
</script>

<template>
  <div class="mt-8">
    <h3 class="text-xs font-semibold uppercase tracking-wider mb-3 px-3"
        :class="darkMode ? 'text-gray-400' : 'text-gray-500'">
      Aksi Cepat
    </h3>
    <div class="space-y-2">
      <button 
        v-for="(action, index) in actions" 
        :key="index"
        class="w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors"
        :class="darkMode 
          ? 'text-gray-300 hover:bg-gray-700/50 border border-gray-700' 
          : 'text-gray-600 hover:bg-gray-100 border border-gray-200'"
      >
        <span class="text-lg mr-3">{{ action.icon }}</span>
        <span class="truncate">{{ action.name }}</span>
      </button>
    </div>
  </div>
</template>