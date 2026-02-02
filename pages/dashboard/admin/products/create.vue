<!-- pages/dashboard/admin/products/create.vue -->

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type {
  CreateProductRequest,
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

const productStore = useProductStore()
const router = useRouter()
const fileUpload = useProductFileUpload()
const isNameEdited = ref(false)


// ===== Form lokal (object untuk select) =====
type CreateProductForm = {
  deviceModels: DeviceModel[]
  productType: ProductType | null
  partBrand: PartBrand | null
  qualityGrade: QualityGrade | null
  sku: string
  name: string
  description: string
  stock: number
  costPrice: number
  technicianPrice: number
  retailPrice: number
  imageUrls: string[]
  warrantyDays: number
}


const form = ref<CreateProductForm>({
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
  imageUrls: [],
  warrantyDays: 0
})


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

const isUploading = ref(false)

// ==== state CRUD master (modal) ====
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

// Load reference data
onMounted(async () => {
  if (productStore.deviceModels.length === 0) {
    await productStore.fetchReferences()
  }
})

// References
const deviceModels = computed(() => productStore.deviceModels)
const productTypes = computed(() => productStore.productTypes)
const partBrands = computed(() => productStore.partBrands)
const qualityGrades = computed(() => productStore.qualityGrades)
const loading = computed(() => productStore.loading.action || isUploading.value)

const autoGenerateName = () => {
  if (isNameEdited.value) return

  const typeName = form.value.productType?.name
  const devices = form.value.deviceModels

  if (!typeName || !devices.length) {
    form.value.name = ''
    return
  }

  const modelNames = devices.map((device) =>
    (device as any).fullName ?? `${device.deviceBrand} ${device.modelName}`
  )

  form.value.name = `${typeName} ${modelNames.join('/')}`
}

// Re-run kalau tipe atau model berubah
watch(
  () => [form.value.productType, form.value.deviceModels],
  () => autoGenerateName(),
  { deep: true }
)


// Re-run kalau tipe atau model berubah
watch(
  () => [form.value.productType, form.value.deviceModels],
  () => autoGenerateName(),
  { deep: true }
)


// Handle file upload
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
    if ((form.value.imageUrls.length || 0) + files.length > 5) {
      errors.value.image = 'Maksimal 5 gambar per produk'
      return
    }
  }

  try {
    isUploading.value = true
    errors.value.image = ''

    const response = await fileUpload.uploadMultipleFile(files)

    response.files.forEach((file: any) => {
      form.value.imageUrls.push(file.fileName)
    })

    target.value = ''
  } catch (error: any) {
    console.error(error)
    errors.value.image = error.data?.message || 'Gagal upload gambar'
  } finally {
    isUploading.value = false
  }
}

// Hapus gambar
const removeImage = async (index: number) => {
  const fileName = form.value.imageUrls[index]
  if (!fileName) return

  form.value.imageUrls.splice(index, 1)

  try {
    await fileUpload.deleteFile(fileName)
  } catch (e) {
    console.error(e)
    form.value.imageUrls.splice(index, 0, fileName)
  }
}

// Validasi
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

  //if (!form.value.sku) errors.value.sku = 'SKU wajib diisi'
  if (!form.value.name) errors.value.name = 'Nama produk wajib diisi'
  if (!form.value.deviceModels.length) {
  errors.value.deviceModelId = 'Minimal satu model perangkat wajib dipilih'
}

  if (!form.value.productType) errors.value.productTypeId = 'Tipe produk wajib dipilih'
  if (!form.value.partBrand) errors.value.partBrandId = 'Merek spare part wajib dipilih'
  if (!form.value.qualityGrade) errors.value.qualityGradeId = 'Kualitas wajib dipilih'
  if (form.value.retailPrice <= 0) errors.value.retailPrice = 'Harga retail harus lebih dari 0'

  return !Object.values(errors.value).some(err => err !== '')
}

