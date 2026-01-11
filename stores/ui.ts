// stores/ui.ts
import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    sidebarCollapsed: false,
    sidebarMobileOpen: false,
  }),

  actions: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
      // Save to localStorage
      if (process.client) {
        localStorage.setItem('sidebar_collapsed', String(this.sidebarCollapsed))
      }
    },

    setSidebarCollapsed(collapsed: boolean) {
      this.sidebarCollapsed = collapsed
      if (process.client) {
        localStorage.setItem('sidebar_collapsed', String(collapsed))
      }
    },

    toggleMobileSidebar() {
      this.sidebarMobileOpen = !this.sidebarMobileOpen
    },

    closeMobileSidebar() {
      this.sidebarMobileOpen = false
    },

    // Initialize from localStorage
    initSidebarState() {
      if (process.client) {
        const saved = localStorage.getItem('sidebar_collapsed')
        if (saved !== null) {
          this.sidebarCollapsed = saved === 'true'
        }
      }
    }
  }
})
