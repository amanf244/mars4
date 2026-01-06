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
  isSidebarCollapsed: boolean
  navItems: MenuItem[]
  user: User
}

const props = defineProps<Props>()

const emit = defineEmits<{
  toggleSidebar: []
  toggleDarkMode: []
  setActive: [index: number]
  logout: []
}>()

const setActiveItem = (index: number) => {
  emit('setActive', index)
}

const toggleSidebar = () => {
  emit('toggleSidebar')
}

const toggleDarkMode = () => {
  emit('toggleDarkMode')
}

const logout = () => {
  emit('logout')
}
</script>

<template>
  <div class="hidden lg:flex fixed inset-y-0 z-50 transition-all duration-300 ease-in-out"
       :class="[isSidebarCollapsed ? 'w-20' : 'w-64']">
    <div :class="['flex flex-col h-full border-r transition-colors duration-300', 
                  darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200']">
      <!-- Logo & Toggle -->
      <div :class="['flex items-center px-4 h-16 border-b transition-colors duration-300',
                    darkMode ? 'border-gray-700' : 'border-gray-200']">
        <div class="flex items-center space-x-3 overflow-hidden" :class="isSidebarCollapsed ? 'justify-center' : ''">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
            <span class="text-white font-bold">{{ user?.name?.charAt(0) || 'A' }}</span>
          </div>
          <span v-if="!isSidebarCollapsed" class="text-xl font-bold transition-opacity duration-300"
                :class="darkMode ? 'text-white' : 'text-gray-800'">
            AdminPanel
          </span>
        </div>
        <button v-if="!isSidebarCollapsed" 
                @click="toggleSidebar"
                class="ml-auto p-1.5 rounded-md transition-colors"
                :class="darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'">
          <span class="text-lg">◀</span>
        </button>
        <button v-else 
                @click="toggleSidebar"
                class="mx-auto p-1.5 rounded-md transition-colors"
                :class="darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'">
          <span class="text-lg">▶</span>
        </button>
      </div>
      
      <!-- Menu navigasi -->
      <div class="flex-1 overflow-y-auto py-5 px-3">
        <nav class="space-y-1">
          <button 
            v-for="(item, index) in navItems" 
            :key="index"
            @click="setActiveItem(index)"
            :class="[
              'w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all relative',
              item.active 
                ? (darkMode 
                  ? 'bg-blue-900/30 text-blue-300 border border-blue-800/50' 
                  : 'bg-blue-50 text-blue-700 border border-blue-100')
                : (darkMode
                  ? 'text-gray-300 hover:bg-gray-700/50'
                  : 'text-gray-700 hover:bg-gray-100')
            ]"
            :title="isSidebarCollapsed ? item.name : ''"
          >
            <span class="text-lg flex-shrink-0">{{ item.icon }}</span>
            <transition name="fade">
              <span v-if="!isSidebarCollapsed" class="ml-3 transition-opacity duration-200">{{ item.name }}</span>
            </transition>
            <span v-if="item.badge && !isSidebarCollapsed" 
                  class="ml-auto px-2 py-0.5 text-xs rounded-full"
                  :class="darkMode ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-800'">
              {{ item.badge }}
            </span>
            <span v-if="item.badge && isSidebarCollapsed" 
                  class="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"></span>
          </button>
        </nav>
        
        <slot name="sidebar-content"></slot>
      </div>
      
      <!-- Info pengguna & pengaturan -->
      <div class="p-4 border-t transition-colors duration-300"
           :class="darkMode ? 'border-gray-700' : 'border-gray-200'">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
              {{ user?.name?.charAt(0) || 'A' }}
            </div>
          </div>
          <transition name="fade">
            <div v-if="!isSidebarCollapsed" class="ml-3 flex-1 overflow-hidden">
              <p :class="['text-sm font-medium truncate', darkMode ? 'text-white' : 'text-gray-900']">
                {{ user?.name || 'Admin' }}
              </p>
              <p :class="['text-xs truncate', darkMode ? 'text-gray-400' : 'text-gray-500']">
                {{ user?.email || 'admin@example.com' }}
              </p>
            </div>
          </transition>
          <button v-if="!isSidebarCollapsed" 
                  @click="toggleDarkMode"
                  class="ml-2 p-2 rounded-md transition-colors"
                  :class="darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'">
            <span class="text-lg">{{ darkMode ? '🌙' : '☀️' }}</span>
          </button>
        </div>
        
        <button 
          @click="logout"
          :class="[
            'mt-4 w-full flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors',
            darkMode 
              ? 'text-red-400 hover:text-red-300 hover:bg-red-900/30 border border-red-800/30' 
              : 'text-red-600 hover:text-red-800 hover:bg-red-50 border border-red-100'
          ]"
          :title="isSidebarCollapsed ? 'Logout' : ''"
        >
          <span class="text-lg">🚪</span>
          <transition name="fade">
            <span v-if="!isSidebarCollapsed" class="ml-2">Keluar</span>
          </transition>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>