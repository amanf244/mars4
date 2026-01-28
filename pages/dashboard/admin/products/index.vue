<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn, TableRow } from '@nuxt/ui'
import type { Product } from '~/composables/useProductApi'

definePageMeta({
  requiresAuth: true,
  middleware: 'admin',
  layout: 'dashboard'
})

const productStore = useProductStore()
const router = useRouter()

// Reactive computed dari store
const products = computed(() => productStore.products)
const loading = computed(() => productStore.loading.products)
const pagination = computed(() => productStore.pagination)

const UBadge = resolveComponent('UBadge')
const UCheckbox = resolveComponent('UCheckbox')

// Filter & search state
const search = ref('')
const selectedTypeId = ref<number | null>(null)
const selectedBrandId = ref<number | null>(null)
const selectedDeviceId = ref<number | null>(null)

const isFilterLoading = computed(() => productStore.loading.products)

// Context Menu State
const showContextMenu = ref(false)
const contextMenuX = ref(0)
const contextMenuY = ref(0)
const selectedRow = ref<Product | null>(null)

// Modal states
const isDetailModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const isBulkDeleteModalOpen = ref(false)

// Delete state
const deleteProductId = ref<number | null>(null)

// Bulk delete progress state
const bulkDeleteProgress = ref(0)
const bulkDeleteTotal = ref(0)
const isBulkDeleting = ref(false)

// Context Menu Actions
const contextMenuActions = [
  {
    label: 'Detail',
    icon: 'i-heroicons-eye',
    action: 'detail' as const
  },
  {
    label: 'Update',
    icon: 'i-heroicons-pencil-square',
    action: 'update' as const
  },
  {
    label: 'Delete',
    icon: 'i-heroicons-trash',
    action: 'delete' as const,
    color: 'red'
  }
]

// Sinkronisasi filter dari store + load awal
onMounted(async () => {
  search.value = productStore.filters.search
  selectedTypeId.value = productStore.filters.typeId
  selectedBrandId.value = productStore.filters.brandId
  selectedDeviceId.value = productStore.filters.deviceId

  await Promise.all([
    productStore.fetchProducts(),
    productStore.fetchReferences()
  ])
})

// Filter handlers
const applyFilters = async () => {
  productStore.setFilters({
    search: search.value,
    typeId: selectedTypeId.value ?? null,
    brandId: selectedBrandId.value ?? null,
    deviceId: selectedDeviceId.value ?? null
  })

  await productStore.fetchProducts({ page: 1 })
}

const resetAllFilters = async () => {
  search.value = ''
  selectedTypeId.value = null
  selectedBrandId.value = null
  selectedDeviceId.value = null

  productStore.resetFilters()
  await productStore.fetchProducts({ page: 1 })
}

// Pagination handlers dengan validasi
const handlePageChange = async (page: number) => {
  const maxPage = productStore.pagination.pages
  
  if (page > maxPage) {
    console.warn(`[Page] Requested page ${page} exceeds max ${maxPage}, redirecting to ${maxPage}`)
    page = maxPage
  }
  if (page < 1) {
    page = 1
  }

  productStore.setPage(page)
  await productStore.fetchProducts({ page })
}

const handlePageSizeChange = async (size: number) => {
  productStore.setPageSize(size)
  await productStore.fetchProducts({ page: 1, pageSize: size })
}

const safePageCount = computed(() => {
  return Math.max(1, productStore.pagination.pages)
})

// Context menu handlers
const handleContextMenu = (event: Event, row: TableRow<Product>) => {
  const mouseEvent = event as MouseEvent
  mouseEvent.preventDefault()

  selectedRow.value = row.original
  contextMenuX.value = mouseEvent.clientX
  contextMenuY.value = mouseEvent.clientY
  showContextMenu.value = true
}

const closeContextMenu = () => {
  showContextMenu.value = false
  selectedRow.value = null
}

const handleActionClick = async (action: string) => {
  if (!selectedRow.value) return

  switch (action) {
    case 'detail':
      await openDetailModal(selectedRow.value)
      break
    case 'update':
      await router.push(`/dashboard/admin/products/${selectedRow.value.id}/edit`)
      break
    case 'delete':
      openDeleteModal(selectedRow.value)
      break
  }

  closeContextMenu()
}

// Modal handlers - SINGLE DELETE
const openDetailModal = async (product: Product) => {
  await productStore.fetchProductById(product.id)
  isDetailModalOpen.value = true
}

const openDeleteModal = (product: Product) => {
  selectedRow.value = product
  deleteProductId.value = product.id
  isDeleteModalOpen.value = true
}

