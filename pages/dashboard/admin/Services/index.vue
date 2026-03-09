<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import { storeToRefs } from 'pinia'
import { FlexRender } from '@tanstack/vue-table'
import type { TableColumn, TableRow } from '@nuxt/ui'
import qz from "qz-tray"

definePageMeta({
  requiresAuth: true,
  layout: 'dashboard'
})

// ===== TYPE DEFINISI (sinkron dengan useServiceTickets.ts dan backend) =====
type KerusakanItem = {
  masterKerusakanId: number
  biaya: number
  pengeluaran?: number
  catatan: string | null
}

type ServiceTicket = {
  id: number
  nama: string
  nomor: string
  teknisiId: number | null
  namaTeknisi?: string | null
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  deviceModelId?: number | null
  namaDeviceModel?: string | null
  pengeluaran: number
  pendapatan: number
  tanggalMasuk: string
  tanggalDiambil: string | null
  kerusakan?: {
    id: number
    masterKerusakanId: number
    namaKerusakan: string
    biaya: number
    pengeluaran?: number
    catatan: string | null
  }[]
}

// Untuk checkbox kerusakan
type MasterKerusakanOption = {
  id: number
  label: string
  defaultBiaya: number
}

// UTable template ref shape (for useTemplateRef type)
type TableRefInstance = {
  tableApi?: {
    getFilteredSelectedRowModel: () => { rows: { original: ServiceTicket }[] }
    resetRowSelection: () => void
  }
}

// ===== STORE =====
const serviceTicketStore = useServiceTicketStore()
const {
  serviceTickets,
  teknisiList,
  deviceModelsList,
  pagination,
  filters,
  loading,
  totalPending,
  totalCompleted,
  totalPendapatan,
  totalPengeluaran,
  totalProfit
} = storeToRefs(serviceTicketStore)

const store = useMasterKerusakanStore()

// ===== UI COMPONENTS =====
const UBadge = resolveComponent('UBadge')
const UCheckbox = resolveComponent('UCheckbox')

// State untuk dropdown kerusakan
const selectedKerusakanId = ref<number | null>(null)
const selectedKerusakanBiaya = ref<number>(0)
const selectedKerusakanPengeluaran = ref<number>(0)

// State untuk input custom
const showCustomKerusakan = ref(false)
const customKerusakanNama = ref('')
const customKerusakanBiaya = ref(0)

const addKerusakanFromDropdown = () => {
  if (!selectedKerusakanId.value) {
    useToast().add({ title: 'Pilih kerusakan', color: 'warning' })
    return
  }
  const option = masterKerusakanOptions.value.find(o => o.id === selectedKerusakanId.value)
  if (!option) return

  // Cek duplikasi (opsional)
  if (formData.value.kerusakan.some(k => k.masterKerusakanId === option.id)) {
    useToast().add({ title: 'Kerusakan sudah ditambahkan', color: 'warning' })
    return
  }

  formData.value.kerusakan.push({
    masterKerusakanId: option.id,
    biaya: selectedKerusakanBiaya.value,
    pengeluaran: selectedKerusakanPengeluaran.value,
    catatan: option.label // atau bisa diisi input terpisah
  })

  // Reset dropdown
  selectedKerusakanId.value = null
  selectedKerusakanBiaya.value = 0
  selectedKerusakanPengeluaran.value = 0
}

const addCustomKerusakan = () => {
  if (!customKerusakanNama.value.trim()) {
    useToast().add({ title: 'Nama kerusakan harus diisi', color: 'warning' })
    return
  }

  formData.value.kerusakan.push({
    masterKerusakanId: 0, // ID 0 menandakan custom
    biaya: customKerusakanBiaya.value,
    catatan: customKerusakanNama.value
  })

  // Reset form custom
  customKerusakanNama.value = ''
  customKerusakanBiaya.value = 0
  showCustomKerusakan.value = false
}

const removeKerusakan = (index: number) => {
  formData.value.kerusakan.splice(index, 1)
}


// ===== FILTERS =====
const search = ref(filters.value.search)
const selectedTeknisiId = ref<number | null>(filters.value.teknisiId)
const selectedStatus = ref<string | null>(filters.value.status)
const startDate = ref(filters.value.startDate)
const endDate = ref(filters.value.endDate)
const isFilterLoading = computed(() => loading.value.serviceTickets)

const deviceModelOptions = computed(() =>
  deviceModelsList.value.map(model => ({
    label: model.fullName ?? String(model.id),
    value: model.id
  }))
)

// ===== PER-TEKNISI SUMMARY =====
const perTeknisiSummary = computed(() => {
  const summary = new Map<number, { nama: string; pendapatan: number; pengeluaran: number }>()
  serviceTickets.value.forEach(ticket => {
    if (!ticket.teknisiId) return
    const existing = summary.get(ticket.teknisiId) || {
      nama: ticket.namaTeknisi || 'Unknown',
      pendapatan: 0,
      pengeluaran: 0
    }
    existing.pendapatan += ticket.pendapatan || 0
    existing.pengeluaran += ticket.pengeluaran || 0
    summary.set(ticket.teknisiId, existing)
  })
  return Array.from(summary.values())
})

