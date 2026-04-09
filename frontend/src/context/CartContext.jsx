import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { paymentService } from '../services/api.js'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)
const STORAGE_KEY = 'bookstore-cart-items'

const loadCartFromStorage = () => {
  if (typeof window === 'undefined') return {}

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    const parsed = stored ? JSON.parse(stored) : null
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}
  } catch (error) {
    return {}
  }
}

export function CartProvider({ children }) {
  const [itemsById, setItemsById] = useState(() => loadCartFromStorage())
  const { user } = useAuth()

  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(itemsById))
    } catch (error) {
      // Ignore storage errors
    }
  }, [itemsById])

  const value = useMemo(() => {
    const items = Object.values(itemsById)
    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)
    const subtotal = items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0,
    )

    return {
      cartCount,
      items,
      subtotal,
      addItem: (book, qty = 1) => {
        const safeQty = Number.isFinite(qty) && qty > 0 ? qty : 1
        const id = book?._id || book?.id || book?.title
        if (!id) return

        setItemsById((prev) => {
          const existing = prev[id]
          const nextQuantity = (existing?.quantity ?? 0) + safeQty
          return {
            ...prev,
            [id]: {
              id,
              title: book?.title ?? 'Untitled',
              price: Number.isFinite(book?.price) ? book.price : 0,
              image: book?.image || book?.imageUrl,
              imageUrl: book?.imageUrl,
              quantity: nextQuantity,
            },
          }
        })
      },
      updateQuantity: (id, quantity) => {
        const nextQty = Number.isFinite(quantity) ? Math.max(0, quantity) : 0
        setItemsById((prev) => {
          if (!prev[id]) return prev
          if (nextQty === 0) {
            const { [id]: _, ...rest } = prev
            return rest
          }
          return { ...prev, [id]: { ...prev[id], quantity: nextQty } }
        })
      },
      removeItem: (id) => {
        setItemsById((prev) => {
          if (!prev[id]) return prev
          const { [id]: _, ...rest } = prev
          return rest
        })
      },
      clearCart: () => setItemsById({}),
      createPaymentIntent: async () => {
        if (!user) {
          throw new Error('User must be logged in to checkout')
        }

        if (items.length === 0) {
          throw new Error('Cart is empty')
        }

        return paymentService.createPaymentIntent(subtotal)
      },
      confirmPayment: async (paymentIntentId) => {
        if (!user) {
          throw new Error('User must be logged in')
        }

        if (items.length === 0) {
          throw new Error('Cart is empty')
        }

        const orderItems = items.map((item) => ({
          bookId: item.id,
          quantity: item.quantity,
        }))

        const response = await paymentService.confirmPayment({
          paymentIntentId,
          items: orderItems,
          totalPrice: subtotal,
        })

        setItemsById({})

        return response
      },
    }
  }, [itemsById, user])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return ctx
}
