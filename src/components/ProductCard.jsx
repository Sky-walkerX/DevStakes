import { ShoppingCart, Heart, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ProductCard({ product, addToCart }) {
  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ position: 'relative', height: '240px', width: '100%' }}>
        <img 
          src={product.image} 
          alt={product.name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'transform 0.2s',
        }} className="hover-scale">
          <Heart size={18} color="white" />
        </div>
      </div>
      
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{product.name}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fbbf24', fontSize: '0.9rem' }}>
            <Star size={16} fill="currentColor" /> {product.rating}
          </div>
        </div>
        
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
          By <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{product.farmer}</span>
        </p>
        
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success-color)' }}>
            ₹{product.price.toFixed(2)}<span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>/{product.unit}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to={`/product/${product.id}`} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
              Details
            </Link>
            <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }} onClick={() => addToCart(product)}>
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