// ===== MASTER KERUSAKAN OPTIONS (ganti nanti dengan data dari API) =====
const masterKerusakanOptions = computed(() => {
  return store.items.map(item => ({
    id: item.id,
    label: item.nama,
    defaultBiaya: 0 // jika tidak ada field defaultBiaya, gunakan 0
  }))
})

console.log('KERUSAKAN OPTIONS', masterKerusakanOptions.value)
// const masterKerusakanOptions = ref<MasterKerusakanOption[]>([
//   { id: 1, label: 'LCD', defaultBiaya: 150000 },
//   { id: 2, label: 'Matot', defaultBiaya: 100000 },
//   { id: 3, label: 'eMMc', defaultBiaya: 200000 },
//   { id: 4, label: 'Charging', defaultBiaya: 75000 },
//   { id: 5, label: 'Touch Screen', defaultBiaya: 120000 },
//   // dst, samakan dengan tabel MasterKerusakan
// ])

// ===== CONTEXT MENU =====
const showContextMenu = ref(false)
const contextMenuX = ref(0)
const contextMenuY = ref(0)
const selectedRow = ref<ServiceTicket | null>(null)

const contextMenuActions = [
  { label: 'Detail', icon: 'i-heroicons-eye', action: 'detail' },
  { label: 'Edit', icon: 'i-heroicons-pencil-square', action: 'edit' },
  { label: 'Delete', icon: 'i-heroicons-trash', action: 'delete', color: 'red' },
  { label: 'Print', icon: 'i-heroicons-printer', action: 'print' , color: 'blue'}
]

// ===== MODAL STATES =====
const isCreateModalOpen = ref(false)
const isDetailModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const isBulkDeleteModalOpen = ref(false)

// ===== MODE TRACKER =====
const modalMode = ref<'create' | 'edit'>('create')

// ===== FORM DATA (sesuai ServiceTicketCreateRequest TS) =====
const formData = ref({
  nama: '',
  nomor: '',
  teknisiId: null as number | null,
  status: 'pending' as 'pending' | 'in_progress' | 'completed' | 'cancelled',
  deviceModelId: null as number | null,
  pengeluaran: 0,
  pendapatan: 0,
  tanggalMasuk: new Date().toISOString().split('T')[0],
  tanggalDiambil: null as string | null,
  kerusakan: [] as KerusakanItem[]
})

// ===== DELETE STATES =====
const deleteTicketId = ref<number | null>(null)

// ===== BULK DELETE PROGRESS =====
const bulkDeleteProgress = ref(0)
const bulkDeleteTotal = ref(0)
const isBulkDeleting = ref(false)

// ===== REFS TABLE (Nuxt 3) =====
const table = useTemplateRef<TableRefInstance>('table')
const rowSelection = ref<Record<string, boolean>>({})

// ===== MOUNTED =====
onMounted(async () => {
  await Promise.all([
    serviceTicketStore.fetchServiceTickets(),
    serviceTicketStore.fetchTeknisi(),
    serviceTicketStore.fetchDeviceModels(),
    store.fetchAll()
    // TODO: fetch master kerusakan di sini kalau sudah ada endpoint-nya
  ])
})

// ===== HELPERS =====
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value)
}

// Toggle kerusakan berdasarkan masterKerusakanId
const toggleKerusakan = (option: MasterKerusakanOption, checked: boolean) => {
  const arr = formData.value.kerusakan
  if (checked) {
    if (!arr.some(k => k.masterKerusakanId === option.id)) {
      arr.push({
        masterKerusakanId: option.id,
        biaya: 0, // atau biaya dari input terpisah
        catatan: option.label
      })
    }
  } else {
    formData.value.kerusakan = arr.filter(k => k.masterKerusakanId !== option.id)
  }
}

const isKerusakanChecked = (optionId: number) => {
  return formData.value.kerusakan.some(k => k.masterKerusakanId === optionId)
}

// ===== FILTER HANDLERS =====
const applyFilters = async () => {
  serviceTicketStore.setFilters({
    search: search.value,
    teknisiId: selectedTeknisiId.value ?? null,
    status: selectedStatus.value ?? null,
    startDate: startDate.value,
    endDate: endDate.value
  })
  await serviceTicketStore.fetchServiceTickets({ page: 1 })
}

const resetFilters = async () => {
  search.value = ''
  selectedTeknisiId.value = null
  selectedStatus.value = null
  startDate.value = null
  endDate.value = null
  serviceTicketStore.resetFilters()
  await serviceTicketStore.fetchServiceTickets({ page: 1 })
}

