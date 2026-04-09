import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const WishlistContext = createContext(null)
const STORAGE_KEY = 'bookstore-wishlist-items'

const loadWishlistFromStorage = () => {
  if (typeof window === 'undefined') return {}

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    const parsed = stored ? JSON.parse(stored) : null
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}
  } catch (error) {
    return {}
  }
}

export function WishlistProvider({ children }) {
  const [itemsById, setItemsById] = useState(() => loadWishlistFromStorage())

  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(itemsById))
    } catch (error) {
      // ignore storage errors
    }
  }, [itemsById])

  const value = useMemo(() => {
    const items = Object.values(itemsById)

    const addToWishlist = (book) => {
      const id = book?.id || book?.title
      if (!id) return

      setItemsById((prev) => {
        if (prev[id]) return prev
        return {
          ...prev,
          [id]: {
            id,
            title: book?.title ?? 'Untitled',
            author: book?.author ?? '',
            price: Number.isFinite(book?.price) ? book.price : 0,
            image: book?.image || book?.imageUrl,
            imageUrl: book?.imageUrl,
          },
        }
      })
    }

    const removeFromWishlist = (id) => {
      setItemsById((prev) => {
        if (!prev[id]) return prev
        const { [id]: _, ...rest } = prev
        return rest
      })
    }

    const toggleWishlist = (book) => {
      const id = book?.id || book?.title
      if (!id) return
      if (itemsById[id]) {
        removeFromWishlist(id)
      } else {
        addToWishlist(book)
      }
    }

    return {
      items,
      wishlistCount: items.length,
      isInWishlist: (id) => Boolean(id && itemsById[id]),
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      clearWishlist: () => setItemsById({}),
    }
  }, [itemsById])

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return ctx
}
