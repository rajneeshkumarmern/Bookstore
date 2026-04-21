const express = require('express')
const Stripe = require('stripe')
const { protect } = require('../middleware/auth')

const router = express.Router()

const isDummy = !process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('123456')

const stripe = isDummy ? null : new Stripe(process.env.STRIPE_SECRET_KEY)

// @desc    Create payment intent
router.post('/create-intent', protect, async (req, res) => {
  const { amount } = req.body

  try {
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' })
    }

    // 🧪 Dummy mode
    if (isDummy) {
      return res.json({
        clientSecret: "dummy_client_secret",
        paymentIntentId: "dummy_intent_id",
        message: "Test mode payment 🚀"
      })
    }

    // 💳 Real Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
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
router.post('/confirm', protect, async (req, res) => {
  const { paymentIntentId, items, totalPrice } = req.body

  try {

    // 🧪 Dummy mode → skip Stripe
    if (isDummy) {
      const Order = require('../models/Order')

      const order = await Order.create({
        userId: req.user._id,
        items,
        totalPrice,
        status: 'Completed',
      })

      const populatedOrder = await Order.findById(order._id)
        .populate('userId', 'name email')
        .populate('items.bookId', 'title author price image')

      return res.json({
        success: true,
        order: populatedOrder,
        message: 'Test payment successful 🚀',
      })
    }

    // 💳 Real Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not completed' })
    }

    if (paymentIntent.metadata.userId !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    const Order = require('../models/Order')

    const order = await Order.create({
      userId: req.user._id,
      items,
      totalPrice,
      status: 'Completed',
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