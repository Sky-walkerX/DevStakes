import React from 'react';
import { motion } from 'framer-motion';
import styles from './Card.module.css';

const Card = ({ 
  title, 
  description, 
  image, 
  tag, 
  interactive = false,
  onClick,
  children,
  className = '',
  delay = 0
}) => {
  const Component = interactive ? motion.div : motion.div;
  
  return (
    <Component
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`${styles.card} ${interactive ? styles.cardInteractive : ''} ${className}`}
      onClick={interactive ? onClick : undefined}
    >
      {tag && <div className={styles.cardTag}>{tag}</div>}
      
      {image && (
        <div style={{ overflow: 'hidden', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
          <img src={image} alt={title} className={styles.cardImage} />
        </div>
      )}
      
      <div className={styles.cardContent}>
        {title && <h3 className={styles.cardTitle}>{title}</h3>}
        {description && <p className={styles.cardBody}>{description}</p>}
        {children && <div className={styles.cardFooter}>{children}</div>}
      </div>
    </Component>
  );
};

export default Card;
