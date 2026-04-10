import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import toast from 'react-hot-toast'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    setLoading(true)

    const result = await register(name, email, password)

    if (result.success) {
      toast.success('Registration successful!')
      navigate('/')
    } else {
      toast.error(result.message)
    }

    setLoading(false)
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-16">
      <div className="w-full max-w-md">
        <div className="glass-panel-soft rounded-3xl p-8 shadow-glass-lg">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-white/95">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-white/60">
              Join us to start your reading journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
                Full name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white placeholder-white/50 shadow-inner outline-none ring-amber-400/30 transition-all duration-200 focus:ring-2"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white placeholder-white/50 shadow-inner outline-none ring-amber-400/30 transition-all duration-200 focus:ring-2"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white placeholder-white/50 shadow-inner outline-none ring-amber-400/30 transition-all duration-200 focus:ring-2"
                placeholder="Create a password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/80 mb-2">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white placeholder-white/50 shadow-inner outline-none ring-amber-400/30 transition-all duration-200 focus:ring-2"
                placeholder="Confirm your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center rounded-full bg-gradient-to-b from-amber-300 to-amber-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-glass-lg outline-none ring-2 ring-amber-400/30 transition-all duration-200 hover:from-amber-200 hover:to-amber-400 hover:shadow-glow focus-visible:ring-amber-400/60 active:translate-y-px disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-white/60">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-amber-300 hover:text-amber-200 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
