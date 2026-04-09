import { Link } from 'react-router-dom'
import { ArrowRight, Leaf, ShieldCheck, TrendingDown } from 'lucide-react'
import { heroImage } from '../data/mockData'

export default function Home() {
  return (
    <div className="animate-fade-in">
      <section style={{
        position: 'relative',
        height: '80vh',
        display: 'flex',
        alignItems: 'center',
        padding: '0 5%',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.8)',
          zIndex: -1
        }}></div>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          background: 'linear-gradient(90deg, rgba(27, 58, 10, 0.95) 0%, rgba(76, 138, 24, 0.7) 50%, rgba(111, 181, 38, 0.3) 100%)',
          zIndex: -1
        }}></div>

        <div style={{ maxWidth: '800px', color: 'white' }}>
          <h1 style={{ fontSize: '4.5rem', lineHeight: '1.1', marginBottom: '1.5rem', fontWeight: 800 }}>
            <span className="text-gradient">Connecting Farmers</span> Direct to Consumers
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)', marginBottom: '2.5rem', maxWidth: '600px' }}>
            Bypass the middlemen. Buy fresh, organic produce directly from local farmers with AI-driven fair pricing and transparent sourcing.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/marketplace" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
              Explore Marketplace <ArrowRight size={20} />
            </Link>
            <Link to="/profile" className="btn btn-secondary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
              Get Started
            </Link>
          </div>
        </div>
      </section>

      <section className="container" style={{ padding: '6rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          
          <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.2)', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--success-color)' }}>
              <Leaf size={32} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Direct Buying</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Get products directly from the farm to your table, ensuring maximum freshness.</p>
          </div>

          <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
            <div style={{ background: 'rgba(114, 184, 38, 0.2)', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--accent-color)' }}>
              <TrendingDown size={32} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>AI Price Suggestions</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Our smart algorithms suggest realistic, fair prices based on market trends.</p>
          </div>

          <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
            <div style={{ background: 'rgba(114, 184, 38, 0.2)', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--accent-color)' }}>
              <ShieldCheck size={32} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Transparent Pricing</h3>
            <p style={{ color: 'var(--text-secondary)' }}>No hidden fees. Every transaction is 100% transparent and direct.</p>
          </div>

        </div>
      </section>

      <section className="container" style={{ padding: '2rem 1.5rem 6rem' }}>
        <div className="glass-panel" style={{ padding: '3rem', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(114, 184, 38, 0.1))', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Thought of the Day</h2>
          <p style={{ fontSize: '1.5rem', fontStyle: 'italic', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto' }}>
            "The discovery of agriculture was the first big step toward a civilized life."
          </p>
          <p style={{ marginTop: '1rem', fontWeight: 600, color: 'var(--accent-color)' }}>— Arthur Keith</p>
        </div>
      </section>
    </div>
  )
}
