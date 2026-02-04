<!-- pages/dashboard/admin/index.vue -->
<script setup lang="ts">
definePageMeta({
  middleware: 'admin',
  requiresAuth: true,
  layout: 'dashboard'
})

const config = useRuntimeConfig()


const auth = useAuthStore()
const productApi = useProductApi()

// Stats
const stats = ref({
  totalProducts: 0,
  totalServices: 24,
  totalCustomers: 1234,
  lowStockCount: 0,
  monthlyRevenue: 45000000
})

interface Product {
  id: number
  name: string
  deviceModel: string
  stock: number
  imageUrl?: string
}

type ActivityColor = 'blue' | 'green' | 'orange'

interface RecentActivity {
  type: 'product' | 'service' | 'alert'
  icon: string
  color: ActivityColor
  title: string
  description: string
  time: string
}


const lowStockProducts = ref<Product[]>([])
const recentActivities = ref<RecentActivity[]>([])

const loading = ref(true)

// Load dashboard data
const loadDashboardData = async () => {
  loading.value = true
  try {
    // Fetch products untuk stats
    const productsResponse = await productApi.fetchProducts({
      page: 1,
      pageSize: 100
    })
    
    stats.value.totalProducts = productsResponse.pagination.total
    
    // Filter low stock products (stock <= 5)
    lowStockProducts.value = productsResponse.data
      .filter(p => p.stock <= 5)
      .slice(0, 5) // Take only 5 for display
    
    stats.value.lowStockCount = productsResponse.data.filter(p => p.stock <= 5).length
    
    // Mock recent activities (nanti bisa diganti dengan real data)
    recentActivities.value = [
      {
        type: 'product',
        icon: 'i-heroicons-cube',
        color: 'blue',
        title: 'Produk diperbaharui',
        description: productsResponse.data[0]?.name || 'LCD iPhone 14 Pro Max',
        time: productsResponse.data[0]
          ? `${Math.floor(Math.random() * 59) + 1} mins ago`
          : 'N/A'
      },
      {
        type: 'service',
        icon: 'i-heroicons-check-circle',
        color: 'green',
        title: 'Service completed',
        description: 'Service #12345',
        time: '15 mins ago'
      },
      {
        type: 'alert',
        icon: 'i-heroicons-exclamation-triangle',
        color: 'orange',
        title: 'Low stock alert',
        description: lowStockProducts.value[0]?.name || 'LCD A10s needs restock',
        time: '1 hour ago'
      }
    ]
  } catch (error) {
    console.error('Failed to load dashboard data:', error)
  } finally {
    loading.value = false
  }
}

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}

// Get stock color
const getStockColor = (stock: number) => {
  if (stock === 0) return 'error'
  if (stock <= 5) return 'warning'
  return 'success'
}


