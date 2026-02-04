<!-- pages/dashboard/users/[id].vue -->
<script setup lang="ts">
import type { UpdateUserRequest, User } from '~/composables/useUserApi'
import { useUsersStore } from '~/stores/users'
// import ConfirmModal from '~/components/ConfirmModal.vue'

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
  isTechnician: false,
  password: ''
})

const loadingInitial = ref(true)
const showPassword = ref(false)
const isSubmitting = ref(false)
const localError = ref<string | null>(null)
const hasUnsavedChanges = ref(false)

const roleOptions = [
  { label: 'User (Akses Terbatas)', value: 'User' as User['role'] },
  { label: 'Admin (Akses Penuh)', value: 'Admin' as User['role'] }
]

const statusOptions = [
  { label: 'Aktif', value: true },
  { label: 'Nonaktif', value: false }
]

// Watch form changes
watch(
  () => ({ ...form }),
  () => {
    hasUnsavedChanges.value = true
  },
  { deep: true }
)

// Load user data
const loadUser = async () => {
  try {
    const user = await usersStore.fetchUserById(userId.value)
    form.email = user.email ?? ''
    form.fullName = user.fullName ?? ''
    form.phoneNumber = user.phoneNumber ?? ''
    form.address = user.address ?? ''
    form.role = user.role === 'Admin' ? 'Admin' : 'User'
    form.isActive = user.isActive
    form.isTechnician = user.isTechnician ?? false
    hasUnsavedChanges.value = false
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: 'Gagal memuat data user',
      icon: 'i-heroicons-x-circle',
      color: 'error'
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

  if (!form.email?.trim()) {
    errors.push('Email wajib diisi')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.push('Format email tidak valid')
  }

  if (!form.fullName?.trim()) {
    errors.push('Nama lengkap wajib diisi')
  } else if (form.fullName.length < 2) {
    errors.push('Nama minimal 2 karakter')
  }

  if (form.phoneNumber && !/^[0-9+\-\s()]+$/.test(form.phoneNumber)) {
    errors.push('Format nomor telepon tidak valid')
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
      color: 'error'
    })
    return
  }

  isSubmitting.value = true

  try {
    // Create update payload, exclude password if empty
    const updatePayload: UpdateUserRequest = { ...form }
    if (!updatePayload.password?.trim()) {
      delete (updatePayload as any).password
    }

    await usersStore.updateUser(userId.value, updatePayload)

    toast.add({
      title: 'Berhasil',
      description: 'Data user berhasil diperbarui',
      icon: 'i-heroicons-check-circle',
      color: 'success'
    })

    hasUnsavedChanges.value = false

    setTimeout(async () => {
      await usersStore.fetchUsers(
        usersStore.filters.page || 1,
        usersStore.filters.search || ''
      )
      await navigateTo('/dashboard/admin/users')
    }, 1500)
  } catch (error: any) {
    console.error('Error updating user:', error)

    const errorMessage =
      usersStore.error || error.message || 'Gagal memperbarui user'
    localError.value = errorMessage

    toast.add({
      title: 'Error',
      description: errorMessage,
      icon: 'i-heroicons-x-circle',
      color: 'error',
      // Nuxt UI Toast tidak punya `timeout`, gunakan `duration`
      duration: 5000
    })
  } finally {
    isSubmitting.value = false
  }
}

// Reset form to original values
const handleReset = () => {
  loadUser()
  hasUnsavedChanges.value = false
  toast.add({
    title: 'Reset',
    description: 'Perubahan telah dibatalkan',
    icon: 'i-heroicons-arrow-path',
    color: 'neutral'
  })
}

// Confirm dialog helper (Nuxt UI modal)
const confirmDialog = (title: string, message: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const modal = useModal()
    modal.open(ConfirmModal, {
      title,
      message,
      onConfirm: () => {
        resolve(true)
        modal.close()
      },
      onCancel: () => {
        resolve(false)
        modal.close()
      }
    })
  })
}

