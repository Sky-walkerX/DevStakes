import React from 'react';
import { motion } from 'framer-motion';

export function Loading({ text = 'Loading…' }) {
  return (
    <div className="loading-container">
      <motion.div
        className="loading-spinner"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      />
      <p className="loading-text">{text}</p>
    </div>
  );
}
