// src/lib/cart-store.ts
'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type CartItem = {
  id: string
  productId: string
  variantId?: string
  quantity: number
  name: string
  price: number
  imageUrl?: string
  size?: string
  color?: string
}

type CartStore = {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (productId: string, variantId?: string) => void
  updateQuantity: (productId: string, variantId: string | undefined, qty: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const id = `${item.productId}-${item.variantId ?? 'default'}`
        set((state) => {
          const existing = state.items.find(i => i.id === id)
          if (existing) {
            return {
              items: state.items.map(i =>
                i.id === id ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
              isOpen: true,
            }
          }
          return { items: [...state.items, { ...item, id }], isOpen: true }
        })
      },

      removeItem: (productId, variantId) => {
        const id = `${productId}-${variantId ?? 'default'}`
        set((state) => ({ items: state.items.filter(i => i.id !== id) }))
      },

      updateQuantity: (productId, variantId, qty) => {
        const id = `${productId}-${variantId ?? 'default'}`
        if (qty <= 0) {
          set((state) => ({ items: state.items.filter(i => i.id !== id) }))
          return
        }
        set((state) => ({
          items: state.items.map(i => i.id === id ? { ...i, quantity: qty } : i)
        }))
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: '123-maison-cart' }
  )
)