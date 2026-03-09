<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import { storeToRefs } from 'pinia'
import { FlexRender } from '@tanstack/vue-table'
import type { TableColumn, TableRow } from '@nuxt/ui'

definePageMeta({
  requiresAuth: true,
  layout: 'dashboard'
})

// ===== STORE =====
const store = useMasterKerusakanStore()
const {
  paginatedItems: kerusakanList,
  pagination,
  filters,
  loading,
  totalFiltered,
  totalPages
} = storeToRefs(store)

// ===== UI COMPONENTS =====
const UBadge = resolveComponent('UBadge')
const UCheckbox = resolveComponent('UCheckbox')

// ===== FILTERS =====
const search = ref(filters.value.search)

// ===== CONTEXT MENU =====
const showContextMenu = ref(false)
const contextMenuX = ref(0)
const contextMenuY = ref(0)
const selectedRow = ref<MasterKerusakan | null>(null)

const contextMenuActions = [
  { label: 'Detail', icon: 'i-heroicons-eye', action: 'detail' },
  { label: 'Edit', icon: 'i-heroicons-pencil-square', action: 'edit' },
  { label: 'Delete', icon: 'i-heroicons-trash', action: 'delete', color: 'red' }
]

// ===== MODAL STATES =====
const isCreateModalOpen = ref(false)
const isDetailModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const isBulkDeleteModalOpen = ref(false)
const modalMode = ref<'create' | 'edit'>('create')

// ===== FORM DATA =====
const formData = ref({
  nama: '',
  deskripsi: '' as string | null,
  isActive: true
})

// ===== DELETE STATES =====
const deleteId = ref<number | null>(null)

// ===== BULK DELETE PROGRESS =====
const bulkDeleteProgress = ref(0)
const bulkDeleteTotal = ref(0)
const isBulkDeleting = ref(false)

// ===== TABLE REF =====
const table = useTemplateRef<TableRefInstance>('table')
const rowSelection = ref<Record<string, boolean>>({})

type TableRefInstance = {
  tableApi?: {
    getFilteredSelectedRowModel: () => { rows: { original: MasterKerusakan }[] }
    resetRowSelection: () => void
  }
}

// ===== MOUNTED =====
onMounted(async () => {
  await store.fetchAll()
})

// ===== FILTER HANDLERS =====
const applyFilters = () => {
  store.setSearch(search.value)
}

const resetFilters = () => {
  search.value = ''
  store.resetFilters()
}

// ===== PAGINATION =====
const handlePageChange = (page: number) => {
  store.setPage(page)
}

const handlePageSizeChange = (size: number) => {
  store.setPageSize(size)
}

// ===== CONTEXT MENU =====
const handleContextMenu = (event: Event, row: TableRow<MasterKerusakan>) => {
  const mouseEvent = event as MouseEvent
  mouseEvent.preventDefault()
  selectedRow.value = row.original
  contextMenuX.value = mouseEvent.clientX
  contextMenuY.value = mouseEvent.clientY
  showContextMenu.value = true
}

const closeContextMenu = () => {
  showContextMenu.value = false
}

const handleActionClick = async (action: string) => {
  if (!selectedRow.value) return
  if (action === 'detail') openDetailModal(selectedRow.value)
  else if (action === 'edit') openEditModal(selectedRow.value)
  else if (action === 'delete') openDeleteModal(selectedRow.value)
  closeContextMenu()
}

// ===== MODAL HANDLERS =====
const openCreateModal = () => {
  modalMode.value = 'create'
  selectedRow.value = null
  formData.value = {
    nama: '',
    deskripsi: '',
    isActive: true
  }
  isCreateModalOpen.value = true
}

const openEditModal = (item: MasterKerusakan) => {
  modalMode.value = 'edit'
  selectedRow.value = item
  formData.value = {
    nama: item.nama,
    deskripsi: item.deskripsi ?? '',
    isActive: item.isActive
  }
  isCreateModalOpen.value = true
}

const openDetailModal = (item: MasterKerusakan) => {
  selectedRow.value = item
  isDetailModalOpen.value = true
}

const openDeleteModal = (item: MasterKerusakan) => {
  selectedRow.value = item
  deleteId.value = item.id
  isDeleteModalOpen.value = true
}

// ===== CRUD =====
const handleCreate = async () => {
  try {
    await store.create({
      nama: formData.value.nama,
      deskripsi: formData.value.deskripsi || null
    })
    isCreateModalOpen.value = false
  } catch (error) {
    console.error(error)
  }
}

