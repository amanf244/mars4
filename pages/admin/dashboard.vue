<script setup lang="ts">
  import QuickActions from '~/components/admin/QuickActions.vue'
import StatsCard from '~/components/admin/StatsCard.vue'

definePageMeta({
  middleware: 'auth',
  meta: {
    requiresAuth: true,
    requiresRole: 'admin'
  }
})
// State untuk dark mode
const darkMode = ref(false)
// State untuk sidebar collapsed
const isSidebarCollapsed = ref(false)

// Data statistik untuk dashboard
const stats = ref([
  { title: 'Total Pengguna', value: '2,847', change: '+12%', icon: '👥', color: 'blue' as const },
  { title: 'Pendapatan', value: '$24,580', change: '+8.2%', icon: '💰', color: 'green' as const },
  { title: 'Transaksi', value: '1,254', change: '+5.3%', icon: '📊', color: 'purple' as const },
  { title: 'Tingkat Konversi', value: '3.25%', change: '-0.5%', icon: '📈', color: 'orange' as const }
])

// Data tabel pengguna terbaru
const recentUsers = ref([
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'User', status: 'active' as const, joinDate: '2023-05-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Admin', status: 'active' as const, joinDate: '2023-05-10' },
  { id: 3, name: 'Robert Johnson', email: 'robert@example.com', role: 'User', status: 'inactive' as const, joinDate: '2023-05-05' },
  { id: 4, name: 'Emily Davis', email: 'emily@example.com', role: 'User', status: 'active' as const, joinDate: '2023-04-28' },
  { id: 5, name: 'Michael Brown', email: 'michael@example.com', role: 'Moderator', status: 'active' as const, joinDate: '2023-04-20' }
])

// Menu navigasi sidebar
const navItems = ref([
  { name: 'Dashboard', icon: '📊', active: true, badge: null },
  { name: 'Pengguna', icon: '👥', active: false, badge: 24 },
  { name: 'Produk', icon: '🛒', active: false, badge: 12 },
  { name: 'Pesanan', icon: '📋', active: false, badge: 45 },
  { name: 'Laporan', icon: '📈', active: false, badge: 3 },
  { name: 'Pengaturan', icon: '⚙️', active: false, badge: null }
])

// Data untuk grafik (contoh sederhana)
const chartData = ref([30, 40, 35, 50, 49, 60, 70, 91, 125, 85, 75, 90])

// Data untuk quick actions
const quickActions = ref([
  { name: 'Tambah Pengguna', icon: '➕', color: 'blue' },
  { name: 'Buat Laporan', icon: '📄', color: 'green' },
  { name: 'Kirim Notifikasi', icon: '📢', color: 'purple' },
  { name: 'Backup Data', icon: '💾', color: 'orange' }
])

// Fungsi untuk toggle dark mode
const toggleDarkMode = () => {
  darkMode.value = !darkMode.value
  if (darkMode.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('darkMode', 'true')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('darkMode', 'false')
  }
}

// Fungsi untuk toggle sidebar collapsed
const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
  localStorage.setItem('sidebarCollapsed', isSidebarCollapsed.value.toString())
}

// Fungsi untuk set menu aktif
const setActive = (index: number) => {
  navItems.value.forEach((item, i) => {
    item.active = i === index
  })
}

// Fungsi logout
const handleLogout = async () => {
  try {
    // Anda dapat menambahkan logika logout di sini
    // auth.logout()
    // redirect ke login page
    navigateTo('/login')
  } finally {
    // Logika setelah logout
  }
}

// Inisialisasi dari localStorage
onMounted(() => {
  // Cek preferensi dark mode dari localStorage
  const savedDarkMode = localStorage.getItem('darkMode')
  if (savedDarkMode === 'true') {
    darkMode.value = true
    document.documentElement.classList.add('dark')
  } else if (savedDarkMode === null && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // Jika tidak ada preferensi tersimpan, gunakan preferensi sistem
    darkMode.value = true
    document.documentElement.classList.add('dark')
  }
  
  // Cek state sidebar collapsed dari localStorage
  const savedSidebarState = localStorage.getItem('sidebarCollapsed')
  if (savedSidebarState) {
    isSidebarCollapsed.value = savedSidebarState === 'true'
  }
})

// Simulasi auth store
const auth = {
  user: {
    name: 'Admin User',
    email: 'admin@example.com'
  },
  logout: () => console.log('Logout function')
}
</script>