// Submit: mapping ke CreateProductRequest
const handleSubmit = async () => {
  if (!validateForm()) return

  const payload: CreateProductRequest = {
    deviceModelIds: form.value.deviceModels.map((m) => m.id),
    productTypeId: form.value.productType?.id ?? 0,
    partBrandId: form.value.partBrand?.id ?? 0,
    qualityGradeId: form.value.qualityGrade?.id ?? 0,
    sku: form.value.sku,
    name: form.value.name,
    description: form.value.description || undefined,
    stock: form.value.stock,
    costPrice: form.value.costPrice,
    technicianPrice: form.value.technicianPrice,
    retailPrice: form.value.retailPrice,
    imageUrls: form.value.imageUrls,
    warrantyDays: form.value.warrantyDays || undefined
  }

  try {
    await productStore.createProduct(payload)
    await navigateTo('/dashboard/admin/products')
  } catch (error: any) {
    console.error('Gagal membuat produk:', error)
    if (error.data?.message) {
      errors.value.general = error.data.message
    } else {
      errors.value.general = 'Gagal membuat produk'
    }
  }
}

// ====== HANDLER CREATE MASTER ======
const handleCreateDeviceModel = async () => {
  const { deviceBrand, modelName } = newDeviceModel.value
  if (!deviceBrand.trim() || !modelName.trim()) return

  const created = await productStore.createDeviceModel(deviceBrand, modelName)
  form.value.deviceModel = created
  isCreateModelModalOpen.value = false
  newDeviceModel.value = { deviceBrand: '', modelName: '' }
}

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

// ====== HANDLER EDIT/DELETE MODEL ======
const openEditModelModal = () => {
  if (!form.value.deviceModels.length) return
  const first = form.value.deviceModels[0]
  if (!first) return
  editDeviceModel.value = {
    id: first.id,
    deviceBrand: first.deviceBrand,
    modelName: first.modelName
  }
  isEditModelModalOpen.value = true
}

const handleUpdateModel = async () => {
  if (!editDeviceModel.value.id) return

  const updated = await productStore.updateDeviceModel(
    editDeviceModel.value.id,
    {
      deviceBrand: editDeviceModel.value.deviceBrand,
      modelName: editDeviceModel.value.modelName
    }
  )

  // Update di array deviceModels (global store + form selected)
  const storeIndex = productStore.deviceModels.findIndex(m => m.id === updated.id)
  if (storeIndex !== -1) {
    productStore.deviceModels[storeIndex] = {
      ...updated,
      fullName: (updated as any).fullName ?? `${updated.deviceBrand} ${updated.modelName}`
    }
  }

  // Update di form selected items
  const formIndex = form.value.deviceModels.findIndex(m => m.id === updated.id)
  if (formIndex !== -1) {
    form.value.deviceModels[formIndex] = {
      ...updated,
      fullName: (updated as any).fullName ?? `${updated.deviceBrand} ${updated.modelName}`
    }
  }

  isEditModelModalOpen.value = false
}


const openDeleteModelModal = () => {
  if (!form.value.deviceModels.length) return
  const first = form.value.deviceModels[0]
  if (!first) return
  editDeviceModel.value = {
    id: first.id,
    deviceBrand: first.deviceBrand,
    modelName: first.modelName
  }
  isDeleteModelModalOpen.value = true
}

const handleDeleteModel = async () => {
  if (!editDeviceModel.value.id) return

  await productStore.deleteDeviceModel(editDeviceModel.value.id)

  // Hapus dari global store (sudah dihandle store action)
  
  // Hapus dari form selected items
  form.value.deviceModels = form.value.deviceModels.filter(
    m => m.id !== editDeviceModel.value.id
  )

  isDeleteModelModalOpen.value = false
}


// ====== HANDLER EDIT/DELETE TYPE ======
const openEditTypeModal = () => {
  if (!form.value.productType) return
  editProductType.value = {
    id: form.value.productType.id,
    name: form.value.productType.name,
    description: form.value.productType.description
  }
  isEditTypeModalOpen.value = true
}

const handleUpdateType = async () => {
  if (!editProductType.value.id) return

  const updated = await productStore.updateProductType(editProductType.value.id, {
    name: editProductType.value.name,
    description: editProductType.value.description
  })

  if (form.value.productType && form.value.productType.id === updated.id) {
    form.value.productType = updated
  }

  isEditTypeModalOpen.value = false
}

const openDeleteTypeModal = () => {
  if (!form.value.productType) return
  editProductType.value = {
    id: form.value.productType.id,
    name: form.value.productType.name,
    description: form.value.productType.description
  }
  isDeleteTypeModalOpen.value = true
}