// Navigate back with confirmation
const handleBack = async () => {
  if (hasUnsavedChanges.value) {
    const confirmed = await confirmDialog(
      'Ada perubahan yang belum disimpan',
      'Yakin ingin meninggalkan halaman ini? Perubahan yang belum disimpan akan hilang.'
    )
    if (confirmed) {
      router.back()
    }
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
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Breadcrumb Navigation -->
      <nav class="mb-6">
        <ol class="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <li>
            <NuxtLink
              to="/dashboard/admin"
              class="inline-flex items-center gap-1 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <i class="i-heroicons-home h-4 w-4" />
              Dashboard
            </NuxtLink>
          </li>
          <li class="flex items-center">
            <i class="i-heroicons-chevron-right h-4 w-4 mx-1" />
            <NuxtLink
              to="/dashboard/admin/users"
              class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Users
            </NuxtLink>
          </li>
          <li class="flex items-center">
            <i class="i-heroicons-chevron-right h-4 w-4 mx-1" />
            <span class="text-gray-900 dark:text-gray-200 font-medium truncate">
              {{ form.fullName || 'Edit User' }}
            </span>
          </li>
        </ol>
      </nav>

      <!-- Page Header -->
      <div class="mb-8">
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-3">
              <div class="p-2 rounded-xl bg-primary-100 dark:bg-primary-900/30">
                <i class="i-heroicons-user-circle h-7 w-7 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  Edit User
                </h1>
                <p class="text-gray-600 dark:text-gray-400 mt-1">
                  Perbarui informasi pengguna dan pengaturan akun
                </p>
              </div>
            </div>
            <div class="flex flex-wrap items-center gap-2 mt-4">
              <UBadge
                :color="form.isActive ? 'success' : 'error'"
                variant="subtle"
                class="inline-flex items-center gap-1"
              >
                <i
                  v-if="form.isActive"
                  class="i-heroicons-check-circle h-3 w-3"
                />
                <i
                  v-else
                  class="i-heroicons-x-circle h-3 w-3"
                />
                {{ form.isActive ? 'Aktif' : 'Nonaktif' }}
              </UBadge>

              <UBadge
                :color="form.role === 'Admin' ? 'primary' : 'secondary'"
                variant="subtle"
                class="inline-flex items-center gap-1"
              >
                <i
                  v-if="form.role === 'Admin'"
                  class="i-heroicons-shield-check h-3 w-3"
                />
                <i
                  v-else
                  class="i-heroicons-user h-3 w-3"
                />
                {{ form.role }}
              </UBadge>

              <UBadge
                v-if="form.isTechnician"
                color="warning"
                variant="subtle"
                class="inline-flex items-center gap-1"
              >
                <i class="i-heroicons-wrench-screwdriver h-3 w-3" />
                Teknisi
              </UBadge>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap items-center gap-2">
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-heroicons-arrow-left"
              @click="handleBack"
              :disabled="isSubmitting"
              class="shrink-0"
            >
              Kembali
            </UButton>
            <UButton
              v-if="hasUnsavedChanges"
              color="warning"
              variant="soft"
              icon="i-heroicons-arrow-path"
              @click="handleReset"
              :disabled="isSubmitting"
              class="shrink-0"
            >
              Reset
            </UButton>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column - Form -->
        <div class="lg:col-span-2">
          <UCard
            class="h-full shadow-lg border border-gray-200 dark:border-gray-800"
            :ui="{
              body: { padding: 'p-0 sm:p-0' },
              ring: 'ring-0'
            }"
          >
            <!-- Loading State -->
            <div v-if="loadingInitial" class="p-8">
              <div class="flex flex-col items-center justify-center py-12 space-y-4">
                <div class="relative">
                  <div class="h-16 w-16 rounded-full border-4 border-gray-200 dark:border-gray-700" />
                  <div class="absolute inset-0 h-16 w-16 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
                </div>
                <p class="text-gray-600 dark:text-gray-400 font-medium">
                  Memuat data user...
                </p>
              </div>
            </div>

            <!-- User Form -->
            <UForm
              v-else
              class="divide-y divide-gray-200 dark:divide-gray-800"
              @submit.prevent="handleSubmit"
            >
              <!-- Personal Information Section -->
              <div class="p-6 space-y-6">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                      Informasi Pribadi
                    </h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Data dasar dan kontak pengguna
                    </p>
                  </div>
                  <div class="h-10 w-10 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                    <i class="i-heroicons-user h-5 w-5 text-primary-600 dark:text-primary-400" />
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <!-- Nama Lengkap -->
                  <UFormField label="Nama Lengkap" name="fullName" required>
                    <UInput
                      v-model="form.fullName"
                      placeholder="Masukkan nama lengkap"
                      icon="i-heroicons-user"
                      size="lg"
                      :ui="{
                        leadingIcon: 'i-heroicons-user',
                        base: 'pl-10'
                      }"
                    />
                    <template #help>
                      <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {{ form.fullName ? `${form.fullName.length} karakter` : 'Wajib diisi' }}
                      </div>
                    </template>
                  </UFormField>

                  <!-- Email -->
                  <UFormField label="Email" name="email" required>
                    <UInput
                      v-model="form.email"
                      placeholder="user@example.com"
                      type="email"
                      size="lg"
                      :ui="{
                        leadingIcon: 'i-heroicons-envelope',
                        base: 'pl-10'
                      }"
                    />
                    <template #help>
                      <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Digunakan untuk login
                      </div>
                    </template>
                  </UFormField>

                  <!-- Nomor Telepon -->
                  <UFormField label="Nomor Telepon" name="phoneNumber">
                    <UInput
                      v-model="form.phoneNumber"
                      placeholder="+62 812 3456 7890"
                      size="lg"
                      :ui="{
                        leadingIcon: 'i-heroicons-phone',
                        base: 'pl-10'
                      }"
                    />
                    <template #help>
                      <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Opsional, format internasional
                      </div>
                    </template>
                  </UFormField>

                  <!-- Role -->
                  <UFormField label="Role" name="role" required>
                    <USelectMenu
  v-model="form.role"
  :options="roleOptions"
  option-attribute="label"
  value-attribute="value"
  placeholder="Pilih role"
  size="lg"
  class="w-full"
