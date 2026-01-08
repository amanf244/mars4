<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  meta: {
    requiresAuth: true,
  },
})

const auth = useAuth()
const router = useRouter()

const handleLogout = async () => {
  if (confirm('Yakin ingin logout?')) {
    await auth.logout()
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p class="text-gray-600 text-sm">User Dashboard</p>
        </div>
        <div class="flex items-center gap-4">
          <ClientOnly>
            <span class="text-gray-700">
              Welcome, <strong>{{ auth.user.value?.name || auth.user.value?.email }}</strong>
            </span>
          </ClientOnly>
          <button
            @click="handleLogout"
            class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- User Info Card -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-4">User Information</h3>
          <ClientOnly>
            <dl class="space-y-2">
              <div class="flex justify-between">
                <dt class="text-gray-600">ID:</dt>
                <dd class="font-medium">{{ auth.userId.value }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-gray-600">Email:</dt>
                <dd class="font-medium">{{ auth.user.value?.email }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-gray-600">Role:</dt>
                <dd class="font-medium capitalize">{{ auth.role.value }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-gray-600">Name:</dt>
                <dd class="font-medium">{{ auth.user.value?.name || 'N/A' }}</dd>
              </div>
            </dl>
          </ClientOnly>
        </div>

        <!-- Auth Status Card -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-4">Auth Status</h3>
          <ClientOnly>
            <dl class="space-y-2">
              <div class="flex justify-between">
                <dt class="text-gray-600">Authenticated:</dt>
                <dd>
                  <span
                    class="px-2 py-1 rounded text-sm font-medium"
                    :class="
                      auth.isAuthenticated.value
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    "
                  >
                    {{ auth.isAuthenticated.value ? 'Yes' : 'No' }}
                  </span>
                </dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-gray-600">Is Admin:</dt>
                <dd>
                  <span
                    class="px-2 py-1 rounded text-sm font-medium"
                    :class="
                      auth.isAdmin.value
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    "
                  >
                    {{ auth.isAdmin.value ? 'Yes' : 'No' }}
                  </span>
                </dd>
              </div>
            </dl>
          </ClientOnly>
        </div>

        <!-- Actions Card -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-4">Actions</h3>
          <div class="space-y-2">
            <button
              @click="handleLogout"
              class="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
            <NuxtLink
              v-if="auth.isAdmin.value"
              to="/admin/dashboard"
              class="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Admin Dashboard
            </NuxtLink>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
