<!-- components/CaseStudiesForm.vue (Lanjutan) -->

<script setup lang="ts">
import type { CaseStudiesItem, CreateCaseStudiesPayload } from '~/types/caseStudies'

interface Props {
  initialData?: CaseStudiesItem | null
  loading?: boolean
  isEditing?: boolean
}

interface Emits {
  (e: 'submit', payload: CreateCaseStudiesPayload): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  isEditing: false
})

const emit = defineEmits<Emits>()

const form = ref<CreateCaseStudiesPayload>({
  title: '',
  caption: '',
  text: '',
  fullText: '',
  photos: [],
  category: '',
  date: '',
  duration: '',
  status: 'draft',
  toolsUsed: [],
  processSteps: [],
  complexityLevel: 'sedang',
  tags: ''
})

const newPhotoUrl = ref('')
const newPhotoCaption = ref('')
const newTool = ref('')
const newProcessStepTitle = ref('')
const newProcessStepDesc = ref('')

// Initialize form with existing data
watch(() => props.initialData, (data) => {
  if (data) {
    form.value = {
      title: data.title,
      caption: data.caption,
      text: data.text,
      fullText: data.fullText,
      photos: data.photos || [],
      category: data.category,
      date: data.date,
      duration: data.duration,
      status: data.status,
      toolsUsed: data.toolsUsed || [],
      processSteps: data.processSteps || [],
      complexityLevel: data.complexityLevel,
      tags: data.tags
    }
  }
}, { immediate: true })

const categories = ['Water Damage', 'Screen Replacement', 'Battery Issue', 'Software Problem', 'Hardware Repair', 'Other']
const complexityLevels = ['rendah', 'sedang', 'tinggi'] as const

const addPhoto = () => {
  if (newPhotoUrl.value.trim()) {
    if (!form.value.photos) form.value.photos = []
    form.value.photos.push({
      url: newPhotoUrl.value,
      caption: newPhotoCaption.value || 'Photo'
    })
    newPhotoUrl.value = ''
    newPhotoCaption.value = ''
  }
}

const removePhoto = (index: number) => {
  form.value.photos?.splice(index, 1)
}

const addTool = () => {
  if (newTool.value.trim()) {
    if (!form.value.toolsUsed) form.value.toolsUsed = []
    form.value.toolsUsed.push(newTool.value)
    newTool.value = ''
  }
}

const removeTool = (index: number) => {
  form.value.toolsUsed?.splice(index, 1)
}

const addProcessStep = () => {
  if (newProcessStepTitle.value.trim()) {
    if (!form.value.processSteps) form.value.processSteps = []
    form.value.processSteps.push({
      title: newProcessStepTitle.value,
      description: newProcessStepDesc.value
    })
    newProcessStepTitle.value = ''
    newProcessStepDesc.value = ''
  }
}

const removeProcessStep = (index: number) => {
  form.value.processSteps?.splice(index, 1)
}

