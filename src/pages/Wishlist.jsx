import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useWishlist } from '../context/WishlistContext.jsx'

function formatMoney(amount, currency = '$') {
  if (!Number.isFinite(amount)) return `${currency}0.00`
  return `${currency}${amount.toFixed(2)}`
}

export default function Wishlist() {
  const { items, wishlistCount, removeFromWishlist, clearWishlist } = useWishlist()

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col px-4 py-10 sm:px-6 sm:py-12">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white/95 sm:text-3xl">
            Wishlist
          </h1>
          <p className="mt-2 text-sm text-white/60">
            {wishlistCount > 0
              ? `You saved ${wishlistCount} book${wishlistCount === 1 ? '' : 's'} for later.`
              : 'Save books from the store to review them later.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/"
            className="rounded-xl border border-transparent px-3 py-2 text-sm font-medium text-white/85 outline-none ring-amber-400/30 transition-all duration-200 hover:border-white/10 hover:bg-white/[0.06] hover:text-white focus-visible:ring-2"
          >
            Continue shopping
          </Link>
          {items.length > 0 ? (
            <button
              type="button"
              onClick={() => {
                clearWishlist()
                toast.error('Cleared wishlist ❌')
              }}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-medium text-white/70 shadow-glass-sm backdrop-blur-sm outline-none ring-amber-400/30 transition-all duration-200 hover:bg-white/[0.08] hover:text-white focus-visible:ring-2"
            >
              Clear
            </button>
          ) : null}
        </div>
      </header>

      {items.length === 0 ? (
        <div className="glass-panel-soft mt-10 rounded-3xl p-12 text-center shadow-glass-lg sm:p-16">
          <p className="text-base font-semibold text-white/95">Your wishlist is empty</p>
          <p className="mt-3 text-sm text-white/60">
            Add books to your wishlist and find them here whenever you return.
          </p>
          <Link
            to="/"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-gradient-to-b from-amber-300 to-amber-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-glass-lg outline-none ring-amber-400/40 transition-all duration-200 hover:from-amber-200 hover:to-amber-400 hover:shadow-glow focus-visible:ring-2 active:translate-y-px"
          >
            Browse books
          </Link>
        </div>
      ) : (
        <section className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="glass-panel-soft flex flex-col overflow-hidden rounded-3xl p-5 shadow-glass-lg transition-all duration-200 hover:border-white/12 hover:bg-white/[0.06]"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl bg-white/[0.04] shadow-inner ring-1 ring-inset ring-white/10">
                {item.image || item.imageUrl ? (
                  <img
                    src={item.image || item.imageUrl}
                    alt={item.title ? `Cover of ${item.title}` : 'Book cover'}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center text-xs text-white/60">
                    No image
                  </div>
                )}
              </div>

              <div className="mt-5 flex flex-1 flex-col justify-between gap-4">
                <div>
                  <h2 className="line-clamp-2 text-base font-semibold tracking-tight text-white/95">
                    {item.title}
                  </h2>
                  <p className="mt-1 text-sm text-white/65">{item.author}</p>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <p className="text-lg font-semibold tracking-tight text-amber-200/95">
                    {formatMoney(item.price)}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      removeFromWishlist(item.id)
                      toast.error('Removed from wishlist ❌')
                    }}
                    className="whitespace-nowrap rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white/85 outline-none ring-amber-400/30 transition-all duration-200 hover:border-white/15 hover:bg-white/[0.08] hover:text-white focus-visible:ring-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  )
}
