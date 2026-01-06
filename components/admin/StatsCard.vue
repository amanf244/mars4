<script setup lang="ts">
interface Stat {
  title: string
  value: string
  change: string
  icon: string
  color: 'blue' | 'green' | 'purple' | 'orange'
}

interface Props {
  stat: Stat
  darkMode: boolean
}

defineProps<Props>()
</script>

<template>
  <div 
    :class="[
      'rounded-xl border p-6 shadow-sm hover:shadow-md transition-all duration-300',
      darkMode 
        ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
        : 'bg-white border-gray-200 hover:border-gray-300'
    ]"
  >
    <div class="flex items-center justify-between">
      <div>
        <p :class="['text-sm', darkMode ? 'text-gray-400' : 'text-gray-600']">
          {{ stat.title }}
        </p>
        <p :class="['text-2xl font-bold mt-2', darkMode ? 'text-white' : 'text-gray-900']">
          {{ stat.value }}
        </p>
        <p 
          :class="[
            'text-sm font-medium mt-1',
            stat.change.startsWith('+') 
              ? (darkMode ? 'text-green-400' : 'text-green-600')
              : (darkMode ? 'text-red-400' : 'text-red-600')
          ]"
        >
          {{ stat.change }} dari bulan lalu
        </p>
      </div>
      <div 
        :class="[
          'w-14 h-14 rounded-full flex items-center justify-center text-2xl',
          stat.color === 'blue' 
            ? (darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-600')
            : '',
          stat.color === 'green' 
            ? (darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-600')
            : '',
          stat.color === 'purple' 
            ? (darkMode ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-50 text-purple-600')
            : '',
          stat.color === 'orange' 
            ? (darkMode ? 'bg-orange-900/30 text-orange-300' : 'bg-orange-50 text-orange-600')
            : ''
        ]"
      >
        {{ stat.icon }}
      </div>
    </div>
  </div>
</template>