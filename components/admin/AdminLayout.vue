<script setup lang="ts">
interface MenuItem {
  name: string
  icon: string
  active: boolean
  badge?: number | null
}

interface User {
  name?: string | null
  email?: string | null
  role?: string
}

// Shared state for all admin pages
const navItems = useState<MenuItem[]>('admin-nav', () => [
  { name: 'Dashboard', icon: '📊', active: false },
  { name: 'Gallery', icon: '🖼️', active: false },
  { name: 'Pengguna', icon: '👥', active: false },
  { name: 'Produk', icon: '🛒', active: false }
])

const darkMode = useState<boolean>('admin-dark', () => false)
const isSidebarCollapsed = useState<boolean>('admin-sidebar', () => false)

// Mark active menu based on route
const route = useRoute()
watch(
  () => route.path,
  (path) => {
    navItems.value.forEach((item) => {
      item.active = path.toLowerCase().includes(item.name.toLowerCase())
    })
  },
  { immediate: true }
)

// Auth user (adapt to your store)
const authStore = useAuthStore()
const safeUser = computed<User>(() => ({
  name: authStore.user?.name || 'Admin',
  email: authStore.user?.email || 'admin@example.com',
  role: authStore.user?.role || 'admin'
}))

const isMobileSidebarOpen = ref(false)

const toggleMobileSidebar = () => {
  isMobileSidebarOpen.value = !isMobileSidebarOpen.value
}

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value
}

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const setActiveItem = (index: number) => {
  navItems.value.forEach((item, i) => {
    item.active = i === index
  })
}

const logout = async () => {
  if (authStore.logout) {
    await authStore.logout()
  }
  navigateTo('/login')
}

</script>

<template>
  <div
    :class="[
      'min-h-screen transition-colors duration-300',
      darkMode ? 'dark bg-gray-900' : 'bg-gray-50'
    ]"
  >
    <!-- Desktop sidebar -->
    <AdminSidebar
      :darkMode="darkMode"
      :isSidebarCollapsed="isSidebarCollapsed"
      :navItems="navItems"
      :user="safeUser as any"
      @toggleSidebar="toggleSidebar"
      @toggleDarkMode="toggleDarkMode"
      @setActive="setActiveItem"
      @logout="logout"
    >
      <template #sidebar-content>
        <slot name="sidebar-content" />
      </template>
    </AdminSidebar>

    <!-- Main content area -->
    <div
      class="transition-all duration-300 ease-in-out"
      :class="isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'"
    >
      <!-- You probably already have these components -->
      <AdminHeader
        :darkMode="darkMode"
        :isSidebarCollapsed="isSidebarCollapsed"
        :user="safeUser as any"
        @toggleSidebar="toggleSidebar"
        @toggleDarkMode="toggleDarkMode"
        @toggleMobileSidebar="toggleMobileSidebar"
      />

      <AdminMobileSidebar
        :darkMode="darkMode"
        :isOpen="isMobileSidebarOpen"
        :navItems="navItems"
        :user="safeUser as any"
        @close="toggleMobileSidebar"
        @setActive="setActiveItem"
        @logout="logout"
      >
        <template #mobile-sidebar-content>
          <slot name="mobile-sidebar-content" />
        </template>
      </AdminMobileSidebar>

      <!-- Page content -->
      <main class="p-4 lg:p-8">
        <slot />
      </main>
    </div>
  </div>

  
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

/* Smooth transitions */
button,
a,
input,
select {
  transition: all 0.2s ease;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.dark ::-webkit-scrollbar-thumb {
  background: #4b5563;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>
