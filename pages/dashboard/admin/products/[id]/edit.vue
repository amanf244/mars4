<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type {
  UpdateProductRequest,
  ProductDetail,
  DeviceModel,
  ProductType,
  PartBrand,
  QualityGrade
} from '~/composables/useProductApi'

definePageMeta({
  requiresAuth: true,
  middleware: 'admin',
  layout: 'dashboard'
})

const route = useRoute()
const router = useRouter()

const productApi = useProductApi()
const productStore = useProductStore()
const fileUpload = useProductFileUpload()

const productId = computed(() => parseInt(route.params.id as string, 10))


// state utama
const product = ref<ProductDetail | null>(null)
type EditProductForm = {
  deviceModels: DeviceModel[]
  productType: ProductType | null | undefined,
  partBrand: PartBrand | null | undefined
  qualityGrade: QualityGrade | null | undefined
  sku: string
  name: string
  description: string
  stock: number
  costPrice: number
  technicianPrice: number
  retailPrice: number
  imageUrl: string
  warrantyDays: number
  isActive: boolean
}

const form = ref<EditProductForm>({
  deviceModels: [],
  productType: null,
  partBrand: null,
  qualityGrade: null,
  sku: '',
  name: '',
  description: '',
  stock: 0,
  costPrice: 0,
  technicianPrice: 0,
  retailPrice: 0,
  imageUrl: '',
  warrantyDays: 0,
  isActive: true
})



// multiple image (pakai fileName dari API upload)
const imageUrls = ref<string[]>([])

const loading = ref(false)
const loadingData = ref(true)
const errors = ref<Record<string, string>>({
  general: '',
  sku: '',
  name: '',
  deviceModelId: '',
  productTypeId: '',
  partBrandId: '',
  qualityGradeId: '',
  retailPrice: '',
  image: ''
})

// reference via store (biar sama dengan create.vue)
const deviceModels = computed<DeviceModel[]>(() => productStore.deviceModels)
const productTypes = computed<ProductType[]>(() => productStore.productTypes)
const partBrands = computed<PartBrand[]>(() => productStore.partBrands)
const qualityGrades = computed<QualityGrade[]>(() => productStore.qualityGrades)

const isUploading = ref(false)

// modal master
const isCreateModelModalOpen = ref(false)
const isEditModelModalOpen = ref(false)
const isDeleteModelModalOpen = ref(false)

const isCreateTypeModalOpen = ref(false)
const isEditTypeModalOpen = ref(false)
const isDeleteTypeModalOpen = ref(false)

const isCreateBrandModalOpen = ref(false)
const isEditBrandModalOpen = ref(false)
const isDeleteBrandModalOpen = ref(false)

const isCreateGradeModalOpen = ref(false)
const isEditGradeModalOpen = ref(false)
const isDeleteGradeModalOpen = ref(false)

// form lokal master
const newDeviceModel = ref<{ deviceBrand: string; modelName: string }>({
  deviceBrand: '',
  modelName: ''
})
const editDeviceModel = ref<{ id: number | null; deviceBrand: string; modelName: string }>({
  id: null,
  deviceBrand: '',
  modelName: ''
})

const newProductType = ref<{ name: string; description?: string }>({
  name: '',
  description: ''
})
const editProductType = ref<{ id: number | null; name: string; description?: string }>({
  id: null,
  name: '',
  description: ''
})

const newPartBrand = ref<{ name: string; description?: string }>({
  name: '',
  description: ''
})
const editBrand = ref<{ id: number | null; name: string; description?: string }>({
  id: null,
  name: '',
  description: ''
})

const newQualityGrade = ref<{ name: string; description?: string }>({
  name: '',
  description: ''
})
const editQualityGrade = ref<{ id: number | null; name: string; description?: string }>({
  id: null,
  name: '',
  description: ''
})

// load reference
const loadReferences = async () => {
  try {
    if (!productStore.deviceModels.length) {
      await productStore.fetchReferences()
    }
  } catch (error) {
    console.error('Error fetching references:', error)
  }
}

// load product
const loadProduct = async () => {
  loadingData.value = true
  try {
    const data = await productApi.fetchProductById(productId.value)

    product.value = data

    // isi field dasar form
    form.value.sku = data.sku
    form.value.name = data.name
    form.value.description = data.description ?? ''
    form.value.stock = data.stock
    form.value.costPrice = data.costPrice ?? 0
    form.value.technicianPrice = data.technicianPrice ?? 0
    form.value.retailPrice = data.retailPrice ?? 0
    form.value.warrantyDays = data.warrantyDays ?? 0
    form.value.isActive = data.isActive

   // mapping ke object untuk select (multi)
form.value.deviceModels = (data.deviceModels || [])
  .map(dm => {
    const existing = deviceModels.value.find(m => m.id === dm.id)
    if (existing) return existing
    // fallback kalau mis-match
    return {
      id: dm.id,
      deviceBrand: dm.fullName.split(' ')[0] || '',
      modelName: dm.fullName.split(' ').slice(1).join(' ') || '',
      fullName: dm.fullName,
      isActive: true
    } as DeviceModel
  })

form.value.productType =
  productTypes.value.find(t => t.id === data.productTypeId) ?? null
form.value.partBrand =
  partBrands.value.find(b => b.id === data.partBrandId) ?? null
form.value.qualityGrade =
  qualityGrades.value.find(g => g.id === data.qualityGradeId) ?? null


    // ambil semua gambar dari ProductDetail.images
    const images = (data.images ?? [])
      .slice()
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))

    imageUrls.value = images.map(i => i.imageUrl)

    // primary image untuk backward compatibility ke backend
    const primaryFromImages =
      images.find(i => i.isPrimary)?.imageUrl ?? images[0]?.imageUrl ?? ''

    form.value.imageUrl = data.imageUrl || primaryFromImages || ''
  } catch (error) {
    console.error('Failed to load product:', error)
    await navigateTo('/dashboard/admin/products')
  } finally {
    loadingData.value = false
  }
}

