# MERN Bookstore App

A full-stack MERN bookstore application with user authentication, cart management, and Stripe payment integration.

## Features

- 🔐 User authentication (register/login)
- 📚 Book browsing and search
- 🛒 Shopping cart with local storage
- 💳 Secure Stripe payment processing
- 📦 Order management and history
- 📱 Responsive design with dark theme

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables in `.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/bookstore
   JWT_SECRET=your_jwt_secret_here
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
   ```

4. Start MongoDB locally or update MONGO_URI for cloud database

5. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Update Stripe publishable key in `src/pages/Checkout.jsx`:
   ```javascript
   const stripePromise = loadStripe('pk_test_your_stripe_publishable_key_here')
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the dashboard
3. Add test keys to your environment:
   - Publishable key: `pk_test_...` (frontend)
   - Secret key: `sk_test_...` (backend)

## Usage

1. Register/Login to create an account
2. Browse books on the home page
3. Add books to cart
4. Proceed to checkout
5. Complete payment with test card details
6. View order history in profile/orders

## Test Payment

Use these test card details for payment testing:
- Card number: `4242 4242 4242 4242`
- Expiry: Any future date (MM/YY)
- CVC: Any 3 digits
- Name: Any name

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Books
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get single book

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/user/:id` - Get user orders

### Payment
- `POST /api/payment/create-intent` - Create payment intent
- `POST /api/payment/confirm` - Confirm payment and create order

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Axios
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT
- **Payment**: Stripe
- **State Management**: React Context