const handleDelete = async () => {
  if (!deleteProductId.value) {
    console.error('No product ID for deletion')
    return
  }

  try {
    await productStore.deleteProduct(deleteProductId.value)
    isDeleteModalOpen.value = false
    selectedRow.value = null
    deleteProductId.value = null

    // Reload page
    await productStore.fetchProducts({ page: productStore.pagination.page })
  } catch (error) {
    console.error('Failed to delete product:', error)
  }
}

// ===== BULK DELETE HANDLERS =====
const table = useTemplateRef('table')
const rowSelection = ref<Record<string, boolean>>({})

const selectedProductIds = computed(() => {
  const selectedRows = table.value?.tableApi?.getFilteredSelectedRowModel().rows || []
  return selectedRows.map(row => row.original.id)
})

const openBulkDeleteModal = () => {
  if (selectedProductIds.value.length === 0) {
    console.warn('No products selected for bulk delete')
    return
  }
  isBulkDeleteModalOpen.value = true
}

const handleBulkDelete = async () => {
  if (selectedProductIds.value.length === 0) {
    console.error('No products selected for bulk deletion')
    return
  }

  isBulkDeleting.value = true
  bulkDeleteTotal.value = selectedProductIds.value.length
  bulkDeleteProgress.value = 0

  try {
    // Start progress animation
    const progressInterval = setInterval(() => {
      if (bulkDeleteProgress.value < bulkDeleteTotal.value - 1) {
        bulkDeleteProgress.value++
      }
    }, 50) // Update progress setiap 50ms untuk smooth animation

    // 1 request untuk hapus semua (BULK DELETE ENDPOINT)
    await productStore.bulkDeleteProducts(selectedProductIds.value)
    
    // Stop animation dan set ke 100%
    clearInterval(progressInterval)
    bulkDeleteProgress.value = bulkDeleteTotal.value
    
    // Tunggu sebentar supaya user lihat 100%
    await new Promise(resolve => setTimeout(resolve, 500))
    
    isBulkDeleteModalOpen.value = false
    isBulkDeleting.value = false
    
    // Reset selection
    table.value?.tableApi?.resetRowSelection()

    console.log(`Successfully deleted ${bulkDeleteTotal.value} products`)

    // Reload data
    await productStore.fetchProducts({ page: productStore.pagination.page })
  } catch (error) {
    console.error('Failed to bulk delete products:', error)
    isBulkDeleting.value = false
  } finally {
    bulkDeleteProgress.value = 0
    bulkDeleteTotal.value = 0
  }
}


// Columns definition
const columns: TableColumn<Product>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(UCheckbox, {
        modelValue: table.getIsSomePageRowsSelected()
          ? 'indeterminate'
          : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
          table.toggleAllPageRowsSelected(!!value),
        'aria-label': 'Select all'
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        modelValue: row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
          row.toggleSelected(!!value),
        'aria-label': 'Select row'
      })
  },
  {
    accessorKey: 'name',
    header: 'Nama Produk'
  },
  {
    accessorKey: 'sku',
    header: 'SKU'
  },
  {
    accessorKey: 'deviceModel',
    header: 'Perangkat'
  },
  {
    accessorKey: 'stock',
    header: 'Stok',
    meta: {
      class: {
        td: 'text-center font-medium'
      }
    }
  },
  {
    accessorKey: 'price',
    header: 'Harga',
    meta: {
      class: {
        th: 'text-right',
        td: 'text-right font-medium'
      }
    },
    cell: ({ row }) => {
      const price = row.getValue<number>('price')
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
      }).format(price)
    }
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      const active = row.getValue<boolean>('isActive')

      return h(
        UBadge,
        {
          variant: 'subtle',
          color: active ? 'success' : 'error'
        },
        () => (active ? 'Aktif' : 'Nonaktif')
      )
    }
  },
  {
    accessorKey: 'lastUpdatedAt',
    header: 'Terakhir Diupdate',
    cell: ({ row }) => {
      return new Date(row.getValue<string>('lastUpdatedAt')).toLocaleString(
        'id-ID',
        {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }
      )
    }
  }
]

function onSelect(e: Event, row: TableRow<Product>) {
  row.toggleSelected(!row.getIsSelected())
}

