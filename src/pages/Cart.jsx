import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2, ArrowRight, CheckCircle } from 'lucide-react'

export default function Cart({ cart, removeFromCart, setCart }) {
  const [success, setSuccess] = useState(false)

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQ = item.quantity + delta;
        return { ...item, quantity: newQ > 0 ? newQ : 1 }
      }
      return item
    }))
  }

  if (success) {
    return (
      <div className="container animate-fade-in" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto', padding: '4rem 2rem' }}>
          <CheckCircle size={80} color="var(--success-color)" style={{ margin: '0 auto 2rem' }} />
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Order Placed!</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '2rem' }}>
            Your order has been sent to the farmers. They will prepare your fresh produce for pick-up/delivery.
          </p>
          <Link to="/marketplace" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="container animate-fade-in" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Your Cart is Empty</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Looks like you haven't added any fresh produce yet.</p>
        <Link to="/marketplace" className="btn btn-primary">Browse Marketplace</Link>
      </div>
    )
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Your Cart</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) 1fr', gap: '3rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {cart.map(item => (
            <div key={item.id} className="glass-card" style={{ display: 'flex', padding: '1.5rem', gap: '1.5rem', alignItems: 'center' }}>
              <img src={item.image} alt={item.name} style={{ width: '100px', height: '100px', borderRadius: '12px', objectFit: 'cover' }} />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.25rem', margin: '0 0 0.5rem 0' }}>{item.name}</h3>
                <p style={{ color: 'var(--text-secondary)', margin: '0 0 1rem 0' }}>{item.farmer}</p>
                <div style={{ fontWeight: 'bold', color: 'var(--success-color)' }}>₹{item.price.toFixed(2)} / {item.unit}</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '8px' }}>
                <button onClick={() => updateQuantity(item.id, -1)} style={qtyBtnStyle}>-</button>
                <span style={{ fontWeight: 600, minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, 1)} style={qtyBtnStyle}>+</button>
              </div>

              <div style={{ fontWeight: 'bold', fontSize: '1.25rem', minWidth: '80px', textAlign: 'right' }}>
                ₹{(item.price * item.quantity).toFixed(2)}
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)', border: 'none', padding: '0.75rem', borderRadius: '8px', cursor: 'pointer' }}
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        <div>
          <div className="glass-panel" style={{ padding: '2rem', position: 'sticky', top: '100px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>Order Summary</h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
              <span>Subtotal</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
              <span>Platform Fee</span>
              <span>₹{(total * 0.05).toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)', fontSize: '1.25rem', fontWeight: 'bold' }}>
              <span>Total</span>
              <span style={{ color: 'var(--success-color)' }}>₹{(total * 1.05).toFixed(2)}</span>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '2rem', padding: '1rem' }}
              onClick={() => {
                setCart([])
                setSuccess(true)
              }}
            >
              Place Order <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const qtyBtnStyle = {
  background: 'transparent',
  border: 'none',
  color: 'white',
  fontSize: '1.25rem',
  cursor: 'pointer',
  width: '30px',
  height: '30px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '4px'
}