onMounted(() => {
  loadDashboardData()
  // Auto refresh every 5 minutes
  setInterval(loadDashboardData, 5 * 60 * 1000)
})
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Welcome Card -->
    <div class="bg-linear-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg p-8 text-white">
      <h2 class="text-3xl font-bold mb-2">
        👋 Welcome back, {{ auth.user?.email || auth.user?.name }}!
      </h2>
      <p class="text-blue-50">
        Here's what's happening with your store today.
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-blue-500" />
    </div>

    <template v-else>
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <!-- Total Products -->
        <NuxtLink to="/dashboard/admin/products" class="block group">
          <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <UIcon name="i-heroicons-cube" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <UBadge color="primary" variant="soft">Products</UBadge>
            </div>
            <p class="text-2xl font-bold text-slate-900 dark:text-white mb-1">{{ stats.totalProducts }}</p>
            <p class="text-sm text-slate-500 dark:text-slate-400">Total Products</p>
          </div>
        </NuxtLink>

        <!-- Active Services -->
        <NuxtLink to="/dashboard/admin/services" class="block group">
          <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 rounded-lg bg-green-50 dark:bg-green-950/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <UIcon name="i-heroicons-wrench-screwdriver" class="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <UBadge color="success" variant="soft">Live</UBadge>
            </div>
            <p class="text-2xl font-bold text-slate-900 dark:text-white mb-1">{{ stats.totalServices }}</p>
            <p class="text-sm text-slate-500 dark:text-slate-400">Active Services</p>
          </div>
        </NuxtLink>

        <!-- Total Customers -->
        <NuxtLink to="/dashboard/admin/customers" class="block group">
          <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 rounded-lg bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <UIcon name="i-heroicons-users" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <UBadge color="secondary" variant="soft">+12%</UBadge>
            </div>
            <p class="text-2xl font-bold text-slate-900 dark:text-white mb-1">{{ stats.totalCustomers.toLocaleString() }}</p>
            <p class="text-sm text-slate-500 dark:text-slate-400">Total Customers</p>
          </div>
        </NuxtLink>

        <!-- Revenue -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-lg bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center">
              <UIcon name="i-heroicons-banknotes" class="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <UBadge color="warning" variant="soft">This Month</UBadge>
          </div>
          <p class="text-2xl font-bold text-slate-900 dark:text-white mb-1">{{ formatCurrency(stats.monthlyRevenue) }}</p>
          <p class="text-sm text-slate-500 dark:text-slate-400">Monthly Revenue</p>
        </div>
      </div>

      <!-- Low Stock Alert -->
      <UCard v-if="lowStockProducts.length > 0">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5 text-orange-500" />
              <h3 class="font-semibold text-slate-900 dark:text-white">Low Stock Alert</h3>
            </div>
            <div class="flex items-center gap-2">
              <UBadge color="warning">{{ stats.lowStockCount }} items</UBadge>
              <NuxtLink
                to="/dashboard/admin/products?filter=lowstock"
                class="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                View all
              </NuxtLink>
            </div>
          </div>
        </template>

        <div class="space-y-3">
          <div
            v-for="product in lowStockProducts"
            :key="product.id"
            class="flex items-center justify-between p-3 rounded-lg bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800"
          >
            <div class="flex items-center gap-3 flex-1">
              <img
                v-if="product.imageUrl"
                :src="product.imageUrl"
                :alt="product.name"
                class="w-10 h-10 rounded-lg object-cover"
              />
              <div
                v-else
                class="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center"
              >
                <UIcon name="i-heroicons-cube" class="w-5 h-5 text-slate-400" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-slate-900 dark:text-white text-sm truncate">{{ product.name }}</p>
                <p class="text-xs text-slate-500 dark:text-slate-400">{{ product.deviceModel }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <UBadge :color="getStockColor(product.stock)" variant="soft">
                {{ product.stock }} pcs
              </UBadge>
              <NuxtLink
                :to="`/dashboard/admin/products/${product.id}/edit`"
                class="text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                Update
              </NuxtLink>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Recent Activity -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold text-slate-900 dark:text-white">Recent Activity</h3>
            <NuxtLink
              to="/dashboard/admin/analytics"
              class="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              View all
            </NuxtLink>
          </div>
        </template>
        
        <div class="space-y-4">
          <div
            v-for="(activity, index) in recentActivities"
            :key="index"
            class="flex items-center gap-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div :class="[
              'w-10 h-10 rounded-full flex items-center justify-center',
              `bg-${activity.color}-100 dark:bg-${activity.color}-900/30`
            ]">
              <UIcon :name="activity.icon" :class="[
                'w-5 h-5',
                `text-${activity.color}-600 dark:text-${activity.color}-400`
              ]" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-slate-900 dark:text-white">{{ activity.title }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400 truncate">{{ activity.description }}</p>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{{ activity.time }}</p>
          </div>
        </div>
      </UCard>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <NuxtLink to="/dashboard/admin/products/create" class="block group">
          <div class="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 hover:border-blue-500 dark:hover:border-blue-500 transition-all">
            <div class="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <UIcon name="i-heroicons-plus" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-2">Add Product</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400">Create new spare part</p>
          </div>
        </NuxtLink>

        <NuxtLink to="/dashboard/admin/services/create" class="block group">
          <div class="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 hover:border-green-500 dark:hover:border-green-500 transition-all">
            <div class="w-12 h-12 rounded-lg bg-green-50 dark:bg-green-950/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <UIcon name="i-heroicons-wrench-screwdriver" class="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
                       <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-2">New Service</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400">Create service order</p>
          </div>
        </NuxtLink>

        <NuxtLink to="/dashboard/admin/case-studies/create" class="block group">
          <div class="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 hover:border-purple-500 dark:hover:border-purple-500 transition-all">
            <div class="w-12 h-12 rounded-lg bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <UIcon name="i-heroicons-document-text" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-2">New Case Study</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400">Add portfolio item</p>
          </div>
        </NuxtLink>
      </div>

      <!-- User Info Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Email Card -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
              <UIcon name="i-heroicons-envelope" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 class="font-semibold text-slate-900 dark:text-white">Email Address</h3>
          </div>
          <p class="text-sm font-mono text-slate-600 dark:text-slate-300 break-all">{{ auth.user?.email }}</p>
        </div>

        <!-- Role Card -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-950/30 flex items-center justify-center">
              <UIcon name="i-heroicons-shield-check" class="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 class="font-semibold text-slate-900 dark:text-white">Account Role</h3>
          </div>
          <UBadge color="success" variant="soft" size="lg">
            {{ auth.user?.role }}
          </UBadge>
        </div>

        <!-- User ID Card -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center">
              <UIcon name="i-heroicons-identification" class="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 class="font-semibold text-slate-900 dark:text-white">User ID</h3>
          </div>
          <p class="text-sm font-mono text-slate-600 dark:text-slate-300">{{ auth.user?.id }}</p>
        </div>
      </div>

      <!-- System Info Card -->
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div class="flex items-center gap-3">
            <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <h3 class="font-semibold text-slate-900 dark:text-white">System Information</h3>
          </div>
        </div>
        <div class="p-6 space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-sm text-slate-600 dark:text-slate-400">API Base URL</span>
            <span class="font-mono text-xs text-slate-900 dark:text-slate-100">{{ $config.public.apiUrl }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-slate-600 dark:text-slate-400">Environment</span>
            <UBadge color="primary" variant="soft">
              {{ config.public.env === 'production' ? 'Production' : 'Development' }}
            </UBadge>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-slate-600 dark:text-slate-400">Auth Type</span>
            <span class="text-sm text-slate-900 dark:text-slate-100">JWT + Refresh Token</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-slate-600 dark:text-slate-400">Version</span>
            <span class="font-mono text-sm text-slate-900 dark:text-slate-100">v1.0.0</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-slate-600 dark:text-slate-400">Products Module</span>
            <UBadge color="success" variant="soft">
              <UIcon name="i-heroicons-check-circle" class="w-3 h-3 mr-1" />
              Active
            </UBadge>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