const handlePrint = async (ticket: ServiceTicket) => {
  try {
    // 1. Cek status koneksi qz-tray
    //    isActive() tersedia di qz 2.0+, fallback dengan pengecekan socket
    const isConnected = qz.websocket.isActive?.() || 
                        (qz.websocket.getConnectionStatus?.() === 'connected');

    if (!isConnected) {
      await qz.websocket.connect();
    }

    // 2. Cari printer (nama bisa disesuaikan)
    const printerName = "FK80 Printer";
    let printer = await qz.printers.find(printerName);

    if (!printer) {
      console.warn(`Printer "${printerName}" tidak ditemukan, menggunakan printer default`);
      printer = await qz.printers.getDefault();
      if (!printer) {
        throw new Error("Tidak ada printer yang tersedia");
      }
    }

    const config = qz.configs.create(printer);

    // 3. Hasilkan HTML nota
    const content = generatePrintContent(ticket);

    const data = [{
      type: 'html',
      format: 'plain',      // atau 'html' jika ingin styling lebih kompleks
      data: content
    }];

    // 4. Kirim ke printer
    await qz.print(config, data);

    // 5. Koneksi TIDAK diputus agar cetakan berikutnya lebih cepat
    //    Jika ingin memutus, bisa tambahkan: await qz.websocket.disconnect();

  } catch (error) {
    console.error('Gagal mencetak:', error);
    useToast().add({
      title: 'Gagal mencetak',
      description: error.message,
      color: 'error'
    });
  }
};

// Fungsi untuk menghasilkan HTML nota
const generatePrintContent = (ticket: ServiceTicket): string => {

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const totalKerusakan = ticket.kerusakan?.reduce((sum, k) => sum + k.biaya, 0) || 0
  const grandTotal = totalKerusakan + ticket.pendapatan

  return `
  <div style="width:68mm;font-family:monospace;font-size:11px">

    <div style="text-align:center">
      <div style="font-size:15px;font-weight:bold">NOTA SERVIS</div>
      <div>Aldep4 Service</div>
      <div>Telp: 0896-3053-4368</div>
      <div>Jl. Contoh Alamat No.123</div>
      <div>mars4.my.id</div>
    </div>

    <hr>

    <table style="width:100%;table-layout:fixed">
      <colgroup>
        <col style="width:40%">
        <col style="width:60%">
      </colgroup>

      <tr><td>No Tiket</td><td style="text-align:right">#${ticket.id}</td></tr>
      <tr><td>Tanggal</td><td style="text-align:right">${formatDate(ticket.tanggalMasuk)}</td></tr>
      <tr><td>Customer</td><td style="text-align:right">${ticket.nama}</td></tr>
      <tr><td>No HP</td><td style="text-align:right">${ticket.nomor}</td></tr>
      <tr><td>Teknisi</td><td style="text-align:right">${ticket.namaTeknisi || '-'}</td></tr>

      ${ticket.namaDeviceModel ? `
      <tr>
        <td>Device</td>
        <td style="text-align:right;word-break:break-word">${ticket.namaDeviceModel}</td>
      </tr>
      ` : ''}

      <tr><td>Status</td><td style="text-align:right">${ticket.status.replace('_',' ')}</td></tr>
    </table>

    <hr>

    <b>KERUSAKAN</b>

    <table style="width:100%;table-layout:fixed">
      <colgroup>
        <col style="width:60%">
        <col style="width:40%">
      </colgroup>

      ${
        ticket.kerusakan?.map(k => `
        <tr>
          <td style="word-break:break-word">${k.namaKerusakan}</td>
          <td style="text-align:right">${formatCurrency(k.biaya)}</td>
        </tr>

        ${k.catatan ? `
        <tr>
          <td colspan="2" style="font-size:10px">- ${k.catatan}</td>
        </tr>` : ''}
        `).join('')
        || `<tr><td colspan="2" style="text-align:center">Tidak ada kerusakan</td></tr>`
      }

    </table>

    <hr>

    <table style="width:100%;table-layout:fixed">
      <colgroup>
        <col style="width:60%">
        <col style="width:40%">
      </colgroup>

      <tr>
        <td>Total</td>
        <td style="text-align:right">${formatCurrency(totalKerusakan)}</td>
      </tr>

      

    </table>

    <hr>

    <div style="text-align:center">
      Terima kasih
      <br>
      Diambil: ${ticket.tanggalDiambil ? formatDate(ticket.tanggalDiambil) : '-'}
      <br><br><br>
      ( Teknisi )
    </div>

  </div>
  `
}
// ===== PAGINATION =====
const handlePageChange = async (page: number) => {
  serviceTicketStore.setPage(page)
  await serviceTicketStore.fetchServiceTickets({ page })
}

