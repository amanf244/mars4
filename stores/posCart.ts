import { defineStore } from 'pinia'

export interface PosCartItem {
  sku: string
  quantity: number
}

interface PosCartState {
  items: PosCartItem[]
  useTechnicianPrice: boolean
}

export const usePosCartStore = defineStore('posCart', {
  state: (): PosCartState => ({
    items: [],
    useTechnicianPrice: false // default harga publik
  }),
  actions: {
    addItem(sku: string) {
      const normalized = sku.trim()
      if (!normalized) return

      const existing = this.items.find(i => i.sku === normalized)
      if (existing) {
        existing.quantity += 1
      } else {
        this.items.push({ sku: normalized, quantity: 1 })
      }
    },
    setQuantity(sku: string, quantity: number) {
      const item = this.items.find(i => i.sku === sku)
      if (!item) return
      if (quantity <= 0) {
        this.items = this.items.filter(i => i.sku !== sku)
      } else {
        item.quantity = quantity
      }
    },
    removeItem(sku: string) {
      this.items = this.items.filter(i => i.sku !== sku)
    },
    clear() {
      this.items = []
      this.useTechnicianPrice = false
    }
  }
})
