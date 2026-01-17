<!-- pages/dashboard/index.vue -->
<script setup lang="ts">
definePageMeta({
  requiresAuth: true,
  layout: 'dashboard',
  middleware: 'user'
})

const auth = useAuthStore()
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Welcome Card -->
    <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg p-8 text-white">
      <h2 class="text-3xl font-bold mb-2">
        👋 {{ auth.isAdmin ? 'Admin Dashboard' : 'Welcome' }}, {{ auth.user?.name }}!
      </h2>
      <p class="text-blue-50">
        {{ auth.isAdmin 
          ? 'Manage your system and monitor all activities.' 
          : 'This is your personal dashboard. Explore and manage your content.'
        }}
      </p>
    </div>

    <!-- Admin Stats (Admin Only) -->
    <div v-if="auth.isAdmin" class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <!-- Total Users -->
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
            <UIcon name="i-heroicons-users" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <UBadge color="success" variant="soft">+12%</UBadge>
        </div>
        <p class="text-2xl font-bold text-slate-900 dark:text-white mb-1">1,234</p>
        <p class="text-sm text-slate-500 dark:text-slate-400">Total Users</p>
      </div>

      <!-- Active Sessions -->
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-lg bg-green-50 dark:bg-green-950/30 flex items-center justify-center">
            <UIcon name="i-heroicons-chart-bar" class="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <UBadge color="success" variant="soft">Live</UBadge>
        </div>
        <p class="text-2xl font-bold text-slate-900 dark:text-white mb-1">89</p>
        <p class="text-sm text-slate-500 dark:text-slate-400">Active Sessions</p>
      </div>

      <!-- Total Images -->
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-lg bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center">
            <UIcon name="i-heroicons-photo" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <UBadge color="info" variant="soft">+5%</UBadge>
        </div>
        <p class="text-2xl font-bold text-slate-900 dark:text-white mb-1">567</p>
        <p class="text-sm text-slate-500 dark:text-slate-400">Total Images</p>
      </div>

      <!-- Storage Used -->
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-lg bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center">
            <UIcon name="i-heroicons-circle-stack" class="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <UBadge color="warning" variant="soft">78%</UBadge>
        </div>
        <p class="text-2xl font-bold text-slate-900 dark:text-white mb-1">7.8 GB</p>
        <p class="text-sm text-slate-500 dark:text-slate-400">Storage Used</p>
      </div>
    </div>

    <!-- User Quick Actions (User Only) -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <NuxtLink to="/dashboard/gallery" class="block group">
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all">
          <div class="w-12 h-12 rounded-lg bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <UIcon name="i-heroicons-photo" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-2">View Gallery</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400">Browse and manage your images</p>
        </div>
      </NuxtLink>

      <NuxtLink to="/dashboard/settings" class="block group">
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all">
          <div class="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <UIcon name="i-heroicons-cog-6-tooth" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-2">Settings</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400">Manage your account settings</p>
        </div>
      </NuxtLink>
    </div>

    <!-- User Info Cards (Universal) -->
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

    <!-- System Info Card (Admin Only) -->
    <div v-if="auth.isAdmin" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
        <div class="flex items-center gap-3">
          <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <h3 class="font-semibold text-slate-900 dark:text-white">System Information</h3>
        </div>
      </div>
      <div class="p-6 space-y-4">
        <div class="flex justify-between items-center">
          <span class="text-sm text-slate-600 dark:text-slate-400">API Base URL</span>
          <span class="font-mono text-xs text-slate-900 dark:text-slate-100">http://localhost:5084/api/v1</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm text-slate-600 dark:text-slate-400">Environment</span>
          <UBadge color="info" variant="soft">Development</UBadge>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm text-slate-600 dark:text-slate-400">Auth Type</span>
          <span class="text-sm text-slate-900 dark:text-slate-100">JWT + Refresh Token</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm text-slate-600 dark:text-slate-400">Version</span>
          <span class="font-mono text-sm text-slate-900 dark:text-slate-100">v1.0.0</span>
        </div>
      </div>
    </div>
  </div>
</template>
