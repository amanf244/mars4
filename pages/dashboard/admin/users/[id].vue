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
const toast = useToast()

const userId = computed(() => Number(route.params.id))

const form = reactive<UpdateUserRequest>({
  email: '',
  fullName: '',
  phoneNumber: '',
  address: '',
  role: 'User',
  isActive: true,
  password: ''
})

const loadingInitial = ref(true)
const showPassword = ref(false)
const isSubmitting = ref(false)
const localError = ref<string | null>(null)

const roleOptions = [
  { label: 'User (Akses Terbatas)', value: 'User' },
  { label: 'Admin (Akses Penuh)', value: 'Admin' }
]

const statusOptions = [
  { label: 'Aktif', value: true },
  { label: 'Nonaktif', value: false }
]

// Load user data
const loadUser = async () => {
  try {
    const user = await usersStore.fetchUserById(userId.value)
    form.email = user.email
    form.fullName = user.fullName
    form.phoneNumber = user.phoneNumber || ''
    form.address = user.address || ''
    form.role = user.role as any || 'User'
    form.isActive = user.isActive
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: 'Gagal memuat data user',
      icon: 'i-heroicons-x-circle',
      color: 'error',
    })
    await navigateTo('/dashboard/users')
  } finally {
    loadingInitial.value = false
  }
}

onMounted(loadUser)

// Form validation
const validateForm = () => {
  const errors: string[] = []
  
  if (!form.email.trim()) {
    errors.push('Email wajib diisi')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.push('Format email tidak valid')
  }
  
  if (!form.fullName.trim()) {
    errors.push('Nama lengkap wajib diisi')
  }
  
  if (form.password && form.password.length < 8) {
    errors.push('Password minimal 8 karakter')
  }
  
  return errors
}

// Submit form
const handleSubmit = async () => {
  localError.value = null
  if (usersStore.error) {
    usersStore.error = null
  }
  
  const validationErrors = validateForm()
  
  if (validationErrors.length > 0) {
    toast.add({
      title: 'Validasi Gagal',
      description: validationErrors[0],
      icon: 'i-heroicons-exclamation-circle',
      color: 'error',
    })
    return
  }

  isSubmitting.value = true

  try {
    await usersStore.updateUser(userId.value, form)
    
    toast.add({
      title: 'Berhasil',
      description: 'Data user berhasil diperbarui',
      icon: 'i-heroicons-check-circle',
      color: 'success',
      timeout: 3000
    })
    
    setTimeout(async () => {
      await usersStore.fetchUsers(usersStore.filters.page || 1, usersStore.filters.search || '')
      await navigateTo('/dashboard/users')
    }, 1500)
  } catch (error: any) {
    console.error('Error updating user:', error)
    
    const errorMessage = usersStore.error || error.message || 'Gagal memperbarui user'
    localError.value = errorMessage
    
    toast.add({
      title: 'Error',
      description: errorMessage,
      icon: 'i-heroicons-x-circle',
      color: 'red',
      timeout: 5000
    })
  } finally {
    isSubmitting.value = false
  }
}

// Navigate back with confirmation
const handleBack = () => {
  const hasChanges = Object.values(form).some((value, key) => {
    if (key === 'password') return false // ignore password
    if (typeof value === 'string') return value.trim() !== ''
    if (typeof value === 'boolean') return value !== true
    return false
  })
  
  if (hasChanges) {
    const confirmed = confirm('Ada perubahan yang belum disimpan. Yakin ingin keluar?')
    if (confirmed) router.back()
  } else {
    router.back()
  }
}

