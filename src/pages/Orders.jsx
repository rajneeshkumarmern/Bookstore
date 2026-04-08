import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

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

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function Orders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) return

    const fetchOrders = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`http://localhost:5000/api/orders/user/${user._id}`)
        setOrders(response.data)
      } catch (err) {
        setError('Failed to fetch orders')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user])

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-white mb-4">Please login to view orders</h1>
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-b from-amber-300 to-amber-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-glass-lg outline-none ring-amber-400/40 transition-all duration-200 hover:from-amber-200 hover:to-amber-400 hover:shadow-glow focus-visible:ring-2 active:scale-95"
          >
            Login
          </Link>
        </div>
      </main>
    )
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-white">Loading orders...</div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center text-red-400">
          <p>{error}</p>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col px-4 py-10 sm:px-6 sm:py-12">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white/95 sm:text-3xl">
            My Orders
          </h1>
          <p className="mt-2 text-sm text-white/60">
            View your order history and track current orders.
          </p>
        </div>
      </header>

      {orders.length === 0 ? (
        <div className="glass-panel-soft mt-10 rounded-3xl p-12 text-center shadow-glass-lg sm:p-16">
          <p className="text-2xl font-semibold tracking-tight text-white/95 sm:text-3xl">
            No orders yet 📦
          </p>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/60">
            Start shopping to see your orders here.
          </p>
          <Link
            to="/"
            className="mt-10 inline-flex items-center justify-center rounded-full bg-gradient-to-b from-amber-300 to-amber-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-glass-lg outline-none ring-amber-400/40 transition-all duration-200 hover:from-amber-200 hover:to-amber-400 hover:shadow-glow focus-visible:ring-2 active:scale-95"
          >
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="mt-10 space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="glass-panel-soft rounded-3xl p-6 shadow-glass-lg"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Order #{order._id.slice(-8)}
                  </h3>
                  <p className="text-sm text-white/60">
                    Placed on {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                      order.status === 'Completed'
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-amber-500/10 text-amber-400'
                    }`}
                  >
                    {order.status}
                  </span>
                  <span className="text-lg font-bold text-amber-400">
                    {formatMoney(order.totalPrice)}
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 rounded-xl bg-white/[0.02] p-4"
                  >
                    <div className="h-16 w-12 flex-none overflow-hidden rounded-lg bg-white/[0.04]">
                      {item.bookId?.image ? (
                        <img
                          src={item.bookId.image}
                          alt={item.bookId.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center text-xs text-white/40">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-white truncate">
                        {item.bookId?.title || 'Unknown Book'}
                      </h4>
                      <p className="text-sm text-white/60">
                        by {item.bookId?.author || 'Unknown Author'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-white/60">Qty: {item.quantity}</p>
                      <p className="font-medium text-amber-400">
                        {formatMoney((item.bookId?.price || 0) * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}