>
  <template #leading>
    <i
      :class="form.role === 'Admin'
        ? 'i-heroicons-shield-check'
        : 'i-heroicons-user'"
      class="h-4 w-4"
    />
  </template>
</USelectMenu>

                    <template #help>
                      <div
                        class="text-xs mt-1"
                        :class="form.role === 'Admin'
                          ? 'text-purple-600 dark:text-purple-400'
                          : 'text-blue-600 dark:text-blue-400'"
                      >
                        <i class="i-heroicons-information-circle h-3 w-3 inline mr-1" />
                        {{ form.role === 'Admin'
                          ? 'Akses penuh ke semua fitur'
                          : 'Akses terbatas'
                        }}
                      </div>
                    </template>
                  </UFormField>
                </div>

                <!-- Alamat -->
                <UFormField label="Alamat" name="address">
                  <UTextarea
                    v-model="form.address"
                    placeholder="Masukkan alamat lengkap..."
                    :rows="3"
                    :ui="{ base: 'resize-none px-3 py-2' }"
                  />
                </UFormField>
              </div>

              <!-- Account Settings Section -->
              <div class="p-6 space-y-6">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                      Pengaturan Akun
                    </h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Status akun dan hak akses tambahan
                    </p>
                  </div>
                  <div class="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                    <i class="i-heroicons-cog-6-tooth h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>

                <div class="space-y-4">
                  <!-- Status Akun -->
                  <div class="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors">
                    <div class="flex items-start gap-3">
                      <div
                        class="p-2 rounded-lg"
                        :class="form.isActive
                          ? 'bg-green-100 dark:bg-green-900/30'
                          : 'bg-red-100 dark:bg-red-900/30'"
                      >
                        <i
                          :class="form.isActive
                            ? 'i-heroicons-check-circle text-green-600 dark:text-green-400'
                            : 'i-heroicons-x-circle text-red-600 dark:text-red-400'"
                          class="h-5 w-5"
                        />
                      </div>
                      <div>
                        <label class="block font-medium text-gray-900 dark:text-white mb-1">
                          Status Akun
                        </label>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                          {{ form.isActive
                            ? 'User dapat login ke sistem'
                            : 'User tidak dapat login'
                          }}
                        </p>
                      </div>
                    </div>
                    <USelect
                      v-model="form.isActive"
                      :items="statusOptions"
                      size="md"
                      :ui="{ base: 'w-32 px-3 py-2' }"
                    />
                  </div>

                  <!-- Technician Toggle -->
                  <div class="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors">
                    <div class="flex items-start gap-3">
                      <div class="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                        <i class="i-heroicons-wrench-screwdriver h-5 w-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <label class="block font-medium text-gray-900 dark:text-white mb-1">
                          Hak Akses Teknisi
                        </label>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                          Berikan akses khusus untuk teknisi (harga khusus, fitur teknisi)
                        </p>
                      </div>
                    </div>
                    <USwitch v-model="form.isTechnician" color="warning" />
                  </div>
                </div>
              </div>

              <!-- Security Section -->
              <div class="p-6 space-y-6">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                      Keamanan
                    </h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Atur password baru untuk pengguna
                    </p>
                  </div>
                  <div class="h-10 w-10 rounded-lg bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
                    <i class="i-heroicons-lock-closed h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                </div>

                <div class="space-y-4">
                  <!-- Password -->
                  <UFormField label="Password Baru" name="password">
                    <div class="space-y-3">
                      <div class="relative">
                        <UInput
                          v-model="form.password"
                          :type="showPassword ? 'text' : 'password'"
                          placeholder="Masukkan password baru"
                          size="lg"
                          :ui="{
                            leadingIcon: 'i-heroicons-key',
                            base: 'pl-10 pr-20'
                          }"
                        />
                        <button
                          type="button"
                          @click="showPassword = !showPassword"
                          class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                          <i
                            :class="showPassword
                              ? 'i-heroicons-eye-slash'
                              : 'i-heroicons-eye'"
                            class="h-5 w-5"
                          />
                        </button>
                      </div>

                      <!-- Password Strength Indicator -->
                      <div
                        v-if="form.password"
                        class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30"
                      >
                        <div class="flex items-center justify-between mb-3">
                          <span class="text-sm font-medium text-gray-900 dark:text-white">
                            Kekuatan Password
                          </span>
                          <span
                            class="text-sm font-semibold"
                            :class="{
                              'text-red-500': form.password.length < 8,
                              'text-amber-500':
                                form.password.length >= 8 &&
                                form.password.length < 12,
                              'text-green-500': form.password.length >= 12
                            }"
                          >
                            {{
                              form.password.length < 8
                                ? 'Lemah'
                                : form.password.length < 12
                                  ? 'Sedang'
                                  : 'Kuat'
                            }}
                          </span>
                        </div>
                        <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
                          <div
                            class="h-full transition-all duration-500"
                            :class="{
                              'w-1/4 bg-red-500': form.password.length < 8,
                              'w-2/4 bg-amber-500':
                                form.password.length >= 8 &&
                                form.password.length < 12,
                              'w-full bg-green-500': form.password.length >= 12
                            }"
                          />
                        </div>
                        <div class="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                          <div class="flex items-center gap-2">
                            <i
                              class="i-heroicons-check-circle h-3 w-3"
                              :class="form.password.length >= 8
                                ? 'text-green-500'
                                : 'text-gray-400'"
                            />
                            <span>Minimal 8 karakter</span>
                          </div>
                          <div class="flex items-center gap-2">
                            <i
                              class="i-heroicons-check-circle h-3 w-3"
                              :class="/(?=.*[A-Z])/.test(form.password)
                                ? 'text-green-500'
                                : 'text-gray-400'"
                            />
                            <span>Minimal 1 huruf besar</span>
                          </div>
                          <div class="flex items-center gap-2">
                            <i
                              class="i-heroicons-check-circle h-3 w-3"
                              :class="/(?=.*[0-9])/.test(form.password)
                                ? 'text-green-500'
                                : 'text-gray-400'"
                            />
                            <span>Minimal 1 angka</span>
                          </div>
                        </div>
                      </div>

                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        <i class="i-heroicons-information-circle h-3 w-3 inline mr-1" />
                        Kosongkan jika tidak ingin mengubah password
                      </p>
                    </div>
                  </UFormField>
                </div>
              </div>

              <!-- Error Display -->
              <div v-if="localError || usersStore.error" class="p-6">
                <div class="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <div class="flex items-start gap-3">
                    <i class="i-heroicons-exclamation-triangle h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div class="text-sm">
                      <p class="font-semibold text-red-700 dark:text-red-300 mb-1">
                        Gagal memperbarui user
                      </p>
                      <p class="text-red-600 dark:text-red-400">
                        {{ localError || usersStore.error }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="p-6 border-t border-gray-200 dark:border-gray-800">
                <div class="flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
                  <div class="text-sm text-gray-600 dark:text-gray-400 w-full sm:w-auto">
                    <div class="flex items-center gap-2">
                      <i class="i-heroicons-information-circle h-4 w-4" />
                      <span>Tekan Ctrl+S untuk menyimpan</span>
                    </div>
                  </div>

                  <div class="flex items-center gap-3 w-full sm:w-auto">
                    <UButton
                      type="button"
                      color="neutral"
                      variant="soft"
                      @click="handleBack"
                      :disabled="isSubmitting"
                      class="flex-1 sm:flex-none"
                    >
                      Batal
                    </UButton>
                    <UButton
                      type="submit"
                      color="primary"
                      :loading="isSubmitting"
                      :disabled="!form.email || !form.fullName || !hasUnsavedChanges"
                      class="flex-1 sm:flex-none shadow-lg shadow-primary-500/20"
                      size="lg"
                    >
                      <template v-if="!isSubmitting">
                        <i class="i-heroicons-check h-5 w-5 mr-2" />
                        Simpan Perubahan
                      </template>
                      <template v-else>
                        <i class="i-heroicons-arrow-path h-5 w-5 animate-spin mr-2" />
                        Menyimpan...
                      </template>
                    </UButton>
                  </div>
                </div>
              </div>
            </UForm>
          </UCard>
        </div>

        <!-- Right Column - Information & Actions -->
        <div class="space-y-6">
          <!-- User Summary Card -->
          <UCard class="shadow-lg border border-gray-200 dark:border-gray-800">
            <template #header>
              <div class="flex items-center gap-3">
                <div class="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                  <i class="i-heroicons-user-circle h-5 w-5 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 class="font-semibold text-gray-900 dark:text-white">Ringkasan User</h3>
              </div>
            </template>

            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">ID Pengguna</span>
                <code class="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  #{{ userId }}
                </code>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Tanggal Dibuat</span>
                <span class="text-sm font-medium">-</span>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Terakhir Diupdate</span>
                <span class="text-sm font-medium">-</span>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Status</span>
                <UBadge
                  :color="form.isActive ? 'success' : 'error'"
                  size="sm"
                  class="inline-flex items-center gap-1"
                >
                  <i
                    :class="form.isActive
                      ? 'i-heroicons-check-circle'
                      : 'i-heroicons-x-circle'"
                    class="h-3 w-3"
                  />
                  {{ form.isActive ? 'Aktif' : 'Nonaktif' }}
                </UBadge>
              </div>
            </div>
          </UCard>

          <!-- Quick Actions Card -->
          <UCard class="shadow-lg border border-gray-200 dark:border-gray-800">
            <template #header>
              <div class="flex items-center gap-3">
                <div class="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                  <i class="i-heroicons-bolt h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 class="font-semibold text-gray-900 dark:text-white">Aksi Cepat</h3>
              </div>
            </template>

            <div class="space-y-3">
              <UButton
                block
                color="neutral"
                variant="soft"
                icon="i-heroicons-envelope"
                :disabled="!form.email"
              >
                Kirim Email
              </UButton>

              <UButton
                block
                color="neutral"
                variant="soft"
                icon="i-heroicons-key"
                @click="form.password = Math.random().toString(36).slice(-12)"
              >
                Generate Password
              </UButton>

              <UButton
                block
                :color="form.isActive ? 'error' : 'success'"
                variant="soft"
                :icon="form.isActive ? 'i-heroicons-lock-closed' : 'i-heroicons-lock-open'"
                @click="form.isActive = !form.isActive"
              >
                {{ form.isActive ? 'Nonaktifkan Akun' : 'Aktifkan Akun' }}
              </UButton>
            </div>
          </UCard>

          <!-- Unsaved Changes Warning -->
          <div
            v-if="hasUnsavedChanges"
            class="p-4 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20"
          >
            <div class="flex items-start gap-3">
              <i class="i-heroicons-exclamation-triangle h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div class="text-sm">
                <p class="font-medium text-amber-700 dark:text-amber-300 mb-1">
                  Ada Perubahan yang Belum Disimpan
                </p>
                <p class="text-amber-600 dark:text-amber-400">
                  Klik "Simpan Perubahan" untuk menyimpan atau "Reset" untuk membatalkan
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
textarea::-webkit-scrollbar {
  width: 6px;
}

textarea::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

textarea::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

.dark textarea::-webkit-scrollbar-track {
  background: #374151;
}

.dark textarea::-webkit-scrollbar-thumb {
  background: #4b5563;
}

.dark textarea::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>
