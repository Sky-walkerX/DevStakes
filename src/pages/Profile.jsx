import { User, MapPin, Phone, Package, Calendar, LogOut } from 'lucide-react'

export default function Profile({ user }) {
  const mockOrders = [
    { id: 'ORD-29381', date: 'Oct 14, 2026', total: 1250.50, status: 'Delivered', items: 3 },
    { id: 'ORD-29302', date: 'Oct 02, 2026', total: 600.00, status: 'Delivered', items: 1 }
  ]

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>My Profile</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 2fr', gap: '3rem' }}>
        
        {/* Profile Details Sidebar */}
        <div className="glass-panel" style={{ padding: '2rem', height: 'fit-content' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent-color), var(--success-color))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: '0 8px 32px rgba(114, 184, 38, 0.4)'
            }}>
              <User size={60} color="white" />
            </div>
            <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>{user.name}</h2>
            <span style={{ 
              background: 'rgba(114, 184, 38, 0.2)', 
              color: '#b4f177', 
              padding: '0.25rem 1rem', 
              borderRadius: '20px', 
              fontSize: '0.9rem',
              fontWeight: 500,
              textTransform: 'capitalize'
            }}>
              {user.role}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)' }}>
              <Phone size={20} />
              <span>+1 (555) 123-4567</span>
            </div>
            <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)' }}>
              <MapPin size={20} />
              <span>123 Market St, San Francisco, CA</span>
            </div>
          </div>
          
          <button className="btn btn-secondary" style={{ width: '100%', marginTop: '2rem' }}>
            Edit Profile
          </button>
        </div>

        {/* Order History */}
        <div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Order History</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {mockOrders.map(order => (
              <div key={order.id} className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                    <Package size={20} color="var(--accent-color)" /> {order.id}
                  </div>
                  <span style={{ color: 'var(--success-color)', background: 'rgba(16, 185, 129, 0.1)', padding: '0.25rem 0.75rem', borderRadius: '6px', fontSize: '0.9rem' }}>
                    {order.status}
                  </span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={18} /> {order.date}
                  </div>
                  <div>
                    {order.items} Items
                  </div>
                  <div style={{ fontWeight: 'bold', color: 'white' }}>
                    ₹{order.total.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
