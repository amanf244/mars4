<script setup lang="ts">
definePageMeta({
  requiresAuth: true,
  role: 'admin'
})

const handleLogout = async () => {
  
  try {
    auth.logout()
    // redirect ke login page
    navigateTo('/login')
  } finally {
    
  }
}

const auth = useAuthStore()
</script>

<template>
  <h1>Admin Dashboard</h1>
  <p>Welcome {{ auth.user?.name }}</p>

  <button @click="handleLogout" class="mt-4 px-4 py-2 bg-red-500 text-white rounded">
    Logout
  </button>
  
</template>

