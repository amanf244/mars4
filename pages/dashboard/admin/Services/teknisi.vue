<!-- pages/teknisi/index.vue -->
<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import { storeToRefs } from 'pinia'
import type { TableColumn, TableRow } from '@nuxt/ui'

definePageMeta({
  requiresAuth: true,
  layout: 'dashboard'
})

// ===== STORE =====
const serviceTicketStore = useServiceTicketStore()
const { teknisiList, loading } = storeToRefs(serviceTicketStore)

// ===== UI COMPONENTS =====
const UBadge = resolveComponent('UBadge')

// ===== MODAL STATES =====
const isCreateModalOpen = ref(false)
const isEditModalOpen = ref(false)
const isDeleteModalOpen = ref(false)

// ===== FORM DATA (sesuai TeknisiCreateRequest & TeknisiUpdateRequest) =====
const formData = ref({
  namaTeknisi: '',
  jenisKelamin: '' as '' | 'Laki-laki' | 'Perempuan',
  gajiPokok: 0,
  statusTeknisi: '' as '' | 'Aktif' | 'Tidak Aktif'
})

// ===== SELECTED ITEM FOR EDIT/DELETE =====
const selectedTeknisi = ref<Teknisi | null>(null)

// ===== LOADING STATE =====
const isActionLoading = ref(false)

// ===== MOUNTED =====
onMounted(async () => {
  await serviceTicketStore.fetchTeknisi()
})

// ===== FORMAT CURRENCY =====
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value)
}

// ===== TABLE COLUMNS =====
const columns: TableColumn<Teknisi>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => `#${row.getValue('id')}`
  },
  {
    accessorKey: 'namaTeknisi',
    header: 'Nama Teknisi',
    cell: ({ row }) => row.getValue('namaTeknisi')
  },
  {
    accessorKey: 'jenisKelamin',
    header: 'Jenis Kelamin',
    cell: ({ row }) => row.getValue('jenisKelamin') || '-'
  },
  {
    accessorKey: 'gajiPokok',
    header: 'Gaji Pokok',
    cell: ({ row }) => formatCurrency(row.getValue<number>('gajiPokok') || 0)
  },
  {
    accessorKey: 'statusTeknisi',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('statusTeknisi') as string
      const color = status === 'Aktif' ? 'success' : status === 'Tidak Aktif' ? 'error' : 'neutral'
      return h(
        UBadge as any,
        { color, variant: 'subtle' },
        { default: () => status || '-' }
      )
    }
  },
  {
    id: 'actions',
    header: 'Aksi',
    cell: ({ row }) =>
      h('div', { class: 'flex gap-2' }, [
        h(
          UButton as any,
          {
            icon: 'i-heroicons-pencil-square',
            color: 'primary',
            variant: 'ghost',
            size: 'xs',
            onClick: () => openEditModal(row.original)
          }
        ),
        h(
          UButton as any,
          {
            icon: 'i-heroicons-trash',
            color: 'error',
            variant: 'ghost',
            size: 'xs',
            onClick: () => openDeleteModal(row.original)
          }
        )
      ])
  }
]

// ===== MODAL HANDLERS =====
const openCreateModal = () => {
  selectedTeknisi.value = null
  formData.value = {
    namaTeknisi: '',
    jenisKelamin: '',
    gajiPokok: 0,
    statusTeknisi: ''
  }
  isCreateModalOpen.value = true
}

const openEditModal = (teknisi: Teknisi) => {
  selectedTeknisi.value = teknisi
  formData.value = {
    namaTeknisi: teknisi.namaTeknisi,
    jenisKelamin: (teknisi.jenisKelamin as any) || '',
    gajiPokok: teknisi.gajiPokok || 0,
    statusTeknisi: (teknisi.statusTeknisi as any) || ''
  }
  isEditModalOpen.value = true
}

const openDeleteModal = (teknisi: Teknisi) => {
  selectedTeknisi.value = teknisi
  isDeleteModalOpen.value = true
}

// ===== CRUD OPERATIONS =====
const handleCreate = async () => {
  isActionLoading.value = true
  try {
    await serviceTicketStore.createTeknisi({
      namaTeknisi: formData.value.namaTeknisi,
      jenisKelamin: formData.value.jenisKelamin || undefined,
      gajiPokok: formData.value.gajiPokok || undefined,
      statusTeknisi: formData.value.statusTeknisi || undefined
    })
    isCreateModalOpen.value = false
    await serviceTicketStore.fetchTeknisi()
  } catch (error) {
    console.error(error)
  } finally {
    isActionLoading.value = false
  }
}

const handleUpdate = async () => {
  if (!selectedTeknisi.value) return
  isActionLoading.value = true
  try {
    await serviceTicketStore.updateTeknisi(selectedTeknisi.value.id, {
      id: selectedTeknisi.value.id,
      namaTeknisi: formData.value.namaTeknisi,
      jenisKelamin: formData.value.jenisKelamin || undefined,
      gajiPokok: formData.value.gajiPokok || undefined,
      statusTeknisi: formData.value.statusTeknisi || undefined
    })
    isEditModalOpen.value = false
    selectedTeknisi.value = null
    await serviceTicketStore.fetchTeknisi()
  } catch (error) {
    console.error(error)
  } finally {
    isActionLoading.value = false
  }
}