// Clean up
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
          <NuxtLink to="/dashboard" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            Dashboard
          </NuxtLink>
        </li>
        <li class="flex items-center">
          <i class="i-heroicons-chevron-right h-4 w-4 mx-2" />
          <NuxtLink to="/dashboard/users" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            Users
          </NuxtLink>
        </li>
        <li class="flex items-center">
          <i class="i-heroicons-chevron-right h-4 w-4 mx-2" />
          <span class="text-gray-900 dark:text-gray-300 font-medium">Edit User</span>
        </li>
      </ol>
    </nav>

    <!-- Header -->
    <div class="mb-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Edit User
          </h1>
          <p class="text-gray-600 dark:text-gray-400 max-w-2xl">
            Perbarui informasi, role, dan status akun user
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
            Kembali
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
              <i class="i-heroicons-user-circle h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                Informasi User
              </h2>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Perbarui data user dan pengaturan akun
              </p>
            </div>
          </div>
        </template>

        <!-- Loading State -->
        <div v-if="loadingInitial" class="flex items-center justify-center py-16">
          <div class="text-center space-y-4">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p class="text-gray-600 dark:text-gray-400">Memuat data user...</p>
          </div>
        </div>

        <!-- User Form -->
        <UForm v-else class="space-y-8" @submit.prevent="handleSubmit">
          <!-- Personal Information Section -->
          <div class="space-y-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <i class="i-heroicons-user-circle h-5 w-5" />
              Informasi Pribadi
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Nama Lengkap -->
              <UFormField
                label="Nama Lengkap"
                name="fullName"
                required
                :help="form.fullName ? `${form.fullName.length} karakter` : ''"
              >
                <UInput
                  v-model="form.fullName"
                  placeholder="Masukkan nama lengkap"
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
                label="Email"
                name="email"
                required
                help="Email digunakan untuk login"
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

              <!-- Nomor Telepon -->
              <UFormField
                label="Nomor Telepon"
                name="phoneNumber"
                help="Opsional, untuk kontak cepat"
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

              <!-- Role -->
              <UFormField
                label="Role"
                name="role"
                required
                help="Tentukan level akses user"
              >
                <USelect
                  v-model="form.role"
                  :items="roleOptions"
                  placeholder="Pilih role"
                  size="md"
                />
                <template #help>
                  <div class="mt-1 space-y-1">
                    <div v-if="form.role === 'Admin'" class="text-sm text-primary-600 dark:text-primary-400">
                      <i class="i-heroicons-shield-check h-4 w-4 inline mr-1" />
                      Akses penuh ke semua fitur sistem
                    </div>
                    <div v-else-if="form.role === 'User'" class="text-sm text-gray-600 dark:text-gray-400">
                      <i class="i-heroicons-user h-4 w-4 inline mr-1" />
                      Akses terbatas hanya ke fitur tertentu
                    </div>
                  </div>
                </template>
              </UFormField>

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

              <!-- Status Akun -->
              <UFormField
                label="Status Akun"
                name="isActive"
                help="Nonaktifkan untuk mencegah login"
              >
                <USelect
                  v-model="form.isActive"
                  :items="statusOptions"
                  placeholder="Pilih status"
                  size="lg"
                />
                <template #help>
                  <div class="mt-1 space-y-1">
                    <div v-if="form.isActive" class="text-sm text-green-600 dark:text-green-400">
                      <i class="i-heroicons-check-circle h-4 w-4 inline mr-1" />
                      User dapat login dan menggunakan sistem
                    </div>
                    <div v-else class="text-sm text-red-600 dark:text-red-400">
                      <i class="i-heroicons-x-circle h-4 w-4 inline mr-1" />
                      User tidak dapat login ke sistem
                    </div>
                  </div>
                </template>
              </UFormField>
            </div>

            <!-- Alamat -->
            <UFormField
              label="Alamat"
              name="address"
              help="Alamat lengkap user"
            >
              <UTextarea
                v-model="form.address"
                placeholder="Masukkan alamat lengkap..."
                :rows="3"
                :ui="{ base: 'resize-y' }"
              />
            </UFormField>
          </div>

          <!-- Security Section -->
          <div class="space-y-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <i class="i-heroicons-lock-closed h-5 w-5" />
              Keamanan Akun
            </h3>
            
            <!-- Password -->
            <UFormField
              label="Password Baru"
              name="password"
              help="Kosongkan jika tidak ingin mengubah password"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <UInput
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="Masukkan password baru"
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
                </div>
                <div v-if="form.password" class="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-gray-900 dark:text-white">Kekuatan Password</span>
                    <span class="text-xs font-medium" :class="{
                      'text-red-500': form.password.length < 8,
                      'text-yellow-500': form.password.length >= 8 && form.password.length < 12,
                      'text-green-500': form.password.length >= 12
                    }">
                      {{
                        form.password.length < 8 ? 'Lemah' :
                        form.password.length < 12 ? 'Sedang' : 'Kuat'
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
                    Minimal 8 karakter untuk keamanan yang baik
                  </div>
                </div>
              </div>
            </UFormField>
          </div>

          <!-- Error Display -->
          <div v-if="localError || usersStore.error" class="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <div class="flex items-start gap-3">
              <i class="i-heroicons-exclamation-triangle h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div class="text-sm text-red-700 dark:text-red-300">
                <p class="font-medium mb-1">Gagal memperbarui user</p>
                <p>{{ localError || usersStore.error }}</p>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200 dark:border-gray-800">
            <div class="text-sm text-gray-600 dark:text-gray-400">
              <i class="i-heroicons-information-circle h-4 w-4 inline mr-1" />
              Perubahan akan segera diterapkan setelah disimpan
            </div>
            
            <div class="flex items-center gap-3 w-full sm:w-auto">
              <UButton
                type="button"
                color="gray"
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
                :disabled="!form.email || !form.fullName"
                class="flex-1 sm:flex-none"
                size="lg"
              >
                <template v-if="!isSubmitting">
                  Simpan Perubahan
                </template>
                <template v-else>
                  Menyimpan...
                </template>
              </UButton>
            </div>
          </div>
        </UForm>
      </UCard>
    </div>
  </div>
</template>