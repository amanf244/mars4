<!-- components/AppSidebar.vue -->
<script setup lang="ts">
const route = useRoute()
const auth = useAuthStore()
const ui = useUiStore()

onMounted(() => {
  ui.initSidebarState()
})

const navigation = computed(() => {
  const items = []

  // ===== CUSTOMER NAVIGATION =====
  if (!auth.isAdmin) {
    items.push(
      {
        label: 'Dashboard',
        icon: 'i-heroicons-home',
        to: '/dashboard/user',
        exactMatch: true
      },
      {
        label: 'My Services',
        icon: 'i-heroicons-wrench-screwdriver',
        to: '/dashboard/user/services',
        badge: '2', // Pending services
        description: 'Track service requests'
      },
      {
        label: 'New Request',
        icon: 'i-heroicons-plus-circle',
        to: '/dashboard/user/services/create',
        description: 'Submit new service'
      },
      {
        label: 'Profile',
        icon: 'i-heroicons-user-circle',
        to: '/dashboard/user/profile'
      }
    )
  }

  // ===== ADMIN NAVIGATION =====
  if (auth.isAdmin) {
    items.push(
      {
        label: 'Dashboard',
        icon: 'i-heroicons-home',
        to: '/dashboard/admin',
        exactMatch: true
      },
      
      // Service Management Module
      {
        type: 'separator',
        label: 'Service Management'
      },
      {
        label: 'All Services',
        icon: 'i-heroicons-wrench-screwdriver',
        to: '/dashboard/admin/services',
        badge: '5', // New services
        badgeColor: 'orange'
      },
      {
        label: 'Service Queue',
        icon: 'i-heroicons-queue-list',
        to: '/dashboard/admin/services/queue',
        description: 'Pending services'
      },
      
      // Content Management Module
      {
        type: 'separator',
        label: 'Content Management'
      },
      {
        label: 'Case Studies',
        icon: 'i-heroicons-document-text',
        to: '/dashboard/admin/case-studies',
        description: 'Portfolio & projects'
      },
      {
        label: 'New Case Study',
        icon: 'i-heroicons-plus-circle',
        to: '/dashboard/admin/case-studies/create'
      },
      
      // Customer Management Module
      {
        type: 'separator',
        label: 'Customer Management'
      },
      {
        label: 'Customers',
        icon: 'i-heroicons-users',
        to: '/dashboard/admin/customers'
      },
      {
        label: 'Reports',
        icon: 'i-heroicons-document-chart-bar',
        to: '/dashboard/admin/reports'
      },
      
      // Analytics & Settings
      {
        type: 'separator',
        label: 'System'
      },
      {
        label: 'Analytics',
        icon: 'i-heroicons-chart-bar',
        to: '/dashboard/admin/analytics'
      },
      {
        label: 'Settings',
        icon: 'i-heroicons-cog-6-tooth',
        to: '/dashboard/admin/settings'
      }
    )
  }

  return items
})

const isActive = (item: any) => {
  if (!item.to) return false
  if (item.exactMatch) {
    return route.path === item.to
  }
  return route.path.startsWith(item.to)
}

watch(() => route.path, () => {
  ui.closeMobileSidebar()
})
</script>

