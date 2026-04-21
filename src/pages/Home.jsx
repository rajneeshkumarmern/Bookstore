import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { bookService } from '../services/api.js'
import BookCard from '../components/BookCard.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import EmptyState from '../components/EmptyState.jsx'

const INITIAL_VISIBLE_COUNT = 8
const LOAD_MORE_STEP = 4

export default function Home({ searchQuery }) {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortOption, setSortOption] = useState('')
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT)
  const navigate = useNavigate()
  const categories = [
    'All',
    'Software',
    'Productivity',
    'Design',
    'Business',
    'Fiction',
  ]

  const fetchBooks = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await bookService.getBooks()
      setBooks(data || [])
    } catch (err) {
      setError(err.message || 'Failed to fetch books')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedCategory === 'All' || book.category === selectedCategory)
  )

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortOption === 'low-to-high') {
      return a.price - b.price
    }
    if (sortOption === 'high-to-low') {
      return b.price - a.price
    }
    return 0
  })

  const visibleBooks = sortedBooks.slice(0, visibleCount)
  const hasMoreBooks = visibleBooks.length < sortedBooks.length

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_COUNT)
  }, [searchQuery, selectedCategory])

  return (
        <main className="flex flex-col">
        <section className="relative overflow-hidden border-b border-white/[0.07]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_circle_at_18%_0%,rgba(251,191,36,0.14),transparent_58%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_circle_at_85%_15%,rgba(56,189,248,0.1),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_circle_at_50%_120%,rgba(99,102,241,0.12),transparent_55%)]" />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:py-14">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-amber-100/95 shadow-glass-sm backdrop-blur-md">
            Deals this week
            <span className="h-1.5 w-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
            Up to 30% off
          </p>
          <h1 className="mt-6 max-w-3xl bg-gradient-to-br from-white via-white to-white/75 bg-clip-text text-3xl font-semibold tracking-tight text-transparent sm:text-4xl md:text-5xl md:leading-[1.1]">
            Discover your next great read
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
            Shop bestselling titles with fast checkout and a clean, modern
            browsing experience.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a
              href="#popular"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-b from-amber-300 to-amber-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-glass-lg outline-none ring-2 ring-amber-400/30 transition-all duration-200 hover:from-amber-200 hover:to-amber-400 hover:shadow-glow focus-visible:ring-amber-400/60 active:translate-y-px"
            >
              Shop popular books
            </a>
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.08] px-6 py-3 text-sm font-semibold text-white shadow-glass-sm outline-none ring-amber-400/30 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.12] focus-visible:ring-2 active:translate-y-px"
            >
              Manage inventory
            </button>
            <p className="text-sm text-white/55">
              Trusted picks across software, productivity, and fiction.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl flex flex-col px-4 py-8 sm:px-6 sm:py-6 lg:py-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2.5">
            {categories.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => setSelectedCategory(label)}
                className={`rounded-full border px-4 py-2 text-sm font-medium shadow-glass-sm backdrop-blur-md outline-none ring-amber-400/30 transition-all duration-200 hover:shadow-glass focus-visible:ring-2 active:translate-y-px ${
                  selectedCategory === label
                    ? 'border-amber-400/50 bg-amber-400/10 text-amber-100'
                    : 'border-white/10 bg-white/[0.05] text-white/88 hover:border-white/18 hover:bg-white/[0.09] hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-4 sm:justify-end">
            <p className="text-sm text-white/55">{sortedBooks.length} results</p>
            <label className="flex items-center gap-2.5 text-sm text-white/65">
              <span className="hidden sm:inline">Sort</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="h-10 rounded-xl border border-white/10 bg-white/[0.06] px-3.5 text-sm text-white shadow-inner shadow-black/20 outline-none ring-amber-400/30 backdrop-blur-md transition-all duration-200 hover:border-white/15 hover:bg-white/[0.08] focus-visible:ring-2"
              >
                <option value="" className="bg-slate-950">Featured</option>
                <option value="low-to-high" className="bg-slate-950">Price: Low to High</option>
                <option value="high-to-low" className="bg-slate-950">Price: High to Low</option>
                <option value="newest" className="bg-slate-950">Newest</option>
              </select>
            </label>
          </div>
        </div>

        <div id="popular" className="mt-12 flex items-end justify-between gap-4 sm:mt-14">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-white/95 sm:text-2xl">
              Popular Books
            </h2>
            <p className="mt-2 text-sm text-white/60">
              Customer favorites with great reviews.
            </p>
          </div>
        </div>

        <div className="glass-panel-soft mt-8 rounded-3xl p-5 shadow-glass-lg sm:mt-10 sm:p-8">
          {loading ? (
            <LoadingSpinner label="Fetching books" />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : sortedBooks.length > 0 ? (
            <>
              <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                {visibleBooks.map((book) => (
                  <div key={book._id} className="w-full">
                    <Link to={`/book/${book._id}`}>
                      <BookCard
                        id={book._id}
                        title={book.title}
                        author={book.author}
                        price={book.price}
                        image={
    book.image
      ? `https://bookstore-nu.vercel.app${book.image}`
      : "https://via.placeholder.com/300x400?text=No+Image"
  }
                      />
                    </Link>
                  </div>
                ))}
              </section>

              {hasMoreBooks ? (
                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((count) => count + LOAD_MORE_STEP)}
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-b from-amber-300 to-amber-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-glass-lg outline-none ring-amber-400/40 transition-all duration-200 hover:from-amber-200 hover:to-amber-400 hover:shadow-glow focus-visible:ring-2 active:translate-y-px"
                  >
                    Load More
                  </button>
                </div>
              ) : null}
            </>
          ) : (
            <EmptyState />
          )}
        </div>
      </section>
    </main>
  )
}

