<script setup lang="ts">
import type { CreateCaseStudiesPayload } from '~/types/caseStudies'

definePageMeta({
  layout: 'dashboard',
  requiresAuth: true,
  middleware: 'admin'
})

const router = useRouter()
const toast = useToast()
const caseStudies = useCaseStudies()

const isLoading = ref(false)

const handleSubmit = async (payload: CreateCaseStudiesPayload) => {
  isLoading.value = true
  try {
    const result = await caseStudies.create(payload)
    
    toast.add({
      title: 'Success',
      description: 'Case study created successfully',
      color: 'success',
      icon: 'i-heroicons-check-circle'
    })
    
    // Redirect ke list setelah 1 detik
    setTimeout(() => {
      navigateTo('/dashboard/admin/case-studies')
    }, 1000)
  } catch (err: any) {
    toast.add({
      title: 'Error',
      description: err?.message || 'Failed to create case study',
      color: 'error',
      icon: 'i-heroicons-x-circle'
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <div class="flex items-center gap-2 mb-2">
        <NuxtLink 
          to="/dashboard/admin/case-studies"
          class="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
          Back to Case Studies
        </NuxtLink>
      </div>
      <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Create New Case Study</h1>
      <p class="text-slate-600 dark:text-slate-400 mt-1">Add a new case study to your portfolio</p>
    </div>

    <!-- Form -->
    <CaseStudiesForm 
      @submit="handleSubmit"
      :loading="isLoading"
      :is-editing="false"
    />
  </div>
</template>