const handlePageSizeChange = async (size: number) => {
  serviceTicketStore.setPageSize(size)
  await serviceTicketStore.fetchServiceTickets({ page: 1, pageSize: size })
}

const safePageCount = computed(() => Math.max(1, pagination.value.pages))

// ===== CONTEXT MENU HANDLERS =====
const handleContextMenu = (event: Event, row: TableRow<ServiceTicket>) => {
  const mouseEvent = event as MouseEvent
  mouseEvent.preventDefault()
  selectedRow.value = row.original
  contextMenuX.value = mouseEvent.clientX
  contextMenuY.value = mouseEvent.clientY
  showContextMenu.value = true
}

const closeContextMenu = () => {
  showContextMenu.value = false
  // jangan reset selectedRow di sini; dibutuhkan untuk edit/delete
}

const handleActionClick = async (action: string) => {
  if (!selectedRow.value) return
  if (action === 'detail') openDetailModal(selectedRow.value)
  else if (action === 'edit') openEditModal(selectedRow.value)
  else if (action === 'delete') openDeleteModal(selectedRow.value)
  else if (action === 'print') handlePrint(selectedRow.value)
  closeContextMenu()
}

// ===== MODAL HANDLERS =====
const openCreateModal = () => {
  modalMode.value = 'create'
  selectedRow.value = null
  formData.value = {
    nama: '',
    nomor: '',
    teknisiId: null,
    status: 'pending',
    deviceModelId: null,
    pengeluaran: 0,
    pendapatan: 0,
    tanggalMasuk: new Date().toISOString().split('T')[0],
    tanggalDiambil: null,
    kerusakan: []
  }
  isCreateModalOpen.value = true
}

const openEditModal = (ticket: ServiceTicket) => {
  modalMode.value = 'edit'
  selectedRow.value = ticket
  formData.value = {
    nama: ticket.nama,
    nomor: ticket.nomor,
    teknisiId: ticket.teknisiId,
    status: ticket.status,
    deviceModelId: ticket.deviceModelId ?? null,
    pengeluaran: ticket.pengeluaran,
    pendapatan: ticket.pendapatan,
    tanggalMasuk: ticket.tanggalMasuk.split('T')[0],
    tanggalDiambil: ticket.tanggalDiambil?.split('T')[0] ?? null,
    kerusakan: (ticket.kerusakan || []).map(k => ({
      masterKerusakanId: k.masterKerusakanId,
      biaya: k.biaya,
      catatan: k.catatan ?? null
    }))
  }
  isCreateModalOpen.value = true
}

const openDetailModal = (ticket: ServiceTicket) => {
  selectedRow.value = ticket
  isDetailModalOpen.value = true
}

const openDeleteModal = (ticket: ServiceTicket) => {
  selectedRow.value = ticket
  deleteTicketId.value = ticket.id
  isDeleteModalOpen.value = true
}

// ===== CRUD OPERATIONS =====
const handleCreate = async () => {
  try {
    await serviceTicketStore.createServiceTicket({
      nama: formData.value.nama,
      nomor: formData.value.nomor,
      teknisiId: formData.value.teknisiId!,
      status: formData.value.status,
      deviceModelId: formData.value.deviceModelId,
      pengeluaran: formData.value.pengeluaran,
      pendapatan: formData.value.pendapatan,
      tanggalMasuk: formData.value.tanggalMasuk,
      tanggalDiambil: formData.value.tanggalDiambil,
      kerusakan: formData.value.kerusakan
    })
    isCreateModalOpen.value = false
    await serviceTicketStore.fetchServiceTickets()
  } catch (error) {
    console.error(error)
  }
}

const handleUpdate = async () => {
  if (!selectedRow.value) {
    console.log('HANDLE UPDATE: selectedRow null')
    return
  }
  console.log('HANDLE UPDATE CALLED', selectedRow.value, formData.value)
  try {
    await serviceTicketStore.updateServiceTicket(selectedRow.value.id, {
      id: selectedRow.value.id,
      nama: formData.value.nama,
      nomor: formData.value.nomor,
      teknisiId: formData.value.teknisiId!,
      status: formData.value.status,
      deviceModelId: formData.value.deviceModelId,
      pengeluaran: formData.value.pengeluaran,
      pendapatan: formData.value.pendapatan,
      tanggalMasuk: formData.value.tanggalMasuk,
      tanggalDiambil: formData.value.tanggalDiambil,
      kerusakan: formData.value.kerusakan
    } as any)
    isCreateModalOpen.value = false
    selectedRow.value = null
    await serviceTicketStore.fetchServiceTickets()
  } catch (error) {
    console.error('UPDATE ERROR', error)
  }
}

const handleDelete = async () => {
  if (!deleteTicketId.value) return
  try {
    await serviceTicketStore.deleteServiceTicket(deleteTicketId.value)
    isDeleteModalOpen.value = false
    selectedRow.value = null
    deleteTicketId.value = null
    await serviceTicketStore.fetchServiceTickets({ page: pagination.value.page })
  } catch (error) {
    console.error(error)
  }
}

