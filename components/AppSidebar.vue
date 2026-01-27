<!-- components/AppSidebar.vue -->
<script setup lang="ts">
const route = useRoute()
const auth = useAuthStore()
const ui = useUiStore()

type NavItem =
  | {
      type: 'separator'
      label: string
      id?: never
      icon?: never
      to?: never
      badge?: never
      badgeColor?: never
      description?: never
      exactMatch?: never
      hasDropdown?: never
      children?: never
    }
  | {
      id: string
      label: string
      icon?: string
      to?: string
      badge?: string
      badgeColor?: 'primary' | 'success' | 'warning' | 'error' | 'neutral'
      description?: string
      exactMatch?: boolean
      hasDropdown?: boolean
      children?: NavItem[]
      type?: never
    }



// State untuk dropdown menu
const expandedMenus = ref<Set<string>>(new Set())

onMounted(() => {
  ui.initSidebarState()
  // Auto-expand menu yang active
  autoExpandActiveMenu()
})

// Auto expand menu yang sedang active
const autoExpandActiveMenu = () => {
  navigation.value.forEach((item) => {
    if (item.children) {
      const hasActiveChild = checkHasActiveChild(item.children)
      if (hasActiveChild) {
        expandedMenus.value.add(item.id)
      }
    }
  })
}

const checkHasActiveChild = (children: NavItem[]): boolean => {
  return children.some(child => {
    if (child.to && route.path.startsWith(child.to)) return true
    if (child.children) return checkHasActiveChild(child.children)
    return false
  })
}

const toggleMenu = (menuId: string) => {
  if (expandedMenus.value.has(menuId)) {
    expandedMenus.value.delete(menuId)
  } else {
    expandedMenus.value.add(menuId)
  }
}

const isMenuExpanded = (menuId: string) => {
  return expandedMenus.value.has(menuId)
}

