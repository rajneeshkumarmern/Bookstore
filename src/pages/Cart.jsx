import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

function formatMoney(amount, currency = '₹') {
  if (!Number.isFinite(amount)) return '₹0'
  const currencyCode = currency === '₹' ? 'INR' : currency === '$' ? 'USD' : currency
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    currencyDisplay: 'symbol',
  }).format(amount)
}

export default function Cart() {
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col px-4 py-10 sm:px-6 sm:py-12">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white/95 sm:text-3xl">
            Shopping Cart
          </h1>
          <p className="mt-2 text-sm text-white/60">
            Review your items and proceed to checkout.
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
              onClick={clearCart}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-medium text-white/70 shadow-glass-sm backdrop-blur-sm outline-none ring-amber-400/30 transition-all duration-200 hover:bg-white/[0.08] hover:text-white focus-visible:ring-2"
            >
              Clear
            </button>
          ) : null}
        </div>
      </header>

      {items.length === 0 ? (
        <div className="glass-panel-soft mt-10 rounded-3xl p-12 text-center shadow-glass-lg sm:p-16">
          <p className="text-2xl font-semibold tracking-tight text-white/95 sm:text-3xl">
            Your cart is empty 🛒
          </p>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/60">
            Start adding books to your cart and they will appear here for review and checkout.
          </p>
          <Link
            to="/"
            className="mt-10 inline-flex items-center justify-center rounded-full bg-gradient-to-b from-amber-300 to-amber-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-glass-lg outline-none ring-amber-400/40 transition-all duration-200 hover:from-amber-200 hover:to-amber-400 hover:shadow-glow focus-visible:ring-2 active:scale-95"
          >
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr,360px]">
          <section className="space-y-4">
            {items.map((item) => {
              const lineTotal = item.price * item.quantity
              return (
                <article
                  key={item.id}
                  className="glass-panel-soft flex gap-5 rounded-2xl p-5 transition-all duration-200 hover:border-white/12 hover:bg-white/[0.06] hover:shadow-glass"
                >
                  <div className="h-28 w-20 flex-none overflow-hidden rounded-xl bg-white/[0.04] shadow-inner ring-1 ring-inset ring-white/10">
                    {item.image || item.imageUrl ? (
                      <img
                        src={item.image || item.imageUrl}
                        alt={item.title ? `Cover of ${item.title}` : 'Book cover'}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-xs text-white/60">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="line-clamp-2 text-sm font-semibold tracking-tight sm:text-base">
                          {item.title}
                        </h2>
                        <p className="mt-1 text-sm text-white/65">
                          {formatMoney(item.price)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          removeItem(item.id)
                          toast.error('Removed from cart ❌')
                        }}
                        className="rounded-md px-2 py-1 text-sm text-white/70 outline-none ring-amber-400/60 transition-all duration-200 hover:bg-white/5 hover:text-white focus-visible:ring-2"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] p-1 shadow-inner shadow-black/20 backdrop-blur-sm">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="grid size-8 place-items-center rounded-full text-white/85 outline-none ring-amber-400/60 transition-all duration-200 hover:bg-white/[0.06] focus-visible:ring-2"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="min-w-10 text-center text-sm font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="grid size-8 place-items-center rounded-full text-white/85 outline-none ring-amber-400/60 transition-all duration-200 hover:bg-white/[0.06] focus-visible:ring-2"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <p className="text-sm font-semibold text-white/90">
                        Total:{' '}
                        <span className="text-amber-300">
                          {formatMoney(lineTotal)}
                        </span>
                      </p>
                    </div>
                  </div>
                </article>
              )
            })}
          </section>

          <aside className="glass-panel h-fit p-6 shadow-glass-lg lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold tracking-tight text-white/95">
              Order summary
            </h2>
            <div className="mt-5 space-y-2.5 text-sm">
              <div className="flex items-center justify-between text-white/75">
                <span>Subtotal</span>
                <span className="font-semibold text-white">
                  {formatMoney(subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between text-white/75">
                <span>Shipping</span>
                <span className="font-semibold text-white">Free</span>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              <div className="flex items-center justify-between">
                <span className="text-white/75">Total</span>
                <span className="text-base font-bold text-amber-200/95">
                  {formatMoney(subtotal)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!user) {
                  toast.error('Please login to checkout')
                  return
                }
                navigate('/checkout')
              }}
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-b from-amber-300 to-amber-500 px-5 py-3.5 text-sm font-semibold text-slate-950 shadow-glass-sm outline-none ring-amber-400/40 transition-all duration-200 hover:from-amber-200 hover:to-amber-400 hover:shadow-glow focus-visible:ring-2 active:translate-y-px"
            >
              Proceed to Checkout
            </button>

            <p className="mt-4 text-xs leading-relaxed text-white/50">
              {!user ? 'Login required to checkout' : 'Secure checkout with order tracking'}
            </p>
          </aside>
        </div>
      )}
    </main>
  )
}

