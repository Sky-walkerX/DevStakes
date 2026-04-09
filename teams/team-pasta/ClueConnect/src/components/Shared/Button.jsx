import React from 'react';
import { motion } from 'framer-motion';

const VARIANT_STYLES = {
  primary: {
    background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 50%, #6d28d9 100%)',
    boxShadow: '0 4px 20px rgba(124,58,237,0.45), inset 0 1px 0 rgba(255,255,255,0.15)',
    color: '#fff',
    border: 'none',
  },
  secondary: {
    background: 'rgba(255,255,255,0.04)',
    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)',
    color: '#94a3b8',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  ghost: {
    background: 'rgba(255,255,255,0.03)',
    boxShadow: 'none',
    color: 'rgba(255,255,255,0.45)',
    border: '1px solid rgba(255,255,255,0.07)',
  },
  danger: {
    background: 'linear-gradient(135deg, #b91c1c 0%, #ef4444 100%)',
    boxShadow: '0 4px 20px rgba(239,68,68,0.35), inset 0 1px 0 rgba(255,255,255,0.15)',
    color: '#fff',
    border: 'none',
  },
  outline: {
    background: 'rgba(255,255,255,0.02)',
    boxShadow: 'none',
    color: '#a78bfa',
    border: '1px solid rgba(139,92,246,0.3)',
  },
};

const SIZE_STYLES = {
  sm: { padding: '7px 14px', fontSize: 12, borderRadius: 8, gap: 6 },
  md: { padding: '10px 20px', fontSize: 13, borderRadius: 10, gap: 8 },
  lg: { padding: '14px 28px', fontSize: 14, borderRadius: 12, gap: 10 },
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  icon,
  ...props
}) {
  const vs = VARIANT_STYLES[variant] || VARIANT_STYLES.primary;
  const ss = SIZE_STYLES[size] || SIZE_STYLES.md;

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.025, y: -1 }}
      whileTap={disabled ? {} : { scale: 0.975, y: 0 }}
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
        position: 'relative', overflow: 'hidden',
        opacity: disabled ? 0.45 : 1,
        transition: 'opacity 0.2s, box-shadow 0.2s',
        ...vs, ...ss,
      }}
      {...props}
    >
      {/* Sheen sweep on hover */}
      <motion.div
        initial={{ x: '-100%' }}
        whileHover={{ x: '200%' }}
        transition={{ duration: 0.55, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: 0, left: 0,
          width: '50%', height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
          pointerEvents: 'none',
        }}
      />
      {icon && <span style={{ fontSize: '1.1em' }}>{icon}</span>}
      {children}
    </motion.button>
  );
}