const navigation = computed<NavItem[]>(() => {
  const items : NavItem[] = []

  // ===== CUSTOMER NAVIGATION =====
  if (!auth.isAdmin) {
    items.push(
      {
        id: 'customer-dashboard',
        label: 'Dashboard',
        icon: 'i-heroicons-home',
        to: '/dashboard/user',
        exactMatch: true
      },
      {
        id: 'customer-services',
        label: 'My Services',
        icon: 'i-heroicons-wrench-screwdriver',
        to: '/dashboard/user/services',
        badge: '2',
        description: 'Track service requests'
      },
      {
        id: 'customer-new-request',
        label: 'New Request',
        icon: 'i-heroicons-plus-circle',
        to: '/dashboard/user/services/create',
        description: 'Submit new service'
      },
      {
        id: 'customer-profile',
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
        id: 'admin-dashboard',
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
        id: 'admin-services',
        label: 'All Services',
        icon: 'i-heroicons-wrench-screwdriver',
        to: '/dashboard/admin/services',
        badge: '5',
        badgeColor: 'warning',
      },
      {
        id: 'admin-queue',
        label: 'Service Queue',
        icon: 'i-heroicons-queue-list',
        to: '/dashboard/admin/services/queue',
        description: 'Pending services'
      },
      
      // ===== PRODUK MENU WITH DROPDOWN =====
      {
        type: 'separator',
        label: 'Product Management'
      },
      {
        id: 'products',
        label: 'Produk',
        icon: 'i-heroicons-cube',
        hasDropdown: true,
        children: [
          {
            id: 'products-all',
            label: 'All Products',
            icon: 'i-heroicons-square-3-stack-3d',
            to: '/dashboard/admin/products',
            badge: '12',
            badgeColor: 'primary'
          },
          {
            id: 'products-add',
            label: 'Add Product',
            icon: 'i-heroicons-plus',
            to: '/dashboard/admin/products/create'
          },
          
          // LEVEL 2: Categories dengan submenu
          {
            id: 'products-categories',
            label: 'Categories',
            icon: 'i-heroicons-tag',
            hasDropdown: true,
            children: [
              {
                id: 'categories-all',
                label: 'All Categories',
                to: '/dashboard/admin/products/categories'
              },
              {
                id: 'categories-electronics',
                label: 'Electronics',
                to: '/dashboard/admin/products/categories/electronics',
                badge: '8'
              },
              {
                id: 'categories-accessories',
                label: 'Accessories',
                to: '/dashboard/admin/products/categories/accessories',
                badge: '4'
              }
            ]
          },
          
          // LEVEL 2: Inventory dengan submenu
          {
            id: 'products-inventory',
            label: 'Inventory',
            icon: 'i-heroicons-archive-box',
            hasDropdown: true,
            children: [
              {
                id: 'inventory-stock',
                label: 'Stock Management',
                to: '/dashboard/admin/products/inventory/stock'
              },
              {
                id: 'inventory-low',
                label: 'Low Stock Alert',
                to: '/dashboard/admin/products/inventory/low-stock',
                badge: '3',
                badgeColor: 'warning'
              },
              {
                id: 'inventory-orders',
                label: 'Purchase Orders',
                to: '/dashboard/admin/products/inventory/orders'
              }
            ]
          },
          
          // LEVEL 2: Pricing
          {
            id: 'products-pricing',
            label: 'Pricing & Discounts',
            icon: 'i-heroicons-ticket',
            to: '/dashboard/admin/products/pricing'
          },
          
          // LEVEL 2: Reviews
          {
            id: 'products-reviews',
            label: 'Reviews',
            icon: 'i-heroicons-star',
            to: '/dashboard/admin/products/reviews',
            badge: '5',
            badgeColor: 'success'
          }
        ]
      },
      
      // Content Management Module
      {
        type: 'separator',
        label: 'Content Management'
      },
      {
        id: 'admin-case-studies',
        label: 'Case Studies',
        icon: 'i-heroicons-document-text',
        to: '/dashboard/admin/case-studies',
        description: 'Portfolio & projects'
      },
      {
        id: 'admin-new-case',
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
        id: 'admin-customers',
        label: 'Customers',
        icon: 'i-heroicons-users',
        to: '/dashboard/admin/customers'
      },
      {
        id: 'admin-reports',
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
        id: 'admin-analytics',
        label: 'Analytics',
        icon: 'i-heroicons-chart-bar',
        to: '/dashboard/admin/analytics'
      },
      {
        id: 'admin-settings',
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
  autoExpandActiveMenu()
})
</script>

<template>
  <div>

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
          ui.sidebarMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          'overflow-hidden' // Fix horizontal scroll
        ]"
      >
        <!-- Header with Logo & Collapse Button -->
        <div class="shrink-0 border-b border-slate-200 dark:border-slate-800">
          <!-- Logo -->
          <div class="p-6 pb-4">
            <NuxtLink 
              to="/"
              :class="['flex items-center', ui.sidebarCollapsed ? 'justify-center' : 'gap-3']"
            >
              <div class="w-10 h-10 rounded-lg bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
                <span class="text-xl font-bold text-white">M</span>
              </div>
              <Transition
                enter-active-class="transition-all duration-300"
                leave-active-class="transition-all duration-300"
                enter-from-class="opacity-0 w-0"
                leave-to-class="opacity-0 w-0"
              >
                <div v-if="!ui.sidebarCollapsed" class="overflow-hidden">
                  <h1 class="text-lg font-bold text-slate-900 dark:text-white whitespace-nowrap">Mars4</h1>
                  <p class="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {{ auth.isAdmin ? 'Admin Panel' : 'Customer Portal' }}
                  </p>
                </div>
              </Transition>
            </NuxtLink>
          </div>

          <!-- Collapse Toggle (Desktop only) - Moved to header -->
          <div class="hidden lg:block px-4 pb-4">
            <button
              @click="ui.toggleSidebar()"
              :class="[
                'w-full rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center',
                ui.sidebarCollapsed ? 'justify-center p-2' : 'gap-3 px-3 py-2'
              ]"
            >
              <UIcon 
                :name="ui.sidebarCollapsed ? 'i-heroicons-chevron-right' : 'i-heroicons-chevron-left'" 
                class="w-4 h-4 text-slate-600 dark:text-slate-400"
              />
              <span 
                v-if="!ui.sidebarCollapsed"
                class="text-xs font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap"
              >
                Collapse Sidebar
              </span>
            </button>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 p-4 space-y-1 overflow-y-auto overflow-x-hidden">
          <template v-for="(item, index) in navigation" :key="item.id || `sep-${index}`">
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

            <!-- Nav Item with Dropdown -->
            <div v-else-if="item.hasDropdown">
              <!-- Parent Button -->
                           <button
                @click="toggleMenu(item.id)"
                :class="[
                  'w-full flex items-center rounded-lg text-sm font-medium transition-all group relative',
                  ui.sidebarCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3',
                  checkHasActiveChild(item.children || [])
                    ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                ]"
              >
                <UIcon 
                  :name="item.icon || 'i-heroicons-cube'" 
                  class="w-5 h-5 transition-transform group-hover:scale-110 shrink-0"
                  :class="[
                    checkHasActiveChild(item.children || [])
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
                    <span class="whitespace-nowrap">{{ item.label }}</span>
                    <UIcon 
                      name="i-heroicons-chevron-down" 
                      :class="[
                        'w-4 h-4 transition-transform',
                        isMenuExpanded(item.id) ? 'rotate-180' : ''
                      ]"
                    />
                  </div>
                </Transition>

                <!-- Tooltip for collapsed state with dropdown indicator -->
                <div
                  v-if="ui.sidebarCollapsed"
                  class="absolute left-full ml-2 px-3 py-2 bg-slate-900 dark:bg-slate-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none"
                >
                  <div class="font-medium flex items-center gap-2">
                    {{ item.label }}
                    <UIcon name="i-heroicons-chevron-right" class="w-3 h-3" />
                  </div>
                </div>
              </button>

              <!-- Dropdown Children -->
              <Transition
                enter-active-class="transition-all duration-300"
                leave-active-class="transition-all duration-300"
                enter-from-class="max-h-0 opacity-0"
                leave-to-class="max-h-0 opacity-0"
              >
                <div
                  v-if="isMenuExpanded(item.id) && !ui.sidebarCollapsed"
                  class="overflow-hidden"
                >
                  <div class="mt-1 ml-4 pl-4 border-l-2 border-slate-200 dark:border-slate-700 space-y-1">
                    <template v-for="child in item.children" :key="child.id">
                      <!-- Level 2: Child with nested dropdown -->
                      <div v-if="child.hasDropdown">
                        <button
                          @click="toggleMenu(child.id)"
                          :class="[
                            'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all',
                            checkHasActiveChild(child.children || [])
                              ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-medium'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                          ]"
                        >
                          <UIcon 
                            :name="child.icon || 'i-heroicons-folder'" 
                            class="w-4 h-4 shrink-0"
                          />
                          <span class="flex-1 text-left whitespace-nowrap">{{ child.label }}</span>
                          <UIcon 
                            name="i-heroicons-chevron-down" 
                            :class="[
                              'w-3 h-3 transition-transform',
                              isMenuExpanded(child.id) ? 'rotate-180' : ''
                            ]"
                          />
                        </button>

                        <!-- Level 3: Nested children -->
                        <Transition
                          enter-active-class="transition-all duration-200"
                          leave-active-class="transition-all duration-200"
                          enter-from-class="max-h-0 opacity-0"
                          leave-to-class="max-h-0 opacity-0"
                        >
                          <div
                            v-if="isMenuExpanded(child.id)"
                            class="overflow-hidden"
                          >
                            <div class="mt-1 ml-4 pl-3 border-l border-slate-200 dark:border-slate-700/50 space-y-1">
                              <NuxtLink
                                v-for="subChild in child.children"
                                :key="subChild.id"
                                :to="subChild.to || '#'"
                                :class="[
                                  'flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all',
                                  isActive(subChild)
                                    ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-medium'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                ]"
                              >
                                <span class="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                                <span class="flex-1 whitespace-nowrap">{{ subChild.label }}</span>
                               <span
  v-if="item.badge"
  :class="[
    'px-2 py-0.5 text-xs font-semibold rounded-full',
    item.badgeColor === 'warning' 
      ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
  ]"
