<!-- pages/dashboard/users.vue -->
<script setup lang="ts">
definePageMeta({
  requiresAuth: true,
  middleware: 'admin',
  layout: 'dashboard'
})

const users = ref([
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'User', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Admin', status: 'Active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive' },
])
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">Users Management</h1>
        <p class="text-slate-600 dark:text-slate-400">Manage system users and permissions</p>
      </div>
      <UButton color="primary" icon="i-heroicons-plus">
        Add User
      </UButton>
    </div>

    <!-- Users Table -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
            <tr v-for="user in users" :key="user.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">{{ user.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">{{ user.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <UBadge :color="user.role === 'Admin' ? 'primary' : 'neutral'" variant="soft">
                  {{ user.role }}
                </UBadge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <UBadge :color="user.status === 'Active' ? 'success' : 'neutral'" variant="soft">
                  {{ user.status }}
                </UBadge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div class="flex items-center gap-2">
                  <UButton color="neutral" icon="i-heroicons-pencil" size="xs" />
                  <UButton color="error" icon="i-heroicons-trash" size="xs" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