<template>
  <div>
    <!-- Mobile Menu Button -->
    <button
      @click="ui.toggleMobileSidebar()"
      class="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700"
    >
      <UIcon 
        :name="ui.sidebarMobileOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'" 
        class="w-6 h-6 text-slate-700 dark:text-slate-300"
      />
    </button>

    <!-- Mobile Backdrop -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="ui.sidebarMobileOpen"
        @click="ui.closeMobileSidebar()"
        class="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
      />
    </Transition>

    <!-- Sidebar -->
    <Transition
      enter-active-class="transition-transform duration-300"
      leave-active-class="transition-transform duration-300"
      enter-from-class="-translate-x-full"
      leave-to-class="-translate-x-full"
    >
      <aside
        v-show="ui.sidebarMobileOpen || true"
        :class="[
          'bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen transition-all duration-300',
          ui.sidebarCollapsed ? 'w-20' : 'w-64',
          'fixed lg:sticky top-0 z-40 lg:z-0',
          ui.sidebarMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        ]"
      >
        <!-- Logo -->
        <div class="p-6 border-b border-slate-200 dark:border-slate-800">
          <NuxtLink 
            to="/"
            :class="['flex items-center', ui.sidebarCollapsed ? 'justify-center' : 'gap-3']"
          >
            <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
              <span class="text-xl font-bold text-white">M</span>
            </div>
            <Transition
              enter-active-class="transition-all duration-300"
              leave-active-class="transition-all duration-300"
              enter-from-class="opacity-0 w-0"
              leave-to-class="opacity-0 w-0"
            >
              <div v-if="!ui.sidebarCollapsed">
                <h1 class="text-lg font-bold text-slate-900 dark:text-white whitespace-nowrap">Mars4</h1>
                <p class="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  {{ auth.isAdmin ? 'Admin Panel' : 'Customer Portal' }}
                </p>
              </div>
            </Transition>
          </NuxtLink>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
          <template v-for="(item, index) in navigation" :key="item.to || `sep-${index}`">
            <!-- Separator -->
            <div
              v-if="item.type === 'separator'"
              :class="['pt-4 pb-2', ui.sidebarCollapsed ? 'px-2' : 'px-4']"
            >
              <p 
                v-if="!ui.sidebarCollapsed"
                class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider"
              >
                {{ item.label }}
              </p>
              <div v-else class="h-px bg-slate-200 dark:bg-slate-700" />
            </div>

            <!-- Nav Link -->
            <NuxtLink
              v-else
              :to="item.to"
              :class="[
                'flex items-center rounded-lg text-sm font-medium transition-all group relative',
                ui.sidebarCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3',
                isActive(item)
                  ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              ]"
            >
              <UIcon 
                :name="item.icon" 
                class="w-5 h-5 transition-transform group-hover:scale-110 shrink-0"
                :class="[
                  isActive(item)
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-slate-400 dark:text-slate-500'
                ]"
              />
              
              <Transition
                enter-active-class="transition-all duration-300"
                leave-active-class="transition-all duration-300"
                enter-from-class="opacity-0"
                leave-to-class="opacity-0"
              >
                <div v-if="!ui.sidebarCollapsed" class="flex-1 flex items-center justify-between">
                  <div class="flex flex-col">
                    <span class="whitespace-nowrap">{{ item.label }}</span>
                    <span 
                      v-if="item.description"
                      class="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap"
                    >
                      {{ item.description }}
                    </span>
                  </div>
                  
                  <!-- Badge -->
                  <span
                    v-if="item.badge"
                    :class="[
                      'px-2 py-0.5 text-xs font-semibold rounded-full',
                      item.badgeColor === 'orange' 
                        ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                        : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    ]"
                  >
                    {{ item.badge }}
                  </span>
                </div>
              </Transition>

              <!-- Tooltip for collapsed state -->
              <div
                v-if="ui.sidebarCollapsed"
                class="absolute left-full ml-2 px-3 py-2 bg-slate-900 dark:bg-slate-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 flex items-center gap-2"
              >
                <div>
                  <div class="font-medium">{{ item.label }}</div>
                  <div v-if="item.description" class="text-xs text-slate-300">
                    {{ item.description }}
                  </div>
                </div>
                <span
                  v-if="item.badge"
                  :class="[
                    'px-1.5 py-0.5 text-xs font-semibold rounded-full',
                    item.badgeColor === 'orange' ? 'bg-orange-500' : 'bg-blue-500',
                    'text-white'
                  ]"
                >
                  {{ item.badge }}
                </span>
              </div>
            </NuxtLink>
          </template>

          <!-- Quick Actions (Customer) -->
          <div v-if="!auth.isAdmin && !ui.sidebarCollapsed" class="pt-4">
            <NuxtLink
              to="/"
              class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              <UIcon name="i-heroicons-arrow-left" class="w-5 h-5 text-slate-400" />
              <span>Back to Website</span>
            </NuxtLink>
          </div>
        </nav>

        <!-- Collapse Toggle (Desktop only) -->
        <div class="hidden lg:block p-4 border-t border-slate-200 dark:border-slate-800">
          <button
            @click="ui.toggleSidebar()"
            :class="[
              'w-full rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center',
              ui.sidebarCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'
            ]"
          >
            <UIcon 
              :name="ui.sidebarCollapsed ? 'i-heroicons-chevron-right' : 'i-heroicons-chevron-left'" 
              class="w-5 h-5 text-slate-600 dark:text-slate-400"
            />
            <span 
              v-if="!ui.sidebarCollapsed"
              class="text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap"
            >
              Collapse
            </span>
          </button>
        </div>

        <!-- Footer -->
        <div class="p-4 border-t border-slate-200 dark:border-slate-800">
          <div
            :class="[
              'rounded-lg bg-slate-50 dark:bg-slate-800/50',
              ui.sidebarCollapsed ? 'p-3' : 'px-4 py-3'
            ]"
          >
            <div v-if="!ui.sidebarCollapsed">
              <p class="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Version</p>
              <p class="text-sm font-mono text-slate-900 dark:text-slate-100">v1.0.0</p>
            </div>
            <div v-else class="text-center">
              <p class="text-xs font-mono text-slate-900 dark:text-slate-100">v1</p>
            </div>
          </div>
        </div>
      </aside>
    </Transition>
  </div>
</template>
