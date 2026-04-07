import React from 'react';
import { motion } from 'framer-motion';
import styles from './Button.module.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  icon: Icon, 
  className = '', 
  onClick,
  ...props 
}) => {
  const variantClass = styles[`btn-${variant}`] || styles['btn-primary'];

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`${styles.btn} ${variantClass} ${className}`}
      onClick={onClick}
      {...props}
    >
      {Icon && <Icon size={18} />}
      {children}
    </motion.button>
  );
};

export default Button;
