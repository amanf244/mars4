  <!-- components/MarketplaceHeader.vue -->
  <template>
    <header class="sticky top-0 z-50 bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4">
        <!-- Desktop: row, Mobile: column tapi dengan duplikat search -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between py-3 md:h-16 gap-3 md:gap-0">
          <!-- Bar atas: logo + search desktop + user -->
          <div class="flex items-center justify-between md:justify-start md:flex-1">
            <!-- Logo -->
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <NuxtLink to="/products" class="text-xl font-bold text-gray-900">
                Mars4<span class="text-primary-400">Mart</span>
              </NuxtLink>
            </div>

            <!-- Search DESKTOP (seperti awal) -->
            <div
              v-if="$route.name === 'products'"
              class="hidden md:block flex-1 max-w-2xl mx-8"
            >
              <div class="relative">
                <input
                  v-model="search"
                  @input="debouncedSearch"
                  type="text"
                  placeholder="Cari sparepart handphone..."
                  class="w-full pl-12 pr-4 py-2.5 bg-gray-100 text-gray-900 placeholder-gray-600 rounded-full
                        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition"
                />
                <svg class="w-5 h-5 text-gray-400 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <!-- User actions + cart -->
<div class="flex items-center gap-2 md:gap-4 md:ml-auto">
  <!-- Cart button -->
  <NuxtLink
    to="/cart"
    class="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-full transition-colors"
  >
    <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
    <span class="hidden md:inline text-sm font-medium text-gray-800">Cart</span>
  </NuxtLink>

  <!-- Login / user dropdown -->
  <ClientOnly>
    <UDropdownMenu
      v-if="auth.isAuthenticated"
      :items="userMenuItems"
      :popper="{ placement: 'bottom-end' }"
    >
      <button
        class="flex items-center gap-3 px-3 py-1.5 md:px-4 md:py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-full transition-colors"
      >
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
            <span class="text-white text-sm font-medium">
              {{ auth.user?.email?.charAt(0).toUpperCase() || 'U' }}
            </span>
          </div>
          <div class="text-left hidden md:block">
            <div class="text-sm font-medium text-gray-900">{{ auth.user?.name || 'User' }}</div>
            <div class="text-xs text-gray-500">{{ auth.user?.email }}</div>
          </div>
        </div>
        <svg class="w-4 h-4 text-gray-500 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </UDropdownMenu>

    <NuxtLink
      v-else
      to="/login"
      class="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-medium transition-colors text-sm md:text-base"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
      <span class="hidden sm:inline">Login</span>
    </NuxtLink>
  </ClientOnly>
</div>

          </div>

          <!-- Search MOBILE (penuh di bawah logo + user) -->
          <div
            v-if="$route.name === 'products'"
            class="md:hidden w-full"
          >
            <div class="relative">
              <input
                v-model="search"
                @input="debouncedSearch"
                type="text"
                placeholder="Cari sparepart handphone..."
                class="w-full pl-10 pr-4 py-2.5 bg-gray-100 text-gray-900 placeholder-gray-600 rounded-full
                      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition text-sm"
              />
              <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Categories: hanya di /products -->
      <div
        v-if="$route.name === 'products'"
        class="bg-white border-b border-gray-200"
      >
        <div class="max-w-7xl mx-auto px-4">
          <div class="flex items-center gap-3 md:gap-6 overflow-x-auto py-3">
            <button
              v-for="category in categories"
              :key="category.id"
              @click="handleSelectCategory(category.id)"
              :class="[
                'flex-shrink-0 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-sm md:text-base font-medium transition-colors',
                filters.typeId === category.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              {{ category.name }}
            </button>
          </div>
        </div>
      </div>
    </header>
  </template>

  <script setup lang="ts">
  const store = useProductStore()
  const auth = useAuthStore()
  const router = useRouter()

  const filters = computed(() => store.filters)

  const search = computed({
    get: () => filters.value.search,
    set: (val: string) => store.setFilters({ search: val })
  })

  declare global {
    interface Window {
      searchTimeout?: number
    }
  }

  const categories = computed(() => store.productTypes || [])

  const debouncedSearch = () => {
    if (window.searchTimeout) {
      clearTimeout(window.searchTimeout)
    }
    window.searchTimeout = window.setTimeout(async () => {
      store.clearProducts()
      await store.fetchProducts({ page: 1 })
    }, 500)
  }

  const handleSelectCategory = async (categoryId: number | string) => {
    const current = filters.value.typeId
    const val = current === Number(categoryId) ? null : Number(categoryId)
    store.setFilters({ typeId: val })
    store.clearProducts()
    await store.fetchProducts({ page: 1 })
  }

  const handleLogout = async () => {
    await auth.logout()
  }

  const navigateToSettings = () => {
    router.push(auth.isAdmin ? '/dashboard/admin' : '/dashboard/user')
  }

  const userMenuItems = computed(() => [
    [
      {
        label: auth.user?.email || 'User',
        slot: 'account',
        disabled: true
      }
    ],
    [
      {
        label: 'Dashboard',
        icon: 'i-heroicons-squares-2x2',
        onSelect: navigateToSettings
      },
      {
        label: 'Settings',
        icon: 'i-heroicons-cog-6-tooth',
        onSelect: navigateToSettings
      }
    ],
    [
      {
        label: 'Logout',
        icon: 'i-heroicons-arrow-right-on-rectangle',
        onSelect: handleLogout
      }
    ]
  ])
  </script>
