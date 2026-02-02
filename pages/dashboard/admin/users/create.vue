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
const toast = useToast()

const form = reactive<CreateUserRequest>({
  email: '',
  password: '',
  fullName: '',
  phoneNumber: '',
  address: '',
  isTechnician: false,
  role: 'User'
})

const showPassword = ref(false)
const isSubmitting = ref(false)

// Tidak perlu clearError karena mungkin tidak ada di store
// atau kita bisa membuat error state lokal
const localError = ref<string | null>(null)

const roleOptions = [
  { label: 'User (Akses Terbatas)', value: 'User' },
  { label: 'Admin (Akses Lengkap)', value: 'Admin' }
]

const validateForm = () => {
  const errors: string[] = []
  
  if (!form.email.trim()) {
    errors.push('Email is required')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.push('Please enter a valid email address')
  }
  
  if (!form.password) {
    errors.push('Password is required')
  } else if (form.password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  
  if (!form.fullName.trim()) {
    errors.push('Full name is required')
  }
  
  return errors
}

const handleSubmit = async () => {
  // Reset error state
  localError.value = null
  if (usersStore.error) {
    // Jika store punya error property, reset it
    usersStore.error = null
  }
  
  const validationErrors = validateForm()
  
  if (validationErrors.length > 0) {
    toast.add({
      title: 'Validation Error',
      description: validationErrors[0],
      icon: 'i-heroicons-exclamation-circle',
      color: 'error',
    })
    return
  }

  isSubmitting.value = true

  try {
    await usersStore.createUser(form)
    
    toast.add({
      title: 'Success',
      description: 'User created successfully',
      icon: 'i-heroicons-check-circle',
      color: 'success'
    })
    
    // Tunggu sebentar sebelum navigate agar user bisa melihat toast
    setTimeout(async () => {
      await usersStore.fetchUsers(1)
      await navigateTo('/dashboard/admin/users')
    }, 1500)
  } catch (error: any) {
    console.error('Error creating user:', error)
    
    // Tampilkan error dari store jika ada, atau dari exception
    const errorMessage = usersStore.error || error.message || 'Failed to create user'
    localError.value = errorMessage
    
    toast.add({
      title: 'Error',
      description: errorMessage,
      icon: 'i-heroicons-x-circle',
      color: 'error',
    })
  } finally {
    isSubmitting.value = false
  }
}

// Navigate back with confirmation if form has changes
const handleBack = () => {
  const hasChanges = Object.values(form).some(value => {
    if (typeof value === 'string') return value.trim() !== ''
    if (typeof value === 'boolean') return value !== false
    return false
  })
  
  if (hasChanges) {
    const confirmed = confirm('You have unsaved changes. Are you sure you want to leave?')
    if (confirmed) router.back()
  } else {
    router.back()
  }
}

// Clean up on unmount
onBeforeUnmount(() => {
  if (usersStore.error) {
    usersStore.error = null
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 p-4 md:p-6">
    <!-- Breadcrumb Navigation -->
    <nav class="mb-6">
      <ol class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
        <li>
          <NuxtLink to="/dashboard/admin" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            Dashboard
          </NuxtLink>
        </li>
        <li class="flex items-center">
          <i class="i-heroicons-chevron-right h-4 w-4 mx-2" />
          <NuxtLink to="/dashboard/admin/users" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            Users
          </NuxtLink>
        </li>
        <li class="flex items-center">
          <i class="i-heroicons-chevron-right h-4 w-4 mx-2" />
          <span class="text-gray-900 dark:text-gray-300 font-medium">Create New</span>
        </li>
      </ol>
    </nav>

    <!-- Header -->
    <div class="mb-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Buat Akun Pengguna Baru
          </h1>
          <p class="text-gray-600 dark:text-gray-400 max-w-2xl">
            Tambahkan akun pengguna baru dan tetapkan peran serta izin yang sesuai untuk akses sistem.
          </p>
        </div>
        <div class="flex items-center gap-2">
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-heroicons-arrow-left"
            @click="handleBack"
            :disabled="isSubmitting"
          >
            Back
          </UButton>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto">
      <UCard class="shadow-lg border border-gray-200 dark:border-gray-800">
        <template #header>
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/30">
              <i class="i-heroicons-user-plus h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                User Information
              </h2>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Fill in the details below to create a new user account
              </p>
            </div>
          </div>
        </template>

        <UForm class="space-y-8" @submit.prevent="handleSubmit">
          <!-- Personal Information Section -->
          <div class="space-y-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <i class="i-heroicons-user-circle h-5 w-5" />
              Personal Information
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Full Name -->
              <UFormField
                label="Nama Lengkap"
                name="fullName"
                required
                :help="form.fullName ? `${form.fullName.length} characters` : ''"
              >
                <UInput
                  v-model="form.fullName"
                  placeholder="Masukkan nama lengkap..."
                  icon="i-heroicons-user"
                  size="lg"
                  :ui="{ icon: { trailing: { pointer: '' } } }"
                  :trailing="form.fullName ? 
                    { icon: 'i-heroicons-x-mark', click: () => form.fullName = '' } : 
                    undefined"
                />
              </UFormField>

              <!-- Email -->
              <UFormField
                label="Alamat Email"
                name="email"
                required
                :help="form.email ? 'Valid email format required' : ''"
              >
                <UInput
                  v-model="form.email"
                  placeholder="user@example.com"
                  icon="i-heroicons-envelope"
                  type="email"
                  size="lg"
                  :ui="{ icon: { trailing: { pointer: '' } } }"
                  :trailing="form.email ? 
                    { icon: 'i-heroicons-x-mark', click: () => form.email = '' } : 
                    undefined"
                />
              </UFormField>

              <!-- Phone Number -->
              <UFormField
                label="Nomor Telepon"
                name="phoneNumber"
                help="Optional, but recommended for quick contact"
              >
                <UInput
                  v-model="form.phoneNumber"
                  placeholder="+62 812 3456 7890"
                  icon="i-heroicons-phone"
                  size="lg"
                  :ui="{ icon: { trailing: { pointer: '' } } }"
                  :trailing="form.phoneNumber ? 
                    { icon: 'i-heroicons-x-mark', click: () => form.phoneNumber = '' } : 
                    undefined"
                />
              </UFormField>
            </div>

            <!-- Address -->
            <UFormField
              label="Alamat Lengkap"
              name="address"
              help="Optional, untuk keperluan pengiriman dan verifikasi"
            >
              <UTextarea
                v-model="form.address"
                placeholder="Masukkan alamat lengkap..."
                :rows="3"
                :ui="{ base: 'resize-y' }"
              />
            </UFormField>
          </div>

          <!-- Account Settings Section -->
          <div class="space-y-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <i class="i-heroicons-cog-6-tooth h-5 w-5" />
              Account Settings
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Role Selection -->
              <UFormField
                label="User Role"
                name="role"
                required
              >
                <USelect
                  v-model="form.role"
                  :items="roleOptions"
                  placeholder="Select a role"
                  :ui="{ 
                    base: 'w-full',
                    icon: { base: 'text-gray-400 dark:text-gray-500' }
                  }"
                  size="lg"
                />
                <template #help>
                  <div class="mt-1 space-y-1">
                    <div v-if="form.role === 'Admin'" class="text-sm text-primary-600 dark:text-primary-400">
                      <i class="i-heroicons-shield-check h-4 w-4 inline mr-1" />
                      Akses penuh ke semua fitur dan pengaturan sistem
                    </div>
                    <div v-else-if="form.role === 'User'" class="text-sm text-gray-600 dark:text-gray-400">
                      <i class="i-heroicons-user h-4 w-4 inline mr-1" />
                      Akses terbatas untuk penggunaan umum saja
                    </div>
                  </div>
                </template>
              </UFormField>

              <!-- Password -->
              <UFormField
                label="Password"
                name="password"
                required
                :help="form.password ? `${form.password.length} characters` : 'Minimum 8 karakter'"
              >
                <UInput
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Enter password"
                  icon="i-heroicons-lock-closed"
                  :ui="{ icon: { trailing: { pointer: '' } } }"
                  :trailing="[
                    form.password ? {
                      icon: 'i-heroicons-x-mark',
                      click: () => form.password = ''
                    } : undefined,
                    {
                      icon: showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye',
                      click: () => showPassword = !showPassword
                    }
                  ].filter(Boolean)"
                  size="lg"
                />
              </UFormField>
            </div>

            <!-- Additional Options -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Technician Toggle -->
              <div class="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-1">
                    <i class="i-heroicons-wrench-screwdriver h-5 w-5 text-primary-600 dark:text-primary-400" />
                    <div>
                      <label class="block text-sm font-medium text-gray-900 dark:text-white">
                        Akun Teknisi
                      </label>
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        Berikan akses teknisi untuk mendapatkan harga khusus dan fitur teknisi
                      </p>
                    </div>
                  </div>
                </div>
                <USwitch v-model="form.isTechnician" color="primary" />
              </div>

              <!-- Password Strength Indicator -->
              <div v-if="form.password" class="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-gray-900 dark:text-white">Password Strength</span>
                  <span class="text-xs font-medium" :class="{
                    'text-red-500': form.password.length < 8,
                    'text-yellow-500': form.password.length >= 8 && form.password.length < 12,
                    'text-green-500': form.password.length >= 12
                  }">
                    {{
                      form.password.length < 8 ? 'Weak' :
                      form.password.length < 12 ? 'Medium' : 'Strong'
                    }}
                  </span>
                </div>
                <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    class="h-full transition-all duration-300"
                    :class="{
                      'w-1/3 bg-red-500': form.password.length < 8,
                      'w-2/3 bg-yellow-500': form.password.length >= 8 && form.password.length < 12,
                      'w-full bg-green-500': form.password.length >= 12
                    }"
                  />
                </div>
                <div class="mt-2 text-xs text-gray-600 dark:text-gray-400">
                  <i class="i-heroicons-information-circle h-3 w-3 inline mr-1" />
                  Include uppercase, lowercase, numbers, and symbols for better security
                </div>
              </div>
            </div>
          </div>

          <!-- Error Display -->
          <div v-if="localError || usersStore.error" class="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <div class="flex items-start gap-3">
              <i class="i-heroicons-exclamation-triangle h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div class="text-sm text-red-700 dark:text-red-300">
                <p class="font-medium mb-1">Unable to create user</p>
                <p>{{ localError || usersStore.error }}</p>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200 dark:border-gray-800">
            <div class="text-sm text-gray-600 dark:text-gray-400">
              <i class="i-heroicons-information-circle h-4 w-4 inline mr-1" />
              User akan menerima email notifikasi dengan detail akun setelah dibuat.
            </div>
            
            <div class="flex items-center gap-3 w-full sm:w-auto">
              <UButton
                type="button"
                color="neutral"
                variant="ghost"
                @click="handleBack"
                :disabled="isSubmitting"
                class="flex-1 sm:flex-none"
              >
                Batal
              </UButton>
              <UButton
                type="submit"
                color="primary"
                icon="i-heroicons-check"
                :loading="isSubmitting"
                :disabled="!form.email || !form.password || !form.fullName"
                class="flex-1 sm:flex-none"
                size="lg"
              >
                <template v-if="!isSubmitting">
                  Buat Akun
                </template>
                <template v-else>
                  Membuat...
                </template>
              </UButton>
            </div>
          </div>
        </UForm>
      </UCard>
    </div>
  </div>
</template>