const handleUpdate = async () => {
  if (!selectedRow.value) return
  try {
    await store.update(selectedRow.value.id, {
      id: selectedRow.value.id,
      nama: formData.value.nama || undefined,
      deskripsi: formData.value.deskripsi || null,
      isActive: formData.value.isActive
    })
    isCreateModalOpen.value = false
    selectedRow.value = null
  } catch (error) {
    console.error(error)
  }
}

const handleDelete = async () => {
  if (!deleteId.value) return
  try {
    await store.delete(deleteId.value)
    isDeleteModalOpen.value = false
    selectedRow.value = null
    deleteId.value = null
  } catch (error) {
    console.error(error)
  }
}

// ===== BULK DELETE =====
const selectedIds = computed(() => {
  const api = table.value?.tableApi
  if (!api) return []
  const selectedRows = api.getFilteredSelectedRowModel().rows || []
  return selectedRows.map(row => row.original.id)
})

const openBulkDeleteModal = () => {
  if (selectedIds.value.length === 0) return
  isBulkDeleteModalOpen.value = true
}

const handleBulkDelete = async () => {
  if (selectedIds.value.length === 0) return
  isBulkDeleting.value = true
  bulkDeleteTotal.value = selectedIds.value.length
  bulkDeleteProgress.value = 0

  try {
    const progressInterval = setInterval(() => {
      if (bulkDeleteProgress.value < bulkDeleteTotal.value - 1) {
        bulkDeleteProgress.value++
      }
    }, 50)

    for (const id of selectedIds.value) {
      await store.delete(id)
      bulkDeleteProgress.value++
    }

    clearInterval(progressInterval)
    bulkDeleteProgress.value = bulkDeleteTotal.value
    await new Promise(resolve => setTimeout(resolve, 500))

    isBulkDeleteModalOpen.value = false
    isBulkDeleting.value = false
    table.value?.tableApi?.resetRowSelection()
  } catch (error) {
    console.error(error)
    isBulkDeleting.value = false
  } finally {
    bulkDeleteProgress.value = 0
    bulkDeleteTotal.value = 0
  }
}

// ===== TABLE COLUMNS =====
const columns: TableColumn<MasterKerusakan>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(UCheckbox as any, {
        modelValue: table.getIsSomePageRowsSelected()
          ? 'indeterminate'
          : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
          table.toggleAllPageRowsSelected(!!value),
        'aria-label': 'Select all'
      }),
    cell: ({ row }) =>
      h(UCheckbox as any, {
        modelValue: row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
          row.toggleSelected(!!value),
        'aria-label': 'Select row'
      })
  },
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => `#${row.getValue('id')}`
  },
  {
    accessorKey: 'nama',
    header: 'Nama Kerusakan',
    cell: ({ row }) => row.getValue('nama')
  },
  {
    accessorKey: 'deskripsi',
    header: 'Deskripsi',
    cell: ({ row }) => row.original.deskripsi || '-'
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.getValue('isActive') as boolean
      return h(
        UBadge as any,
        {
          color: isActive ? 'success' : 'error',
          variant: 'subtle'
        },
        { default: () => (isActive ? 'Aktif' : 'Nonaktif') }
      )
    }
  }
]

