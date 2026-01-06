<script setup lang="ts">
interface MenuItem {
  name: string
  icon: string
  active: boolean
  badge?: number | null
}

interface User {
  name: string
  email: string
}

interface Props {
  darkMode: boolean
  isOpen: boolean
  navItems: MenuItem[]
  user: User
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  setActive: [index: number]
  logout: []
}>()

const closeSidebar = () => {
  emit('close')
}

const setActiveItem = (index: number) => {
  emit('setActive', index)
  closeSidebar()
}

const logout = () => {
  emit('logout')
}
</script>

<template>
  <div 
    v-if="isOpen" 
    class="fixed inset-0 z-50 lg:hidden transition-opacity duration-300"
    :class="darkMode ? 'bg-black/70' : 'bg-black/50'"
    @click="closeSidebar"
  >
    <div 
      class="fixed inset-y-0 left-0 w-64 transition-transform duration-300"
      :class="darkMode ? 'bg-gray-800' : 'bg-white'"
      @click.stop
    >
      <div class="flex flex-col h-full">
        <!-- Logo mobile sidebar -->
        <div class="flex items-center justify-between h-16 px-4 border-b"
             :class="darkMode ? 'border-gray-700' : 'border-gray-200'">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span class="text-white font-bold">{{ user?.name?.charAt(0) || 'A' }}</span>
            </div>
            <span :class="['text-xl font-bold', darkMode ? 'text-white' : 'text-gray-800']">
              AdminPanel
            </span>
          </div>
          <button @click="closeSidebar" 
                  class="p-2 rounded-md transition-colors"
                  :class="darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'">
            <span class="text-2xl">×</span>
          </button>
        </div>
        
        <!-- Menu navigasi mobile -->
        <div class="flex-1 overflow-y-auto py-5">
          <nav class="px-4 space-y-1">
            <button 
              v-for="(item, index) in navItems" 
              :key="index"
              @click="setActiveItem(index)"
              :class="[
                'w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all',
                item.active 
                  ? (darkMode 
                    ? 'bg-blue-900/30 text-blue-300 border border-blue-800/50' 
                    : 'bg-blue-50 text-blue-700 border border-blue-100')
                  : (darkMode
                    ? 'text-gray-300 hover:bg-gray-700/50'
                    : 'text-gray-700 hover:bg-gray-100')
              ]"
            >
              <span class="mr-3 text-lg">{{ item.icon }}</span>
              {{ item.name }}
              <span v-if="item.badge" 
                    class="ml-auto px-2 py-0.5 text-xs rounded-full"
                    :class="darkMode ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-800'">
                {{ item.badge }}
              </span>
            </button>
          </nav>
          
          <slot name="mobile-sidebar-content"></slot>
        </div>
        
        <!-- Info pengguna & logout mobile -->
        <div class="p-4 border-t" :class="darkMode ? 'border-gray-700' : 'border-gray-200'">
          <div class="flex items-center mb-4">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                {{ user?.name?.charAt(0) || 'A' }}
              </div>
            </div>
            <div class="ml-3 flex-1">
              <p :class="['text-sm font-medium', darkMode ? 'text-white' : 'text-gray-900']">
                {{ user?.name || 'Admin' }}
              </p>
              <p :class="['text-xs', darkMode ? 'text-gray-400' : 'text-gray-500']">
                {{ user?.email || 'admin@example.com' }}
              </p>
            </div>
          </div>
          <button 
            @click="logout"
            class="w-full flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors"
            :class="darkMode 
              ? 'text-red-400 hover:text-red-300 hover:bg-red-900/30 border border-red-800/30' 
              : 'text-red-600 hover:text-red-800 hover:bg-red-50 border border-red-100'"
          >
            <span class="mr-2">🚪</span> Keluar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>