import { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send, Bot } from 'lucide-react'
import axios from 'axios'

const API = 'http://localhost:8000'

const SUGGESTIONS = [
  'What should I grow in black soil in monsoon?',
  'What is the price of tomatoes?',
  'Give me farming tips',
  'How do I use the platform?',
]

export default function AIChatbot() {
  const [isOpen, setIsOpen]     = useState(false)
  const [messages, setMessages] = useState([
    {
      text: "Hi! 👋 I'm AgriBot, your AI farming assistant. Ask me about crop prices, recommendations, farming tips, or how to use Farm2City!",
      isBot: true,
    },
  ])
  const [input, setInput]       = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef               = useRef(null)

  // Auto-scroll to latest message
  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const sendMessage = async (text) => {
    const query = (text || input).trim()
    if (!query) return

    setMessages(prev => [...prev, { text: query, isBot: false }])
    setInput('')
    setIsTyping(true)

    try {
      const { data } = await axios.post(`${API}/chat`, { query })
      setMessages(prev => [...prev, { text: data.reply, isBot: true }])
    } catch {
      setMessages(prev => [...prev, {
        text: '⚠️ Unable to connect to the AI server. Please make sure the backend is running.',
        isBot: true,
      }])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <>
      {/* Floating toggle button */}
      <button
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        onClick={() => setIsOpen(o => !o)}
        style={{
          position: 'fixed', bottom: '2rem', right: '2rem',
          borderRadius: '50%', width: 60, height: 60, padding: 0, border: 'none',
          background: 'linear-gradient(135deg,#8b5cf6,#3b82f6)',
          boxShadow: '0 8px 24px rgba(139,92,246,0.5)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, transition: 'transform 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {isOpen ? <X size={26} color="white" /> : <MessageCircle size={26} color="white" />}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div
          className="glass-panel animate-fade-in"
          style={{
            position: 'fixed', bottom: '6rem', right: '2rem',
            width: 370, height: 520,
            display: 'flex', flexDirection: 'column',
            zIndex: 1000, overflow: 'hidden', borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}
        >
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg,#8b5cf6,#3b82f6)',
            padding: '1rem 1.25rem',
            display: 'flex', alignItems: 'center', gap: '0.75rem',
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.2)', borderRadius: '50%',
              width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Bot size={20} color="white" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'white' }}>AgriBot AI</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                Online · ML-powered
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '1.25rem',
            display: 'flex', flexDirection: 'column', gap: '0.75rem',
          }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: msg.isBot ? 'flex-start' : 'flex-end',
                  background: msg.isBot
                    ? 'rgba(255,255,255,0.08)'
                    : 'linear-gradient(135deg,#8b5cf6,#3b82f6)',
                  padding: '0.7rem 1rem',
                  borderRadius: msg.isBot ? '0 12px 12px 12px' : '12px 0 12px 12px',
                  maxWidth: '86%',
                  lineHeight: 1.55,
                  fontSize: '0.88rem',
                  whiteSpace: 'pre-line',
                  color: 'white',
                }}
              >
                {msg.text}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div style={{
                alignSelf: 'flex-start',
                background: 'rgba(255,255,255,0.08)',
                padding: '0.8rem 1rem',
                borderRadius: '0 12px 12px 12px',
                display: 'flex', gap: 4, alignItems: 'center',
              }}>
                {[0, 0.2, 0.4].map((delay, i) => (
                  <span key={i} style={{
                    width: 7, height: 7, borderRadius: '50%', background: '#a78bfa',
                    display: 'inline-block',
                    animation: `bounce 1s ${delay}s infinite`,
                  }} />
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick suggestions (shown when empty) */}
          {messages.length === 1 && (
            <div style={{ padding: '0 1.25rem 0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s)}
                  style={{
                    background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)',
                    borderRadius: '20px', padding: '0.3rem 0.7rem',
                    color: '#c4b5fd', fontSize: '0.75rem', cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{
            padding: '0.75rem 1rem',
            borderTop: '1px solid var(--glass-border)',
            display: 'flex', gap: '0.5rem',
          }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Ask AgriBot…"
              style={{
                flex: 1, background: 'rgba(0,0,0,0.25)', border: '1px solid var(--glass-border)',
                borderRadius: '20px', padding: '0.65rem 1rem', color: 'white', outline: 'none',
                fontSize: '0.9rem',
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isTyping}
              style={{
                background: input.trim() && !isTyping
                  ? 'linear-gradient(135deg,#8b5cf6,#3b82f6)'
                  : 'rgba(255,255,255,0.1)',
                border: 'none', borderRadius: '50%', width: 42, height: 42,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: input.trim() && !isTyping ? 'pointer' : 'default',
                transition: 'background 0.2s', flexShrink: 0,
              }}
            >
              <Send size={18} color="white" style={{ marginLeft: -1 }} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
