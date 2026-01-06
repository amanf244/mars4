<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  requiresAuth: true,
  role: 'admin'
})

// Layout state
const darkMode = ref(false)
const isSidebarCollapsed = ref(false)

// Gallery store
const galleryStore = useGalleryStore()
const authStore = useAuthStore()
const router = useRouter()

// Form data - fix date type issue
const formData = reactive({
  title: '',
  caption: '',
  text: '',
  fullText: '',
  photos: [] as Array<{ url: string; caption: string }>,
  category: '',
  date: new Date().toISOString().split('T')[0],
  duration: '',
  status: 'draft' as 'draft' | 'published',
  toolsUsed: [] as string[],
  processSteps: [] as Array<{ title: string; description: string }>,
  complexityLevel: 'sedang' as 'rendah' | 'sedang' | 'tinggi',
  tags: ''
})

// Current tool input
const newTool = ref('')
const newPhotoUrl = ref('')
const newPhotoCaption = ref('')

// Menu navigation
const navItems = ref([
  { name: 'Dashboard', icon: '📊', active: false },
  { name: 'Gallery', icon: '🖼️', active: true },
])

// Add/remove methods
const addTool = () => {
  if (newTool.value.trim()) {
    formData.toolsUsed.push(newTool.value.trim())
    newTool.value = ''
  }
}

const removeTool = (index: number) => {
  formData.toolsUsed.splice(index, 1)
}

const addProcessStep = () => {
  formData.processSteps.push({ title: '', description: '' })
}

const removeProcessStep = (index: number) => {
  formData.processSteps.splice(index, 1)
}

const addPhoto = () => {
  if (newPhotoUrl.value.trim()) {
    formData.photos.push({
      url: newPhotoUrl.value.trim(),
      caption: newPhotoCaption.value.trim() || 'Untitled'
    })
    newPhotoUrl.value = ''
    newPhotoCaption.value = ''
  }
}

const removePhoto = (index: number) => {
  formData.photos.splice(index, 1)
}

// Form submission
const handleSubmit = async () => {
  try {
    // Pastikan semua field required terisi
    const itemData = {
      ...formData,
      date: formData.date // Sudah pasti string
    }
    await galleryStore.createGalleryItem(itemData)
    router.push('/admin/gallery')
  } catch (error) {
    console.error('Failed to create gallery item:', error)
  }
}

const handleCancel = () => {
  if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
    router.push('/admin/gallery')
  }
}

// Layout functions
const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const setActive = (index: number) => {
  navItems.value.forEach((item, i) => {
    item.active = i === index
  })
}

