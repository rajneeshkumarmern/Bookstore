import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { bookService } from '../services/api.js'
import { useCart } from '../context/CartContext.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'

function formatMoney(amount) {
  if (!Number.isFinite(amount)) return '₹0'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    currencyDisplay: 'symbol',
  }).format(amount)
}

export default function BookDetails() {
  const { id } = useParams()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true)
        const data = await bookService.getBookById(id)
        setBook(data)
      } catch (err) {
        setError(err.message || 'Failed to fetch book details')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (id) {
      fetchBook()
    }
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-16">
        <LoadingSpinner label="Loading book details" />
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-16">
        <div className="max-w-md rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center text-white shadow-glass-sm">
          <p className="text-lg font-semibold text-red-100">{error || 'Book not found'}</p>
          <Link to="/" className="mt-4 inline-block rounded-full bg-amber-400 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-300">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="flex flex-col">
      <section className="relative overflow-hidden border-b border-white/[0.07]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_circle_at_18%_0%,rgba(251,191,36,0.14),transparent_58%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_circle_at_85%_15%,rgba(56,189,248,0.1),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_circle_at_50%_120%,rgba(99,102,241,0.12),transparent_55%)]" />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:py-14">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-amber-100/95 shadow-glass-sm backdrop-blur-md transition-all duration-200 hover:border-white/20 hover:bg-white/[0.12]"
          >
            ← Back to Books
          </Link>
          <h1 className="mt-6 max-w-3xl bg-gradient-to-br from-white via-white to-white/75 bg-clip-text text-3xl font-semibold tracking-tight text-transparent sm:text-4xl md:text-5xl md:leading-[1.1]">
            {book.title}
          </h1>
          <p className="mt-4 text-lg text-white/75">
            by {book.author}
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="flex justify-center lg:justify-start">
            <div className="glass-panel-soft relative w-full max-w-sm overflow-hidden rounded-3xl p-8 shadow-glass-lg">
              <img
                src={book.image}
                alt={book.title}
                className="h-full w-full object-cover rounded-2xl"
              />
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="glass-panel-soft rounded-3xl p-8 shadow-glass-lg">
              <div className="mb-6">
                <p className="text-3xl font-bold text-amber-400">
                  {formatMoney(book.price)}
                </p>
                <p className="mt-2 text-sm text-white/60 uppercase tracking-wide">
                  {book.category}
                </p>
              </div>

              <p className="mb-8 text-white/80 leading-relaxed">
                {book.description}
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={() => addToCart(book)}
                  className="flex-1 inline-flex items-center justify-center rounded-full bg-gradient-to-b from-amber-300 to-amber-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-glass-lg outline-none ring-amber-400/40 transition-all duration-200 hover:from-amber-200 hover:to-amber-400 hover:shadow-glow focus-visible:ring-2 active:translate-y-px"
                >
                  Add to Cart
                </button>
                <button className="flex-1 inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.05] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:border-white/20 hover:bg-white/[0.12] hover:shadow-lg active:scale-95">
                  Add to Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
