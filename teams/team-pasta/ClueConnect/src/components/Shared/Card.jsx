import React from 'react';
import { motion } from 'framer-motion';

export function Card({ children, className = '', hover = false, glow = false, onClick }) {
  const cardClass = `glass-card card-padded ${glow ? 'glow-purple' : ''} ${onClick ? 'cursor-pointer' : ''} ${className}`;
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -2 } : {}}
      onClick={onClick}
      className={cardClass}
    >
      {children}
    </motion.div>
  );
}
