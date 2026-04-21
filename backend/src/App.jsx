import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Cart from './pages/Cart.jsx'
import Home from './pages/Home.jsx'
import BookDetails from './pages/BookDetails.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Profile from './pages/Profile.jsx'
import Wishlist from './pages/Wishlist.jsx'
import Orders from './pages/Orders.jsx'
import Checkout from './pages/Checkout.jsx'
import Admin from './pages/Admin.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AdminRoute from './components/AdminRoute.jsx'

function App() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-slate-950 font-sans text-left text-white antialiased selection:bg-amber-400/25 selection:text-white">
      
      {/* Background Effects */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-slate-950 to-[#0c1222]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_85%_at_50%_-25%,rgba(99,102,241,0.22),transparent_58%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_100%_0%,rgba(251,191,36,0.11),transparent_52%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_0%_100%,rgba(56,189,248,0.09),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(2,6,23,0)_0%,rgba(2,6,23,0.55)_100%)]" />
      </div>

      {/* Navbar */}
      <Navbar setSearchQuery={setSearchQuery} />

      {/* Pages */}
      <div className="flex flex-col">
        <Routes>
          <Route path="/" element={<Home searchQuery={searchQuery} />} />
          <Route path="/book/:id" element={<BookDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
        </Routes>
      </div>
    </div>
  )
}

export default App