const handleDelete = async () => {
  if (!selectedTeknisi.value) return
  isActionLoading.value = true
  try {
    await serviceTicketStore.deleteTeknisi(selectedTeknisi.value.id)
    isDeleteModalOpen.value = false
    selectedTeknisi.value = null
    await serviceTicketStore.fetchTeknisi()
  } catch (error) {
    console.error(error)
  } finally {
    isActionLoading.value = false
  }
}
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Data Teknisi</h1>
        <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">Kelola data teknisi servis</p>
      </div>
      <UButton icon="i-heroicons-plus" color="primary" size="lg" @click="openCreateModal">
        Tambah Teknisi
      </UButton>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
      <UTable
        :data="teknisiList"
        :columns="columns"
        :loading="loading.teknisi"
        class="w-full"
      >
        <template #empty>
          <div class="flex flex-col items-center justify-center py-10 text-center">
            <UIcon name="i-heroicons-user-group" class="w-12 h-12 text-gray-400 mb-3" />
            <p class="text-gray-500 dark:text-gray-400">Belum ada data teknisi</p>
            <UButton color="primary" variant="link" @click="openCreateModal">
              Tambah sekarang
            </UButton>
          </div>
        </template>
      </UTable>
    </div>

    <!-- Create Modal -->
    <UModal v-model:open="isCreateModalOpen" title="Tambah Teknisi Baru">
      <template #body>
        <form @submit.prevent="handleCreate" class="space-y-4">
          <UFormField label="Nama Teknisi" required>
            <UInput v-model="formData.namaTeknisi" required />
          </UFormField>

          <UFormField label="Jenis Kelamin">
            <USelect
              v-model="formData.jenisKelamin"
              :items="[
                { label: 'Laki-laki', value: 'Laki-laki' },
                { label: 'Perempuan', value: 'Perempuan' }
              ]"
              placeholder="Pilih jenis kelamin"
              clearable
            />
          </UFormField>

          <UFormField label="Gaji Pokok">
            <UInput
              v-model.number="formData.gajiPokok"
              type="number"
              min="0"
              placeholder="Masukkan gaji pokok"
            />
          </UFormField>

          <UFormField label="Status">
            <USelect
              v-model="formData.statusTeknisi"
              :items="[
                { label: 'Aktif', value: 'Aktif' },
                { label: 'Tidak Aktif', value: 'Tidak Aktif' }
              ]"
              placeholder="Pilih status"
              clearable
            />
          </UFormField>
        </form>
      </template>
      <template #footer="{ close }">
        <UButton color="neutral" variant="outline" @click="close">Batal</UButton>
        <UButton
          color="primary"
          :loading="isActionLoading"
          @click="handleCreate"
        >
          Simpan
        </UButton>
      </template>
    </UModal>

    <!-- Edit Modal -->
    <UModal v-model:open="isEditModalOpen" title="Edit Teknisi">
      <template #body>
        <form @submit.prevent="handleUpdate" class="space-y-4">
          <UFormField label="Nama Teknisi" required>
            <UInput v-model="formData.namaTeknisi" required />
          </UFormField>

          <UFormField label="Jenis Kelamin">
            <USelect
              v-model="formData.jenisKelamin"
              :items="[
                { label: 'Laki-laki', value: 'Laki-laki' },
                { label: 'Perempuan', value: 'Perempuan' }
              ]"
              placeholder="Pilih jenis kelamin"
              clearable
            />
          </UFormField>

          <UFormField label="Gaji Pokok">
            <UInput
              v-model.number="formData.gajiPokok"
              type="number"
              min="0"
              placeholder="Masukkan gaji pokok"
            />
          </UFormField>

          <UFormField label="Status">
            <USelect
              v-model="formData.statusTeknisi"
              :items="[
                { label: 'Aktif', value: 'Aktif' },
                { label: 'Tidak Aktif', value: 'Tidak Aktif' }
              ]"
              placeholder="Pilih status"
              clearable
            />
          </UFormField>
        </form>
      </template>
      <template #footer="{ close }">
        <UButton color="neutral" variant="outline" @click="close">Batal</UButton>
        <UButton
          color="primary"
          :loading="isActionLoading"
          @click="handleUpdate"
        >
          Update
        </UButton>
      </template>
    </UModal>

    <!-- Delete Confirmation Modal -->
    <UModal v-model:open="isDeleteModalOpen" :ui="{ footer: 'justify-end' }">
      <template #header>
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-error/10">
            <UIcon name="i-heroicons-exclamation-triangle" class="h-5 w-5 text-error" />
          </div>
          <div>
            <h3 class="font-semibold text-highlighted">Hapus Teknisi</h3>
            <p class="text-sm text-muted">Tindakan ini tidak dapat dibatalkan</p>
          </div>
        </div>
      </template>
      <template #body>
        <p v-if="selectedTeknisi" class="text-muted">
          Apakah Anda yakin ingin menghapus teknisi
          <strong class="text-highlighted">{{ selectedTeknisi.namaTeknisi }}</strong>?
        </p>
      </template>
      <template #footer="{ close }">
        <UButton color="neutral" variant="outline" @click="close">Batal</UButton>
        <UButton
          color="error"
          :loading="isActionLoading"
          @click="handleDelete"
        >
          Hapus
        </UButton>
      </template>
    </UModal>
  </div>
</template>