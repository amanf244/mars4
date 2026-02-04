<script setup lang="ts">
import { usePosCartStore } from '~/stores/posCart'

definePageMeta({
  requiresAuth: true,
  middleware: 'admin',
  layout: 'dashboard'
})

const posCart = usePosCartStore()

const skuInput = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

// ===== TYPES DARI BACKEND PRICING & SALES =====
interface CartItemPrice {
  sku: string
  name: string
  quantity: number
  unitPrice: number
  lineTotal: number
}

interface CartPriceResponse {
  items: CartItemPrice[]
  subtotalRetail: number
  subtotalActual: number
  discount: number
  isTechnicianPrice: boolean
}

interface SaleItemResponse {
  sku: string
  name: string
  quantity: number
  unitPrice: number
  lineTotal: number
  remainingStock: number
}

interface SaleResponse {
  id: number
  createdAt: string
  cashierId: number
  cashierName?: string
  isMemberPrice: boolean
  technicianId?: number | null
  technicianName?: string | null
  subtotal: number
  discount: number
  total: number
  items: SaleItemResponse[]
}

const pricing = ref<CartPriceResponse | null>(null)
const saleResult = ref<SaleResponse | null>(null)

// ===== TEKNISI SEARCH =====
interface Technician {
  id: number
  fullName: string | null
  email: string
}

const technicianQuery = ref('')
const technicianResults = ref<Technician[]>([])
const selectedTechnician = ref<Technician | null>(null)
const searchingTechnician = ref(false)

const searchTechnicians = async () => {
  const q = technicianQuery.value.trim()
  if (!q) {
    technicianResults.value = []
    selectedTechnician.value = null
    posCart.useTechnicianPrice = false
    await refreshPricing()
    return
  }

  try {
    searchingTechnician.value = true
    const apiBase  = useRuntimeConfig().public.apiBase  || 'http://localhost:5084'
    const auth = useAuthStore()

    const res = await $fetch<Technician[]>(`${apiBase }/api/v1/users/search/technicians`, {
      params: { q },
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    })

    technicianResults.value = res
  } catch (err) {
    console.error('Failed to search technicians', err)
  } finally {
    searchingTechnician.value = false
  }
}

const selectTechnician = async (tech: Technician) => {
  selectedTechnician.value = tech
  technicianQuery.value = tech.fullName || tech.email
  technicianResults.value = []
  posCart.useTechnicianPrice = true
  await refreshPricing()
}

// ===== INPUT SCAN SKU =====
const handleScanEnter = async (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    const sku = skuInput.value.trim()
    if (!sku) return
    posCart.addItem(sku)
    skuInput.value = ''
    await refreshPricing()
  }
}

// untuk table supaya reaktif
const cartItems = computed(() => posCart.items)

// ===== PRICING CART (preview subtotal/diskon/total) =====
const refreshPricing = async () => {
  if (!posCart.items.length) {
    pricing.value = null
    return
  }

  try {
    const apiBase  = useRuntimeConfig().public.apiBase  || 'http://localhost:5084'
    const auth = useAuthStore()

    const body = {
      items: posCart.items.map(i => ({
        sku: i.sku,
        quantity: i.quantity
      })),
      useTechnicianPrice: posCart.useTechnicianPrice
    }

    console.log('Pricing body:', body)

    const res = await $fetch<CartPriceResponse>(`${apiBase }/api/v1/products/cart/price`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${auth.token}`,
        'Content-Type': 'application/json'
      },
      body
    })

    pricing.value = res
  } catch (err: any) {
    console.error('Failed to price cart', err)
    // kalau backend kirim {message: "..."}
    if (err?.data?.message) {
      error.value = err.data.message
    }
  }
}


// ===== PROSES TRANSAKSI =====
const processSale = async () => {
  if (!posCart.items.length) {
    error.value = 'Keranjang masih kosong'
    return
  }

  try {
    loading.value = true
    error.value = null
    saleResult.value = null

    const apiBase  = useRuntimeConfig().public.apiBase  || 'http://localhost:5084'
    const auth = useAuthStore()

    const body = {
      items: posCart.items.map(i => ({ sku: i.sku, quantity: i.quantity })),
      useTechnicianPrice: posCart.useTechnicianPrice,
      technicianId: selectedTechnician.value?.id,
      technicianName: selectedTechnician.value?.fullName
    }

    const res = await $fetch<SaleResponse>(`${apiBase }/api/v1/sales`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${auth.token}`,
        'Content-Type': 'application/json'
      },
      body
    })

    saleResult.value = res
    posCart.clear()
    pricing.value = null
    selectedTechnician.value = null
    technicianQuery.value = ''
  } catch (err: any) {
    error.value = err?.data?.message || 'Gagal memproses transaksi'
  } finally {
    loading.value = false
  }
}

