<script setup lang="ts">
interface MenuAction {
  label: string
  icon: string
  action: string
  color?: string
}

interface Props {
  x: number
  y: number
  actions: MenuAction[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  actionClicked: [action: string]
  close: []
}>()

const handleAction = (action: string) => {
  emit('actionClicked', action)
  emit('close')
}
</script>

<template>
  <div
    class="fixed bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 min-w-[160px] z-50"
    :style="{ top: `${y}px`, left: `${x}px` }"
  >
    <button
      v-for="menuAction in actions"
      :key="menuAction.action"
      class="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors"
      :class="menuAction.color === 'red' ? 'text-error' : 'text-gray-700 dark:text-gray-200'"
      @click="handleAction(menuAction.action)"
    >
      <UIcon :name="menuAction.icon" class="w-4 h-4" />
      {{ menuAction.label }}
    </button>
  </div>
</template>