// ===== BULK DELETE =====
const selectedTicketIds = computed(() => {
  const api = table.value?.tableApi
  if (!api) return []
  const selectedRows = api.getFilteredSelectedRowModel().rows || []
  return selectedRows.map(row => row.original.id as number)
})

const openBulkDeleteModal = () => {
  if (selectedTicketIds.value.length === 0) return
  isBulkDeleteModalOpen.value = true
}

const handleBulkDelete = async () => {
  if (selectedTicketIds.value.length === 0) return
  isBulkDeleting.value = true
  bulkDeleteTotal.value = selectedTicketIds.value.length
  bulkDeleteProgress.value = 0

  try {
    const progressInterval = setInterval(() => {
      if (bulkDeleteProgress.value < bulkDeleteTotal.value - 1) {
        bulkDeleteProgress.value++
      }
    }, 50)

    for (const id of selectedTicketIds.value) {
      await serviceTicketStore.deleteServiceTicket(id)
      bulkDeleteProgress.value++
    }

    clearInterval(progressInterval)
    bulkDeleteProgress.value = bulkDeleteTotal.value
    await new Promise(resolve => setTimeout(resolve, 500))

    isBulkDeleteModalOpen.value = false
    isBulkDeleting.value = false
    table.value?.tableApi?.resetRowSelection()
    await serviceTicketStore.fetchServiceTickets({ page: pagination.value.page })
  } catch (error) {
    console.error(error)
    isBulkDeleting.value = false
  } finally {
    bulkDeleteProgress.value = 0
    bulkDeleteTotal.value = 0
  }
}

// ===== TABLE COLUMNS =====
const columns: TableColumn<ServiceTicket>[] = [
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
    header: 'Customer',
    cell: ({ row }) =>
      h('div', { class: 'flex flex-col' }, [
        h('span', { class: 'font-medium' }, row.getValue('nama') as string),
        h('span', { class: 'text-xs text-gray-500' }, row.original.nomor)
      ])
  },
  {
    accessorKey: 'namaTeknisi',
    header: 'Teknisi',
    cell: ({ row }) => row.original.namaTeknisi || '-'
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      const color =
        {
          pending: 'warning',
          in_progress: 'info',
          completed: 'success',
          cancelled: 'error'
        }[status] || 'neutral'
      return h(
        UBadge as any,
        { color, variant: 'subtle' },
        { default: () => status.replace('_', ' ') }
      )
    }
  },
  {
    accessorKey: 'tanggalMasuk',
    header: 'Tgl Masuk',
    cell: ({ row }) =>
      new Date(row.getValue('tanggalMasuk') as string).toLocaleDateString(
        'id-ID',
        { day: 'numeric', month: 'short', year: 'numeric' }
      )
  },
  {
    accessorKey: 'pendapatan',
    header: 'Pendapatan',
    meta: { class: { td: 'text-right font-medium' } },
    cell: ({ row }) => formatCurrency(row.getValue<number>('pendapatan'))
  }
]

