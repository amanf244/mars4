<!-- components/Logo.vue -->
<script setup lang="ts">
defineProps<{
  class?: string
}>()
</script>

<template>
  <div :class="class" class="flex items-center gap-2">
    <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
      <span class="text-lg font-bold text-white">M</span>
    </div>
    <span class="text-lg font-bold">Mars4</span>
  </div>
</template>
