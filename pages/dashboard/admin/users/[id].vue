<!-- pages/dashboard/users/[id].vue -->
<script setup lang="ts">
import type { UpdateUserRequest, User } from '~/composables/useUserApi'
import { useUsersStore } from '~/stores/users'

definePageMeta({
  requiresAuth: true,
  middleware: 'admin',
  layout: 'dashboard'
})

const route = useRoute()
const router = useRouter()
const usersStore = useUsersStore()

const userId = computed(() => Number(route.params.id))

const form = reactive<UpdateUserRequest>({
  email: '',
  fullName: '',
  phoneNumber: '',
  address: '',
  role: 'User',
  isActive: true
})

const loadingInitial = ref(true)
const showPassword = ref(false)

const submitting = computed(() => usersStore.loading.action)
const error = computed(() => usersStore.error)

const roleOptions = [
  { label: 'Admin (full access)', value: 'Admin' },
  { label: 'User (limited access)', value: 'User' }
]

const statusOptions = [
  { label: 'Active', value: true },
  { label: 'Inactive', value: false }
]

const loadUser = async () => {
  try {
    const user = await usersStore.fetchUserById(userId.value)
    // map ke form (password tidak diisi)
    form.email = user.email
    form.fullName = user.fullName
    form.phoneNumber = user.phoneNumber
    form.address = user.address
    form.role = (user.role as any) || 'User'
    form.isActive = user.isActive
  } catch {
    // kalau gagal, kembali ke list
    await navigateTo('/dashboard/users')
  } finally {
    loadingInitial.value = false
  }
}

onMounted(loadUser)

const handleSubmit = async () => {
  try {
    await usersStore.updateUser(userId.value, form)
    await usersStore.fetchUsers(usersStore.filters.page, usersStore.filters.search)
   await navigateTo('/dashboard/users')
  } catch {
    // error sudah di-store
  }
}
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Edit User
        </h1>
        <p class="text-slate-600 dark:text-slate-400">
          Update user information, role, and account status
        </p>
      </div>
      <div class="flex items-center gap-2">
        <UButton
          color="neutral"
          variant="soft"
          icon="i-heroicons-arrow-left"
          @click="$router.back()"
        >
          Back
        </UButton>
      </div>
    </div>

    <UCard v-if="!loadingInitial">
      <UForm class="space-y-6" @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Full Name -->
          <UFormGroup
            label="Full Name"
            name="fullName"
            required
            help="Nama lengkap user."
          >
            <UInput
              v-model="form.fullName"
              placeholder="Super Admin"
              icon="i-heroicons-user"
            />
          </UFormGroup>

          <!-- Email -->
          <UFormGroup
            label="Email"
            name="email"
            required
            help="Email login user. Jika diubah, user akan memakai email baru untuk login."
          >
            <UInput
              v-model="form.email"
              placeholder="user@example.com"
              icon="i-heroicons-envelope"
              type="email"
            />
          </UFormGroup>

          <!-- Phone -->
          <UFormGroup
            label="Phone Number"
            name="phoneNumber"
            help="Nomor telepon user."
          >
            <UInput
              v-model="form.phoneNumber"
              placeholder="+628123456789"
              icon="i-heroicons-phone"
            />
          </UFormGroup>

          <!-- Role -->
          <UFormGroup
            label="Role"
            name="role"
            required
            help="Ganti role untuk mengatur level akses user."
          >
            <USelect
              v-model="form.role"
              :items="roleOptions"
              option-attribute="label"
              value-attribute="value"
              icon="i-heroicons-user-group"
            />
          </UFormGroup>

          <!-- Status -->
          <UFormGroup
            label="Account Status"
            name="isActive"
            help="Nonaktifkan akun untuk mencegah user login, tanpa menghapus data."
          >
            <USelect
              v-model="form.isActive"
              :items="statusOptions"
              option-attribute="label"
              value-attribute="value"
              icon="i-heroicons-power"
            />
          </UFormGroup>
        </div>

        <!-- Address -->
        <UFormGroup
          label="Address"
          name="address"
          help="Alamat user jika diperlukan."
        >
          <UTextarea
            v-model="form.address"
            placeholder="Jl. Contoh No. 123, Jakarta"
            :rows="3"
          />
        </UFormGroup>

        <!-- Password (opsional) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UFormGroup
            label="New Password (optional)"
            name="password"
            help="Kosongkan jika tidak ingin mengubah password."
          >
            <UInput
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              icon="i-heroicons-lock-closed"
              :trailing-icon="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
              @click:trailing="showPassword = !showPassword"
            />
          </UFormGroup>
        </div>

        <!-- Error -->
        <div v-if="error" class="text-sm text-red-500">
          {{ error }}
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3 pt-2">
          <UButton
            color="neutral"
            variant="ghost"
            @click="$router.back()"
          >
            Cancel
          </UButton>
          <UButton
            type="submit"
            color="primary"
            icon="i-heroicons-check"
            :loading="submitting"
          >
            Save Changes
          </UButton>
        </div>
      </UForm>
    </UCard>

    <div v-else class="flex items-center justify-center py-16">
      <ULoadingIcon size="lg" />
    </div>
  </div>
</template>
