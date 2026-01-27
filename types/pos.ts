interface CartItemPrice {
  sku: string
  name: string
  quantity: number
  unitPrice: number
  lineTotal: number
}

interface CartPriceResponse {
  items: CartItemPrice[]
  subtotalRetail: number
  subtotalActual: number
  discount: number
  isTechnicianPrice: boolean
}

interface SaleItemRequest {
  sku: string
  quantity: number
}

interface SaleResponse {
  id: number
  createdAt: string
  cashierId: number
  cashierName: string
  isMemberPrice: boolean
  technicianId?: number | null
  technicianName?: string | null
  subtotal: number
  discount: number
  total: number
  items: {
    sku: string
    name: string
    quantity: number
    unitPrice: number
    lineTotal: number
    remainingStock: number
  }[]
}
