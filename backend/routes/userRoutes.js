const express = require('express')
const User = require('../models/User')
const { protect, admin } = require('../middleware/auth')

const router = express.Router()

// Temporary admin seeding route. Enable with ENABLE_ADMIN_SEED=true and remove after first admin creation.
router.post('/seed-admin', async (req, res) => {
  if (process.env.ENABLE_ADMIN_SEED !== 'true') {
    return res.status(403).json({ message: 'Admin seeding is disabled' })
  }

  const { name, email, password } = req.body
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' })
  }

  try {
    const existingAdmin = await User.findOne({ role: 'admin' })
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin user already exists' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User with that email already exists' })
    }

    const user = await User.create({ name, email, password, role: 'admin' })
    const token = require('jsonwebtoken').sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    })

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get all users (admin only)
router.get('/', protect, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password')
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Update a user's role (admin only)
router.put('/:id/role', protect, admin, async (req, res) => {
  const { role } = req.body

  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' })
  }

  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    user.role = role
    await user.save()

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
