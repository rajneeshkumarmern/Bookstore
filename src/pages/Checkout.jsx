import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const stripePromise = loadStripe('pk_test_your_stripe_publishable_key_here')

function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const { items, subtotal, createPaymentIntent, confirmPayment } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [clientSecret, setClientSecret] = useState('')

  useEffect(() => {
    const setupPayment = async () => {
      try {
        const paymentData = await createPaymentIntent()
        setClientSecret(paymentData.clientSecret)
      } catch (error) {
        toast.error(error.message)
        navigate('/cart')
      }
    }

    if (user && items.length > 0) {
      setupPayment()
    }
  }, [user, items, createPaymentIntent, navigate])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setLoading(true)

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      })

      if (error) {
        toast.error(error.message)
      } else if (paymentIntent.status === 'succeeded') {
        // Confirm payment and create order
        await confirmPayment(paymentIntent.id)
        toast.success('Payment successful! Order placed.')
        navigate('/orders')
      }
    } catch (error) {
      toast.error('Payment failed')
    } finally {
      setLoading(false)
    }
  }

  const cardStyle = {
    style: {
      base: {
        fontSize: '16px',
        color: '#ffffff',
        '::placeholder': {
          color: '#aab7c4',
        },
        backgroundColor: 'transparent',
      },
    },
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-white mb-4">Please login to checkout</h1>
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-b from-amber-300 to-amber-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-glass-lg outline-none ring-amber-400/40 transition-all duration-200 hover:from-amber-200 hover:to-amber-400 hover:shadow-glow focus-visible:ring-2 active:scale-95"
          >
            Login
          </button>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-white mb-4">Your cart is empty</h1>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-b from-amber-300 to-amber-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-glass-lg outline-none ring-amber-400/40 transition-all duration-200 hover:from-amber-200 hover:to-amber-400 hover:shadow-glow focus-visible:ring-2 active:scale-95"
          >
            Browse Books
          </button>
        </div>
      </div>
    )
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col px-4 py-10 sm:px-6 sm:py-12">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-white/95 sm:text-3xl">
          Checkout
        </h1>
        <p className="mt-2 text-sm text-white/60">
          Complete your purchase securely
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Order Summary */}
        <div className="glass-panel-soft rounded-3xl p-6 shadow-glass-lg">
          <h2 className="text-lg font-semibold text-white mb-4">Order Summary</h2>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="h-12 w-9 flex-none overflow-hidden rounded-lg bg-white/[0.04]">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-xs text-white/40">
                      No img
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-white truncate">{item.title}</h3>
                  <p className="text-sm text-white/60">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium text-amber-400">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          <div className="mt-4 flex justify-between text-lg font-bold">
            <span className="text-white">Total</span>
            <span className="text-amber-400">₹{subtotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Form */}
        <div className="glass-panel-soft rounded-3xl p-6 shadow-glass-lg">
          <h2 className="text-lg font-semibold text-white mb-4">Payment Details</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Card Information
              </label>
              <div className="rounded-xl border border-white/10 bg-white/[0.06] p-4">
                <CardElement options={cardStyle} />
              </div>
            </div>

            <button
              type="submit"
              disabled={!stripe || loading}
              className="w-full inline-flex items-center justify-center rounded-full bg-gradient-to-b from-amber-300 to-amber-500 px-5 py-3.5 text-sm font-semibold text-slate-950 shadow-glass-sm outline-none ring-amber-400/40 transition-all duration-200 hover:from-amber-200 hover:to-amber-400 hover:shadow-glow focus-visible:ring-2 active:translate-y-px disabled:opacity-50"
            >
              {loading ? 'Processing...' : `Pay ₹${subtotal.toFixed(2)}`}
            </button>
          </form>

          <p className="mt-4 text-xs leading-relaxed text-white/50 text-center">
            Your payment information is secure and encrypted
          </p>
        </div>
      </div>
    </main>
  )
}

export default function Checkout() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  )
}