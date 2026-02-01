<script setup lang="ts">
import { validateLoginForm } from '~/utils/validators'

// definePageMeta({
//   layout: 'blank'
// })

const auth = useAuthStore()
const toast = useToast()

const form = reactive({
  email: 'admin@example.com',
  password: 'Admin123!',
  rememberMe: true,
  deviceName: 'web-nuxt-client'
})

const state = reactive({
  email: form.email,
  password: form.password,
  rememberMe: form.rememberMe
})

const showPassword = ref(false)
const isSubmitting = ref(false)

const handleSubmit = async () => {
  const validation = validateLoginForm(state.email, state.password)

  if (!validation.valid) {
    Object.entries(validation.errors).forEach(([field, message]) => {
      toast.add({
        title: 'Validation Error',
        description: message,
        color: 'error',
        icon: 'i-heroicons-exclamation-triangle',
        duration: 3000
      })
    })
    return
  }

  isSubmitting.value = true

  try {
    await auth.login({
      email: state.email,
      password: state.password,
      rememberMe: state.rememberMe,
      deviceName: form.deviceName
    })

    toast.add({
      title: 'Welcome back!',
      description: 'Login successful',
      color: 'success',
      icon: 'i-heroicons-check-circle',
      duration: 2000
    })

    setTimeout(async () => {
      if (auth.isAdmin) {
        await navigateTo('/dashboard/admin')
      } else {
        await navigateTo('/products')
      }
    }, 500)
  } catch (err: any) {
    toast.add({
      title: 'Login Failed',
      description: err?.data?.message || 'Invalid credentials',
      color: 'error',
      icon: 'i-heroicons-x-circle',
      duration: 3000
    })
  } finally {
    isSubmitting.value = false
  }
}

const fillDemoAdmin = () => {
  state.email = 'admin@example.com'
  state.password = 'Admin123!'
}

const fillDemoUser = () => {
  state.email = 'user@example.com'
  state.password = 'Admin123!'
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Subtle Background Pattern -->
    <div class="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
    
    <!-- Subtle Gradient Overlay -->
    <div class="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-slate-950 to-purple-950/20"></div>

    <!-- Subtle Corner Glow -->
    <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl"></div>
    <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl"></div>

    <!-- Login Container -->
    <div class="relative z-10 w-full max-w-md">
      <!-- Card -->
      <div class="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl shadow-2xl overflow-hidden">
        <!-- Header -->
        <div class="p-8 pb-6 border-b border-slate-800/50">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span class="text-xl font-bold text-white">M</span>
            </div>
            <div>
              <h1 class="text-xl font-bold text-white">Mars4</h1>
              <p class="text-xs text-slate-400">Authentication Portal</p>
            </div>
          </div>
          <h2 class="text-2xl font-semibold text-white mb-1">Welcome back</h2>
          <p class="text-sm text-slate-400">Sign in to your account to continue</p>
        </div>

        <!-- Form -->
        <div class="p-8">
          <form @submit.prevent="handleSubmit" class="space-y-5">
            <!-- Email -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-300 block">Email address</label>
              <div class="relative group">
                <div class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors">
                  <UIcon name="i-heroicons-envelope" class="w-5 h-5" />
                </div>
                <input
                  v-model="state.email"
                  type="email"
                  placeholder="admin@example.com"
                  :disabled="isSubmitting"
                  class="w-full pl-11 pr-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <!-- Password -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-300 block">Password</label>
              <div class="relative group">
                <div class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors">
                  <UIcon name="i-heroicons-lock-closed" class="w-5 h-5" />
                </div>
                <input
                  v-model="state.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="••••••••"
                  :disabled="isSubmitting"
                  @keyup.enter="handleSubmit"
                  class="w-full pl-11 pr-12 py-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  :disabled="isSubmitting"
                >
                  <UIcon :name="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" class="w-5 h-5" />
                </button>
              </div>
            </div>

            <!-- Remember Me & Forgot Password -->
            <div class="flex items-center justify-between text-sm">
              <label class="flex items-center gap-2 cursor-pointer group">
                <input
                  v-model="state.rememberMe"
                  type="checkbox"
                  :disabled="isSubmitting"
                  class="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-0 transition-all disabled:opacity-50"
                />
                <span class="text-slate-400 group-hover:text-slate-300 transition-colors">Remember me</span>
              </label>
              <a href="#" class="text-slate-400 hover:text-blue-400 transition-colors">Forgot password?</a>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:from-blue-600 hover:to-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <UIcon v-if="isSubmitting" name="i-heroicons-arrow-path" class="w-5 h-5 animate-spin" />
              <span>{{ isSubmitting ? 'Signing in...' : 'Sign in' }}</span>
            </button>
          </form>

          <!-- Divider -->
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-slate-800"></div>
            </div>
            <div class="relative flex justify-center text-xs">
              <span class="px-3 text-slate-500 bg-slate-900/50">Demo credentials</span>
            </div>
          </div>

          <!-- Demo Buttons -->
          <div class="grid grid-cols-2 gap-3">
            <button
              @click="fillDemoAdmin"
              :disabled="isSubmitting"
              class="px-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300 text-sm font-medium hover:bg-slate-800 hover:border-slate-600 hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <UIcon name="i-heroicons-shield-check" class="w-4 h-4" />
              <span>Admin</span>
            </button>
            <button
              @click="fillDemoUser"
              :disabled="isSubmitting"
              class="px-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300 text-sm font-medium hover:bg-slate-800 hover:border-slate-600 hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <UIcon name="i-heroicons-user" class="w-4 h-4" />
              <span>User</span>
            </button>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-8 py-4 bg-slate-900/30 border-t border-slate-800/50">
          <div class="flex items-center justify-center gap-2 text-xs text-slate-500">
            <UIcon name="i-heroicons-lock-closed" class="w-3.5 h-3.5" />
            <span>Secured by JWT Authentication</span>
          </div>
        </div>
      </div>

      <!-- Bottom Text -->
      <div class="mt-6 text-center">
        <p class="text-sm text-slate-500">
          Don't have an account? <a href="#" class="text-blue-400 hover:text-blue-300 transition-colors">Sign up</a>
        </p>
      </div>
    </div>

    <!-- <UNotifications /> -->
  </div>
</template>

<style scoped>
.bg-grid-pattern {
  background-image: 
    linear-gradient(to right, rgb(148 163 184 / 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgb(148 163 184 / 0.1) 1px, transparent 1px);
  background-size: 64px 64px;
}
</style>
