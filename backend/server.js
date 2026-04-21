const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const connectDB = require('./config/db')

// Load env variables
dotenv.config()

// Connect DB
connectDB()

const app = express()

// Middleware
app.use(cors({
  origin: "https://bookstore-nu.vercel.app",
  credentials: true
}))

app.use(express.json())

// Routes
const bookRoutes = require('./routes/bookRoutes')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const orderRoutes = require('./routes/orderRoutes')
const paymentRoutes = require('./routes/paymentRoutes')

// API Routes
app.use('/api/books', bookRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/payment', paymentRoutes)

// Root route (health check)
app.get('/', (req, res) => {
  res.send('Bookstore API is running ...')
})

// Server start
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})