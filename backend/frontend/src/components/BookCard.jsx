import { useState } from 'react'
import toast from 'react-hot-toast'
import { useCart } from '../context/CartContext.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'

export default function BookCard({
  id,
  image,
  title,
  author,
  price,
  onAddToCart,
  currency = '₹',
}) {
  const { addItem } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const isWishlisted = isInWishlist(id)
  const [imageErrored, setImageErrored] = useState(false)
  const fallbackImage = '/images/love.jpg'

  const currencyCode = currency === '₹' ? 'INR' : currency === '$' ? 'USD' : currency
  const displayPrice =
    typeof price === 'number'
      ? new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: currencyCode,
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
          currencyDisplay: 'symbol',
        }).format(price)
      : price

  const incomingImage = image
  const coverSrc = !incomingImage || imageErrored ? fallbackImage : incomingImage

  return (
    <article className="glass-panel group flex h-full flex-col overflow-hidden text-white outline-none transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:shadow-lg hover:border-white/15 hover:bg-white/[0.08] focus-within:ring-2 focus-within:ring-amber-400/50 motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-b from-white/[0.04] to-white/[0.02]">
        <img
          src={coverSrc}
          alt={title ? `Cover of ${title}` : 'Book cover'}
          loading="lazy"
          onError={() => {
            if (!imageErrored) setImageErrored(true)
          }}
          className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105 motion-reduce:transform-none"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-0 transition duration-300 ease-in-out group-hover:opacity-100" />
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
      </div>

      <div className="flex flex-1 flex-col justify-between space-y-6 p-5 sm:p-6">
        <div className="space-y-4">
          <div className="min-h-[4.5rem] overflow-hidden">
            <h3 className="line-clamp-2 break-words text-base font-semibold leading-snug tracking-tight sm:text-[15px] text-white">
              {title}
            </h3>
            <p className="mt-2 line-clamp-1 break-words text-sm text-white/65">
              {author}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-lg font-bold tracking-tight text-amber-200/95">
            {displayPrice}
          </p>
          <div className="flex flex-wrap items-center justify-end gap-3 sm:justify-end">
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                toggleWishlist({ id, title, author, price, image: incomingImage })
                if (isWishlisted) {
                  toast.error('Removed from wishlist ❌')
                } else {
                  toast.success('Added to wishlist ❤️')
                }
              }}
              aria-pressed={isWishlisted}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full outline-none ring-amber-400/40 transition-all duration-200 ease-in-out active:scale-95 ${
                isWishlisted
                  ? 'bg-gradient-to-b from-amber-300 to-amber-500 text-slate-950 shadow-lg'
                  : 'border border-white/10 bg-white/[0.05] text-white/85 hover:border-white/15 hover:bg-white/[0.1] hover:text-white hover:shadow-lg'
              }`}
            >
              {isWishlisted ? '❤️' : '🤍'}
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                addItem({ id, title, price, image: incomingImage }, 1)
                toast.success('Added to cart ✅')
                onAddToCart?.()
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-amber-300 to-amber-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-glass-sm outline-none ring-amber-400/40 transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg active:scale-95 sm:w-auto"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