// upload file
const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files ?? [])
  if (!files.length) return

  for (const file of files) {
    if (!file.type.startsWith('image/')) {
      errors.value.image = 'Semua file harus berupa gambar'
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      errors.value.image = 'Ukuran maksimal per file 5MB'
      return
    }
  }

  if (imageUrls.value.length + files.length > 5) {
    errors.value.image = 'Maksimal 5 gambar per produk'
    return
  }

  try {
    isUploading.value = true
    errors.value.image = ''

    const response = await fileUpload.uploadMultipleFile(files)
    response.files.forEach((file: any) => {
      imageUrls.value.push(file.fileName)
    })

    form.value.imageUrl = imageUrls.value[0] ?? ''
    target.value = ''
  } catch (error: any) {
    console.error(error)
    errors.value.image = error.data?.message || 'Gagal upload gambar'
  } finally {
    isUploading.value = false
  }
}

// hapus gambar (hanya ubah state, tidak delete file ke server)
const removeImage = (index: number) => {
  imageUrls.value.splice(index, 1)
  form.value.imageUrl = imageUrls.value[0] ?? ''
}

// validasi
const validateForm = () => {
  errors.value = {
    general: '',
    sku: '',
    name: '',
    deviceModelId: '',
    productTypeId: '',
    partBrandId: '',
    qualityGradeId: '',
    retailPrice: '',
    image: ''
  }

  if (!form.value.sku?.trim()) {
    errors.value.sku = 'SKU wajib diisi'
  }
  if (!form.value.name?.trim()) {
    errors.value.name = 'Nama produk wajib diisi'
  }
 if (!form.value.deviceModels.length) {
  errors.value.deviceModelId = 'Minimal satu model perangkat wajib dipilih'
}

  if (!form.value.productType) {
    errors.value.productTypeId = 'Tipe produk wajib dipilih'
  }
  if (!form.value.partBrand) {
    errors.value.partBrandId = 'Merek spare part wajib dipilih'
  }
  if (!form.value.qualityGrade) {
    errors.value.qualityGradeId = 'Kualitas wajib dipilih'
  }
  if (!form.value.retailPrice || form.value.retailPrice <= 0) {
    errors.value.retailPrice = 'Harga retail harus lebih dari 0'
  }

  return !Object.values(errors.value).some(err => err)
}

// submit
const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true
  errors.value.general = ''

  try {
   const payload: UpdateProductRequest = {
  sku: form.value.sku,
  name: form.value.name,
  description: form.value.description || undefined,
  deviceModelIds: form.value.deviceModels.map(m => m.id),
  productTypeId: form.value.productType?.id,
  partBrandId: form.value.partBrand?.id,
  qualityGradeId: form.value.qualityGrade?.id,
  stock: form.value.stock,
  costPrice: form.value.costPrice,
  technicianPrice: form.value.technicianPrice,
  retailPrice: form.value.retailPrice,
  imageUrls: imageUrls.value,
  warrantyDays: form.value.warrantyDays,
  isActive: form.value.isActive
}



    await productStore.updateProduct(productId.value, payload)
    await navigateTo('/dashboard/admin/products')
  } catch (error: any) {
    errors.value.general = error.data?.message || 'Gagal mengupdate produk'
  } finally {
    loading.value = false
  }
}

// quick stock
const handleStockUpdate = async (newStock: number) => {
  try {
    const result = await productStore.updateStock(productId.value, newStock)
    if (product.value) {
      product.value.stock = result.newStock
      product.value.isLowStock = result.isLowStock
      form.value.stock = result.newStock
    }
  } catch (error) {
    console.error('Failed to update stock:', error)
  }
}

// toggle status
const toggleStatus = async () => {
  try {
    const newStatus = !form.value.isActive
    const result = await productStore.updateStatus(productId.value, newStatus)
    form.value.isActive = result.isActive
    if (product.value) {
      product.value.isActive = result.isActive
    }
  } catch (error) {
    console.error('Failed to toggle status:', error)
  }
}

/* ========== HANDLER MASTER (PAKAI OBJECT, BUKAN *_ID) ========== */

// MODEL
const handleCreateDeviceModel = async () => {
  const { deviceBrand, modelName } = newDeviceModel.value
  if (!deviceBrand.trim() || !modelName.trim()) return

  const created = await productStore.createDeviceModel(deviceBrand, modelName)

  // tambahkan ke list terpilih
  form.value.deviceModels.push(created)

  isCreateModelModalOpen.value = false
  newDeviceModel.value = { deviceBrand: '', modelName: '' }
}

