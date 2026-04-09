import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import {
  Mail, Lock, User, ChevronRight, Loader2, AlertCircle, X, ShieldCheck, Eye, EyeOff, Fingerprint
} from 'lucide-react';

/* ─────────────────────────────────────────────
   Tiny animated scanline orb in the header
───────────────────────────────────────────── */
function HeaderOrb() {
  return (
    <motion.div
      style={{
        position: 'relative',
        width: 64,
        height: 64,
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px',
      }}
    >
      {/* Outer spinning ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: '1px solid transparent',
          borderTopColor: 'rgba(139,92,246,0.7)',
          borderRightColor: 'rgba(139,92,246,0.2)',
        }}
      />
      {/* Middle faint ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          inset: 8,
          borderRadius: '50%',
          border: '1px solid transparent',
          borderBottomColor: 'rgba(239,68,68,0.5)',
          borderLeftColor: 'rgba(239,68,68,0.1)',
        }}
      />
      {/* Core glow */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, rgba(139,92,246,0.05) 70%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(139,92,246,0.25)',
        }}
      >
        <ShieldCheck size={18} style={{ color: '#a78bfa' }} strokeWidth={1.5} />
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Styled input field
───────────────────────────────────────────── */
function AuthInput({ icon: Icon, type: initialType, placeholder, value, onChange, required, minLength, autoComplete }) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = initialType === 'password';
  const type = isPassword && showPassword ? 'text' : initialType;

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 14,
        transition: 'all 0.2s',
        background: isFocused
          ? 'rgba(139,92,246,0.06)'
          : 'rgba(255,255,255,0.03)',
        boxShadow: isFocused
          ? 'inset 0 0 0 1px rgba(139,92,246,0.55), 0 0 0 3px rgba(139,92,246,0.08)'
          : 'inset 0 0 0 1px rgba(255,255,255,0.08)',
      }}
    >
      {/* Leading icon */}
      <div
        style={{
          position: 'absolute',
          left: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          color: isFocused ? '#a78bfa' : 'rgba(255,255,255,0.25)',
          transition: 'color 0.2s',
          pointerEvents: 'none',
          display: 'flex',
        }}
      >
        <Icon size={17} strokeWidth={1.8} />
      </div>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        minLength={minLength}
        autoComplete={autoComplete}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          color: '#fff',
          fontSize: 14,
          fontFamily: 'Inter, system-ui, sans-serif',
          letterSpacing: '0.01em',
          padding: isPassword ? '15px 48px 15px 46px' : '15px 16px 15px 46px',
          caretColor: '#a78bfa',
          boxSizing: 'border-box',
        }}
      />

      {/* Show/hide toggle for password */}
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(v => !v)}
          style={{
            position: 'absolute',
            right: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.25)',
            display: 'flex',
            padding: 4,
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}
        >
          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Auth Modal