const handleDeleteType = async () => {
  if (!editProductType.value.id) return

  await productStore.deleteProductType(editProductType.value.id)

  if (form.value.productType && form.value.productType.id === editProductType.value.id) {
    form.value.productType = null
  }

  isDeleteTypeModalOpen.value = false
}

// ====== HANDLER EDIT/DELETE BRAND ======
const openEditBrandModal = () => {
  if (!form.value.partBrand) return
  editBrand.value = {
    id: form.value.partBrand.id,
    name: form.value.partBrand.name,
    description: (form.value.partBrand as any).notes || ''
  }
  isEditBrandModalOpen.value = true
}

const handleUpdateBrand = async () => {
  if (!editBrand.value.id || !editBrand.value.name.trim()) return

  const updated = await productStore.updatePartBrand(editBrand.value.id, {
    name: editBrand.value.name,
    description: editBrand.value.description
  })

  if (form.value.partBrand && form.value.partBrand.id === updated.id) {
    form.value.partBrand = updated
  }

  isEditBrandModalOpen.value = false
}

const openDeleteBrandModal = () => {
  if (!form.value.partBrand) return
  editBrand.value = {
    id: form.value.partBrand.id,
    name: form.value.partBrand.name,
    description: (form.value.partBrand as any).notes || ''
  }
  isDeleteBrandModalOpen.value = true
}

const handleDeleteBrand = async () => {
  if (!editBrand.value.id) return

  await productStore.deletePartBrand(editBrand.value.id)

  if (form.value.partBrand && form.value.partBrand.id === editBrand.value.id) {
    form.value.partBrand = null
  }

  isDeleteBrandModalOpen.value = false
}

// ====== HANDLER EDIT/DELETE QUALITY ======
const openEditGradeModal = () => {
  if (!form.value.qualityGrade) return
  editQualityGrade.value = {
    id: form.value.qualityGrade.id,
    name: form.value.qualityGrade.name,
    description: form.value.qualityGrade.description
  }
  isEditGradeModalOpen.value = true
}

const handleUpdateGrade = async () => {
  if (!editQualityGrade.value.id) return

  const updated = await productStore.updateQualityGrade(editQualityGrade.value.id, {
    name: editQualityGrade.value.name,
    description: editQualityGrade.value.description
  })

  if (form.value.qualityGrade && form.value.qualityGrade.id === updated.id) {
    form.value.qualityGrade = updated
  }

  isEditGradeModalOpen.value = false
}

const openDeleteGradeModal = () => {
  if (!form.value.qualityGrade) return
  editQualityGrade.value = {
    id: form.value.qualityGrade.id,
    name: form.value.qualityGrade.name,
    description: form.value.qualityGrade.description
  }
  isDeleteGradeModalOpen.value = true
}

const handleDeleteGrade = async () => {
  if (!editQualityGrade.value.id) return

  await productStore.deleteQualityGrade(editQualityGrade.value.id)

  if (form.value.qualityGrade && form.value.qualityGrade.id === editQualityGrade.value.id) {
    form.value.qualityGrade = null
  }

  isDeleteGradeModalOpen.value = false
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900">
    <div class="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <!-- Header -->
      <div class="mb-6">
        <div class="flex items-center gap-3 mb-2">
          <UButton
            icon="i-heroicons-arrow-left"
            color="neutral"
            variant="ghost"
            size="sm"
            @click="router.back()"
          />
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Tambah Produk Baru
          </h1>
        </div>
        <p class="text-sm text-slate-600 dark:text-slate-400 ml-11">
          Buat spare part atau produk baru untuk inventori
        </p>
      </div>

      <!-- Error Alert -->
      <UAlert
        v-if="errors.general"
        color="error"
        variant="soft"
        :title="errors.general"
        :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'error', variant: 'link' }"
        class="mb-6"
        @close="errors.general = ''"
      />

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Informasi Dasar -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-primary-500" />
              <h3 class="text-lg font-semibold text-slate-900 dark:text-white">
                Informasi Dasar
              </h3>
            </div>
          </template>

          <div class="space-y-5">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700 dark:text-slate-300">
                  SKU <span class="text-red-500">*</span>
                </label>
                <UInput
                  v-model="form.sku"
                  placeholder="LCD-A10S-SUN-OEM"
                  size="md"
                  icon="i-heroicons-hashtag"
                />
                <p v-if="errors.sku" class="text-xs text-red-500">{{ errors.sku }}</p>
                <p v-else class="text-xs text-slate-500">Kode identifikasi produk yang unik</p>
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Nama Produk <span class="text-red-500">*</span>
                </label>
                <UInput
  v-model="form.name"
  placeholder="Kosongkan untuk auto-generate dari tipe + model"
  size="md"
  icon="i-heroicons-cube"
  @input="isNameEdited = true"