const openEditModelModal = () => {
  if (!form.value.deviceModels.length) return

  // untuk sekarang, edit model pertama di list
  const dm = form.value.deviceModels[0]
   if (!dm) return
  editDeviceModel.value = {
    id: dm.id,
    deviceBrand: dm.deviceBrand,
    modelName: dm.modelName
  }
  isEditModelModalOpen.value = true
}

// const handleUpdateModel = async () => {
//   if (!editDeviceModel.value.id) return
//   const api = useProductApi()
//   const updated = await api.updateDeviceModel(editDeviceModel.value.id, {
//     deviceBrand: editDeviceModel.value.deviceBrand,
//     modelName: editDeviceModel.value.modelName
//   })

//   // update di store
//   const idxStore = productStore.deviceModels.findIndex(m => m.id === updated.id)
//   if (idxStore !== -1) productStore.deviceModels[idxStore] = updated

//   // update di form (semua yang id‑nya sama)
//   form.value.deviceModels = form.value.deviceModels.map(m =>
//     m.id === updated.id ? updated : m
//   )

//   isEditModelModalOpen.value = false
// }

// edit.vue: Ganti direct API → store
const handleUpdateModel = async () => {
  if (!editDeviceModel.value.id) return

  const updated = await productStore.updateDeviceModel(
    editDeviceModel.value.id,
    {
      deviceBrand: editDeviceModel.value.deviceBrand,
      modelName: editDeviceModel.value.modelName
    }
  )

  // Cukup map form (store sudah auto-sync)
  form.value.deviceModels = form.value.deviceModels.map(m =>
    m.id === updated.id ? updated : m
  )

  isEditModelModalOpen.value = false
}


const openDeleteModelModal = () => {
  if (!form.value.deviceModels.length) return

  const dm = form.value.deviceModels[0]
   if (!dm) return
  editDeviceModel.value = {
    id: dm.id,
    deviceBrand: dm.deviceBrand,
    modelName: dm.modelName
  }
  isDeleteModelModalOpen.value = true
}

const handleDeleteModel = async () => {
  if (!editDeviceModel.value.id) return

  await productStore.deleteDeviceModel(editDeviceModel.value.id)
productStore.deviceModels = productStore.deviceModels
  .filter(m => m.id !== editDeviceModel.value.id)

form.value.deviceModels = form.value.deviceModels.filter(
  m => m.id !== editDeviceModel.value.id
)


  // buang dari list terpilih
  form.value.deviceModels = form.value.deviceModels.filter(
    m => m.id !== editDeviceModel.value.id
  )

  isDeleteModelModalOpen.value = false
}


// TYPE
const handleCreateProductType = async () => {
  if (!newProductType.value.name.trim()) return

  const created = await productStore.createProductType(
    newProductType.value.name,
    newProductType.value.description
  )

  form.value.productType = created
  isCreateTypeModalOpen.value = false
  newProductType.value = { name: '', description: '' }
}

const openEditTypeModal = () => {
  if (!form.value.productType) return
  const t = productTypes.value.find(tp => tp.id === form.value.productType?.id)
  if (!t) return

  editProductType.value = {
    id: t.id,
    name: t.name,
    description: t.description
  }
  isEditTypeModalOpen.value = true
}

const handleUpdateType = async () => {
  if (!editProductType.value.id) return
  const updated = await productStore.updateProductType(editProductType.value.id, {
    name: editProductType.value.name,
    description: editProductType.value.description
  })

  const idx = productStore.productTypes.findIndex(t => t.id === updated.id)
  if (idx !== -1) productStore.productTypes[idx] = updated

  if (form.value.productType?.id === updated.id) {
    form.value.productType = updated
  }

  isEditTypeModalOpen.value = false
}

const openDeleteTypeModal = () => {
  if (!form.value.productType) return
  const t = productTypes.value.find(tp => tp.id === form.value.productType?.id)
  if (!t) return

  editProductType.value = {
    id: t.id,
    name: t.name,
    description: t.description
  }
  isDeleteTypeModalOpen.value = true
}

const handleDeleteType = async () => {
  if (!editProductType.value.id) return
  
  await productStore.deleteProductType(editProductType.value.id)

  productStore.productTypes = productStore.productTypes
    .filter(t => t.id !== editProductType.value.id)

  if (form.value.productType?.id === editProductType.value.id) {
    form.value.productType = null
  }

  isDeleteTypeModalOpen.value = false
}

// BRAND
const handleCreatePartBrand = async () => {
  if (!newPartBrand.value.name.trim()) return

  const created = await productStore.createPartBrand(
    newPartBrand.value.name,
    newPartBrand.value.description
  )

  form.value.partBrand = created
  isCreateBrandModalOpen.value = false
  newPartBrand.value = { name: '', description: '' }
}

const openEditBrandModal = () => {
  if (!form.value.partBrand) return
  const b = partBrands.value.find(pb => pb.id === form.value.partBrand?.id)
  if (!b) return

  editBrand.value = {
    id: b.id,
    name: b.name,
    description: b.description
  }
  isEditBrandModalOpen.value = true
}

const handleUpdateBrand = async () => {
  if (!editBrand.value.id || !editBrand.value.name.trim()) return

  const updated = await productStore.updatePartBrand(editBrand.value.id, {
  name: editBrand.value.name,
  description: editBrand.value.description
})


  const idx = productStore.partBrands.findIndex(b => b.id === updated.id)
  if (idx !== -1) productStore.partBrands[idx] = updated

  if (form.value.partBrand?.id === updated.id) {
    form.value.partBrand = updated
  }

  isEditBrandModalOpen.value = false
}