const handleLogout = async () => {
  try {
    await authStore.logout()
    navigateTo('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

// Dark mode
const toggleDarkMode = () => {
  darkMode.value = !darkMode.value
  if (darkMode.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// Handle image error dengan type safety
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🖼️</text></svg>'
}
</script>

<template>
  <AdminLayout
    :darkMode="darkMode"
    :isSidebarCollapsed="isSidebarCollapsed"
    :navItems="navItems"
    :user="authStore.user"
    pageTitle="Create New Gallery"
    pageDescription="Buat gallery item baru untuk dokumentasi perbaikan"
    @toggleSidebar="toggleSidebar"
    @toggleDarkMode="toggleDarkMode"
    @setActive="setActive"
    @logout="handleLogout"
  >
    <!-- Loading State -->
    <div v-if="galleryStore.isLoading" class="fixed inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center z-50">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-400">Creating gallery item...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="galleryStore.error" class="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-4">
      <div class="flex items-center">
        <span class="text-red-600 dark:text-red-400 mr-3">⚠️</span>
        <p class="text-red-800 dark:text-red-300">{{ galleryStore.error }}</p>
      </div>
    </div>

    <!-- Form -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <!-- Form Tabs -->
      <div class="border-b border-gray-200 dark:border-gray-700">
        <div class="flex overflow-x-auto">
          <button class="px-6 py-4 font-medium text-blue-600 dark:text-blue-400 border-b-2 border-blue-600">
            📝 Basic Information
          </button>
          <button class="px-6 py-4 font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300">
            🛠️ Technical Details
          </button>
          <button class="px-6 py-4 font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300">
            🖼️ Photos
          </button>
          <button class="px-6 py-4 font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300">
            📊 Process Steps
          </button>
        </div>
      </div>

      <!-- Form Content -->
      <div class="p-6">
        <form @submit.prevent="handleSubmit" class="space-y-8">
          <!-- Basic Information Section -->
          <div class="space-y-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Title -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  v-model="formData.title"
                  type="text"
                  required
                  class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="e.g., iPhone 12 Pro Water Damage Repair"
                />
              </div>

              <!-- Category -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  v-model="formData.category"
                  required
                  class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                >
                  <option value="">Select Category</option>
                  <option value="Water Damage">Water Damage</option>
                  <option value="Screen Replacement">Screen Replacement</option>
                  <option value="Battery Replacement">Battery Replacement</option>
                  <option value="Logic Board Repair">Logic Board Repair</option>
                  <option value="Data Recovery">Data Recovery</option>
                  <option value="Software Issue">Software Issue</option>
                </select>
              </div>
            </div>

            <!-- Caption -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Caption *
              </label>
              <input
                v-model="formData.caption"
                type="text"
                required
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="Brief description that will appear in listings"
              />
            </div>

            <!-- Short Text -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Short Description *
              </label>
              <textarea
                v-model="formData.text"
                rows="3"
                required
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                placeholder="Brief summary of the repair process"
              ></textarea>
            </div>

            <!-- Full Text -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Detailed Description *
              </label>
              <textarea
                v-model="formData.fullText"
                rows="6"
                required
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                placeholder="Complete details of the repair process, steps taken, challenges faced, etc."
              ></textarea>
            </div>
          </div>

          <!-- Metadata Section -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-8">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Metadata</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Date -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Repair Date *
                </label>
                <input
                  v-model="formData.date"
                  type="date"
                  required
                  class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>

              <!-- Duration -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Repair Duration *
                </label>
                <input
                  v-model="formData.duration"
                  type="text"
                  required
                  class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="e.g., 6 hours, 2 days"
                />
              </div>

              <!-- Complexity -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Complexity Level *
                </label>
                <select
                  v-model="formData.complexityLevel"
                  required
                  class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                >
                  <option value="rendah">Low</option>
                  <option value="sedang">Medium</option>
                  <option value="tinggi">High</option>
                </select>
              </div>
            </div>

            <!-- Status & Tags -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <!-- Status -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <div class="flex space-x-4">
                  <label class="flex items-center">
                    <input
                      v-model="formData.status"
                      type="radio"
                      value="draft"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span class="ml-2 text-gray-700 dark:text-gray-300">Draft</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="formData.status"
                      type="radio"
                      value="published"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span class="ml-2 text-gray-700 dark:text-gray-300">Published</span>
                  </label>
                </div>
              </div>

              <!-- Tags -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags *
                </label>
                <input
                  v-model="formData.tags"
                  type="text"
                  required
                  class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Separate tags with commas, e.g., iphone, water damage, repair"
                />
              </div>
            </div>
          </div>

          <!-- Tools Used Section -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-8">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tools Used</h3>
            
            <div class="space-y-4">
              <div v-for="(tool, index) in formData.toolsUsed" :key="index" class="flex items-center">
                <input
                  v-model="formData.toolsUsed[index]"
                  type="text"
                  class="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Tool name"
                />
                <button
                  type="button"
                  @click="removeTool(index)"
                  class="ml-3 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                >
                  Remove
                </button>
              </div>
              
              <div class="flex items-center">
                <input
                  v-model="newTool"
                  type="text"
                  @keyup.enter="addTool"
                  class="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Add a new tool"
                />
                <button
                  type="button"
                  @click="addTool"
                  class="ml-3 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Tool
                </button>
              </div>
            </div>
          </div>

          <!-- Photos Section -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-8">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Photos</h3>
            
            <div class="space-y-6">
              <!-- Existing Photos -->
              <div v-if="formData.photos.length" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  v-for="(photo, index) in formData.photos"
                  :key="index"
                  class="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div class="flex items-center mb-3">
                    <div class="w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded overflow-hidden mr-4">
                      <img
                        :src="photo.url"
                        :alt="photo.caption"
                        class="w-full h-full object-cover"
                        @error="handleImageError"
                      />
                    </div>
                    <div class="flex-1">
                      <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ photo.caption }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ photo.url }}</p>
                    </div>
                    <button
                      type="button"
                      @click="removePhoto(index)"
                      class="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              <!-- Add New Photo -->
              <div class="border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                <h4 class="font-medium text-gray-900 dark:text-white mb-4">Add New Photo</h4>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Image URL *
                    </label>
                    <input
                      v-model="newPhotoUrl"
                      type="url"
                      class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Caption
                    </label>
                    <input
                      v-model="newPhotoCaption"
                      type="text"
                      class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      placeholder="Photo description"
                    />
                  </div>
                  <button
                    type="button"
                    @click="addPhoto"
                    :disabled="!newPhotoUrl"
                    :class="[
                      'px-4 py-2.5 font-medium rounded-lg transition-colors',
                      newPhotoUrl
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    ]"
                  >
                    Add Photo
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Process Steps Section -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-8">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Process Steps</h3>
            
            <div class="space-y-6">
              <div
                v-for="(step, index) in formData.processSteps"
                :key="index"
                class="border border-gray-200 dark:border-gray-700 rounded-lg p-6"
              >
                <div class="flex justify-between items-center mb-4">
                  <h4 class="font-medium text-gray-900 dark:text-white">Step {{ index + 1 }}</h4>
                  <button
                    type="button"
                    @click="removeProcessStep(index)"
                    class="text-sm text-red-600 hover:text-red-800"
                  >
                    Remove Step
                  </button>
                </div>
                
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Step Title *
                    </label>
                    <input
                      v-model="step.title"
                      type="text"
                      required
                      class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      placeholder="e.g., Initial Diagnosis"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description *
                    </label>
                    <textarea
                      v-model="step.description"
                      rows="3"
                      required
                      class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                      placeholder="Detailed description of this step"
                    ></textarea>
                  </div>
                </div>
              </div>
              
              <button
                type="button"
                @click="addProcessStep"
                class="w-full py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
              >
                + Add Process Step
              </button>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-8 flex justify-end space-x-4">
            <button
              type="button"
              @click="handleCancel"
              class="px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="galleryStore.isLoading"
              :class="[
                'px-8 py-3 font-medium rounded-lg transition-colors',
                galleryStore.isLoading
                  ? 'bg-blue-400 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-sm hover:shadow'
              ]"
            >
              {{ galleryStore.isLoading ? 'Creating...' : 'Create Gallery Item' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </AdminLayout>
</template>