const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const connectDB = require('./config/db')

dotenv.config()

connectDB()


const app = express()

app.use(cors({
  origin: [
    "https://bookstore-nu.vercel.app",
    "https://bookstore-frontend-p6ys.vercel.app"
  ],
  credentials: true
}))

app.use(express.json())

const bookRoutes = require('./routes/bookRoutes')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const orderRoutes = require('./routes/orderRoutes')
const paymentRoutes = require('./routes/paymentRoutes')

app.use('/api/books', bookRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/payment', paymentRoutes)

app.get('/', (req, res) => {
  res.send('Bookstore API is running ...')
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})