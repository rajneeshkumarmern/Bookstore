import { useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const formatName = (user) => {
  if (!user) return 'Guest Reader'
  if (user.name) return user.name
  if (user.email) return user.email.split('@')[0]
  return 'Guest Reader'
}

const getAvatarLetters = (name) => {
  if (!name) return 'BR'
  const parts = name.split(' ').filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true })
      return
    }
  }, [user, navigate])

  const displayName = useMemo(() => formatName(user), [user])
  const avatarLetters = useMemo(() => getAvatarLetters(displayName), [displayName])

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  if (!user) {
    return null
  }

  return (
    <main className="flex min-h-screen flex-col px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-amber-300/80">Profile</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Your account overview
            </h1>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center rounded-full bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white/90 transition-all duration-200 hover:bg-white/[0.1] focus-visible:ring-2 focus-visible:ring-amber-400/50"
          >
            Logout
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 shadow-glass-lg backdrop-blur-xl">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-300 to-amber-500 text-3xl font-semibold text-slate-950 shadow-glow">
                {avatarLetters}
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-200/80">Account holder</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">{displayName}</h2>
                <p className="mt-1 text-sm text-white/60">Member since today</p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
                <p className="text-sm text-white/50">Email</p>
                <p className="mt-2 text-base font-medium text-white break-words overflow-hidden">
                  {user?.email ?? 'no-email@example.com'}
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
                <p className="text-sm text-white/50">Status</p>
                <p className="mt-2 text-base font-medium text-white">Active</p>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 shadow-glass-lg backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-amber-200/80">Orders</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">Recent activity</h2>
              </div>
            </div>

            <div className="mt-8 rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-center">
              <p className="text-lg font-semibold text-white/90">No orders yet</p>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Your recent purchases will appear here once you place an order. Keep exploring the bookstore to add more books to your cart.
              </p>
              <Link
                to="/orders"
                className="mt-4 inline-flex items-center justify-center rounded-full bg-gradient-to-b from-amber-300 to-amber-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-glass-lg outline-none ring-amber-400/40 transition-all duration-200 hover:from-amber-200 hover:to-amber-400 hover:shadow-glow focus-visible:ring-2 active:scale-95"
              >
                View All Orders
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