const openDeleteBrandModal = () => {
  if (!form.value.partBrand) return
  const b = partBrands.value.find(pb => pb.id === form.value.partBrand?.id)
  if (!b) return

  editBrand.value = {
    id: b.id,
    name: b.name,
    description: b.description
  }
  isDeleteBrandModalOpen.value = true
}

const handleDeleteBrand = async () => {
  if (!editBrand.value.id) return

  await productStore.deletePartBrand(editBrand.value.id)
  productStore.partBrands = productStore.partBrands
    .filter(b => b.id !== editBrand.value.id)

  if (form.value.partBrand?.id === editBrand.value.id) {
    form.value.partBrand = null
  }

  isDeleteBrandModalOpen.value = false
}

// GRADE
const handleCreateQualityGrade = async () => {
  if (!newQualityGrade.value.name.trim()) return

  const created = await productStore.createQualityGrade(
    newQualityGrade.value.name,
    newQualityGrade.value.description
  )

  form.value.qualityGrade = created
  isCreateGradeModalOpen.value = false
  newQualityGrade.value = { name: '', description: '' }
}

const openEditGradeModal = () => {
  if (!form.value.qualityGrade) return
  const g = qualityGrades.value.find(q => q.id === form.value.qualityGrade?.id)
  if (!g) return

  editQualityGrade.value = {
    id: g.id,
    name: g.name,
    description: g.description
  }
  isEditGradeModalOpen.value = true
}

const handleUpdateGrade = async () => {
  if (!editQualityGrade.value.id) return
  const updated = await productStore.updateQualityGrade(editQualityGrade.value.id, {
    name: editQualityGrade.value.name,
    description: editQualityGrade.value.description
  })

  const idx = productStore.qualityGrades.findIndex(g => g.id === updated.id)
  if (idx !== -1) productStore.qualityGrades[idx] = updated

  if (form.value.qualityGrade?.id === updated.id) {
    form.value.qualityGrade = updated
  }

  isEditGradeModalOpen.value = false
}

const openDeleteGradeModal = () => {
  if (!form.value.qualityGrade) return
  const g = qualityGrades.value.find(q => q.id === form.value.qualityGrade?.id)
  if (!g) return

  editQualityGrade.value = {
    id: g.id,
    name: g.name,
    description: g.description
  }
  isDeleteGradeModalOpen.value = true
}

const handleDeleteGrade = async () => {
  if (!editQualityGrade.value.id) return
  await productStore.deleteQualityGrade(editQualityGrade.value.id)

  productStore.qualityGrades = productStore.qualityGrades
    .filter(g => g.id !== editQualityGrade.value.id)

  if (form.value.qualityGrade?.id === editQualityGrade.value.id) {
    form.value.qualityGrade = null
  }

  isDeleteGradeModalOpen.value = false
}

onMounted(async () => {
  await Promise.all([loadReferences(), loadProduct()])
})
</script>


