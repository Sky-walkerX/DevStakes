import { useState } from 'react'
import { Send, PhoneCall, Video } from 'lucide-react'

export default function Chat() {
  const [messages, setMessages] = useState([
    { text: "Hi, I'm interested in the organic tomatoes.", isMine: true },
    { text: "Hello! They are fresh out of the field today. How many kg do you need?", isMine: false, sender: "Green Valley Farm" },
    { text: "I need around 10 kg. Can we do ₹380 total?", isMine: true }
  ])
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return
    setMessages([...messages, { text: input, isMine: true }])
    setInput('')
    
    // Mock response
    setTimeout(() => {
      setMessages(prev => [...prev, { text: "Sure, I can do ₹380 for 10 kg. I'll update the price for you to checkout.", isMine: false, sender: "Green Valley Farm" }])
    }, 1500)
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem', height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
      
      <div className="glass-panel" style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        
        {/* Contact List Sidebar */}
        <div style={{ width: '300px', borderRight: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Messages</h2>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', cursor: 'pointer' }}>
              <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Green Valley Farm</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Sure, I can do $22 for 10 lbs...
              </div>
            </div>
            {/* Add more mock contacts as needed */}
          </div>
        </div>

        {/* Chat Window */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontWeight: 'bold' }}>GV</span>
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Green Valley Farm</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--success-color)' }}>Online</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)' }}>
              <button style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}><PhoneCall size={20} /></button>
              <button style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}><Video size={20} /></button>
            </div>
          </div>

          <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.isMine ? 'flex-end' : 'flex-start',
                maxWidth: '70%',
              }}>
                {!msg.isMine && <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>{msg.sender}</div>}
                <div style={{
                  padding: '1rem 1.25rem',
                  borderRadius: msg.isMine ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.isMine ? 'var(--accent-color)' : 'rgba(255,255,255,0.1)',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: '1.5rem', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '1rem' }}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..." 
              style={{
                flex: 1,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                padding: '0 1.5rem',
                color: 'white',
                outline: 'none'
              }}
            />
            <button className="btn btn-primary" onClick={handleSend} style={{ padding: '0 1.5rem' }}>
              <Send size={20} />
            </button>
          </div>

        </div>

      </div>
    </div>
  )
}