>
  {{ item.badge }}
</span>

                              </NuxtLink>
                            </div>
                          </div>
                        </Transition>
                      </div>

                      <!-- Level 2: Regular child link -->
                      <NuxtLink
                        v-else
                        :to="child.to || '#'"
                        :class="[
                          'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all',
                          isActive(child)
                            ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-medium'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        ]"
                      >
                        <UIcon 
                          :name="child.icon || 'i-heroicons-document'" 
                          class="w-4 h-4 shrink-0"
                        />
                        <span class="flex-1 whitespace-nowrap">{{ child.label }}</span>
                        <span
                          v-if="child.badge"
                          :class="[
                            'px-1.5 py-0.5 text-xs font-semibold rounded-full',
                            child.badgeColor === 'warning' 
                              ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                              : child.badgeColor === 'success'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                              : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          ]"
                        >
                          {{ child.badge }}
                        </span>
                      </NuxtLink>
                    </template>
                  </div>
                </div>
              </Transition>
            </div>

            <!-- Regular Nav Link (no dropdown) -->
            <NuxtLink
              v-else
              :to="item.to || '#'"
              :class="[
                'flex items-center rounded-lg text-sm font-medium transition-all group relative',
                ui.sidebarCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3',
                isActive(item)
                  ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              ]"
            >
              <UIcon 
                :name="item.icon || 'i-heroicons-document'" 
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
                      item.badgeColor === 'warning' 
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
                class="absolute left-full ml-2 px-3 py-2 bg-slate-900 dark:bg-slate-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 flex items-center gap-2 pointer-events-none"
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
                    item.badgeColor === 'warning' ? 'bg-orange-500' : 'bg-blue-500',
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

        <!-- Footer -->
        <div class="shrink-0 p-4 border-t border-slate-200 dark:border-slate-800">
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

<style scoped>
/* Smooth max-height transitions */
.max-h-0 {
  max-height: 0;
}

/* Fix tooltip z-index */
.z-50 {
  z-index: 50;
}
</style>

