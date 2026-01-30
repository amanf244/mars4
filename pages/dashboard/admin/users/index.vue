<!-- pages/dashboard/users.vue -->
<script setup lang="ts">
import { h } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { User } from '~/composables/useUserApi'

definePageMeta({
  requiresAuth: true,
  middleware: 'admin',
  layout: 'dashboard'
})

const usersStore = useUsersStore()
const router = useRouter()

const search = ref('')

const columns: TableColumn<User>[] = [
  {
    accessorKey: 'fullName',
    header: 'Name',
    cell: ({ row }) => row.getValue('fullName')
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => row.getValue('email')
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
      const role = row.getValue('role') as string
      const color = role.toLowerCase() === 'admin' ? 'primary' : 'neutral'
      return h(resolveComponent('UBadge'), { color, variant: 'soft' }, () => role)
    }
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.getValue('isActive') as boolean
      const label = isActive ? 'Active' : 'Inactive'
      const color = isActive ? 'success' : 'neutral'
      return h(resolveComponent('UBadge'), { color, variant: 'soft' }, () => label)
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const user = row.original as User
      const UButton = resolveComponent('UButton')
      return h('div', { class: 'flex items-center gap-2' }, [
        h(UButton, {
          color: 'neutral',
          icon: 'i-heroicons-pencil',
          size: 'xs',
          onClick: () => handleEdit(user)
        }),
        h(UButton, {
          color: 'error',
          icon: 'i-heroicons-trash',
          size: 'xs',
          onClick: () => handleDelete(user)
        })
      ])
    }
  }
]

const sortedUsers = computed(() => usersStore.users)

// INIT
onMounted(() => {
  usersStore.fetchUsers()
})

// HANDLERS
const handleSearch = useDebounceFn(() => {
  usersStore.fetchUsers(1, search.value)
}, 400)

const handleAdd = () => {
  // nanti buka modal / navigate ke /dashboard/users/create
  router.push('/dashboard/admin/users/create')
}

const handleEdit = (user: User) => {
  usersStore.selectedUser = user
  // buka modal edit / navigate ke detail
  router.push(`/dashboard/admin/users/${user.id}`)
}

const handleDelete = async (user: User) => {
  if (!confirm(`Hapus user ${user.fullName}?`)) return
  await usersStore.deleteUser(user.id)
}
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Users Management
        </h1>
        <p class="text-slate-600 dark:text-slate-400">
          Manage system users and permissions
        </p>
      </div>

      <div class="flex items-center gap-3">
        <UInput
          v-model="search"
          icon="i-heroicons-magnifying-glass"
          placeholder="Search by name or email..."
          class="w-64"
          @input="handleSearch"
        />
        <UButton color="primary" icon="i-heroicons-plus" @click="handleAdd">
          Add User
        </UButton>
      </div>
    </div>

    <!-- Summary -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <UCard>
        <div class="text-xs text-slate-500 mb-1">Total Users</div>
        <div class="text-2xl font-semibold">
          {{ usersStore.totalUsers }}
        </div>
      </UCard>
      <UCard>
        <div class="text-xs text-slate-500 mb-1">Active</div>
        <div class="text-2xl font-semibold text-emerald-500">
          {{ usersStore.activeCount }}
        </div>
      </UCard>
      <UCard>
        <div class="text-xs text-slate-500 mb-1">Inactive</div>
        <div class="text-2xl font-semibold text-slate-500">
          {{ usersStore.inactiveCount }}
        </div>
      </UCard>
      <UCard>
        <div class="text-xs text-slate-500 mb-1">Verified Email</div>
        <div class="text-2xl font-semibold text-sky-500">
          {{ usersStore.verifiedCount }}
        </div>
      </UCard>
    </div>

    <!-- Users Table -->
    <UCard>
      <UTable
        :columns="columns"
        :data="sortedUsers"
        :loading="usersStore.loading.list"
      />
    </UCard>
  </div>
</template>
