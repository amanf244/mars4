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

// Load data saat mounted
onMounted(async () => {
  await Promise.all([
    productStore.fetchProducts(),
    productStore.fetchReferences()
  ])
})

// Context Menu State
const showContextMenu = ref(false)
const contextMenuX = ref(0)
const contextMenuY = ref(0)
const selectedRow = ref<Product | null>(null)

// Modal states
const isDetailModalOpen = ref(false)
const isUpdateModalOpen = ref(false)
const isDeleteModalOpen = ref(false)

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

// Handle right click
const handleContextMenu = (event: Event, row: TableRow<Product>) => {
  const mouseEvent = event as MouseEvent
  mouseEvent.preventDefault()
  
  selectedRow.value = row.original
  contextMenuX.value = mouseEvent.clientX
  contextMenuY.value = mouseEvent.clientY
  showContextMenu.value = true
}

// Close context menu
const closeContextMenu = () => {
  showContextMenu.value = false
  selectedRow.value = null
}

// Handle action click
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

// Modal handlers
const openDetailModal = async (product: Product) => {
  await productStore.fetchProductById(product.id)
  isDetailModalOpen.value = true
}

const openUpdateModal = async (product: Product) => {
  await productStore.fetchProductById(product.id)
  isUpdateModalOpen.value = true
}

const openDeleteModal = (product: Product) => {
  selectedRow.value = product
  isDeleteModalOpen.value = true
}

const handleDelete = async () => {
  if (!selectedRow.value) return
  
  try {
    await productStore.deleteProduct(selectedRow.value.id)
    isDeleteModalOpen.value = false
    selectedRow.value = null
  } catch (error) {
    console.error('Failed to delete product:', error)
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

const table = useTemplateRef('table')
const rowSelection = ref<Record<string, boolean>>({})

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
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Manajemen Produk</h1>
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

        <div class="px-4 py-3.5 border-t border-accented text-sm text-muted">
          {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} dari
          {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} baris dipilih.
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
            <p class="font-medium text-highlighted">{{ productStore.currentProduct.name }}</p>
          </div>
          <div>
            <p class="text-sm text-muted">SKU</p>
            <p class="font-medium text-highlighted">{{ productStore.currentProduct.sku }}</p>
          </div>
          <div>
            <p class="text-sm text-muted">Model Perangkat</p>
            <p class="font-medium text-highlighted">{{ productStore.currentProduct.deviceModel }}</p>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-muted">Stok</p>
              <p class="font-medium text-highlighted">{{ productStore.currentProduct.stock }}</p>
            </div>
            <div>
              <p class="text-sm text-muted">Status Stok</p>
              <UBadge :color="productStore.currentProduct.isLowStock ? 'warning' : 'success'" variant="subtle">
                {{ productStore.currentProduct.isLowStock ? 'Stok Rendah' : 'Normal' }}
              </UBadge>
            </div>
          </div>
          <div>
            <p class="text-sm text-muted">Harga Retail</p>
            <p class="font-medium text-highlighted">
              {{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(productStore.currentProduct.retailPrice) }}
            </p>
          </div>
          <div>
            <p class="text-sm text-muted">Status</p>
            <UBadge :color="productStore.currentProduct.isActive ? 'success' : 'error'" variant="subtle">
              {{ productStore.currentProduct.isActive ? 'Aktif' : 'Nonaktif' }}
            </UBadge>
          </div>
        </div>
      </template>

      <template #footer="{ close }">
        <div class="flex justify-end">
          <UButton color="neutral" variant="outline" @click="close">Tutup</UButton>
        </div>
      </template>
    </UModal>

    <!-- Delete Confirmation Modal -->
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
        <UButton color="neutral" variant="outline" @click="close">Batal</UButton>
        <UButton 
          color="error" 
          @click="handleDelete"
          :loading="productStore.loading.action"
        >
          Hapus Produk
        </UButton>
      </template>
    </UModal>
  </div>
</template>
