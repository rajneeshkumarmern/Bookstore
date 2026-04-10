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

3. Set up environment variables in `.env` or in Render:
   ```env
   PORT=5000
   MONGO_URI=<MongoDB Atlas connection string>
   JWT_SECRET=<secure random string>
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
   ```

4. Start MongoDB locally or update `MONGO_URI` for Atlas.

5. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Install dependencies from the `frontend` folder:
   ```bash
   cd frontend
   npm install
   ```

2. Set the frontend API URL in `frontend/.env.example` or in your environment:
   ```env
   VITE_API_URL=https://<your-render-backend-url>
   ```

3. Update Stripe publishable key in `frontend/src/pages/Checkout.jsx`:
   ```javascript
   const stripePromise = loadStripe('pk_test_your_stripe_publishable_key_here')
   ```

4. Start the development server:
   ```bash
   cd frontend
   npm run dev
   ```

### Deployment

- Backend: Deploy the `backend` folder to Render as a Web Service.
  - Build Command: `npm install`
  - Start Command: `node server.js`
  - Environment Variables:
    - `MONGO_URI`
    - `JWT_SECRET`
    - `STRIPE_SECRET_KEY`

- Frontend: Deploy the `frontend` folder to Vercel.
  - Framework Preset: Vite
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Environment Variable:
    - `VITE_API_URL=https://<your-render-backend-url>`

- Use the deployed backend URL in Vercel so the frontend connects to your Render API.

## Automatic Deployment (GitHub Actions)

This repository includes a GitHub Actions workflow at `.github/workflows/deploy.yml`.

On push to `main`, the workflow will:

- Trigger a backend deploy on Render via the Render API
- Deploy the frontend to Vercel using the Vercel CLI

Required GitHub secrets:

- `RENDER_API_KEY`
- `RENDER_SERVICE_ID`
- `VERCEL_TOKEN`
- `VITE_API_URL`

Optional Vercel secrets if you want explicit project targeting:

- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

> Make sure the backend service is configured on Render and the frontend project is configured on Vercel before using the workflow.

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

## Deployment Notes

- The backend already enables CORS and listens on `process.env.PORT`.
- The frontend uses `VITE_API_URL` via `src/services/api.js` and falls back to `https://bookstore-backend-xxxx.onrender.com` for local development.
- `vercel.json` is included to support React Router client-side routing.

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
