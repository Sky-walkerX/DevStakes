import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Tractor, ShieldCheck } from 'lucide-react'

export default function Login({ setUser }) {
  const navigate = useNavigate()
  const [role, setRole] = useState('buyer') // 'buyer' or 'farmer'

  const handleLogin = (e) => {
    e.preventDefault()
    // Mock login by setting user state
    setUser({
      name: role === 'farmer' ? 'Green Valley Farm' : 'John Doe',
      role: role
    })
    
    // Redirect based on role
    if (role === 'farmer') {
      navigate('/dashboard')
    } else {
      navigate('/marketplace')
    }
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '6rem 1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 80px)' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '3rem', position: 'relative', overflow: 'hidden' }}>
        
        {/* Decorative elements */}
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'var(--accent-color)', filter: 'blur(80px)', zIndex: 0, opacity: 0.5 }}></div>
        <div style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: '150px', height: '150px', background: 'var(--success-color)', filter: 'blur(80px)', zIndex: 0, opacity: 0.3 }}></div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <ShieldCheck size={48} color="var(--success-color)" />
            </div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome Back</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Sign in to continue to Farm2City</p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <button 
              onClick={() => setRole('buyer')}
              style={{
                flex: 1, padding: '1rem', borderRadius: '12px', border: '1px solid',
                backgroundColor: role === 'buyer' ? 'rgba(114, 184, 38, 0.2)' : 'var(--glass-bg)',
                borderColor: role === 'buyer' ? 'var(--accent-color)' : 'var(--glass-border)',
                color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', transition: 'all 0.3s'
              }}
            >
              <User size={24} color={role === 'buyer' ? 'var(--accent-color)' : 'var(--text-secondary)'} />
              <span style={{ fontWeight: role === 'buyer' ? 600 : 400 }}>Buyer</span>
            </button>
            <button 
              onClick={() => setRole('farmer')}
              style={{
                flex: 1, padding: '1rem', borderRadius: '12px', border: '1px solid',
                backgroundColor: role === 'farmer' ? 'rgba(16, 185, 129, 0.2)' : 'var(--glass-bg)',
                borderColor: role === 'farmer' ? 'var(--success-color)' : 'var(--glass-border)',
                color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', transition: 'all 0.3s'
              }}
            >
              <Tractor size={24} color={role === 'farmer' ? 'var(--success-color)' : 'var(--text-secondary)'} />
              <span style={{ fontWeight: role === 'farmer' ? 600 : 400 }}>Farmer</span>
            </button>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Email Address</label>
              <input type="email" required placeholder="name@example.com" style={{ width: '100%', padding: '1rem', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }} defaultValue={role === 'farmer' ? 'farmer@greenvalley.com' : 'buyer@example.com'} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Password</label>
              <input type="password" required placeholder="••••••••" defaultValue="password123" style={{ width: '100%', padding: '1rem', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }} />
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', marginTop: '1rem' }}>
              Sign In
            </button>
          </form>
          
          <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            By signing in, you agree to our Terms of Service & Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}
