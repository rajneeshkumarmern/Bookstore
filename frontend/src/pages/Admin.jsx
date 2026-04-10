import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { bookService, userService } from '../services/api.js'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'

const categories = ['Software', 'Productivity', 'Design', 'Business', 'Fiction']

export default function Admin() {
  const { user } = useAuth()
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    price: '',
    image: '',
    description: '',
    category: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [usersError, setUsersError] = useState('')

  const fetchUsers = async () => {
    try {
      setUsersLoading(true)
      setUsersError('')
      const fetchedUsers = await userService.getAllUsers()
      setUsers(fetchedUsers || [])
    } catch (err) {
      setUsersError(err.message)
    } finally {
      setUsersLoading(false)
    }
  }

  const handlePromote = async (userId) => {
    try {
      setLoading(true)
      await userService.updateUserRole(userId, 'admin')
      toast.success('User promoted to admin')
      await fetchUsers()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await bookService.createBook({
        ...newBook,
        price: Number(newBook.price) || 0,
      })
      toast.success('Book added successfully')
      setNewBook({ title: '', author: '', price: '', image: '', description: '', category: '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col px-4 py-10 sm:px-6 sm:py-12">
      <div className="glass-panel-soft rounded-3xl p-8 shadow-glass-lg">
        <header className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-white/95">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-white/60">
            Add new book listings and keep the shop inventory up to date.
          </p>
        </header>

        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <input
            type="text"
            placeholder="Title"
            value={newBook.title}
            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
            required
            className="rounded-3xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none ring-amber-400/30 transition focus-visible:ring-2"
          />
          <input
            type="text"
            placeholder="Author"
            value={newBook.author}
            onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
            required
            className="rounded-3xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none ring-amber-400/30 transition focus-visible:ring-2"
          />
          <input
            type="number"
            placeholder="Price"
            value={newBook.price}
            onChange={(e) => setNewBook({ ...newBook, price: e.target.value })}
            required
            className="rounded-3xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none ring-amber-400/30 transition focus-visible:ring-2"
          />
          <input
            type="text"
            placeholder="Image URL"
            value={newBook.image}
            onChange={(e) => setNewBook({ ...newBook, image: e.target.value })}
            className="rounded-3xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none ring-amber-400/30 transition focus-visible:ring-2"
          />
          <select
            value={newBook.category}
            onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
            required
            className="rounded-3xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none ring-amber-400/30 transition focus-visible:ring-2"
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category} value={category} className="bg-slate-950">
                {category}
              </option>
            ))}
          </select>
          <textarea
            placeholder="Description"
            value={newBook.description}
            onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
            rows="4"
            className="sm:col-span-2 rounded-3xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none ring-amber-400/30 transition focus-visible:ring-2"
          />
          <button
            type="submit"
            disabled={loading}
            className="sm:col-span-2 inline-flex items-center justify-center rounded-full bg-gradient-to-b from-amber-300 to-amber-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-glass-lg outline-none ring-amber-400/40 transition hover:from-amber-200 hover:to-amber-400 focus-visible:ring-2 disabled:opacity-50"
          >
            {loading ? 'Saving book...' : 'Save Book'}
          </button>
        </form>

        {loading && <div className="mt-6"><LoadingSpinner label="Saving book" /></div>}
      </div>

      <section className="mt-10 glass-panel-soft rounded-3xl p-8 shadow-glass-lg">
        <header className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight text-white/95">User Management</h2>
          <p className="mt-2 text-sm text-white/60">
            Promote trusted users to admin and manage role assignments.
          </p>
        </header>

        {usersLoading ? (
          <LoadingSpinner label="Loading users" />
        ) : usersError ? (
          <ErrorMessage message={usersError} />
        ) : (
          <div className="space-y-4">
            {users.length === 0 ? (
              <p className="text-sm text-white/60">No users found.</p>
            ) : (
              <div className="space-y-3">
                {users.map((account) => (
                  <div
                    key={account._id}
                    className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-slate-950/40 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-white">{account.name}</p>
                      <p className="text-sm text-white/60">{account.email}</p>
                      <p className="mt-1 text-xs uppercase tracking-widest text-amber-300">
                        {account.role}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {account.role !== 'admin' ? (
                        <button
                          onClick={() => handlePromote(account._id)}
                          className="inline-flex items-center justify-center rounded-full bg-gradient-to-b from-amber-300 to-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-glass-sm transition hover:from-amber-200 hover:to-amber-400 disabled:opacity-50"
                          disabled={loading}
                        >
                          Promote to Admin
                        </button>
                      ) : (
                        <span className="rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200">
                          Administrator
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  )
}