const handleSubmit = () => {
  if (!form.value.title.trim()) {
    throw new Error('Title is required')
  }
  if (!form.value.category.trim()) {
    throw new Error('Category is required')
  }
  emit('submit', form.value)
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Basic Info -->
    <div class="bg-white dark:bg-slate-800 rounded-lg p-6 space-y-4 border border-slate-200 dark:border-slate-700">
      <h3 class="text-lg font-semibold text-slate-900 dark:text-white">📝 Basic Information</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormGroup label="Title" name="title" :required="true">
          <UInput 
            v-model="form.title"
            placeholder="e.g., iPhone 12 Pro Water Damage"
            :disabled="loading"
            color="neutral"
          />
        </UFormGroup>

        <UFormGroup label="Category" name="category" :required="true">
          <USelect 
            v-model="form.category"
            :options="categories"
            placeholder="Select category"
            :disabled="loading"
            color="neutral"
          />
        </UFormGroup>
      </div>

      <UFormGroup label="Caption" name="caption" :required="true">
        <UTextarea 
          v-model="form.caption"
          placeholder="Brief description of the case"
          :rows="2"
          :disabled="loading"
          color="neutral"
        />
      </UFormGroup>

      <UFormGroup label="Short Description" name="text" :required="true">
        <UTextarea 
          v-model="form.text"
          placeholder="Short summary visible in list view"
          :rows="3"
          :disabled="loading"
          color="neutral"
        />
      </UFormGroup>

      <UFormGroup label="Full Description" name="fullText" :required="true">
        <UTextarea 
          v-model="form.fullText"
          placeholder="Detailed explanation of the entire case study"
          :rows="6"
          :disabled="loading"
          color="neutral"
        />
      </UFormGroup>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UFormGroup label="Date" name="date" :required="true">
          <UInput 
            v-model="form.date"
            placeholder="e.g., 20 Feb 2024"
            :disabled="loading"
            color="neutral"
          />
        </UFormGroup>

        <UFormGroup label="Duration" name="duration" :required="true">
          <UInput 
            v-model="form.duration"
            placeholder="e.g., 6 jam"
            :disabled="loading"
            color="neutral"
          />
        </UFormGroup>

        <UFormGroup label="Complexity Level" name="complexityLevel" :required="true">
          <USelect 
            v-model="form.complexityLevel"
            :options="complexityLevels"
            :disabled="loading"
            color="neutral"
          />
        </UFormGroup>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormGroup label="Status" name="status" :required="true">
          <USelect 
            v-model="form.status"
            :options="['draft', 'published', 'archived']"
            :disabled="loading"
            color="neutral"
          />
        </UFormGroup>

        <UFormGroup label="Tags" name="tags">
          <UInput 
            v-model="form.tags"
            placeholder="e.g., iphone, water damage, repair"
            :disabled="loading"
            color="neutral"
          />
        </UFormGroup>
      </div>
    </div>

    <!-- Photos Section -->
    <div class="bg-white dark:bg-slate-800 rounded-lg p-6 space-y-4 border border-slate-200 dark:border-slate-700">
      <h3 class="text-lg font-semibold text-slate-900 dark:text-white">📸 Photos</h3>
      
      <div class="space-y-3">
        <div class="flex flex-col sm:flex-row gap-2">
          <UInput 
            v-model="newPhotoUrl"
            placeholder="Photo URL (https://...)"
            :disabled="loading"
            class="flex-1"
            color="neutral"
          />
          <UInput 
            v-model="newPhotoCaption"
            placeholder="Photo caption"
            :disabled="loading"
            class="flex-1"
            color="neutral"
          />
          <UButton 
            @click="addPhoto"
            :disabled="loading || !newPhotoUrl.trim()"
            color="info"
            icon="i-heroicons-plus"
          >
            Add Photo
          </UButton>
        </div>

        <!-- Photo List -->
        <div v-if="form.photos?.length" class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div 
            v-for="(photo, index) in form.photos" 
            :key="`photo-${index}`"
            class="border border-slate-200 dark:border-slate-700 rounded-lg p-3 flex items-start justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <div class="flex-1 min-w-0 flex gap-3">
              <div v-if="photo.url" class="w-12 h-12 shrink-0">
                <img 
                  :src="photo.url" 
                  :alt="photo.caption"
                  class="w-full h-full object-cover rounded"
                  loading="lazy"
                />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-slate-900 dark:text-white">{{ photo.caption }}</p>
                <p class="text-xs text-slate-500 dark:text-slate-400 truncate">{{ photo.url }}</p>
              </div>
            </div>
            <UButton 
              color="error"
              variant="ghost"
              size="sm"
              icon="i-heroicons-trash"
              @click="removePhoto(index)"
              :disabled="loading"
            />
          </div>
        </div>
        <div v-else class="text-center py-4 text-slate-500 dark:text-slate-400 text-sm">
          No photos added yet
        </div>
      </div>
    </div>

    <!-- Tools Section -->
    <div class="bg-white dark:bg-slate-800 rounded-lg p-6 space-y-4 border border-slate-200 dark:border-slate-700">
      <h3 class="text-lg font-semibold text-slate-900 dark:text-white">🔧 Tools Used</h3>
      
      <div class="space-y-3">
        <div class="flex gap-2">
          <UInput 
            v-model="newTool"
            placeholder="e.g., Ultrasonic Cleaner"
            :disabled="loading"
            class="flex-1"
            color="neutral"
            @keyup.enter="addTool"
          />
          <UButton 
            @click="addTool"
            :disabled="loading || !newTool.trim()"
            color="info"
            icon="i-heroicons-plus"
          >
            Add Tool
          </UButton>
        </div>

        <!-- Tools List -->
        <div v-if="form.toolsUsed?.length" class="flex flex-wrap gap-2">
          <div 
            v-for="(tool, index) in form.toolsUsed" 
            :key="`tool-${index}`"
            class="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-200 px-3 py-1.5 rounded-full text-sm font-medium"
          >
            <span>{{ tool }}</span>
            <button 
              type="button"
              @click="removeTool(index)"
              :disabled="loading"
              class="hover:text-blue-600 dark:hover:text-blue-300 transition-colors disabled:opacity-50"
            >
              ✕
            </button>
          </div>
        </div>
        <div v-else class="text-center py-4 text-slate-500 dark:text-slate-400 text-sm">
          No tools added yet
        </div>
      </div>
    </div>

    <!-- Process Steps Section -->
    <div class="bg-white dark:bg-slate-800 rounded-lg p-6 space-y-4 border border-slate-200 dark:border-slate-700">
      <h3 class="text-lg font-semibold text-slate-900 dark:text-white">📋 Process Steps</h3>
      
      <div class="space-y-3">
        <div class="space-y-2">
          <UFormGroup label="Step Title" size="sm">
            <UInput 
              v-model="newProcessStepTitle"
              placeholder="e.g., Diagnosis"
              :disabled="loading"
              color="neutral"
            />
          </UFormGroup>
          <UFormGroup label="Step Description" size="sm">
            <UTextarea 
              v-model="newProcessStepDesc"
              placeholder="Describe this step..."
              :rows="2"
              :disabled="loading"
              color="neutral"
            />
          </UFormGroup>
          <UButton 
            @click="addProcessStep"
            :disabled="loading || !newProcessStepTitle.trim()"
            color="info"
            icon="i-heroicons-plus"
            class="w-full"
          >
            Add Process Step
          </UButton>
        </div>

        <!-- Process Steps List -->
        <div v-if="form.processSteps?.length" class="space-y-2">
          <div 
            v-for="(step, index) in form.processSteps" 
            :key="`step-${index}`"
            class="border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <div class="flex items-start justify-between gap-2">
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold shrink-0">
                    {{ index + 1 }}
                  </div>
                  <p class="font-semibold text-slate-900 dark:text-white">{{ step.title }}</p>
                </div>
                <p class="text-sm text-slate-600 dark:text-slate-300 mt-1 ml-8">{{ step.description }}</p>
              </div>
              <UButton 
                color="error"
                variant="ghost"
                size="sm"
                icon="i-heroicons-trash"
                @click="removeProcessStep(index)"
                :disabled="loading"
              />
            </div>
          </div>
        </div>
        <div v-else class="text-center py-4 text-slate-500 dark:text-slate-400 text-sm">
          No process steps added yet
        </div>
      </div>
    </div>

    <!-- Submit Button -->
    <div class="flex gap-3 pt-4">
      <UButton 
        type="submit"
        :disabled="loading"
        size="lg"
        color="info"
        icon="i-heroicons-check"
        class="flex-1"
      >
        {{ isEditing ? 'Update Case Study' : 'Create Case Study' }}
      </UButton>
      <UButton 
        type="button"
        @click="$router.back()"
        :disabled="loading"
        size="lg"
        variant="outline"
        color="secondary"
        icon="i-heroicons-arrow-left"
      >
        Cancel
      </UButton>
    </div>
  </form>
</template>