const printReceipt = () => {
  window.print()
}
</script>

<template>
  <div class="space-y-6">
    <header class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-semibold">Kasir POS</h1>
        <p class="text-sm text-slate-500">
          Scan SKU, pilih teknisi (kalau ada), lalu proses transaksi.
        </p>
      </div>
    </header>

    <!-- INPUT SCAN + PILIH TEKNISI + MODE HARGA -->
    <UCard>
      <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div class="flex-1 space-y-1">
          <label class="text-sm font-medium">Scan SKU</label>
          <UInput
            v-model="skuInput"
            size="lg"
            placeholder="Scan barcode/QR, lalu Enter"
            @keyup="handleScanEnter"
            autofocus
          />
          <p class="text-xs text-slate-500">
            Scanner akan mengisi input ini dan menekan Enter otomatis.
          </p>
        </div>

        <div class="w-full md:w-80 space-y-2">
          <div>
            <label class="text-sm font-medium">Teknisi / Member (opsional)</label>
            <UInput
              v-model="technicianQuery"
              size="sm"
              placeholder="Cari nama / email teknisi"
              @input="searchTechnicians"
            />
            <p class="text-xs text-slate-500">
              Jika teknisi ditemukan, harga otomatis pakai harga teknisi.
            </p>
          </div>

          <div
            v-if="technicianResults.length"
            class="border rounded bg-white dark:bg-slate-900 max-h-40 overflow-auto text-sm"
          >
            <button
              v-for="tech in technicianResults"
              :key="tech.id"
              class="w-full text-left px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800"
              @click="selectTechnician(tech)"
            >
              <div>{{ tech.fullName || '(Tanpa nama)' }}</div>
              <div class="text-xs text-slate-500">{{ tech.email }}</div>
            </button>
          </div>

          <div v-if="selectedTechnician" class="text-xs text-emerald-600">
            Teknisi dipilih: {{ selectedTechnician.fullName || selectedTechnician.email }}
          </div>

          <div class="flex items-center gap-3">
            <UToggle
              v-model="posCart.useTechnicianPrice"
              @change="refreshPricing"
            />
            <span class="text-sm">
              Pakai harga teknisi/member
            </span>
          </div>
          <p class="text-xs text-slate-500">
            Off = harga publik, On = harga teknisi. Dipaksa On jika teknisi dipilih.
          </p>
        </div>
      </div>

      <p v-if="error" class="mt-3 text-sm text-red-500">
        {{ error }}
      </p>
    </UCard>

    <!-- TABEL KERANJANG + PREVIEW HARGA -->
    <UCard v-if="cartItems.length">
      <table class="w-full text-sm">
        <thead>
          <tr class="text-left border-b">
            <th class="py-2">SKU</th>
            <th class="py-2">Qty</th>
            <th class="py-2 text-right">Harga</th>
            <th class="py-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in pricing?.items || []"
            :key="item.sku"
            class="border-b last:border-0"
          >
            <td class="py-1">
              <div class="font-mono">{{ item.sku }}</div>
              <div class="text-xs text-slate-500">{{ item.name }}</div>
            </td>
            <td class="py-1">
              <div class="flex items-center gap-2">
                <UInput
                  v-model.number="item.quantity"
                  type="number"
                  min="0"
                  class="w-20"
                  size="xs"
                  @change="() => { posCart.setQuantity(item.sku, Number(item.quantity) || 0); refreshPricing() }"
                />
                <UButton
                  color="error"
                  variant="ghost"
                  size="xs"
                  icon="i-heroicons-trash"
                  @click="() => { posCart.removeItem(item.sku); refreshPricing() }"
                />
              </div>
            </td>
            <td class="py-1 text-right">
              Rp {{ item.unitPrice.toLocaleString('id-ID') }}
            </td>
            <td class="py-1 text-right">
              Rp {{ item.lineTotal.toLocaleString('id-ID') }}
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="pricing" class="mt-4 flex flex-col items-end gap-1 text-sm">
        <div>
          Subtotal harga publik:
          <strong>Rp {{ pricing.subtotalRetail.toLocaleString('id-ID') }}</strong>
        </div>
        <div v-if="pricing.discount > 0">
          Potongan teknisi:
          <strong class="text-emerald-600">
            - Rp {{ pricing.discount.toLocaleString('id-ID') }}
          </strong>
        </div>
        <div class="text-lg font-semibold">
          Total bayar:
          Rp {{ pricing.subtotalActual.toLocaleString('id-ID') }}
        </div>
      </div>

      <div class="mt-4 flex justify-end gap-3">
        <UButton
          color="primary"
          size="lg"
          icon="i-heroicons-credit-card"
          :loading="loading"
          :disabled="!cartItems.length"
          @click="processSale"
        >
          Beli / Proses
        </UButton>
      </div>
    </UCard>

    <div v-else class="text-sm text-slate-500">
      Keranjang kosong. Scan SKU untuk menambahkan barang.
    </div>

    <!-- STRUK PENJUALAN -->
    <UCard v-if="saleResult" class="mt-6 print:w-[80mm]">
      <div class="text-center text-sm mb-3">
        <div class="font-semibold">Toko Kamu</div>
        <div class="text-xs text-slate-500">
          Struk Penjualan #{{ saleResult.id }}
        </div>
        <div class="text-xs text-slate-500">
          {{ new Date(saleResult.createdAt).toLocaleString('id-ID') }}
        </div>
        <div class="text-xs text-slate-500">
          Kasir: {{ saleResult.cashierName || 'Admin' }}
        </div>
        <div
          class="text-xs text-slate-500"
          v-if="saleResult.technicianName"
        >
          Customer: {{ saleResult.technicianName }}
        </div>
      </div>

      <hr class="border-dashed border-slate-300 mb-2" />

      <table class="w-full text-xs">
        <tbody>
          <tr
            v-for="item in saleResult.items"
            :key="item.sku"
            class="align-top"
          >
            <td class="pr-2">
              <div class="font-medium">{{ item.name }}</div>
              <div class="font-mono text-[10px] text-slate-500">
                {{ item.sku }}
              </div>
            </td>
            <td class="whitespace-nowrap text-right">
              <div>
                {{ item.quantity }} x
                {{ item.unitPrice.toLocaleString('id-ID') }}
              </div>
              <div class="font-medium">
                {{ item.lineTotal.toLocaleString('id-ID') }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <hr class="border-dashed border-slate-300 my-2" />

      <div class="text-xs space-y-1">
        <div class="flex justify-between">
          <span>Subtotal</span>
          <span>Rp {{ saleResult.subtotal.toLocaleString('id-ID') }}</span>
        </div>
        <div class="flex justify-between" v-if="saleResult.discount > 0">
          <span>Diskon</span>
          <span>- Rp {{ saleResult.discount.toLocaleString('id-ID') }}</span>
        </div>
        <div class="flex justify-between text-sm font-semibold">
          <span>Total</span>
          <span>Rp {{ saleResult.total.toLocaleString('id-ID') }}</span>
        </div>
        <div class="flex justify-between text-[10px] text-slate-500">
          <span>Harga</span>
          <span>
            {{ saleResult.isMemberPrice ? 'Harga Teknisi/Member' : 'Harga Publik' }}
          </span>
        </div>
      </div>

      <div class="mt-3 text-center text-[10px] text-slate-500">
        Terima kasih telah berbelanja
      </div>

      <div class="mt-2 flex justify-center gap-2 no-print">
        <UButton size="xs" icon="i-heroicons-printer" @click="printReceipt">
          Print Struk
        </UButton>
      </div>
    </UCard>
  </div>
</template>

<style>
@media print {
  .no-print {
    display: none !important;
  }

  body {
    background: #ffffff;
  }
}
</style>
