import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Marketplace from './pages/Marketplace'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Profile from './pages/Profile'
import Dashboard from './pages/Dashboard'
import Chat from './pages/Chat'
import Login from './pages/Login'
import AIChatbot from './components/AIChatbot'

function App() {
  const [cart, setCart] = useState([])
  const [user, setUser] = useState(null)

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  return (
    <div className="app-container">
      <Navbar cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)} user={user} setUser={setUser} />
      
      <main style={{ paddingTop: '80px', minHeight: 'calc(100vh - 80px)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/marketplace" element={<Marketplace addToCart={addToCart} />} />
          <Route path="/product/:id" element={<ProductDetails addToCart={addToCart} />} />
          <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} setCart={setCart} />} />
          <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={user && user.role === 'farmer' ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/chat" element={user ? <Chat /> : <Navigate to="/login" />} />
        </Routes>
      </main>

      <AIChatbot />
    </div>
  )
}

export default App