<template>
  <div class="p-6 space-y-6 max-w-4xl">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <UButton
          icon="i-heroicons-arrow-left"
          color="neutral"
          variant="ghost"
          @click="router.back()"
        />
        <div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white">
            Edit Produk
          </h1>
          <p
            v-if="product"
            class="text-sm text-slate-600 dark:text-slate-400 mt-1"
          >
            {{ product.sku }} - {{ product.name }}
          </p>
        </div>
      </div>

      <UButton
        :color="form.isActive ? 'success' : 'neutral'"
        :icon="form.isActive ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'"
        @click="toggleStatus"
      >
        {{ form.isActive ? 'Active' : 'Inactive' }}
      </UButton>
    </div>

    <!-- Loading -->
    <UCard v-if="loadingData">
      <div class="flex items-center justify-center py-12">
        <UIcon
          name="i-heroicons-arrow-path"
          class="w-8 h-8 animate-spin text-blue-500"
        />
      </div>
    </UCard>

    <!-- Form -->
    <template v-else-if="product">
      <!-- Error -->
      <UAlert
        v-if="errors.general"
        color="error"
        variant="soft"
        :title="errors.general"
        close-button
        icon="i-heroicons-x-mark"
        @close="errors.general = ''"
      />

      <!-- Quick info -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UCard>
          <div class="text-center">
            <p class="text-sm text-slate-600 dark:text-slate-400">
              Current Stock
            </p>
            <p class="text-3xl font-bold text-slate-900 dark:text-white mt-1">
              {{ product.stock }}
            </p>
            <UBadge
              v-if="product.isLowStock"
              color="warning"
              variant="soft"
              class="mt-2"
            >
              Low Stock
            </UBadge>
          </div>
        </UCard>

        <UCard>
          <div class="text-center">
            <p class="text-sm text-slate-600 dark:text-slate-400">
              Retail Price
            </p>
            <p class="text-3xl font-bold text-slate-900 dark:text-white mt-1">
              {{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.retailPrice) }}
            </p>
          </div>
        </UCard>

        <UCard>
          <div class="text-center">
            <p class="text-sm text-slate-600 dark:text-slate-400">
              Last Updated
            </p>
            <p class="text-lg font-medium text-slate-900 dark:text-white mt-1">
              {{ new Date(product.lastUpdatedAt).toLocaleDateString('id-ID') }}
            </p>
          </div>
        </UCard>
      </div>

      <UCard>
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <!-- Basic Info -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-slate-900 dark:text-white">
              Basic Information
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UFieldGroup label="SKU" :error="errors.sku">
                <UInput
                  v-model="form.sku"
                  placeholder="LCD-A10S-SUN-OEM"
                  size="lg"
                />
              </UFieldGroup>

              <UFieldGroup label="Product Name" :error="errors.name">
                <UInput
                  v-model="form.name"
                  placeholder="LCD A10s Sunshine OEM"
                  size="lg"
                />
              </UFieldGroup>
            </div>

            <UFieldGroup label="Description">
              <UTextarea
                v-model="form.description"
                placeholder="Product description..."
              />
            </UFieldGroup>
          </div>

          <!-- Image Upload -->
         <div class="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-700">
  <h3 class="text-lg font-semibold text-slate-900 dark:text-white">
    Gambar Produk
  </h3>

  <div class="space-y-3">
    <label class="cursor-pointer inline-block">
      <input
        type="file"
        accept="image/*"
        class="hidden"
        multiple
        @change="handleFileChange"
        :disabled="isUploading"
      />
      <UButton
        icon="i-heroicons-photo"
        color="neutral"
        variant="outline"
        :loading="isUploading"
        :disabled="isUploading"
        as="span"
      >
        {{ isUploading ? 'Mengupload...' : 'Tambah Gambar' }}
      </UButton>
    </label>

    <div
      v-if="imageUrls.length"
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
    >
      <div
        v-for="(fileName, index) in imageUrls"
        :key="fileName"
        class="relative group"
      >
        <img
          :src="fileUpload.getFileUrl(fileName)"
          class="w-full h-40 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
          :alt="fileName"
        />
        <UButton
          icon="i-heroicons-x-mark"
          color="error"
          size="xs"
          class="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition"
          @click="removeImage(index)"
        />
      </div>
    </div>

    <p v-if="errors.image" class="text-xs text-red-500">
      {{ errors.image }}
    </p>
    <p v-else class="text-xs text-slate-500">
      Maksimal 5 gambar per produk, ukuran maksimal 5MB, format JPG, PNG, GIF, WEBP.
    </p>
  </div>
</div>


          <!-- Classification -->
          <div class="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-700">
            <h3 class="text-lg font-semibold text-slate-900 dark:text-white">
              Classification
            </h3>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <!-- Device Model -->
              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Model Perangkat
                  <span class="text-red-500">*</span>
                </label>
                <div class="flex gap-2">
              <USelectMenu
  v-model="form.deviceModels"
  :items="deviceModels"
  placeholder="Pilih model perangkat"
  label-key="fullName"
  size="md"
  searchable
  multiple
  class="flex-1"
/>

<UButton
  icon="i-heroicons-plus"
  variant="outline"
  color="primary"
  @click="isCreateModelModalOpen = true"
/>
<UButton
  icon="i-heroicons-pencil-square"
  variant="outline"
  color="neutral"
  :disabled="!form.deviceModels.length"
  @click="openEditModelModal"
/>
<UButton
  icon="i-heroicons-trash"
  variant="outline"
  color="error"
  :disabled="!form.deviceModels.length"
  @click="openDeleteModelModal"
/>

                </div>
                <p v-if="errors.deviceModelId" class="text-xs text-red-500">
                  {{ errors.deviceModelId }}
                </p>
                <p v-else class="text-xs text-slate-500">
                  Pilih atau kelola model perangkat
                </p>
              </div>

              <!-- Product Type -->
              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Tipe Produk
                  <span class="text-red-500">*</span>
                </label>
                <div class="flex gap-2">
                  <USelectMenu
  v-model="form.productType"
  :items="productTypes"
  placeholder="Pilih tipe produk"
  label-key="name"
  searchable
  size="lg"
  class="flex-1"
/>
                  <UButton
                    icon="i-heroicons-plus"
                    variant="outline"
                    color="primary"
                    @click="isCreateTypeModalOpen = true"
                  />
                  <UButton
                    icon="i-heroicons-pencil-square"
                    variant="outline"
                    color="neutral"
                    :disabled="!form.productType"
                    @click="openEditTypeModal"
                  />
                  <UButton
                    icon="i-heroicons-trash"
                    variant="outline"
                    color="error"
                    :disabled="!form.productType"
                    @click="openDeleteTypeModal"
                  />
                </div>
                <p v-if="errors.productTypeId" class="text-xs text-red-500">
                  {{ errors.productTypeId }}
                </p>
                <p v-else class="text-xs text-slate-500">
                  Pilih atau kelola kategori produk
                </p>
              </div>

              <!-- Part Brand -->
              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Merek Spare Part
                  <span class="text-red-500">*</span>
                </label>
                <div class="flex gap-2">
                  <USelectMenu
  v-model="form.partBrand"
  :items="partBrands"
  placeholder="Pilih merek spare part"
  label-key="name"
  searchable
  size="lg"
  class="flex-1"
