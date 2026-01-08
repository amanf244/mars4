<script setup lang="ts">
// Nuxt 4 auto-imports definePageMeta, ref, etc
definePageMeta({
  middleware: 'guest',
})

const auth = useAuth()
const route = useRoute()
const router = useRouter()

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
    })

    const redirectTo =
      (route.query.redirect as string) ||
      (auth.role.value === 'admin' ? '/admin/dashboard' : '/dashboard')

    await router.push(redirectTo)
  } catch (error: any) {
    errorMessage.value =
      error?.data?.message || error?.message || 'Login gagal'
    console.error('Login error:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
      <h1 class="text-3xl font-bold text-center mb-8 text-gray-900">
        Login
      </h1>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <!-- Email Input -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            v-model="email"
            type="email"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="admin@example.com"
          />
        </div>

        <!-- Password Input -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            v-model="password"
            type="password"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="••••••••"
          />
        </div>

        <!-- Remember Me & Forgot Password -->
        <div class="flex items-center justify-between">
          <label class="flex items-center gap-2">
            <input
              v-model="rememberMe"
              type="checkbox"
              class="rounded border-gray-300"
            />
            <span class="text-sm text-gray-600">Remember me</span>
          </label>
          <NuxtLink
            to="/forgot-password"
            class="text-sm text-blue-600 hover:underline"
          >
            Forgot password?
          </NuxtLink>
        </div>

        <!-- Error Message -->
        <p v-if="errorMessage" class="text-red-600 text-sm font-medium">
          {{ errorMessage }}
        </p>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>

      <!-- Footer -->
      <div class="mt-6 text-center text-sm text-gray-600">
        <p>
          Don't have an account?
          <NuxtLink to="/register" class="text-blue-600 hover:underline">
            Register here
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>