───────────────────────────────────────────── */
export const Auth = () => {
  const { isAuthModalOpen, closeAuthModal, signIn, signUp } = useAuthStore();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isAuthModalOpen) {
      setTimeout(() => {
        setEmail(''); setPassword(''); setUsername('');
        setError(null); setSuccess(null); setIsLoading(false);
      }, 300);
    }
  }, [isAuthModalOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
        closeAuthModal();
      } else {
        if (!username.trim()) throw new Error('Username is required');
        if (password.length < 6) throw new Error('Password must be at least 6 characters');
        const { error, data } = await signUp(email, password, username);
        if (error) throw error;
        // If email confirmation is required
        if (data?.user && !data.session) {
          setSuccess('✉ Check your email to confirm your account, then log in.');
          setIsLogin(true);
          setPassword('');
        } else {
          closeAuthModal();
        }
      }
    } catch (err) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(v => !v);
    setError(null);
    setSuccess(null);
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          {/* ── Backdrop ── */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeAuthModal}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
            }}
          />

          {/* ── Ambient glow behind modal ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            style={{
              position: 'absolute',
              width: 420,
              height: 420,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />

          {/* ── Modal Card ── */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            style={{
              position: 'relative',
              zIndex: 2,
              width: '100%',
              maxWidth: 400,
              borderRadius: 24,
              overflow: 'hidden',
              background: 'linear-gradient(160deg, rgba(18,10,28,0.96) 0%, rgba(8,6,14,0.98) 100%)',
              boxShadow: `
                0 0 0 1px rgba(139,92,246,0.15),
                0 0 0 1px rgba(255,255,255,0.05),
                0 24px 60px rgba(0,0,0,0.7),
                0 4px 24px rgba(0,0,0,0.5),
                inset 0 1px 0 rgba(255,255,255,0.07)
              `,
            }}
          >
            {/* Scanline texture overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />

            {/* Top purple glow line */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '15%',
                right: '15%',
                height: 1,
                background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.8), transparent)',
                zIndex: 1,
              }}
            />

            {/* Corner accent — top right */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 120,
                height: 120,
                background: 'radial-gradient(circle at top right, rgba(239,68,68,0.06) 0%, transparent 70%)',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />

            {/* Close button */}
            <button
              onClick={closeAuthModal}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                zIndex: 10,
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
              }}
            >
              <X size={16} />
            </button>

            {/* ── Content ── */}
            <div style={{ position: 'relative', zIndex: 2, padding: '36px 32px 32px' }}>

              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <HeaderOrb />

                {/* Case file tag */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 12px',
                    borderRadius: 20,
                    background: 'rgba(139,92,246,0.1)',
                    border: '1px solid rgba(139,92,246,0.25)',
                    marginBottom: 14,
                  }}
                >
                  <Fingerprint size={11} style={{ color: '#a78bfa' }} />
                  <span style={{ fontSize: 11, letterSpacing: '0.12em', color: '#a78bfa', fontWeight: 600, textTransform: 'uppercase' }}>
                    {isLogin ? 'Detective Access' : 'New Recruit'}
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={isLogin ? 'login-head' : 'signup-head'}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h2
                      style={{
                        fontSize: 24,
                        fontWeight: 700,
                        color: '#fff',
                        margin: '0 0 6px',
                        letterSpacing: '-0.02em',
                        lineHeight: 1.2,
                      }}
                    >
                      {isLogin ? 'Access the Files' : 'Join the Investigation'}
                    </h2>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0, lineHeight: 1.6 }}>
                      {isLogin
                        ? 'Enter your credentials to resume your case.'
                        : 'Create an identity to begin your first case.'}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* ── Error Banner ── */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 10,
                        padding: '12px 14px',
                        borderRadius: 12,
                        background: 'rgba(239,68,68,0.08)',
                        border: '1px solid rgba(239,68,68,0.2)',
                      }}
                    >
                      <AlertCircle size={16} style={{ color: '#f87171', flexShrink: 0, marginTop: 1 }} />
                      <p style={{ fontSize: 13, color: '#fca5a5', margin: 0, lineHeight: 1.5 }}>{error}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Success Banner ── */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 10,
                        padding: '12px 14px',
                        borderRadius: 12,
                        background: 'rgba(16,185,129,0.08)',
                        border: '1px solid rgba(16,185,129,0.2)',
                      }}
                    >
                      <ShieldCheck size={16} style={{ color: '#34d399', flexShrink: 0, marginTop: 1 }} />
                      <p style={{ fontSize: 13, color: '#6ee7b7', margin: 0, lineHeight: 1.5 }}>{success}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Form ── */}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                {/* Username (sign up only) */}
                <AnimatePresence initial={false}>
                  {!isLogin && (
                    <motion.div
                      key="username-field"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.22 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ marginBottom: 4 }}>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: 6 }}>
                          Username
                        </label>
                        <AuthInput
                          icon={User}
                          type="text"
                          placeholder="e.g. shadow_detective"
                          value={username}
                          onChange={e => setUsername(e.target.value)}
                          required={!isLogin}
                          autoComplete="username"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email */}
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: 6 }}>
                    Email
                  </label>
                  <AuthInput
                    icon={Mail}
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>

                {/* Password */}
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: 6 }}>
                    Password
                  </label>
                  <AuthInput
                    icon={Lock}
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    minLength={6}
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                  />
                </div>

                {/* Submit */}
                <div style={{ marginTop: 8 }}>
                  <motion.button
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    type="submit"
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      padding: '15px 24px',
                      borderRadius: 14,
                      border: 'none',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      fontSize: 14,
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      color: '#fff',
                      background: isLoading
                        ? 'rgba(139,92,246,0.5)'
                        : 'linear-gradient(135deg, #9333ea 0%, #7c3aed 50%, #6d28d9 100%)',
                      boxShadow: isLoading
                        ? 'none'
                        : '0 4px 20px rgba(124,58,237,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
                      transition: 'all 0.2s',
                      position: 'relative',
                      overflow: 'hidden',
                      fontFamily: 'Inter, system-ui, sans-serif',
                    }}
                  >
                    {/* Sheen animation on hover */}
                    <motion.div
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '200%' }}
                      transition={{ duration: 0.55, ease: 'easeInOut' }}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '50%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
                        pointerEvents: 'none',
                      }}
                    />
                    {isLoading ? (
                      <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                    ) : (
                      <>
                        <span>{isLogin ? 'Access Files' : 'Begin Investigation'}</span>
                        <ChevronRight size={16} style={{ opacity: 0.8 }} />
                      </>
                    )}
                  </motion.button>
                </div>
              </form>

              {/* ── Divider ── */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  margin: '20px 0 16px',
                }}
              >
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>or</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
              </div>

              {/* ── Toggle login/signup ── */}
              <div style={{ textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={switchMode}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 13,
                    color: 'rgba(255,255,255,0.35)',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    transition: 'color 0.2s',
                    lineHeight: 1.6,
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
                >
                  {isLogin ? (
                    <>No account?{' '}
                      <span style={{ color: '#a78bfa', fontWeight: 600 }}>Create one →</span>
                    </>
                  ) : (
                    <>Already have an account?{' '}
                      <span style={{ color: '#a78bfa', fontWeight: 600 }}>Log in →</span>
                    </>
                  )}
                </button>
              </div>

              {/* Footer badge */}
              <div
                style={{
                  marginTop: 24,
                  paddingTop: 16,
                  borderTop: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981', animation: 'pulse 2s infinite' }} />
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  CRIMEFILES · Secure Auth
                </span>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
