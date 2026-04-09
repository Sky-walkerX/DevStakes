import { useParams, Link } from 'react-router-dom'
import { ShoppingCart, MessageSquare, ArrowLeft, Star, ShieldCheck } from 'lucide-react'
import { products } from '../data/mockData'

export default function ProductDetails({ addToCart }) {
  const { id } = useParams()
  const product = products.find(p => p.id === parseInt(id))

  if (!product) return <div className="container" style={{ padding: '5rem', textAlign: 'center' }}>Product not found.</div>

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem' }}>
      <Link to="/marketplace" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '2rem' }}>
        <ArrowLeft size={20} /> Back to Marketplace
      </Link>

      <div className="glass-panel" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', padding: '3rem', alignItems: 'center' }}>
        
        <div style={{ borderRadius: '16px', overflow: 'hidden', height: '500px', width: '100%' }}>
          <img 
            src={product.image} 
            alt={product.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--accent-color)', fontWeight: 600, marginBottom: '0.5rem' }}>
            <span>{product.category}</span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fbbf24' }}>
              <Star size={18} fill="currentColor" /> {product.rating} Rating
            </span>
          </div>

          <h1 style={{ fontSize: '3.5rem', lineHeight: '1.2', marginBottom: '1rem' }}>{product.name}</h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>{product.description}</p>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', marginBottom: '2rem' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, #8ad33b, #65a822)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontWeight: 'bold' }}>{product.farmer.charAt(0)}</span>
            </div>
            <div>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Farmer / Seller</p>
              <p style={{ margin: 0, fontWeight: 600, fontSize: '1.1rem' }}>{product.farmer}</p>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success-color)' }}>
              <ShieldCheck size={20} /> Verified
            </div>
          </div>

          <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--success-color)', marginBottom: '2rem' }}>
            ₹{product.price.toFixed(2)}<span style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}> / {product.unit}</span>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" style={{ flex: 1, padding: '1rem', fontSize: '1.1rem' }}>
              Buy Now
            </button>
            <button className="btn btn-secondary" style={{ flex: 1, padding: '1rem', fontSize: '1.1rem' }} onClick={() => addToCart(product)}>
              <ShoppingCart size={20} /> Add to Cart
            </button>
            <Link to="/chat" className="btn btn-secondary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', borderColor: 'var(--accent-color)', color: 'white' }}>
              <MessageSquare size={20} /> Negotiate with Farmer
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
