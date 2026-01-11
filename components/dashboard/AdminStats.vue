<!-- components/dashboard/AdminStats.vue -->
<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
    <div class="stat-card">
      <div class="stat-icon bg-blue-50 dark:bg-blue-950/30">
        <UIcon name="i-heroicons-users" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
      </div>
      <p class="stat-value">1,234</p>
      <p class="stat-label">Total Users</p>
    </div>
    <!-- More stats... -->
  </div>
</template>

<style scoped>
.stat-card {
  @apply bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm;
}
.stat-icon {
  @apply w-12 h-12 rounded-lg flex items-center justify-center mb-4;
}
.stat-value {
  @apply text-2xl font-bold text-slate-900 dark:text-white mb-1;
}
.stat-label {
  @apply text-sm text-slate-500 dark:text-slate-400;
}
</style>
