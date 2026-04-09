import { useState } from 'react'
import {
  PlusCircle,
  Package as PkgIcon,
  DollarSign,
  Activity,
  Image as ImageIcon,
  Sparkles,
  Droplets,
  Calendar,
  Leaf,
} from 'lucide-react'
import axios from 'axios'
import { products } from '../data/mockData'

const API = 'http://localhost:8000'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('add')

  // ── Add Product state ──────────────────────────────────────────────────────
  const [cropType, setCropType]         = useState('tomatoes')
  const [month, setMonth]               = useState(new Date().getMonth() + 1)
  const [rainfall, setRainfall]         = useState(150)
  const [price, setPrice]               = useState('')
  const [suggestedPrice, setSuggestedPrice] = useState(null)
  const [priceLoading, setPriceLoading] = useState(false)
  const [priceError, setPriceError]     = useState(null)

  // ── Crop Recommendation state ──────────────────────────────────────────────
  const [soilType, setSoilType]         = useState('loamy')
  const [season, setSeason]             = useState('summer')
  const [recommendation, setRecommendation] = useState(null)
  const [recLoading, setRecLoading]     = useState(false)
  const [recError, setRecError]         = useState(null)

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleSuggest = async () => {
    setPriceLoading(true)
    setSuggestedPrice(null)
    setPriceError(null)
    try {
      const { data } = await axios.get(`${API}/predict-price`, {
        params: { category: cropType, month: Number(month), rainfall: Number(rainfall) },
      })
      setSuggestedPrice(data.predicted_price)
    } catch {
      setPriceError('Could not reach the AI server. Is the backend running?')
    } finally {
      setPriceLoading(false)
    }
  }

  const handleRecommend = async () => {
    setRecLoading(true)
    setRecommendation(null)
    setRecError(null)
    try {
      const { data } = await axios.get(`${API}/recommend-crop`, {
        params: { soil: soilType, season },
      })
      setRecommendation(data.recommended_crop)
    } catch {
      setRecError('Could not reach the AI server. Is the backend running?')
    } finally {
      setRecLoading(false)
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem' }}>Farmer Dashboard</h1>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={20} color="var(--success-color)" />
          <span>Status: <strong>Active</strong></span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 3fr', gap: '2rem' }}>

        {/* ── Sidebar ── */}
        <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
          {[
            { key: 'add',    icon: <PlusCircle size={20} />,                          label: 'Add Product' },
            { key: 'manage', icon: <PkgIcon size={20} />,                             label: 'My Products' },
            { key: 'ai',     icon: <Sparkles size={20} color="#b4f177" />,            label: 'AI Insights' },
          ].map(({ key, icon, label }) => (
            <button
              key={key}
              style={activeTab === key ? activeTabStyle : tabStyle}
              onClick={() => setActiveTab(key)}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        <div className="glass-panel" style={{ padding: '2.5rem' }}>

          {/* ── Add Product Tab ── */}
          {activeTab === 'add' && (
            <div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>Add New Product</h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Left column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                  {/* Crop type */}
                  <div className="form-group">
                    <label style={labelStyle}>Crop Type</label>
                    <select value={cropType} onChange={e => setCropType(e.target.value)} style={inputStyle}>
                      {['tomatoes','apples','potatoes','corn','wheat','mangoes','vegetable'].map(c => (
                        <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                      ))}
                    </select>
                  </div>

                  {/* Month + Rainfall */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label style={labelStyle}><Calendar size={14} style={{ marginRight: 4 }} />Month (1–12)</label>
                      <input type="number" min="1" max="12" value={month} onChange={e => setMonth(e.target.value)} style={inputStyle} />
                    </div>
                    <div className="form-group">
                      <label style={labelStyle}><Droplets size={14} style={{ marginRight: 4 }} />Rainfall (mm)</label>
                      <input type="number" value={rainfall} onChange={e => setRainfall(e.target.value)} style={inputStyle} />
                    </div>
                  </div>

                  {/* Price + AI Suggest */}
                  <div className="form-group">
                    <label style={labelStyle}>Price per Unit (₹)</label>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ position: 'relative', flex: 1 }}>
                        <DollarSign size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input
                          type="number"
                          value={price}
                          onChange={e => setPrice(e.target.value)}
                          placeholder="0.00"
                          style={{ ...inputStyle, paddingLeft: '2.5rem' }}
                        />
                      </div>
                      <button
                        className="btn btn-secondary"
                        onClick={handleSuggest}
                        disabled={priceLoading}
                        style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                      >
                        {priceLoading ? (
                          <span style={{ display: 'flex', gap: '3px' }}>
                            <span style={dotStyle}>•</span><span style={{ ...dotStyle, animationDelay: '0.2s' }}>•</span><span style={{ ...dotStyle, animationDelay: '0.4s' }}>•</span>
                          </span>
                        ) : <Sparkles size={16} />}
                        AI Suggest
                      </button>
                    </div>
                  </div>

                  {/* Price result */}
                  {suggestedPrice !== null && (
                    <div className="animate-fade-in" style={suggestBoxStyle}>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>AI Suggested Price</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#b4f177' }}>₹{suggestedPrice} / kg</div>
                      </div>
                      <button
                        onClick={() => setPrice(suggestedPrice)}
                        style={{ background: 'var(--accent-color)', border: 'none', borderRadius: '6px', padding: '0.4rem 0.8rem', color: 'white', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Apply
                      </button>
                    </div>
                  )}
                  {priceError && <div style={errorStyle}>{priceError}</div>}

                  <button className="btn btn-primary" style={{ marginTop: '1rem' }}>Publish Product</button>
                </div>

                {/* Right column — image upload */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <label style={labelStyle}>Upload Image</label>
                  <div style={{ border: '2px dashed var(--glass-border)', borderRadius: '12px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', cursor: 'pointer' }}>
                    <ImageIcon size={48} color="var(--text-secondary)" style={{ marginBottom: '1rem' }} />
                    <p style={{ color: 'var(--text-secondary)' }}>Click or drag image to upload</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── My Products Tab ── */}
          {activeTab === 'manage' && (
            <div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>My Listed Products</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
                    {['Product', 'Category', 'Price', 'Status'].map(h => (
                      <th key={h} style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.slice(0, 4).map((p, i) => (
                    <tr key={i}>
                      <td style={tdStyle}>
                        <img src={p.image} alt={p.name} style={{ width: 40, height: 40, borderRadius: 4, objectFit: 'cover', marginRight: 12 }} />
                        {p.name}
                      </td>
                      <td style={tdStyle}>{p.category}</td>
                      <td style={tdStyle}>₹{p.price.toFixed(2)}</td>
                      <td style={tdStyle}>
                        <span style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--success-color)', padding: '0.25rem 0.5rem', borderRadius: 4, fontSize: '0.8rem' }}>Active</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── AI Insights Tab ── */}
          {activeTab === 'ai' && (
            <div className="animate-fade-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <Leaf size={28} color="#b4f177" />
                <h2 style={{ fontSize: '1.8rem' }}>AI Crop Suggestions</h2>
              </div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Get ML-powered recommendations on what to grow based on your soil type and the current season.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                <div className="form-group">
                  <label style={labelStyle}>Soil Type</label>
                  <select value={soilType} onChange={e => setSoilType(e.target.value)} style={inputStyle}>
                    {['loamy','clay','sandy','alluvial','black','red','laterite'].map(s => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label style={labelStyle}>Season</label>
                  <select value={season} onChange={e => setSeason(e.target.value)} style={inputStyle}>
                    {['summer','winter','monsoon'].map(s => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                className="btn btn-primary"
                onClick={handleRecommend}
                disabled={recLoading}
                style={{ width: '100%', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '1rem' }}
              >
                {recLoading ? 'Analyzing soil data…' : <><Sparkles size={18} /> Get AI Crop Recommendation</>}
              </button>

              {recommendation && (
                <div className="animate-fade-in glass-panel" style={{ padding: '2.5rem', textAlign: 'center', background: 'rgba(114,184,38,0.08)', border: '1px solid #72b826' }}>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Best crop for {soilType} soil · {season}</p>
                  <div style={{ fontSize: '3rem', fontWeight: 800, color: '#b4f177', letterSpacing: '-1px' }}>{recommendation}</div>
                  <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', maxWidth: 380, margin: '1rem auto 0' }}>
                    Our ML model predicts <strong style={{ color: 'white' }}>{recommendation}</strong> will yield
                    the best results and market demand for {soilType} soil during {season}.
                  </p>
                </div>
              )}
              {recError && <div style={errorStyle}>{recError}</div>}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const tabStyle = {
  width: '100%', padding: '1rem', background: 'transparent', border: 'none',
  color: 'var(--text-secondary)', textAlign: 'left', borderRadius: '8px',
  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem',
  fontSize: '1rem', marginBottom: '0.5rem', transition: 'all 0.2s',
}
const activeTabStyle = { ...tabStyle, background: 'rgba(114,184,38,0.15)', color: 'var(--text-primary)' }
const labelStyle = { display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }
const inputStyle = {
  width: '100%', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
  color: 'var(--text-primary)', padding: '0.75rem 1rem', borderRadius: '8px', outline: 'none',
  boxSizing: 'border-box',
}
const tdStyle = {
  padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)',
  display: 'table-cell', verticalAlign: 'middle',
}
const suggestBoxStyle = {
  padding: '1rem 1.25rem', background: 'rgba(114,184,38,0.1)',
  border: '1px solid #72b826', borderRadius: '10px',
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
}
const errorStyle = {
  padding: '0.75rem 1rem', background: 'rgba(239,68,68,0.1)',
  border: '1px solid rgba(239,68,68,0.4)', borderRadius: '8px',
  color: '#fca5a5', fontSize: '0.9rem',
}
const dotStyle = {
  display: 'inline-block',
  animation: 'bounce 1s infinite',
}