// ===== ROW SELECT HANDLER =====
function onSelect(e: Event, row: TableRow<ServiceTicket>) {
  row.toggleSelected(!row.getIsSelected())
}
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Service Tickets</h1>
        <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">Kelola tiket servis pelanggan</p>
      </div>
      <UButton icon="i-heroicons-plus" color="primary" size="lg" @click="openCreateModal">
        New Ticket
      </UButton>
    </div>

    <!-- Stat Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <div
        class="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5"
      >
        <p class="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Total Tickets
        </p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ pagination.total }}</p>
      </div>
      <div
        class="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5"
      >
        <p class="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pending</p>
        <p class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
          {{ totalPending }}
        </p>
      </div>
      <div
        class="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5"
      >
        <p class="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">Completed</p>
        <p class="text-2xl font-bold text-green-600 dark:text-green-400">
          {{ totalCompleted }}
        </p>
      </div>
      <div
        class="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5"
      >
        <p class="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">Revenue</p>
        <p class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
          {{ formatCurrency(totalPendapatan) }}
        </p>
      </div>
      <div
        class="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5"
      >
        <p class="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">Profit</p>
        <p class="text-2xl font-bold text-green-600 dark:text-green-400">
          {{ formatCurrency(totalProfit) }}
        </p>
      </div>
    </div>

    <!-- Per-Teknisi Summary Table -->
    <div
      class="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden"
    >
      <div class="px-5 py-3 border-b border-gray-200 dark:border-gray-800">
        <h3 class="font-semibold">Ringkasan per Teknisi</h3>
      </div>
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
        <thead class="bg-gray-50 dark:bg-gray-800/50">
          <tr>
            <th
              class="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Teknisi
            </th>
            <th
              class="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Pendapatan
            </th>
            <th
              class="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Pengeluaran
            </th>
            <th
              class="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Laba Bersih
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
          <tr
            v-for="item in perTeknisiSummary"
            :key="item.nama"
            class="hover:bg-gray-50 dark:hover:bg-gray-800/50"
          >
            <td class="px-5 py-2 whitespace-nowrap text-sm font-medium">
              {{ item.nama }}
            </td>
            <td class="px-5 py-2 whitespace-nowrap text-sm">
              {{ formatCurrency(item.pendapatan) }}
            </td>
            <td class="px-5 py-2 whitespace-nowrap text-sm">
              {{ formatCurrency(item.pengeluaran) }}
            </td>
            <td
              class="px-5 py-2 whitespace-nowrap text-sm font-semibold"
              :class="item.pendapatan - item.pengeluaran >= 0 ? 'text-green-600' : 'text-red-600'"
            >
              {{ formatCurrency(item.pendapatan - item.pengeluaran) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Filters -->
    <div class="flex flex-col md:flex-row gap-3 items-start md:items-end justify-between">
      <div class="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
        <UInput
          v-model="search"
          placeholder="Cari nama / nomor"
          icon="i-heroicons-magnifying-glass"
          @keyup.enter="applyFilters"
        />
        <USelect
          v-model="selectedTeknisiId"
          :items="teknisiList.map(t => ({ label: t.namaTeknisi, value: t.id }))"
          placeholder="Filter Teknisi"
          clearable
        />
        <USelect
          v-model="selectedStatus"
          :items="[
            { label: 'Pending', value: 'pending' },
            { label: 'In Progress', value: 'in_progress' },
            { label: 'Completed', value: 'completed' },
            { label: 'Cancelled', value: 'cancelled' }
          ]"
          placeholder="Filter Status"
          clearable
        />
        <div class="flex gap-2">
          <UInput v-model="startDate" type="date" placeholder="Start Date" class="flex-1" />
          <UInput v-model="endDate" type="date" placeholder="End Date" class="flex-1" />
        </div>
      </div>
      <div class="flex gap-2">
        <UButton color="primary" :loading="isFilterLoading" @click="applyFilters">
          Terapkan
        </UButton>
        <UButton color="neutral" variant="outline" :loading="isFilterLoading" @click="resetFilters">
          Reset
        </UButton>
      </div>
    </div>

    <!-- Bulk Actions Bar -->
    <div
      v-if="selectedTicketIds.length > 0"
      class="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg"
    >
      <div class="text-sm">
        <span class="font-semibold text-blue-700 dark:text-blue-300">
          {{ selectedTicketIds.length }}
        </span>
        <span class="text-blue-600 dark:text-blue-400"> tiket dipilih</span>
      </div>
      <UButton color="error" icon="i-heroicons-trash" @click="openBulkDeleteModal">
        Hapus {{ selectedTicketIds.length }} Tiket
      </UButton>
    </div>

    <!-- Context Menu Overlay -->
    <div
      v-if="showContextMenu"
      class="fixed inset-0 z-40"
      @click="closeContextMenu"
    />

    <!-- Main Table with Nested Kerusakan Rows -->
    <div class="flex w-full flex-1 gap-1">
      <div class="flex-1">
        <UTable
          ref="table"
          v-model:row-selection="rowSelection"
          :data="serviceTickets"
          :columns="columns"
          :loading="loading.serviceTickets"
          @select="onSelect"
          @contextmenu="handleContextMenu"
        >
          <template #row="{ row }">
            <!-- Main ticket row -->
            <tr
              :data-state="row.getIsSelected() && 'selected'"
              class="hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <td
                v-for="cell in row.getVisibleCells()"
                :key="cell.id"
                :class="cell.column.columnDef.meta?.class?.td"
              >
                <FlexRender
                  :render="cell.column.columnDef.cell"
                  :props="cell.getContext()"
                />
              </td>
            </tr>
            <!-- Kerusakan row -->
            <tr
              v-if="row.original.kerusakan && row.original.kerusakan.length"
              class="bg-gray-50 dark:bg-gray-800/30"
            >
              <td :colspan="columns.length" class="px-5 py-2 text-sm">
                <span class="font-medium text-gray-700 dark:text-gray-300 mr-2">
                  Kendala:
                </span>
                <span
                  v-for="(k, idx) in row.original.kerusakan"
                  :key="idx"
                  class="inline-block bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-xs mr-2 mb-1"
                >
                  {{ k.namaKerusakan }} ({{ formatCurrency(k.biaya) }})
                </span>
              </td>
            </tr>
          </template>
        </UTable>

        <!-- Pagination Footer -->
        <div
          class="flex items-center justify-between px-4 py-3.5 border-t border-gray-200 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-400"
        >
          <div>
            {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }}
            dari
            {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }}
            baris dipilih.
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
              :page-count="safePageCount"
              :total="pagination.total"
              @update:page="handlePageChange"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Context Menu (custom component kamu) -->
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
      :title="modalMode === 'edit' ? 'Edit Tiket' : 'Buat Tiket Baru'"
    >
      <template #body>
        <form
          @submit.prevent="modalMode === 'edit' ? handleUpdate() : handleCreate()"
          class="space-y-4"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField label="Nama Customer" required>
              <UInput v-model="formData.nama" required />
            </UFormField>
            <UFormField label="Nomor HP" required>
              <UInput v-model="formData.nomor" required />
            </UFormField>
            <UFormField label="Teknisi" required>
              <USelect
                v-model="formData.teknisiId"
                :items="teknisiList.map(t => ({ label: t.namaTeknisi, value: t.id }))"
                placeholder="Pilih teknisi"
                required
                clearable
              />
            </UFormField>
            <UFormField label="Model Device (opsional)">
              <USelect
                v-model="formData.deviceModelId"
                :items="deviceModelOptions"
                placeholder="Pilih model device"
                clearable
              />
            </UFormField>
            <UFormField label="Status">
              <USelect
                v-model="formData.status"
                :items="[
                  { label: 'Pending', value: 'pending' },
                  { label: 'In Progress', value: 'in_progress' },
                  { label: 'Completed', value: 'completed' },
                  { label: 'Cancelled', value: 'cancelled' }
                ]"
              />
            </UFormField>
            <UFormField label="Tanggal Masuk" required>
              <UInput v-model="formData.tanggalMasuk" type="date" required />
            </UFormField>
            <UFormField label="Tanggal Diambil">
              <UInput v-model="formData.tanggalDiambil" type="date" />
            </UFormField>
            <!-- <UFormField label="Pengeluaran (Rp)">
              <UInput v-model.number="formData.pengeluaran" type="number" min="0" />
            </UFormField>
            <UFormField label="Pendapatan (Rp)">
              <UInput v-model.number="formData.pendapatan" type="number" min="0" />
            </UFormField> -->
          </div>

          <!-- Kerusakan checkboxes -->
         <UFormField label="Kendala / Kerusakan">
  <!-- Dropdown dengan input biaya -->
  <div class="flex flex-col gap-3">

  <!-- INPUT AREA -->
  <div class="grid grid-cols-12 gap-2 items-end">

  <div class="col-span-6">
    <USelect
      v-model="selectedKerusakanId"
      :items="masterKerusakanOptions.map(o => ({ label: o.label, value: o.id }))"
      placeholder="Pilih kerusakan"
      clearable
    />
  </div>

  <div class="col-span-2">
    <label class="text-xs text-gray-500">Biaya</label>
    <UInput
      v-model.number="selectedKerusakanBiaya"
      type="number"
      min="0"
      placeholder="0"
    />
  </div>

  <div class="col-span-2">
    <label class="text-xs text-gray-500">Pengeluaran</label>
    <UInput
      v-model.number="selectedKerusakanPengeluaran"
      type="number"
      min="0"
      placeholder="0"
    />
  </div>

  <div class="col-span-2">
    <UButton
      block
      color="primary"
      class="mt-[18px]"
      @click="addKerusakanFromDropdown"
    >
      Tambah
    </UButton>
  </div>