// Navigate to create page
const goToCreateProduct = () => {
  router.push('/dashboard/admin/products/create')
}
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header dengan tombol tambah -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">
          Manajemen Produk
        </h1>
        <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Kelola inventori spare part dan produk
        </p>
      </div>
      <UButton
        icon="i-heroicons-plus"
        color="primary"
        size="lg"
        @click="goToCreateProduct"
      >
        Tambah Produk
      </UButton>
    </div>

    <!-- Filter & Search -->
    <div class="flex flex-col md:flex-row gap-3 items-start md:items-end justify-between">
      <div class="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
        <UInput
          v-model="search"
          placeholder="Cari nama / SKU"
          icon="i-heroicons-magnifying-glass"
          @keyup.enter="applyFilters"
        />

        <USelect
          v-model="selectedTypeId"
          :items="productStore.productTypes.map(t => ({ label: t.name, value: t.id }))"
          placeholder="Filter Tipe"
          clearable
        />

        <USelect
          v-model="selectedBrandId"
          :items="productStore.partBrands.map(b => ({ label: b.name, value: b.id }))"
          placeholder="Filter Brand"
          clearable
        />

        <USelect
          v-model="selectedDeviceId"
          :items="productStore.deviceModels.map(d => ({ label: d.fullName ?? d.modelName, value: d.id }))"
          placeholder="Filter Perangkat"
          clearable
        />
      </div>

      <div class="flex gap-2">
        <UButton
          color="primary"
          :loading="isFilterLoading"
          @click="applyFilters"
        >
          Terapkan
        </UButton>
        <UButton
          color="neutral"
          variant="outline"
          :loading="isFilterLoading"
          @click="resetAllFilters"
        >
          Reset
        </UButton>
      </div>
    </div>

    <!-- Rekap singkat -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div class="rounded-lg border p-3">
        <p class="text-xs text-muted">Total Produk</p>
        <p class="text-lg font-semibold text-highlighted">
          {{ productStore.totalProducts }}
        </p>
      </div>
      <div class="rounded-lg border p-3">
        <p class="text-xs text-muted">Total Stok (di halaman)</p>
        <p class="text-lg font-semibold text-highlighted">
          {{ productStore.totalStock }}
        </p>
      </div>
      <div class="rounded-lg border p-3">
        <p class="text-xs text-muted">Produk Aktif</p>
        <p class="text-lg font-semibold text-emerald-500">
          {{ productStore.activeCount }}
        </p>
      </div>
      <div class="rounded-lg border p-3">
        <p class="text-xs text-muted">Produk Nonaktif</p>
        <p class="text-lg font-semibold text-red-500">
          {{ productStore.inactiveCount }}
        </p>
      </div>
    </div>

    <!-- Bulk Actions Bar (muncul saat ada yang dipilih) -->
    <div 
      v-if="selectedProductIds.length > 0" 
      class="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg"
    >
      <div class="text-sm">
        <span class="font-semibold text-blue-700 dark:text-blue-300">
          {{ selectedProductIds.length }}
        </span>
                <span class="text-blue-600 dark:text-blue-400">
          produk dipilih
        </span>
      </div>
      <UButton
        color="error"
        icon="i-heroicons-trash"
        @click="openBulkDeleteModal"
      >
        Hapus {{ selectedProductIds.length }} Produk
      </UButton>
    </div>

    <!-- Overlay untuk close context menu -->
    <div
      v-if="showContextMenu"
      class="fixed inset-0 z-40"
      @click="closeContextMenu"
    />

    <div class="flex w-full flex-1 gap-1">
      <div class="flex-1">
        <UTable
          ref="table"
          v-model:row-selection="rowSelection"
          :data="products"
          :columns="columns"
          :loading="loading"
          @select="onSelect"
          @contextmenu="handleContextMenu"
        />

        <!-- Footer tabel + pagination dengan validasi -->
        <div class="flex items-center justify-between px-4 py-3.5 border-t border-accented text-sm text-muted">
          <div>
            {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} dari
            {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} baris dipilih.
          </div>

          <div class="flex items-center gap-3">
            <USelect
              :model-value="pagination.pageSize"
              :items="[
                { label: '10 / halaman', value: 10 },
                { label: '20 / halaman', value: 20 },
                { label: '50 / halaman', value: 50 },
                { label: '100 / halaman', value: 100 },
                { label: '200 / halaman', value: 200 },
              ]"
              class="w-36"
              @update:model-value="(v: number) => handlePageSizeChange(v)"
            />

            <!-- Pagination dengan safe page count -->
            <UPagination
              :page="pagination.page"
              :page-count="safePageCount"
              :total="pagination.total"
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

    <!-- Detail Modal -->
    <UModal 
      v-model:open="isDetailModalOpen"
      title="Detail Produk"
    >
      <template #body>
        <div v-if="productStore.currentProduct" class="space-y-4">
          <div>
            <p class="text-sm text-muted">Nama Produk</p>
            <p class="font-medium text-highlighted">
              {{ productStore.currentProduct.name }}
            </p>
          </div>
          <div>
            <p class="text-sm text-muted">SKU</p>
            <p class="font-medium text-highlighted">
              {{ productStore.currentProduct.sku }}
            </p>
          </div>
          <div>
            <p class="text-sm text-muted">Model Perangkat</p>
            <p class="font-medium text-highlighted">
              {{ productStore.currentProduct.deviceModel }}
            </p>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-muted">Stok</p>
              <p class="font-medium text-highlighted">
                {{ productStore.currentProduct.stock }}
              </p>
            </div>
            <div>
              <p class="text-sm text-muted">Status Stok</p>
              <UBadge
                :color="productStore.currentProduct.isLowStock ? 'warning' : 'success'"
                variant="subtle"
              >
                {{ productStore.currentProduct.isLowStock ? 'Stok Rendah' : 'Normal' }}
              </UBadge>
            </div>
          </div>
          <div>
            <p class="text-sm text-muted">Harga Retail</p>
            <p class="font-medium text-highlighted">
              {{
                new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR'
                }).format(productStore.currentProduct.retailPrice)
              }}
            </p>
          </div>
          <div>
            <p class="text-sm text-muted">Status</p>
            <UBadge
              :color="productStore.currentProduct.isActive ? 'success' : 'error'"
              variant="subtle"
            >
              {{ productStore.currentProduct.isActive ? 'Aktif' : 'Nonaktif' }}
            </UBadge>
          </div>
        </div>
      </template>

      <template #footer="{ close }">
        <div class="flex justify-end">
          <UButton color="neutral" variant="outline" @click="close">
            Tutup
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- Single Delete Confirmation Modal -->
    <UModal 
      v-model:open="isDeleteModalOpen"
      :ui="{ footer: 'justify-end' }"
    >
      <template #header>
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-error/10">
            <UIcon name="i-heroicons-exclamation-triangle" class="h-5 w-5 text-error" />
          </div>
          <div>
            <h3 class="font-semibold text-highlighted">Hapus Produk</h3>
            <p class="text-sm text-muted">Tindakan ini tidak dapat dibatalkan</p>
          </div>
        </div>
      </template>

      <template #body>
        <div v-if="selectedRow">
          <p class="text-muted">
            Apakah Anda yakin ingin menghapus 
            <strong class="text-highlighted">{{ selectedRow.name }}</strong>? 
            Ini akan menghapus produk secara permanen dari inventori Anda.
          </p>
        </div>
      </template>

      <template #footer="{ close }">
        <UButton color="neutral" variant="outline" @click="close">
          Batal
        </UButton>
        <UButton 
          color="error" 
          @click="handleDelete"
          :loading="productStore.loading.action"
        >
          Hapus Produk
        </UButton>
      </template>
    </UModal>

    <!-- Bulk Delete Confirmation Modal dengan Progress -->
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
              {{ isBulkDeleting ? 'Menghapus Produk...' : 'Hapus Multiple Produk' }}
            </h3>
            <p class="text-sm text-muted">
              {{ isBulkDeleting ? 'Mohon tunggu, jangan tutup halaman ini' : 'Tindakan ini tidak dapat dibatalkan' }}
            </p>
          </div>
        </div>
      </template>

      <template #body>
        <!-- Konfirmasi awal (sebelum delete) -->
        <div v-if="!isBulkDeleting">
          <p class="text-muted">
            Apakah Anda yakin ingin menghapus 
            <strong class="text-highlighted">{{ selectedProductIds.length }} produk</strong> sekaligus? 
            Ini akan menghapus semua produk yang dipilih secara permanen dari inventori Anda.
          </p>
          <div v-if="selectedProductIds.length <= 10" class="mt-4 space-y-1">
            <p class="text-xs text-muted font-semibold">Produk yang akan dihapus:</p>
            <ul class="text-xs text-muted list-disc list-inside">
              <li v-for="id in selectedProductIds" :key="id">
                {{ products.find(p => p.id === id)?.name }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Progress State (saat sedang delete) -->
        <div v-else class="space-y-4">
          <p class="text-muted text-center">
            Menghapus <strong class="text-highlighted">{{ bulkDeleteProgress }}</strong> 
            dari <strong class="text-highlighted">{{ bulkDeleteTotal }}</strong> produk...
          </p>

          <!-- Progress Bar -->
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div 
              class="bg-red-600 h-3 rounded-full transition-all duration-300 ease-out"
              :style="{ width: `${(bulkDeleteProgress / bulkDeleteTotal) * 100}%` }"
            ></div>
          </div>

          <p class="text-sm text-muted text-center font-semibold">
            {{ Math.round((bulkDeleteProgress / bulkDeleteTotal) * 100) }}% selesai
          </p>
        </div>
      </template>

      <template #footer="{ close }">
        <!-- Tombol hilang saat sedang proses delete -->
        <template v-if="!isBulkDeleting">
          <UButton color="neutral" variant="outline" @click="close">
            Batal
          </UButton>
          <UButton 
            color="error" 
            @click="handleBulkDelete"
          >
            Hapus {{ selectedProductIds.length }} Produk
          </UButton>
        </template>
      </template>
    </UModal>
  </div>
</template>

