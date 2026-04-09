import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar({ setSearchQuery }) {
  const searchId = useId()
  const { cartCount } = useCart()
  const { wishlistCount } = useWishlist()
  const { user, isAdmin, logout } = useAuth()
  const [localSearch, setLocalSearch] = useState('')

  const handleSearchChange = (e) => {
    const value = e.target.value
    setLocalSearch(value)
    setSearchQuery(value)
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="glass-nav sticky top-0 z-50 w-full shrink-0 text-white supports-[backdrop-filter]:bg-slate-950/25">
      <div className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 sm:py-4">
        <div className="flex flex-col gap-4 sm:grid sm:grid-cols-[auto,1fr,auto] sm:items-center sm:gap-5">
          <Link
            to="/"
            className="group inline-flex items-center gap-2.5 rounded-xl px-2 py-1 font-semibold tracking-tight outline-none ring-amber-400/50 transition-all duration-200 hover:bg-white/[0.06] hover:shadow-glow focus-visible:ring-2"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 text-slate-950 shadow-glow">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                aria-hidden="true"
                fill="currentColor"
              >
                <path d="M6 4.75A2.75 2.75 0 0 0 3.25 7.5v11A2.75 2.75 0 0 0 6 21.25h12A2.75 2.75 0 0 0 20.75 18.5v-11A2.75 2.75 0 0 0 18 4.75H6Zm0 1.5h12c.69 0 1.25.56 1.25 1.25v11c0 .69-.56 1.25-1.25 1.25H6c-.69 0-1.25-.56-1.25-1.25v-11c0-.69.56-1.25 1.25-1.25Z" />
                <path d="M7 8a.75.75 0 0 1 .75-.75h8.5a.75.75 0 0 1 0 1.5h-8.5A.75.75 0 0 1 7 8Zm0 3a.75.75 0 0 1 .75-.75h8.5a.75.75 0 0 1 0 1.5h-8.5A.75.75 0 0 1 7 11Zm0 3a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 0 1.5h-5.5A.75.75 0 0 1 7 14Z" />
              </svg>
            </span>
            <span className="text-lg leading-none tracking-tight">
              <span className="text-white/95">Book</span>
              <span className="bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                Store
              </span>
            </span>
          </Link>

          <div className="sm:px-1">
            <label htmlFor={searchId} className="sr-only">
              Search books
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  aria-hidden="true"
                  fill="currentColor"
                >
                  <path d="M10 4.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM3 10a7 7 0 1 1 12.04 4.838l4.56 4.56a.75.75 0 1 1-1.06 1.06l-4.56-4.56A7 7 0 0 1 3 10Z" />
                </svg>
              </span>
              <input
                id={searchId}
                type="search"
                value={localSearch}
                onChange={handleSearchChange}
                placeholder="Search for books, authors, ISBN…"
                className="h-11 w-full rounded-full border border-white/10 bg-white/[0.07] px-11 pr-24 text-[15px] text-white shadow-inner shadow-black/20 outline-none ring-amber-400/40 backdrop-blur-md placeholder:text-white/40 transition focus-visible:border-amber-400/30 focus-visible:ring-2"
              />
              <button
                type="button"
                className="absolute right-1 top-1/2 flex h-9 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-b from-amber-300 to-amber-500 px-4 text-sm font-semibold text-slate-950 shadow-glass-sm outline-none ring-amber-400/50 transition-all duration-200 hover:from-amber-200 hover:to-amber-400 hover:shadow-glow focus-visible:ring-2 active:translate-y-px"
              >
                Search
              </button>
            </div>
          </div>

          <nav className="flex items-center justify-between gap-2 sm:justify-end sm:gap-3">
            {user ? (
              <>
                {isAdmin ? (
                  <Link
                    to="/admin"
                    className="inline-flex rounded-xl border border-transparent px-3 py-2 text-sm font-medium text-white/85 outline-none ring-amber-400/40 transition-all duration-200 hover:border-white/10 hover:bg-white/[0.06] hover:text-white focus-visible:ring-2"
                  >
                    Admin
                  </Link>
                ) : null}
                <Link
                  to="/profile"
                  className="inline-flex rounded-xl border border-transparent px-3 py-2 text-sm font-medium text-white/85 outline-none ring-amber-400/40 transition-all duration-200 hover:border-white/10 hover:bg-white/[0.06] hover:text-white focus-visible:ring-2"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex rounded-xl border border-transparent px-3 py-2 text-sm font-medium text-white/85 outline-none ring-amber-400/40 transition-all duration-200 hover:border-white/10 hover:bg-white/[0.06] hover:text-white focus-visible:ring-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="inline-flex rounded-xl border border-transparent px-3 py-2 text-sm font-medium text-white/85 outline-none ring-amber-400/40 transition-all duration-200 hover:border-white/10 hover:bg-white/[0.06] hover:text-white focus-visible:ring-2"
              >
                Login
              </Link>
            )}
            <Link
              to="/wishlist"
              className="group relative inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-sm font-semibold text-white shadow-glass-sm outline-none ring-amber-400/40 backdrop-blur-sm transition-all duration-200 hover:border-white/15 hover:bg-white/[0.1] hover:shadow-glass focus-visible:ring-2"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                aria-hidden="true"
                fill="currentColor"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6.42 3.42 5 5.5 5c1.74 0 3.41 1.01 4.5 2.09C11.09 6.01 12.76 5 14.5 5 16.58 5 18 6.42 18 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span>Wishlist</span>
              {wishlistCount > 0 ? (
                <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-gradient-to-b from-amber-300 to-amber-500 text-[11px] font-bold leading-none text-slate-950 shadow-glass-sm transition-transform duration-200 group-hover:scale-110 motion-reduce:transform-none">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              ) : null}
            </Link>
            <Link
              to="/cart"
              className="group relative inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-sm font-semibold text-white shadow-glass-sm outline-none ring-amber-400/40 backdrop-blur-sm transition-all duration-200 hover:border-white/15 hover:bg-white/[0.1] hover:shadow-glass focus-visible:ring-2"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                aria-hidden="true"
                fill="currentColor"
              >
                <path d="M6.5 6.25a.75.75 0 0 0 0 1.5h1.17l1.55 8.11A2.75 2.75 0 0 0 11.92 18h6.14a2.75 2.75 0 0 0 2.7-2.24l.9-4.76a2.25 2.25 0 0 0-2.21-2.67H9.2l-.2-1.08A1.75 1.75 0 0 0 7.28 6.25H6.5Zm4.75 13.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm6 1a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
              </svg>
              <span>Cart</span>
              {cartCount > 0 ? (
                <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-gradient-to-b from-amber-300 to-amber-500 text-[11px] font-bold leading-none text-slate-950 shadow-glass-sm transition-transform duration-200 group-hover:scale-110 motion-reduce:transform-none">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              ) : null}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
