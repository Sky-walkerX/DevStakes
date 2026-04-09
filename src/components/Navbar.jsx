import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, Sprout, LayoutDashboard, MessageSquare, LogOut } from 'lucide-react'

export default function Navbar({ cartCount, user, setUser }) {
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path) => location.pathname === path

  const handleSignOut = () => {
    setUser(null)
    navigate('/')
  }

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 1000,
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--glass-border)'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '80px'
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'var(--text-primary)' }}>
          <Sprout size={32} color="var(--success-color)" />
          <span style={{ fontSize: '1.5rem', fontWeight: 700 }} className="poppins">Farm2City</span>
        </Link>
        
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/marketplace" style={{ ...navLinkStyle, color: isActive('/marketplace') ? 'var(--accent-color)' : 'var(--text-primary)' }}>Marketplace</Link>
            {user && user.role === 'farmer' && (
              <Link to="/dashboard" style={{ ...navLinkStyle, color: isActive('/dashboard') ? 'var(--accent-color)' : 'var(--text-primary)' }}>
                <LayoutDashboard size={20} /> Dashboard
              </Link>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', borderLeft: '1px solid var(--glass-border)', paddingLeft: '1.5rem' }}>
            <Link to="/chat" style={{ position: 'relative', color: 'var(--text-primary)' }}>
              <MessageSquare size={24} />
            </Link>

            <Link to="/cart" style={{ position: 'relative', color: 'var(--text-primary)' }}>
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-10px',
                  background: 'var(--danger-color)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}>
                  {cartCount}
                </span>
              )}
            </Link>
            
            
            {user ? (
              <>
                <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', textDecoration: 'none' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--accent-color), var(--success-color))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <User size={20} />
                  </div>
                </Link>
                <button onClick={handleSignOut} title="Sign Out" style={{ background: 'transparent', border: 'none', color: 'var(--danger-color)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <LogOut size={22} />
                </button>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

const navLinkStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  textDecoration: 'none',
  fontWeight: 500,
  transition: 'color 0.3s ease'
}
