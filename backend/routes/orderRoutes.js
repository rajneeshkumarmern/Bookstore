const express = require('express')
const Order = require('../models/Order')
const { protect } = require('../middleware/auth')

const router = express.Router()

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
router.post('/', protect, async (req, res) => {
  const { items, totalPrice } = req.body

  try {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must have at least one item' })
    }

    if (!totalPrice || totalPrice <= 0) {
      return res.status(400).json({ message: 'Invalid total price' })
    }

    const order = await Order.create({
      userId: req.user._id,
      items,
      totalPrice,
    })

    const populatedOrder = await Order.findById(order._id)
      .populate('userId', 'name email')
      .populate('items.bookId', 'title author price image')

    res.status(201).json(populatedOrder)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// @desc    Get user orders
// @route   GET /api/orders/user/:id
// @access  Private
router.get('/user/:id', protect, async (req, res) => {
  try {
    // Check if user is requesting their own orders
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized to view these orders' })
    }

    const orders = await Order.find({ userId: req.params.id })
      .populate('userId', 'name email')
      .populate('items.bookId', 'title author price image')
      .sort({ createdAt: -1 })

    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private (Admin only - for now, allow user to update their own)
router.put('/:id', protect, async (req, res) => {
  const { status } = req.body

  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    // Check if user owns this order
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this order' })
    }

    order.status = status || order.status
    const updatedOrder = await order.save()

    const populatedOrder = await Order.findById(updatedOrder._id)
      .populate('userId', 'name email')
      .populate('items.bookId', 'title author price image')

    res.json(populatedOrder)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router