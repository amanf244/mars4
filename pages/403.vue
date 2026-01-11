<script setup lang="ts">
const auth = useAuthStore()
const router = useRouter()

const handleGoBack = () => {
  router.back()
}

const handleGoDashboard = async () => {
  if (auth.isAdmin) {
    await navigateTo('/admin')
  } else {
    await navigateTo('/')
  }
}

const handleGoLogin = async () => {
  await navigateTo('/login')
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-red-900 via-slate-900 to-slate-900 flex items-center justify-center p-4">
    <!-- Animated background -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 right-0 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
    </div>

    <!-- Content -->
    <div class="text-center relative z-10 max-w-md">
      <!-- Error Code -->
      <div class="mb-8">
        <h1 class="text-8xl font-black text-red-500 mb-2 drop-shadow-lg">403</h1>
        <p class="text-slate-300 text-xl">Access Forbidden</p>
      </div>

      <!-- Message -->
      <div class="mb-8 space-y-3">
        <h2 class="text-3xl font-bold text-white">
          🔒 Access Denied
        </h2>
        <p class="text-slate-300 text-lg leading-relaxed">
          You don't have permission to access this resource. Please make sure you're logged in with the correct account.
        </p>
      </div>

      <!-- Actions -->
      <div class="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <UButton
          color="neutral"
          size="lg"
          icon="i-heroicons-arrow-left"
          @click="handleGoBack"
        >
          Go Back
        </UButton>
        <UButton
          v-if="auth.isAuthenticated"
          color="primary"
          size="lg"
          icon="i-heroicons-home"
          @click="handleGoDashboard"
        >
          Dashboard
        </UButton>
        <UButton
          v-else
          color="primary"
          size="lg"
          icon="i-heroicons-arrow-right"
          @click="handleGoLogin"
        >
          Sign In
        </UButton>
      </div>

      <!-- Auth Status -->
      <div class="mt-8 pt-8 border-t border-slate-700">
        <p class="text-sm text-slate-400 mb-3">Current Status:</p>
        <div class="flex items-center justify-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
          <div :class="[
            'w-2 h-2 rounded-full',
            auth.isAuthenticated ? 'bg-green-500' : 'bg-red-500'
          ]"></div>
          <span class="text-slate-300 text-sm">
            {{ auth.isAuthenticated ? 'Authenticated' : 'Not Authenticated' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes blob {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}

.animate-blob {
  animation: blob 7s infinite;
}
</style>