/>
                  <UButton
                    icon="i-heroicons-plus"
                    variant="outline"
                    color="primary"
                    @click="isCreateBrandModalOpen = true"
                  />
                  <UButton
                    icon="i-heroicons-pencil-square"
                    variant="outline"
                    color="neutral"
                    :disabled="!form.partBrand"
                    @click="openEditBrandModal"
                  />
                  <UButton
                    icon="i-heroicons-trash"
                    variant="outline"
                    color="error"
                    :disabled="!form.partBrand"
                    @click="openDeleteBrandModal"
                  />
                </div>
                <p v-if="errors.partBrandId" class="text-xs text-red-500">
                  {{ errors.partBrandId }}
                </p>
                <p v-else class="text-xs text-slate-500">
                  Pilih atau kelola merek pabrikan
                </p>
              </div>

              <!-- Quality Grade -->
              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Kualitas
                  <span class="text-red-500">*</span>
                </label>
                <div class="flex gap-2">
                 <USelectMenu
  v-model="form.qualityGrade"
  :items="qualityGrades"
  placeholder="Pilih kualitas"
  label-key="name"
  searchable
  size="lg"
  class="flex-1"
/>
                  <UButton
                    icon="i-heroicons-plus"
                    variant="outline"
                    color="primary"
                    @click="isCreateGradeModalOpen = true"
                  />
                  <UButton
                    icon="i-heroicons-pencil-square"
                    variant="outline"
                    color="neutral"
                    :disabled="!form.qualityGrade"
                    @click="openEditGradeModal"
                  />
                  <UButton
                    icon="i-heroicons-trash"
                    variant="outline"
                    color="error"
                    :disabled="!form.qualityGrade"
                    @click="openDeleteGradeModal"
                  />
                </div>
                <p v-if="errors.qualityGradeId" class="text-xs text-red-500">
                  {{ errors.qualityGradeId }}
                </p>
                <p v-else class="text-xs text-slate-500">
                  Pilih atau kelola tingkat kualitas
                </p>
              </div>
            </div>
          </div>

          <!-- Stock & Pricing -->
          <div class="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-700">
            <h3 class="text-lg font-semibold text-slate-900 dark:text-white">
              Stock & Pricing
            </h3>

            <div class="space-y-6">
              <div>
                <h4 class="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Inventori
                </h4>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <UFieldGroup label="Jumlah Stok">
                    <UInput
                      v-model.number="form.stock"
                      type="number"
                      min="0"
                      placeholder="0"
                      size="lg"
                    />
                    <p class="text-xs text-slate-500">
                      Jumlah stok aktual
                    </p>
                  </UFieldGroup>

                  <UFieldGroup label="Periode Garansi (hari)">
                    <UInput
                      v-model.number="form.warrantyDays"
                      type="number"
                      min="0"
                      placeholder="0"
                      size="lg"
                    />
                    <p class="text-xs text-slate-500">
                      Durasi garansi dalam hari
                    </p>
                  </UFieldGroup>
                </div>
              </div>

              <div class="border-t border-slate-200 dark:border-slate-700 pt-4">
                <h4 class="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Konfigurasi Harga
                </h4>
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  <UFieldGroup label="Harga Modal">
                    <UInput
                      v-model.number="form.costPrice"
                      type="number"
                      min="0"
                      placeholder="0"
                      size="lg"
                    >
                      <template #leading>
                        <span class="text-slate-500 text-xs font-medium">
                          Rp
                        </span>
                      </template>
                    </UInput>
                    <p class="text-xs text-slate-500">
                      Harga beli internal
                    </p>
                  </UFieldGroup>

                  <UFieldGroup label="Harga Teknisi">
                    <UInput
                      v-model.number="form.technicianPrice"
                      type="number"
                      min="0"
                      placeholder="0"
                      size="lg"
                    >
                      <template #leading>
                        <span class="text-slate-500 text-xs font-medium">
                          Rp
                        </span>
                      </template>
                    </UInput>
                    <p class="text-xs text-slate-500">
                      Harga untuk teknisi
                    </p>
                  </UFieldGroup>

                  <UFieldGroup label="Harga Retail" :error="errors.retailPrice">
                    <UInput
                      v-model.number="form.retailPrice"
                      type="number"
                      min="0"
                      placeholder="0"
                      size="lg"
                    >
                      <template #leading>
                        <span class="text-slate-500 text-xs font-medium">
                          Rp
                        </span>
                      </template>
                    </UInput>
                    <p v-if="!errors.retailPrice" class="text-xs text-slate-500">
                      Harga untuk pelanggan
                    </p>
                  </UFieldGroup>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
            <UButton
              color="neutral  "
              variant="soft"
              size="lg"
              :disabled="loading"
              @click="router.back()"
            >
              Batal
            </UButton>
            <UButton
              type="submit"
              icon="i-heroicons-check"
              color="primary"
              size="lg"
              :loading="loading"
            >
              Update Produk
            </UButton>
          </div>
        </form>
      </UCard>
    </template>
  </div>

  <!-- MODALS MASTER -->
  <!-- Modal Tambah Model Perangkat -->
  <UModal v-model:open="isCreateModelModalOpen" title="Tambah Model Perangkat">
    <template #body>
      <div class="space-y-3">
        <UFieldGroup label="Brand HP" required>
          <UInput
            v-model="newDeviceModel.deviceBrand"
            placeholder="Samsung, Oppo, Xiaomi..."
          />
        </UFieldGroup>
        <UFieldGroup label="Nama Model" required>
          <UInput
            v-model="newDeviceModel.modelName"
            placeholder="A10s, A12, Note 8, dll"
          />
        </UFieldGroup>
      </div>
    </template>
    <template #footer="{ close }">
      <UButton color="neutral" variant="outline" @click="close">
        Batal
      </UButton>
      <UButton
        color="primary"
        :loading="productStore.loading.action"
        @click="handleCreateDeviceModel"
      >
        Simpan
      </UButton>
    </template>
  </UModal>

  <!-- Modal Edit Model Perangkat -->
  <UModal v-model:open="isEditModelModalOpen" title="Edit Model Perangkat">
    <template #body>
      <div class="space-y-3">
        <UFieldGroup label="Brand HP" required>
          <UInput v-model="editDeviceModel.deviceBrand" />
        </UFieldGroup>
        <UFieldGroup label="Nama Model" required>
          <UInput v-model="editDeviceModel.modelName" />
        </UFieldGroup>
      </div>
    </template>
    <template #footer="{ close }">
      <UButton color="neutral" variant="outline" @click="close">
        Batal
      </UButton>
      <UButton
        color="primary"
        :loading="productStore.loading.action"
        @click="handleUpdateModel"
      >
        Simpan Perubahan
      </UButton>
    </template>
  </UModal>

  <!-- Modal Hapus Model Perangkat -->
  <UModal
    v-model:open="isDeleteModelModalOpen"
    :ui="{ footer: 'justify-end' }"
  >
    <template #header>
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-full bg-error/10">
          <UIcon
            name="i-heroicons-exclamation-triangle"
            class="h-5 w-5 text-error"
          />
        </div>
        <div>
          <h3 class="font-semibold text-highlighted">Hapus Model Perangkat</h3>
          <p class="text-sm text-muted">
            Tindakan ini tidak dapat dibatalkan
          </p>
        </div>
      </div>
    </template>
    <template #body>
      <p class="text-muted">
        Apakah Anda yakin ingin menghapus
        <strong class="text-highlighted">
          {{ editDeviceModel.deviceBrand }} {{ editDeviceModel.modelName }}
        </strong>
        dari daftar model perangkat?
      </p>
    </template>
    <template #footer="{ close }">
      <UButton color="neutral" variant="outline" @click="close">
        Batal
      </UButton>
      <UButton
        color="error"
        :loading="productStore.loading.action"
        @click="handleDeleteModel"
      >
        Hapus
      </UButton>
    </template>
  </UModal>

  <!-- Modal Tambah Tipe Produk -->
  <UModal v-model:open="isCreateTypeModalOpen" title="Tambah Tipe Produk">
    <template #body>
      <div class="space-y-3">
        <UFieldGroup label="Nama Tipe" required>
          <UInput v-model="newProductType.name" placeholder="LCD, Baterai, Charger..." />
        </UFieldGroup>
        <UFieldGroup label="Deskripsi">
          <UTextarea v-model="newProductType.description" />
        </UFieldGroup>
      </div>
    </template>
    <template #footer="{ close }">
      <UButton color="neutral" variant="outline" @click="close">
        Batal
      </UButton>
      <UButton
        color="primary"
        :loading="productStore.loading.action"
        @click="handleCreateProductType"
      >
        Simpan
      </UButton>
    </template>
  </UModal>

  <!-- Modal Edit Tipe Produk -->
  <UModal v-model:open="isEditTypeModalOpen" title="Edit Tipe Produk">
    <template #body>
      <div class="space-y-3">
        <UFieldGroup label="Nama Tipe" required>
          <UInput v-model="editProductType.name" />
        </UFieldGroup>
        <UFieldGroup label="Deskripsi">
          <UTextarea v-model="editProductType.description" />
        </UFieldGroup>
      </div>
    </template>
    <template #footer="{ close }">
      <UButton color="neutral" variant="outline" @click="close">
        Batal
      </UButton>
      <UButton
        color="primary"
        :loading="productStore.loading.action"
        @click="handleUpdateType"
      >
        Simpan Perubahan
      </UButton>
    </template>
  </UModal>

  <!-- Modal Hapus Tipe Produk -->
  <UModal
    v-model:open="isDeleteTypeModalOpen"
    :ui="{ footer: 'justify-end' }"
  >
    <template #header>
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-full bg-error/10">
          <UIcon
            name="i-heroicons-exclamation-triangle"
            class="h-5 w-5 text-error"
          />
        </div>
        <div>
          <h3 class="font-semibold text-highlighted">Hapus Tipe Produk</h3>
          <p class="text-sm text-muted">
            Tindakan ini tidak dapat dibatalkan
          </p>
        </div>
      </div>
    </template>
    <template #body>
      <p class="text-muted">
        Apakah Anda yakin ingin menghapus
        <strong class="text-highlighted">
          {{ editProductType.name }}
        </strong>
        dari daftar tipe produk?
      </p>
    </template>
    <template #footer="{ close }">
      <UButton color="neutral" variant="outline" @click="close">
        Batal
      </UButton>
      <UButton
        color="error"
        :loading="productStore.loading.action"
        @click="handleDeleteType"
      >
        Hapus
      </UButton>
    </template>
  </UModal>

  <!-- Modal Tambah Merek -->
  <UModal v-model:open="isCreateBrandModalOpen" title="Tambah Merek Spare Part">
    <template #body>
      <div class="space-y-3">
        <UFieldGroup label="Nama Merek" required>
          <UInput v-model="newPartBrand.name" placeholder="Shinstar, LF, OG, dll" />
        </UFieldGroup>
        <UFieldGroup label="Deskripsi">
          <UTextarea v-model="newPartBrand.description" />
        </UFieldGroup>
      </div>
    </template>
    <template #footer="{ close }">
      <UButton color="neutral" variant="outline" @click="close">
        Batal
      </UButton>
      <UButton
        color="primary"
        :loading="productStore.loading.action"
        @click="handleCreatePartBrand"
      >
        Simpan
      </UButton>
    </template>
  </UModal>

  <!-- Modal Edit Merek -->
  <UModal v-model:open="isEditBrandModalOpen" title="Edit Merek Spare Part">
    <template #body>
      <div class="space-y-3">
        <UFieldGroup label="Nama Merek" required>
          <UInput v-model="editBrand.name" />
        </UFieldGroup>
        <UFieldGroup label="Deskripsi">
          <UTextarea v-model="editBrand.description" />
        </UFieldGroup>
      </div>
    </template>
    <template #footer="{ close }">
      <UButton color="neutral" variant="outline" @click="close">
        Batal
      </UButton>
      <UButton
        color="primary"
        :loading="productStore.loading.action"
        @click="handleUpdateBrand"
      >
        Simpan Perubahan
      </UButton>
    </template>
  </UModal>

  <!-- Modal Hapus Merek -->
  <UModal
    v-model:open="isDeleteBrandModalOpen"
    :ui="{ footer: 'justify-end' }"
  >
    <template #header>
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-full bg-error/10">
          <UIcon
            name="i-heroicons-exclamation-triangle"
            class="h-5 w-5 text-error"
          />
        </div>
        <div>
          <h3 class="font-semibold text-highlighted">Hapus Merek</h3>
          <p class="text-sm text-muted">
            Tindakan ini tidak dapat dibatalkan
          </p>
        </div>
      </div>
    </template>
    <template #body>
      <p class="text-muted">
        Apakah Anda yakin ingin menghapus
        <strong class="text-highlighted">
          {{ editBrand.name }}
        </strong>
        dari daftar merek? Produk yang sudah menggunakan merek ini tidak akan otomatis berubah.
      </p>
    </template>
    <template #footer="{ close }">
      <UButton color="neutral" variant="outline" @click="close">
        Batal
      </UButton>
      <UButton
        color="error"
        :loading="productStore.loading.action"
        @click="handleDeleteBrand"
      >
        Hapus
      </UButton>
    </template>
  </UModal>

  <!-- Modal Tambah Kualitas -->
  <UModal v-model:open="isCreateGradeModalOpen" title="Tambah Kualitas">
    <template #body>
      <div class="space-y-3">
        <UFieldGroup label="Nama Kualitas" required>
          <UInput v-model="newQualityGrade.name" placeholder="Original, OEM, High Copy, KW" />
        </UFieldGroup>
        <UFieldGroup label="Deskripsi">
          <UTextarea v-model="newQualityGrade.description" />
        </UFieldGroup>
      </div>
    </template>
    <template #footer="{ close }">
      <UButton color="neutral" variant="outline" @click="close">
        Batal
      </UButton>
      <UButton
        color="primary"
        :loading="productStore.loading.action"
        @click="handleCreateQualityGrade"
      >
        Simpan
      </UButton>
    </template>
  </UModal>

  <!-- Modal Edit Kualitas -->
  <UModal v-model:open="isEditGradeModalOpen" title="Edit Kualitas">
    <template #body>
      <div class="space-y-3">
        <UFieldGroup label="Nama Kualitas" required>
          <UInput v-model="editQualityGrade.name" />
        </UFieldGroup>
        <UFieldGroup label="Deskripsi">
          <UTextarea v-model="editQualityGrade.description" />
        </UFieldGroup>
      </div>
    </template>
    <template #footer="{ close }">
      <UButton color="neutral" variant="outline" @click="close">
        Batal
      </UButton>
      <UButton
        color="primary"
        :loading="productStore.loading.action"
        @click="handleUpdateGrade"
      >
        Simpan Perubahan
      </UButton>
    </template>
  </UModal>

  <!-- Modal Hapus Kualitas -->
  <UModal
    v-model:open="isDeleteGradeModalOpen"
    :ui="{ footer: 'justify-end' }"
  >
    <template #header>
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-full bg-error/10">
          <UIcon
            name="i-heroicons-exclamation-triangle"
            class="h-5 w-5 text-error"
          />
        </div>
        <div>
          <h3 class="font-semibold text-highlighted">Hapus Kualitas</h3>
          <p class="text-sm text-muted">
            Tindakan ini tidak dapat dibatalkan
          </p>
        </div>
      </div>
    </template>
    <template #body>
      <p class="text-muted">
        Apakah Anda yakin ingin menghapus
        <strong class="text-highlighted">
          {{ editQualityGrade.name }}
        </strong>
        dari daftar kualitas?
      </p>
    </template>
    <template #footer="{ close }">
      <UButton color="neutral" variant="outline" @click="close">
        Batal
      </UButton>
      <UButton
        color="error"
        :loading="productStore.loading.action"
        @click="handleDeleteGrade"
      >
        Hapus
      </UButton>
    </template>
  </UModal>
</template>