<template>
  <AdminLayout
    :darkMode="darkMode"
    :isSidebarCollapsed="isSidebarCollapsed"
    :navItems="navItems"
    :user="auth.user"
    @toggleSidebar="toggleSidebar"
    @toggleDarkMode="toggleDarkMode"
    @setActive="setActive"
    @logout="handleLogout"
  >
    <template #sidebar-content>
      <ClientOnly>
  <QuickActions 
    :actions="quickActions"
    :darkMode="darkMode"
  />
</ClientOnly>

    </template>

    <template #mobile-sidebar-content>
      <div class="mt-8 px-4">
        <h3 class="text-xs font-semibold uppercase tracking-wider mb-3"
            :class="darkMode ? 'text-gray-400' : 'text-gray-500'">
          Aksi Cepat
        </h3>
        <div class="grid grid-cols-2 gap-2">
          <button 
            v-for="(action, index) in quickActions" 
            :key="index"
            class="flex flex-col items-center justify-center p-3 rounded-lg transition-colors"
            :class="darkMode 
              ? 'bg-gray-700/50 hover:bg-gray-700 border border-gray-600' 
              : 'bg-gray-100 hover:bg-gray-200 border border-gray-200'"
          >
            <span class="text-xl mb-2">{{ action.icon }}</span>
            <span class="text-xs text-center">{{ action.name }}</span>
          </button>
        </div>
      </div>
    </template>

    <!-- Konten utama -->
   <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <ClientOnly>
  <StatsCard 
    v-for="stat in stats"
    :key="stat.title"
    :stat="stat"
    :darkMode="darkMode"
  />
