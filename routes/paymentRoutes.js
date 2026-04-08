const express = require('express')
const Stripe = require('stripe')
const { protect } = require('../middleware/auth')

const router = express.Router()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// @desc    Create payment intent
// @route   POST /api/payment/create-intent
// @access  Private
router.post('/create-intent', protect, async (req, res) => {
  const { amount } = req.body

  try {
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' })
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'inr',
      metadata: {
        userId: req.user._id.toString(),
      },
    })

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error('Stripe error:', error)
    res.status(500).json({ message: 'Payment creation failed' })
  }
})

// @desc    Confirm payment and create order
// @route   POST /api/payment/confirm
// @access  Private
router.post('/confirm', protect, async (req, res) => {
  const { paymentIntentId, items, totalPrice } = req.body

  try {
    // Verify payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not completed' })
    }

    // Check if user matches
    if (paymentIntent.metadata.userId !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    // Create order in database
    const Order = require('../models/Order')
    const order = await Order.create({
      userId: req.user._id,
      items,
      totalPrice,
      status: 'Completed', // Mark as completed since payment succeeded
    })

    const populatedOrder = await Order.findById(order._id)
      .populate('userId', 'name email')
      .populate('items.bookId', 'title author price image')

    res.json({
      success: true,
      order: populatedOrder,
      message: 'Payment successful and order created',
    })
  } catch (error) {
    console.error('Payment confirmation error:', error)
    res.status(500).json({ message: 'Order creation failed' })
  }
})

module.exports = router