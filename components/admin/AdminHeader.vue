<script setup lang="ts">
interface User {
  name: string
  email: string
}

interface Props {
  darkMode: boolean
  isSidebarCollapsed: boolean
  user: User
}

const props = defineProps<Props>()

const emit = defineEmits<{
  toggleSidebar: []
  toggleDarkMode: []
  toggleMobileSidebar: []
}>()
</script>

<template>
  <!-- Header mobile -->
  <div class="sticky top-0 z-40 lg:hidden border-b transition-colors duration-300"
       :class="darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
    <div class="flex items-center justify-between px-4 py-3">
      <div class="flex items-center">
        <button @click="$emit('toggleMobileSidebar')" 
                class="mr-3 p-2 rounded-md transition-colors"
                :class="darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'">
          <span class="text-2xl">☰</span>
        </button>
        <div class="flex items-center">
          <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center mr-2">
            <span class="text-white font-bold">{{ user?.name?.charAt(0) || 'A' }}</span>
          </div>
          <span :class="['text-lg font-bold', darkMode ? 'text-white' : 'text-gray-800']">
            AdminPanel
          </span>
        </div>
      </div>
      <div class="flex items-center">
        <button @click="$emit('toggleDarkMode')"
                class="mr-4 p-2 rounded-md transition-colors"
                :class="darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'">
          <span class="text-lg">{{ darkMode ? '🌙' : '☀️' }}</span>
        </button>
        <div class="relative">
          <button class="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                  :class="darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'">
            <span class="text-lg">🔔</span>
          </button>
          <span class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2"
                :class="darkMode ? 'ring-gray-800' : 'ring-white'"></span>
        </div>
      </div>
    </div>
  </div>

  <!-- Header desktop -->
  <header class="hidden lg:flex sticky top-0 z-40 border-b transition-colors duration-300"
          :class="darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
    <div class="flex-1 flex items-center justify-between px-8 py-4">
      <div>
        <h1 :class="['text-2xl font-bold', darkMode ? 'text-white' : 'text-gray-900']">
          Dashboard Admin
        </h1>
        <p :class="darkMode ? 'text-gray-300' : 'text-gray-600'">
          Selamat datang kembali, {{ user?.name || 'Admin' }}!
        </p>
      </div>
      
      <div class="flex items-center space-x-4">
        <div class="relative">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3"
                :class="darkMode ? 'text-gray-400' : 'text-gray-500'">
            🔍
          </span>
          <input 
            type="text" 
            :class="[
              'pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors',
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'border border-gray-300 text-gray-900 placeholder-gray-500'
            ]"
            placeholder="Cari dashboard..."
          >
        </div>
        
        <button @click="$emit('toggleSidebar')"
                class="p-2 rounded-md transition-colors"
                :class="darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'">
          <span class="text-xl">{{ isSidebarCollapsed ? '▶' : '◀' }}</span>
        </button>
        
        <div class="relative">
          <button class="relative w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                  :class="darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'">
            <span class="text-lg">🔔</span>
            <span class="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2"
                  :class="darkMode ? 'ring-gray-800' : 'ring-white'"></span>
          </button>
        </div>
        
        <div class="h-8 w-px" :class="darkMode ? 'bg-gray-700' : 'bg-gray-300'"></div>
        
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
              {{ user?.name?.charAt(0) || 'A' }}
            </div>
          </div>
          <div class="ml-3">
            <p :class="['text-sm font-medium', darkMode ? 'text-white' : 'text-gray-900']">
              {{ user?.name || 'Admin' }}
            </p>
            <p :class="['text-xs', darkMode ? 'text-gray-400' : 'text-gray-500']">
              Administrator
            </p>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>