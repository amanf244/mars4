<!-- pages/dashboard/users/create.vue -->
<script setup lang="ts">
import type { CreateUserRequest } from '~/composables/useUserApi'
import { useUsersStore } from '~/stores/users'

definePageMeta({
  requiresAuth: true,
  middleware: 'admin',
  layout: 'dashboard'
})

const router = useRouter()
const usersStore = useUsersStore()

const form = reactive<CreateUserRequest>({
  email: '',
  password: '',
  fullName: '',
  phoneNumber: '',
  address: '',
  role: 'User'
})

const showPassword = ref(false)

const submitting = computed(() => usersStore.loading.action)
const error = computed(() => usersStore.error)

const roleOptions = [
  { label: 'Admin (full access)', value: 'Admin' },
  { label: 'User (limited access)', value: 'User' }
]

const handleSubmit = async () => {
  try {
    await usersStore.createUser(form)
    await usersStore.fetchUsers(1)
    router.push('/dashboard/users')
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
          Add New User
        </h1>
        <p class="text-slate-600 dark:text-slate-400">
          Create a new account and assign role & permissions
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

    <UCard>
      <UForm class="space-y-6" @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Full Name -->
          <UFormGroup
            label="Full Name"
            name="fullName"
            required
            help="Nama lengkap user yang akan muncul di dashboard dan struk."
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
            help="Email akan digunakan untuk login dan verifikasi."
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
            help="Opsional, tetapi disarankan untuk kontak cepat."
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
            help="Admin punya akses penuh, User hanya fitur tertentu."
          >
            <USelect
              v-model="form.role"
              :items="roleOptions"
              option-attribute="label"
              value-attribute="value"
              icon="i-heroicons-user-group"
            />
          </UFormGroup>
        </div>

        <!-- Address -->
        <UFormGroup
          label="Address"
          name="address"
          help="Alamat lengkap user, misalnya untuk invoice atau pengiriman."
        >
          <UTextarea
            v-model="form.address"
            placeholder="Jl. Contoh No. 123, Jakarta"
            :rows="3"
          />
        </UFormGroup>

        <!-- Password -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UFormGroup
            label="Password"
            name="password"
            help="Minimal 8 karakter, kombinasi huruf besar, kecil, angka, dan simbol."
            required
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
            Create User
          </UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>