</ClientOnly>

    </div>
    <!-- Chart & Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      <!-- Chart Container -->
      <div class="lg:col-span-2 rounded-xl border p-6 shadow-sm"
           :class="darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
        <div class="flex items-center justify-between mb-6">
          <h2 :class="['text-lg font-bold', darkMode ? 'text-white' : 'text-gray-900']">
            Ringkasan Aktivitas
          </h2>
          <select :class="[
            'rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors',
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'border border-gray-300 text-gray-900'
          ]">
            <option>30 hari terakhir</option>
            <option>90 hari terakhir</option>
            <option>Tahun ini</option>
          </select>
        </div>
        
        <!-- Simple chart -->
        <div class="h-64 flex items-end space-x-1 pt-4">
          <div 
            v-for="(value, index) in chartData" 
            :key="index"
            class="flex-1 rounded-t-lg transition-all hover:opacity-80"
            :class="darkMode 
              ? 'bg-gradient-to-t from-blue-600 to-blue-400' 
              : 'bg-gradient-to-t from-blue-500 to-blue-300'"
            :style="{ height: `${value / 1.5}%` }"
            :title="`Nilai: ${value}`"
          ></div>
        </div>
        <div class="flex justify-between text-xs mt-2"
             :class="darkMode ? 'text-gray-400' : 'text-gray-500'">
          <span>Jan</span>
          <span>Feb</span>
          <span>Mar</span>
          <span>Apr</span>
          <span>Mei</span>
          <span>Jun</span>
          <span>Jul</span>
          <span>Agu</span>
          <span>Sep</span>
          <span>Okt</span>
          <span>Nov</span>
          <span>Des</span>
        </div>
      </div>
      
      <!-- Recent Users -->
      <div class="rounded-xl border p-6 shadow-sm"
           :class="darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
        <div class="flex items-center justify-between mb-6">
          <h2 :class="['text-lg font-bold', darkMode ? 'text-white' : 'text-gray-900']">
            Pengguna Terbaru
          </h2>
          <button :class="['text-sm font-medium', darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800']">
            Lihat semua
          </button>
        </div>
        
        <div class="space-y-4">
          <div 
            v-for="user in recentUsers.slice(0, 4)" 
            :key="user.id"
            :class="[
              'flex items-center justify-between p-3 rounded-lg transition-colors',
              darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
            ]"
          >
            <div class="flex items-center">
              <div class="w-10 h-10 rounded-full flex items-center justify-center"
                   :class="darkMode 
                     ? 'bg-gradient-to-r from-gray-700 to-gray-600' 
                     : 'bg-gradient-to-r from-blue-100 to-purple-100'">
                <span :class="['font-medium', darkMode ? 'text-gray-300' : 'text-gray-700']">
                  {{ user.name.charAt(0) }}
                </span>
              </div>
              <div class="ml-3">
                <p :class="['text-sm font-medium', darkMode ? 'text-white' : 'text-gray-900']">
                  {{ user.name }}
                </p>
                <p :class="['text-xs', darkMode ? 'text-gray-400' : 'text-gray-500']">
                  {{ user.email }}
                </p>
              </div>
            </div>
            <span 
              :class="[
                'px-2 py-1 text-xs font-medium rounded-full',
                user.status === 'active' 
                  ? (darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800')
                  : (darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800')
              ]"
            >
              {{ user.status === 'active' ? 'Aktif' : 'Nonaktif' }}
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Table Section -->
    <div class="rounded-xl border shadow-sm overflow-hidden"
         :class="darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
      <div class="px-6 py-4 border-b"
           :class="darkMode ? 'border-gray-700' : 'border-gray-200'">
        <h2 :class="['text-lg font-bold', darkMode ? 'text-white' : 'text-gray-900']">
          Daftar Pengguna
        </h2>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y"
               :class="darkMode ? 'divide-gray-700' : 'divide-gray-200'">
          <thead :class="darkMode ? 'bg-gray-700' : 'bg-gray-50'">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  :class="darkMode ? 'text-gray-300' : 'text-gray-500'">
                Nama
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  :class="darkMode ? 'text-gray-300' : 'text-gray-500'">
                Email
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  :class="darkMode ? 'text-gray-300' : 'text-gray-500'">
                Peran
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  :class="darkMode ? 'text-gray-300' : 'text-gray-500'">
                Status
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  :class="darkMode ? 'text-gray-300' : 'text-gray-500'">
                Tanggal Bergabung
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  :class="darkMode ? 'text-gray-300' : 'text-gray-500'">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody :class="darkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'">
            <tr v-for="user in recentUsers" :key="user.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                       :class="darkMode 
                         ? 'bg-gradient-to-r from-gray-700 to-gray-600' 
                         : 'bg-gradient-to-r from-blue-100 to-purple-100'">
                    <span :class="['text-sm font-medium', darkMode ? 'text-gray-300' : 'text-gray-700']">
                      {{ user.name.charAt(0) }}
                    </span>
                  </div>
                  <div :class="['text-sm font-medium', darkMode ? 'text-white' : 'text-gray-900']">
                    {{ user.name }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm"
                  :class="darkMode ? 'text-gray-300' : 'text-gray-700'">
                {{ user.email }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-3 py-1 text-xs font-medium rounded-full"
                      :class="darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800'">
                  {{ user.role }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="[
                    'px-3 py-1 text-xs font-medium rounded-full',
                    user.status === 'active' 
                      ? (darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800')
                      : (darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800')
                  ]"
                >
                  {{ user.status === 'active' ? 'Aktif' : 'Nonaktif' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm"
                  :class="darkMode ? 'text-gray-300' : 'text-gray-700'">
                {{ user.joinDate }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button :class="['mr-3', darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-900']">
                  Edit
                </button>
                <button :class="darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-900'">
                  Hapus
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="px-6 py-4 border-t flex items-center justify-between"
           :class="darkMode ? 'border-gray-700' : 'border-gray-200'">
        <div class="text-sm" :class="darkMode ? 'text-gray-400' : 'text-gray-700'">
          Menampilkan <span class="font-medium">1</span> sampai <span class="font-medium">5</span> dari <span class="font-medium">124</span> hasil
        </div>
        <div class="flex space-x-2">
          <button class="px-3 py-1 border rounded-md text-sm font-medium transition-colors"
                  :class="darkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'">
            Sebelumnya
          </button>
          <button class="px-3 py-1 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
            1
          </button>
          <button class="px-3 py-1 border rounded-md text-sm font-medium transition-colors"
                  :class="darkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'">
            2
          </button>
          <button class="px-3 py-1 border rounded-md text-sm font-medium transition-colors"
                  :class="darkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'">
            3
          </button>
          <button class="px-3 py-1 border rounded-md text-sm font-medium transition-colors"
                  :class="darkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'">
            Selanjutnya
          </button>
        </div>
      </div>
    </div>
    
    <!-- Footer note -->
    <div class="mt-8 text-center text-sm"
         :class="darkMode ? 'text-gray-500' : 'text-gray-400'">
      <p>© 2023 AdminPanel. Hak cipta dilindungi undang-undang. Versi 2.1.0</p>
    </div>
  </AdminLayout>
</template>