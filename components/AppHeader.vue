<!-- components/AppHeader.vue -->
<script setup lang="ts">
const auth = useAuthStore()
const toast = useToast()
const colorMode = useColorMode()
const route = useRoute()

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})

const toggleDarkMode = () => {
  isDark.value = !isDark.value
}

const pageTitle = computed(() => {
  if (route.path.includes('/gallery')) return 'Gallery'
  if (route.path.includes('/users')) return 'Users Management'
  if (route.path.includes('/admin')) return 'Admin Dashboard'
  return 'Dashboard'
})

const dropdownItems = computed(() => [
  [
    {
      label: 'Profile',
      icon: 'i-heroicons-user-circle',
      click: () => navigateTo('/profile')
    }
  ],
  [
    {
      label: 'Settings',
      icon: 'i-heroicons-cog-6-tooth',
      click: () => navigateTo('/settings')
    }
  ],
  [
    {
      label: 'Logout',
      icon: 'i-heroicons-arrow-left-on-rectangle',
      click: handleLogout
    }
  ]
])

async function handleLogout() {
  try {
    await auth.logout()
    toast.add({
      title: 'Logged Out',
      description: 'You have been logged out successfully',
      color: 'success',
      icon: 'i-heroicons-check-circle'
    })
  } catch (err) {
    toast.add({
      title: 'Error',
      description: 'Failed to logout',
      color: 'error',
      icon: 'i-heroicons-x-circle'
    })
  }
}
</script>

<template>
  <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
    <div class="px-6 py-4">
      <div class="flex items-center justify-between">
        <!-- Page Title -->
        <div>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white">{{ pageTitle }}</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400">Welcome back, {{ auth.user?.name }}</p>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-3">
          <ClientOnly>
          <!-- Dark Mode Toggle -->
          <button
            @click="toggleDarkMode"
            class="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <UIcon 
              :name="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'" 
              class="w-5 h-5"
            />
          </button>
          </ClientOnly>

          <!-- User Dropdown -->
          <UDropdownMenu :items="dropdownItems">
            <button class="flex items-center gap-3 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <span class="text-sm font-bold text-white">{{ auth.user?.name?.charAt(0).toUpperCase() }}</span>
              </div>
              <div class="text-left hidden sm:block">
                <p class="text-sm font-medium text-slate-900 dark:text-white">{{ auth.user?.name }}</p>
                <p class="text-xs text-slate-500 dark:text-slate-400">{{ auth.user?.role }}</p>
              </div>
              <UIcon name="i-heroicons-chevron-down" class="w-4 h-4 text-slate-400" />
            </button>
          </UDropdownMenu>
        </div>
      </div>
    </div>
  </header>
</template>
