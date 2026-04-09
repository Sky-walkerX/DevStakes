import React from 'react';
import { motion } from 'framer-motion';
import { useTimer } from '../../hooks/useTimer';

export function Timer() {
  const { timeRemaining, formatTime, urgencyLevel } = useTimer();

  const isCritical = urgencyLevel === 'critical';
  const isWarning  = urgencyLevel === 'warning';

  const timerStyles = isCritical
    ? { border: '1px solid rgba(239,68,68,0.5)', background: 'rgba(239,68,68,0.1)', color: '#f87171', boxShadow: '0 0 16px rgba(239,68,68,0.2)' }
    : isWarning
    ? { border: '1px solid rgba(245,158,11,0.4)', background: 'rgba(245,158,11,0.08)', color: '#fbbf24' }
    : { border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: '#94a3b8' };

  return (
    <motion.div
      animate={isCritical ? { scale: [1, 1.03, 1] } : { scale: 1 }}
      transition={isCritical ? { repeat: Infinity, duration: 0.7 } : {}}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '7px 14px', borderRadius: 10,
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 14, fontWeight: 700,
        letterSpacing: '0.06em',
        transition: 'all 0.3s',
        minWidth: 90,
        justifyContent: 'center',
        ...timerStyles,
      }}
    >
      <motion.span
        animate={isCritical ? { opacity: [1, 0.3, 1] } : { opacity: 1 }}
        transition={isCritical ? { repeat: Infinity, duration: 0.7 } : {}}
        style={{ fontSize: 13 }}
      >
        ⏱
      </motion.span>
      <span>{formatTime(timeRemaining)}</span>
    </motion.div>
  );
}