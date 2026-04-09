import { useState } from 'react'
import ProductCard from '../components/ProductCard'
import { products as mockProducts } from '../data/mockData'
import { Filter, Search } from 'lucide-react'

export default function Marketplace({ addToCart }) {
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  const categories = ['All', 'Vegetables', 'Fruits', 'Grains']

  const filteredProducts = mockProducts.filter(p => {
    const matchesFilter = filter === 'All' || p.category === filter
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>Fresh <span className="text-gradient">Marketplace</span></h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Support local farmers directly.</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                padding: '0.75rem 1rem 0.75rem 3rem',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                outline: 'none',
                minWidth: '250px'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--glass-bg)', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
            <Filter size={20} style={{ margin: '0.25rem 0.5rem', color: 'var(--text-secondary)' }} />
            {categories.map(c => (
              <button 
                key={c}
                onClick={() => setFilter(c)}
                style={{
                  background: filter === c ? 'var(--accent-color)' : 'transparent',
                  color: filter === c ? 'white' : 'var(--text-primary)',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '2.5rem' 
        }}>
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} addToCart={addToCart} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '5rem', background: 'var(--glass-bg)', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>No products found</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  )
}