/>

                <p v-if="errors.name" class="text-xs text-red-500">{{ errors.name }}</p>
                <p v-else class="text-xs text-slate-500">Nama tampilan untuk produk</p>
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-700 dark:text-slate-300">
                Deskripsi
              </label>
              <UTextarea
                v-model="form.description"
                placeholder="Masukkan deskripsi produk (opsional)..."
                :rows="4"
                resize
              />
              <p class="text-xs text-slate-500">Deskripsi produk (opsional)</p>
            </div>

            <!-- Image Upload -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-700 dark:text-slate-300">
                Gambar Produk
              </label>
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
                  v-if="form.imageUrls && form.imageUrls.length"
                  class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
                >
                  <div
                    v-for="(fileName, index) in form.imageUrls"
                    :key="fileName"
                    class="relative group"
                  >
                    <img
                      :src="fileUpload.getFileUrl(fileName)"
                      class="w-full h-40 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
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
              </div>

              <p v-if="errors.image" class="text-xs text-red-500">{{ errors.image }}</p>
              <p v-else class="text-xs text-slate-500">
                Ukuran maksimal 5MB, format: JPG, PNG, GIF, WEBP
              </p>
            </div>
          </div>
        </UCard>

        <!-- Klasifikasi -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-tag" class="w-5 h-5 text-primary-500" />
              <h3 class="text-lg font-semibold text-slate-900 dark:text-white">
                Klasifikasi
              </h3>
            </div>
          </template>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <!-- Model Perangkat -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-700 dark:text-slate-300">
                Model Perangkat <span class="text-red-500">*</span>
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
                  :disabled="!form.deviceModels"
                  @click="openEditModelModal"
                />
                <UButton
                  icon="i-heroicons-trash"
                  variant="outline"
                  color="error"
                  :disabled="!form.deviceModels"
                  @click="openDeleteModelModal"
                />
              </div>
              <p v-if="errors.deviceModelId" class="text-xs text-red-500">
                {{ errors.deviceModelId }}
              </p>
              <p v-else class="text-xs text-slate-500">Pilih atau kelola model perangkat</p>
            </div>

            <!-- Tipe Produk -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-700 dark:text-slate-300">
                Tipe Produk <span class="text-red-500">*</span>
              </label>
              <div class="flex gap-2">
                <USelectMenu
                  v-model="form.productType"
                  :items="productTypes"
                  placeholder="Pilih tipe produk"
                  label-key="name"
                  size="md"
                  searchable
                  class="flex-1"
                >
                  <template #leading>
                    <UIcon name="i-heroicons-squares-2x2" class="w-5 h-5" />
                  </template>
                </USelectMenu>
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
              <p v-else class="text-xs text-slate-500">Pilih atau kelola kategori produk</p>
            </div>

            <!-- Merek Spare Part -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-700 dark:text-slate-300">
                Merek Spare Part <span class="text-red-500">*</span>
              </label>
              <div class="flex gap-2">
                <USelectMenu
                  v-model="form.partBrand"
                  :items="partBrands"
                  placeholder="Pilih merek spare part"
                  label-key="name"
                  size="md"
                  searchable
                  class="flex-1"
                >
                  <template #leading>
                    <UIcon name="i-heroicons-building-storefront" class="w-5 h-5" />
                  </template>
                </USelectMenu>

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
              <p v-else class="text-xs text-slate-500">Pilih atau kelola merek pabrikan</p>
            </div>

            <!-- Kualitas -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-700 dark:text-slate-300">
                Kualitas <span class="text-red-500">*</span>
              </label>
              <div class="flex gap-2">
                <USelectMenu
                  v-model="form.qualityGrade"
                  :items="qualityGrades"
                  placeholder="Pilih kualitas"
                  label-key="name"
                  size="md"
                  searchable
                  class="flex-1"
                >
                  <template #leading>
                    <UIcon name="i-heroicons-star" class="w-5 h-5" />
                  </template>
                </USelectMenu>
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
              <p v-else class="text-xs text-slate-500">Pilih atau kelola tingkat kualitas</p>
            </div>
          </div>
        </UCard>

        <!-- Stok & Harga -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-currency-dollar" class="w-5 h-5 text-primary-500" />
              <h3 class="text-lg font-semibold text-slate-900 dark:text-white">
                Stok & Harga
              </h3>
            </div>
          </template>

          <div class="space-y-6">
            <div>
              <h4 class="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                Inventori
              </h4>
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div class="space-y-2">
                  <label class="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Jumlah Stok
                  </label>
                  <UInput
                    v-model.number="form.stock"
                    type="number"
                    placeholder="0"
                    size="md"
                    min="0"
                  >
                    <template #leading>
                      <UIcon name="i-heroicons-cube" class="w-5 h-5" />
                    </template>
                  </UInput>
                  <p class="text-xs text-slate-500">Jumlah stok awal</p>
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Periode Garansi
                  </label>
                  <UInput
                    v-model.number="form.warrantyDays"
                    type="number"
                    placeholder="0"
                    size="md"
                    min="0"
                  >
                    <template #leading>
                      <UIcon name="i-heroicons-shield-check" class="w-5 h-5" />
                    </template>
                    <template #trailing>
                      <span class="text-xs text-slate-500">hari</span>
                    </template>
                  </UInput>
                  <p class="text-xs text-slate-500">Durasi garansi dalam hari</p>
                </div>
              </div>
            </div>

            <div class="border-t border-slate-200 dark:border-slate-700"></div>

            <div>
              <h4 class="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                Konfigurasi Harga
              </h4>
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div class="space-y-2">
                  <label class="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Harga Modal
                  </label>
                  <UInput
                    v-model.number="form.costPrice"
                    type="number"
                    placeholder="0"
                    size="md"
                    min="0"
                  >
                    <template #leading>
                      <span class="text-xs text-slate-500 font-medium">Rp</span>
                    </template>
                  </UInput>
                  <p class="text-xs text-slate-500">Harga beli internal</p>
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Harga Teknisi
                  </label>
                  <UInput
                    v-model.number="form.technicianPrice"
                    type="number"
                    placeholder="0"
                    size="md"
                    min="0"
                  >
                    <template #leading>
                      <span class="text-xs text-slate-500 font-medium">Rp</span>
                    </template>
                  </UInput>
                  <p class="text-xs text-slate-500">Harga untuk teknisi</p>
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Harga Retail <span class="text-red-500">*</span>
                  </label>
                  <UInput
                    v-model.number="form.retailPrice"
                    type="number"
                    placeholder="0"
                    size="md"
                    min="0"
                  >
                    <template #leading>
                      <span class="text-xs text-slate-500 font-medium">Rp</span>
                    </template>
                  </UInput>
                  <p v-if="errors.retailPrice" class="text-xs text-red-500">
                    {{ errors.retailPrice }}
                  </p>
                  <p v-else class="text-xs text-slate-500">Harga untuk pelanggan</p>
                </div>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3 pt-2 pb-4">
          <UButton
            color="neutral"
            variant="soft"
            size="lg"
            @click="router.back()"
            :disabled="loading"
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
            Buat Produk
          </UButton>
        </div>
      </form>
    </div>

    <!-- MODALS MASTER -->

    <!-- Modal Tambah Model Perangkat -->
    <UModal v-model:open="isCreateModelModalOpen" title="Tambah Model Perangkat">
      <template #body>
        <div class="space-y-3">
          <UFieldGroup label="Brand HP" required>
            <UInput v-model="newDeviceModel.deviceBrand" placeholder="Samsung, Oppo, Xiaomi..." />
          </UFieldGroup>
          <UFieldGroup label="Nama Model" required>
            <UInput v-model="newDeviceModel.modelName" placeholder="A10s, A12, Note 8, dll" />
          </UFieldGroup>
        </div>
      </template>
      <template #footer="{ close }">
        <UButton color="neutral" variant="outline" @click="close">Batal</UButton>
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
        <UButton color="neutral" variant="outline" @click="close">Batal</UButton>
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
    <UModal v-model:open="isDeleteModelModalOpen" :ui="{ footer: 'justify-end' }">
      <template #header>
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-error/10">
            <UIcon name="i-heroicons-exclamation-triangle" class="h-5 w-5 text-error" />
          </div>
          <div>
            <h3 class="font-semibold text-highlighted">Hapus Model Perangkat</h3>
            <p class="text-sm text-muted">Tindakan ini tidak dapat dibatalkan</p>
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
        <UButton color="neutral" variant="outline" @click="close">Batal</UButton>
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
        <UButton color="neutral" variant="outline" @click="close">Batal</UButton>
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
        <UButton color="neutral" variant="outline" @click="close">Batal</UButton>
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
    <UModal v-model:open="isDeleteTypeModalOpen" :ui="{ footer: 'justify-end' }">
      <template #header>
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-error/10">
            <UIcon name="i-heroicons-exclamation-triangle" class="h-5 w-5 text-error" />
          </div>
          <div>
            <h3 class="font-semibold text-highlighted">Hapus Tipe Produk</h3>
            <p class="text-sm text-muted">Tindakan ini tidak dapat dibatalkan</p>
          </div>
        </div>
      </template>

      <template #body>
        <p class="text-muted">
          Apakah Anda yakin ingin menghapus
          <strong class="text-highlighted">{{ editProductType.name }}</strong>
          dari daftar tipe produk?
        </p>
      </template>

      <template #footer="{ close }">
        <UButton color="neutral" variant="outline" @click="close">Batal</UButton>
        <UButton
          color="error"
          :loading="productStore.loading.action"
          @click="handleDeleteType"
        >
          Hapus
        </UButton>
      </template>
    </UModal>

    <!-- Modal Tambah Merek Spare Part -->
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
        <UButton color="neutral" variant="outline" @click="close">Batal</UButton>
        <UButton
          color="primary"
          :loading="productStore.loading.action"
          @click="handleCreatePartBrand"
        >
          Simpan
        </UButton>
      </template>
    </UModal>

    <!-- Modal Edit Merek Spare Part -->
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
        <UButton color="neutral" variant="outline" @click="close">Batal</UButton>
        <UButton
          color="primary"
          :loading="productStore.loading.action"
          @click="handleUpdateBrand"
        >
          Simpan Perubahan
        </UButton>
      </template>
    </UModal>

    <!-- Modal Hapus Merek Spare Part -->
    <UModal v-model:open="isDeleteBrandModalOpen" :ui="{ footer: 'justify-end' }">
      <template #header>
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-error/10">
            <UIcon name="i-heroicons-exclamation-triangle" class="h-5 w-5 text-error" />
          </div>
          <div>
            <h3 class="font-semibold text-highlighted">Hapus Merek</h3>
            <p class="text-sm text-muted">Tindakan ini tidak dapat dibatalkan</p>
          </div>
        </div>
      </template>

      <template #body>
        <p class="text-muted">
          Apakah Anda yakin ingin menghapus
          <strong class="text-highlighted">{{ editBrand.name }}</strong> dari daftar merek?
          Produk yang sudah menggunakan merek ini tidak akan otomatis berubah.
        </p>
      </template>

      <template #footer="{ close }">
        <UButton color="neutral" variant="outline" @click="close">Batal</UButton>
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
        <UButton color="neutral" variant="outline" @click="close">Batal</UButton>
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
        <UButton color="neutral" variant="outline" @click="close">Batal</UButton>
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
    <UModal v-model:open="isDeleteGradeModalOpen" :ui="{ footer: 'justify-end' }">
      <template #header>
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-error/10">
            <UIcon name="i-heroicons-exclamation-triangle" class="h-5 w-5 text-error" />
          </div>
          <div>
            <h3 class="font-semibold text-highlighted">Hapus Kualitas</h3>
            <p class="text-sm text-muted">Tindakan ini tidak dapat dibatalkan</p>
          </div>
        </div>
      </template>

      <template #body>
        <p class="text-muted">
          Apakah Anda yakin ingin menghapus
          <strong class="text-highlighted">{{ editQualityGrade.name }}</strong>
          dari daftar kualitas?
        </p>
      </template>

      <template #footer="{ close }">
        <UButton color="neutral" variant="outline" @click="close">Batal</UButton>
        <UButton
          color="error"
          :loading="productStore.loading.action"
          @click="handleDeleteGrade"
        >
          Hapus
        </UButton>
      </template>
    </UModal>
  </div>
</template>
