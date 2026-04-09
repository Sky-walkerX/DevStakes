import React from 'react';
import { motion } from 'framer-motion';

const COLOR_MAP = {
  purple: { fill: 'linear-gradient(90deg, #7c3aed, #a78bfa)', glow: 'rgba(139,92,246,0.4)', text: '#a78bfa' },
  cyan:   { fill: 'linear-gradient(90deg, #0891b2, #22d3ee)', glow: 'rgba(6,182,212,0.4)',   text: '#22d3ee' },
  red:    { fill: 'linear-gradient(90deg, #b91c1c, #f87171)', glow: 'rgba(239,68,68,0.4)',    text: '#f87171' },
  amber:  { fill: 'linear-gradient(90deg, #b45309, #fbbf24)', glow: 'rgba(245,158,11,0.4)',  text: '#fbbf24' },
  green:  { fill: 'linear-gradient(90deg, #065f46, #34d399)', glow: 'rgba(16,185,129,0.4)',  text: '#34d399' },
};

export function ProgressBar({ value = 0, label, color = 'purple', showPercent = true }) {
  const c = COLOR_MAP[color] || COLOR_MAP.purple;
  const pct = Math.min(100, Math.max(0, value));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}>
      {(label || showPercent) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {label && (
            <span style={{ fontSize: 9, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
              {label}
            </span>
          )}
          {showPercent && (
            <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: c.text }}>
              {Math.round(pct)}%
            </span>
          )}
        </div>
      )}
      <div style={{ position: 'relative', height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            height: '100%',
            borderRadius: 99,
            background: c.fill,
            boxShadow: pct > 5 ? `0 0 8px ${c.glow}` : 'none',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Shimmer sweep */}
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
            style={{ position: 'absolute', top: 0, left: 0, width: '40%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }}
          />
        </motion.div>
      </div>
    </div>
  );
}