</div>


  <!-- CUSTOM FORM -->
  <div
    v-if="showCustomKerusakan"
    class="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 space-y-2"
  >

    <div class="grid grid-cols-12 gap-2">

      <div class="col-span-6">
        <UInput
          v-model="customKerusakanNama"
          placeholder="Nama kerusakan"
        />
      </div>

      <div class="col-span-3">
        <UInput
          v-model.number="customKerusakanBiaya"
          type="number"
          min="0"
          placeholder="Biaya"
        />
      </div>

      <div class="col-span-3 flex gap-2">
        <UButton
          color="neutral"
          variant="outline"
          block
          @click="showCustomKerusakan = false"
        >
          Batal
        </UButton>

        <UButton
          color="primary"
          block
          @click="addCustomKerusakan"
        >
          Simpan
        </UButton>
      </div>

    </div>

  </div>


  <!-- LIST KERUSAKAN -->
  <div v-if="formData.kerusakan.length > 0" class="space-y-2">

    <div
      v-for="(item, idx) in formData.kerusakan"
      :key="idx"
      class="flex items-center justify-between p-3 border rounded-lg bg-gray-50 dark:bg-gray-800"
    >

      <div class="flex flex-col">

        <span class="font-medium">
          {{
            item.catatan ||
            masterKerusakanOptions.find(o => o.id === item.masterKerusakanId)?.label ||
            'Custom'
          }}
        </span>

        <div class="text-sm text-gray-500 flex gap-3">

          <span>Biaya: {{ formatCurrency(item.biaya) }}</span>

          <span v-if="item.pengeluaran">
            Modal: {{ formatCurrency(item.pengeluaran) }}
          </span>

        </div>

      </div>

      <UButton
        color="error"
        variant="ghost"
        icon="i-heroicons-trash"
        size="xs"
        @click="removeKerusakan(idx)"
      />

    </div>

  </div>

