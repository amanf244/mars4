<script setup lang="ts">
import { ref } from 'vue'

const auth = useAuthStore()
const route = useRoute()

// Gunakan guest middleware


const email = ref('admin@example.com')
const password = ref('Admin123!')
const rememberMe = ref(false)
const loading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  errorMessage.value = ''
  loading.value = true

  try {
    await auth.login({
      email: email.value,
      password: password.value,
      rememberMe: rememberMe.value,
      deviceName: 'web-browser'
    })

    // Redirect setelah login berhasil
    const redirectTo = route.query.redirect as string || 
      (auth.role === 'admin' ? '/admin/dashboard' : '/dashboard')
    
    await navigateTo(redirectTo)
    
  } catch (error: any) {
    errorMessage.value =
      error?.data?.message || error.message || 'Login gagal'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md bg-white rounded-xl shadow p-8">
      <h1 class="text-2xl font-bold text-center mb-6">
        Login
      </h1>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            class="w-full border rounded-lg px-4 py-2"
            required
          />
        </div>

        <div>
          <label class="block text-sm mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            class="w-full border rounded-lg px-4 py-2"
            required
          />
        </div>

        <div class="flex items-center justify-between">
          <label class="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              v-model="rememberMe"
              class="rounded border-gray-300"
            />
            Remember me
          </label>

          <NuxtLink
            to="/forgot-password"
            class="text-sm text-blue-600 hover:underline"
          >
            Forgot password?
          </NuxtLink>
        </div>

        <p v-if="errorMessage" class="text-red-500 text-sm">
          {{ errorMessage }}
        </p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {{ loading ? 'Loading...' : 'Login' }}
        </button>
      </form>
    </div>
  </div>
</template>