// ===== ROW SELECT HANDLER =====
function onSelect(e: Event, row: TableRow<MasterKerusakan>) {
  row.toggleSelected(!row.getIsSelected())
}
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Master Kerusakan</h1>
        <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Kelola jenis-jenis kerusakan yang dapat dipilih saat membuat tiket servis
        </p>
      </div>
      <UButton icon="i-heroicons-plus" color="primary" size="lg" @click="openCreateModal">
        Tambah Kerusakan
      </UButton>
    </div>

    <!-- Stat Cards (optional) -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5">
        <p class="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ totalFiltered }}</p>
      </div>
      <div class="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5">
        <p class="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">Aktif</p>
        <p class="text-2xl font-bold text-green-600 dark:text-green-400">
          {{ kerusakanList.filter(k => k.isActive).length }}
        </p>
      </div>
      <div class="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5">
        <p class="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nonaktif</p>
        <p class="text-2xl font-bold text-red-600 dark:text-red-400">
          {{ kerusakanList.filter(k => !k.isActive).length }}
        </p>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-col md:flex-row gap-3 items-start md:items-end justify-between">
      <div class="flex-1 max-w-md">
        <UInput
          v-model="search"
          placeholder="Cari nama / deskripsi..."
          icon="i-heroicons-magnifying-glass"
          @keyup.enter="applyFilters"
        />
      </div>
      <div class="flex gap-2">
        <UButton color="primary" :loading="loading.list" @click="applyFilters">
          Terapkan
        </UButton>
        <UButton color="neutral" variant="outline" :loading="loading.list" @click="resetFilters">
          Reset
        </UButton>
      </div>
    </div>

    <!-- Bulk Actions Bar -->
    <div
      v-if="selectedIds.length > 0"
      class="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg"
    >
      <div class="text-sm">
        <span class="font-semibold text-blue-700 dark:text-blue-300">
          {{ selectedIds.length }}
        </span>
        <span class="text-blue-600 dark:text-blue-400"> item dipilih</span>
      </div>
      <UButton color="error" icon="i-heroicons-trash" @click="openBulkDeleteModal">
        Hapus {{ selectedIds.length }} Item
      </UButton>
    </div>

    <!-- Context Menu Overlay -->
    <div
      v-if="showContextMenu"
      class="fixed inset-0 z-40"
      @click="closeContextMenu"
    />

    <!-- Main Table -->
    <div class="flex w-full flex-1 gap-1">
      <div class="flex-1">
        <UTable
          ref="table"
          v-model:row-selection="rowSelection"
          :data="kerusakanList"
          :columns="columns"
          :loading="loading.list"
          @select="onSelect"
          @contextmenu="handleContextMenu"
        >
          <template #empty>
            <div class="flex flex-col items-center justify-center py-10 text-center">
              <UIcon name="i-heroicons-cube" class="w-12 h-12 text-gray-400 mb-3" />
              <p class="text-gray-500 dark:text-gray-400">Belum ada data kerusakan</p>
              <UButton color="primary" variant="link" @click="openCreateModal">
                Tambah sekarang
              </UButton>
            </div>
          </template>
        </UTable>

        <!-- Pagination Footer -->
        <div
          class="flex items-center justify-between px-4 py-3.5 border-t border-gray-200 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-400"
        >
          <div>
            {{ selectedIds.length }} dari {{ totalFiltered }} baris dipilih.
          </div>
          <div class="flex items-center gap-3">
            <USelect
              :model-value="pagination.pageSize"
              :items="[
                { label: '10 / halaman', value: 10 },
                { label: '20 / halaman', value: 20 },
                { label: '50 / halaman', value: 50 },
                { label: '100 / halaman', value: 100 }
              ]"
              class="w-36"
              @update:model-value="v => handlePageSizeChange(Number(v))"
            />
            <UPagination
              :page="pagination.page"
              :page-count="totalPages"
              :total="totalFiltered"
              @update:page="handlePageChange"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Context Menu -->
    <TableContextMenu
      v-if="showContextMenu"
      :x="contextMenuX"
      :y="contextMenuY"
      :actions="contextMenuActions"
      @action-clicked="handleActionClick"
      @close="closeContextMenu"
    />

    <!-- Create/Edit Modal -->
    <UModal
      v-model:open="isCreateModalOpen"
      :title="modalMode === 'edit' ? 'Edit Kerusakan' : 'Tambah Kerusakan Baru'"
      :description="modalMode === 'edit' ? 'Ubah data kerusakan' : 'Isi form untuk menambah jenis kerusakan baru'"
    >
      <template #body>
        <form @submit.prevent="modalMode === 'edit' ? handleUpdate() : handleCreate()" class="space-y-4">
          <UFormField label="Nama Kerusakan" required>
            <UInput v-model="formData.nama" required placeholder="Contoh: LCD" />
          </UFormField>

          <UFormField label="Deskripsi (opsional)">
            <UTextarea v-model="formData.deskripsi" placeholder="Deskripsi singkat..." :rows="3" />
          </UFormField>

          <UFormField v-if="modalMode === 'edit'" label="Status">
            <USelect
              v-model="formData.isActive"
              :items="[
                { label: 'Aktif', value: true },
                { label: 'Nonaktif', value: false }
              ]"
            />
          </UFormField>
        </form>
      </template>
      <template #footer="{ close }">
        <UButton color="neutral" variant="outline" @click="close">Batal</UButton>
        <UButton
          color="primary"
          :loading="loading.action"
          @click="modalMode === 'edit' ? handleUpdate() : handleCreate()"
        >
          {{ modalMode === 'edit' ? 'Update' : 'Simpan' }}
        </UButton>
      </template>
    </UModal>

    <!-- Detail Modal -->
    <UModal v-model:open="isDetailModalOpen" title="Detail Kerusakan">
      <template #body>
        <div v-if="selectedRow" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500">ID</p>
              <p class="font-medium">#{{ selectedRow.id }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Status</p>
              <UBadge
                :color="selectedRow.isActive ? 'success' : 'error'"
                variant="subtle"
              >
                {{ selectedRow.isActive ? 'Aktif' : 'Nonaktif' }}
              </UBadge>
            </div>
          </div>
          <div>
            <p class="text-sm text-gray-500">Nama Kerusakan</p>
            <p class="font-medium">{{ selectedRow.nama }}</p>
          </div>
          <div v-if="selectedRow.deskripsi">
            <p class="text-sm text-gray-500">Deskripsi</p>
            <p class="text-sm">{{ selectedRow.deskripsi }}</p>
          </div>
        </div>
      </template>
      <template #footer="{ close }">
        <UButton color="neutral" variant="outline" @click="close">Tutup</UButton>
      </template>
    </UModal>

    <!-- Single Delete Confirmation -->
    <UModal v-model:open="isDeleteModalOpen" :ui="{ footer: 'justify-end' }">
      <template #header>
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-error/10">
            <UIcon name="i-heroicons-exclamation-triangle" class="h-5 w-5 text-error" />
          </div>
          <div>
            <h3 class="font-semibold text-highlighted">Hapus Kerusakan</h3>
            <p class="text-sm text-muted">Tindakan ini tidak dapat dibatalkan</p>
          </div>
        </div>
      </template>
      <template #body>
        <p v-if="selectedRow" class="text-muted">
          Apakah Anda yakin ingin menghapus
          <strong class="text-highlighted">{{ selectedRow.nama }}</strong>?
          <span class="block mt-2 text-sm text-warning">
            *Hanya dapat dihapus jika tidak digunakan di tiket servis.
          </span>
        </p>
      </template>
      <template #footer="{ close }">
        <UButton color="neutral" variant="outline" @click="close">Batal</UButton>
        <UButton color="error" :loading="loading.action" @click="handleDelete">
          Hapus
        </UButton>
      </template>
    </UModal>

    <!-- Bulk Delete Modal with Progress -->
    <UModal
      v-model:open="isBulkDeleteModalOpen"
      :ui="{ footer: 'justify-end' }"
      :prevent-close="isBulkDeleting"
    >
      <template #header>
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-error/10">
            <UIcon
              :name="isBulkDeleting ? 'i-heroicons-arrow-path' : 'i-heroicons-exclamation-triangle'"
              class="h-5 w-5 text-error"
              :class="{ 'animate-spin': isBulkDeleting }"
            />
          </div>
          <div>
            <h3 class="font-semibold text-highlighted">
              {{ isBulkDeleting ? 'Menghapus...' : 'Hapus Multiple Item' }}
            </h3>
            <p class="text-sm text-muted">
              {{
                isBulkDeleting
                  ? 'Mohon tunggu, jangan tutup halaman ini'
                  : 'Tindakan ini tidak dapat dibatalkan'
              }}
            </p>
          </div>
        </div>
      </template>
      <template #body>
        <div v-if="!isBulkDeleting">
          <p class="text-muted">
            Apakah Anda yakin ingin menghapus
            <strong class="text-highlighted">{{ selectedIds.length }} item</strong> sekaligus?
          </p>
          <p class="text-sm text-warning mt-2">
            *Hanya item yang tidak digunakan di tiket servis yang akan terhapus.
          </p>
        </div>
        <div v-else class="space-y-4">
          <p class="text-muted text-center">
            Menghapus
            <strong class="text-highlighted">{{ bulkDeleteProgress }}</strong>
            dari
            <strong class="text-highlighted">{{ bulkDeleteTotal }}</strong>
            item...
          </p>
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              class="bg-red-600 h-3 rounded-full transition-all duration-300 ease-out"
              :style="{ width: `${(bulkDeleteProgress / bulkDeleteTotal) * 100}%` }"
            />
          </div>
          <p class="text-sm text-muted text-center font-semibold">
            {{ Math.round((bulkDeleteProgress / bulkDeleteTotal) * 100) }}% selesai
          </p>
        </div>
      </template>
      <template #footer="{ close }">
        <template v-if="!isBulkDeleting">
          <UButton color="neutral" variant="outline" @click="close">Batal</UButton>
          <UButton color="error" @click="handleBulkDelete">
            Hapus {{ selectedIds.length }} Item
          </UButton>
        </template>
      </template>
    </UModal>
  </div>
</template>