</div>
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
    <UModal v-model:open="isDetailModalOpen" title="Detail Tiket">
      <template #body>
        <div v-if="selectedRow" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500">ID Tiket</p>
              <p class="font-medium">#{{ selectedRow.id }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Status</p>
              <UBadge
                :color="{
                  pending: 'warning',
                  in_progress: 'info',
                  completed: 'success',
                  cancelled: 'error'
                }[selectedRow.status] || 'neutral'"
                variant="subtle"
              >
                {{ selectedRow.status.replace('_', ' ') }}
              </UBadge>
            </div>
          </div>
          <div>
            <p class="text-sm text-gray-500">Nama Customer</p>
            <p class="font-medium">{{ selectedRow.nama }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Nomor HP</p>
            <p class="font-medium">{{ selectedRow.nomor }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Teknisi</p>
            <p class="font-medium">{{ selectedRow.namaTeknisi || '-' }}</p>
          </div>
          <div v-if="selectedRow.namaDeviceModel">
            <p class="text-sm text-gray-500">Model Device</p>
            <p class="font-medium">{{ selectedRow.namaDeviceModel }}</p>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500">Tanggal Masuk</p>
              <p class="font-medium">
                {{ new Date(selectedRow.tanggalMasuk).toLocaleDateString('id-ID') }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Tanggal Diambil</p>
              <p class="font-medium">
                {{
                  selectedRow.tanggalDiambil
                    ? new Date(selectedRow.tanggalDiambil).toLocaleDateString('id-ID')
                    : '-'
                }}
              </p>
            </div>
          </div>
          <!-- <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500">Pengeluaran</p>
              <p class="font-medium">{{ formatCurrency(selectedRow.pengeluaran) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Pendapatan</p>
              <p class="font-medium">{{ formatCurrency(selectedRow.pendapatan) }}</p>
            </div>
          </div> -->
          <div v-if="selectedRow.kerusakan && selectedRow.kerusakan.length">
            <p class="text-sm text-gray-500">Kendala</p>
            <div class="flex flex-wrap gap-2 mt-1">
              <span
                v-for="k in selectedRow.kerusakan"
                :key="k.id"
                class="bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1 text-xs"
              >
                {{ k.namaKerusakan }} ({{ formatCurrency(k.biaya) }})
              </span>
              <span
                v-if="selectedRow.kerusakan.some(k => k.pengeluaran)"
                class="bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1 text-xs"
              >
                Modal: {{ formatCurrency(selectedRow.kerusakan.reduce((sum, k) => sum + (k.pengeluaran || 0), 0)) }}
              </span>
            </div>
          </div>
        </div>
      </template>
      <template #footer="{ close }">
        <UButton color="neutral" variant="outline" @click="close">Tutup</UButton>
      </template>
    </UModal>

    <!-- Single Delete Confirmation Modal -->
    <UModal v-model:open="isDeleteModalOpen" :ui="{ footer: 'justify-end' }">
      <template #header>
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-error/10">
            <UIcon
              name="i-heroicons-exclamation-triangle"
              class="h-5 w-5 text-error"
            />
          </div>
          <div>
            <h3 class="font-semibold text-highlighted">Hapus Tiket</h3>
            <p class="text-sm text-muted">Tindakan ini tidak dapat dibatalkan</p>
          </div>
        </div>
      </template>
      <template #body>
        <p v-if="selectedRow" class="text-muted">
          Apakah Anda yakin ingin menghapus tiket
          <strong class="text-highlighted">
            #{{ selectedRow.id }} - {{ selectedRow.nama }}
          </strong>?
        </p>
      </template>
      <template #footer="{ close }">
        <UButton color="neutral" variant="outline" @click="close">Batal</UButton>
        <UButton color="error" :loading="loading.action" @click="handleDelete">
          Hapus Tiket
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
              {{ isBulkDeleting ? 'Menghapus Tiket...' : 'Hapus Multiple Tiket' }}
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
            <strong class="text-highlighted">
              {{ selectedTicketIds.length }} tiket
            </strong>
            sekaligus?
          </p>
        </div>
        <div v-else class="space-y-4">
          <p class="text-muted text-center">
            Menghapus
            <strong class="text-highlighted">{{ bulkDeleteProgress }}</strong>
            dari
            <strong class="text-highlighted">{{ bulkDeleteTotal }}</strong>
            tiket...
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
            Hapus {{ selectedTicketIds.length }} Tiket
          </UButton>
        </template>
      </template>
    </UModal>
  </div>
</template>
