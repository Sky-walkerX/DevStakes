import React from 'react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Compass, BookCopy } from 'lucide-react';
import styles from './Chronicles.module.css';

const activeVoyages = [
  {
    id: 'v1',
    title: 'The Neon Bastion',
    description: 'A cyber-arcane fortress hanging on the edge of the void. Your choices currently ripple through the Shadow Sector.',
    tag: 'ACTIVE PHASE IV',
    image: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=600&auto=format&fit=crop',
    icon: Compass
  },
  {
    id: 'v2',
    title: 'Echoes of Sylvaris',
    description: 'The woods are dreaming, and you have just stepped into their nightmare. The first sigil is yours.',
    tag: 'ACTIVE PHASE I',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop',
    icon: Compass
  }
];

const finishedTales = [
  {
    id: 'f1',
    title: 'Sovereign of the Dying Sun',
    description: 'Your reign lasted three cycles. You chose sacrifice over survival, sealing the rift forever.',
    tag: 'GRAND FINALE',
    image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=800&auto=format&fit=crop',
    featured: true
  },
  {
    id: 'f2',
    title: 'Crypt of the Silent King',
    description: 'Ended in failure. The curse remains unbroken.',
    tag: 'ARCHIVE 025'
  },
  {
    id: 'f3',
    title: 'The Cerulean Deep',
    description: 'A peaceful resolution. The treaty was signed.',
    tag: 'ARCHIVE 089'
  },
  {
    id: 'f4',
    title: 'Peaks of the Frost Giants',
    description: 'The summit was reached at a terrible cost.',
    tag: 'ARCHIVE 104'
  },
  {
    id: 'f5',
    title: 'Founding of New Valoria',
    description: 'A new civilization rises from the ashes.',
    tag: 'ARCHIVE 112'
  }
];

const Chronicles = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <motion.h1 
            className={styles.title}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            The Grand Library
          </motion.h1>
          <motion.p 
            className={styles.subtitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Where every echo of your journey is bound in starlight and ink. Relive<br/>
            the tales of past realms or continue your current weaving.
          </motion.p>
        </div>
        
        <div className={styles.statsPanel}>
          <div className={styles.statItem}>
            <span>LIBRARY INTEGRITY</span>
            <div className={styles.statValue}>98.4%</div>
          </div>
          <div className={styles.statItem}>
            <span>LORE POINTS</span>
            <div className={styles.statValue}>12,450</div>
          </div>
        </div>
      </header>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}><Compass size={20} /> ACTIVE VOYAGES</h3>
        <div className={styles.activeGrid}>
          {activeVoyages.map((voyage, index) => (
            <div key={voyage.id} className={styles.activeCardWrapper}>
              <div 
                className={styles.activeImage} 
                style={{ backgroundImage: `url(${voyage.image})` }}
              ></div>
              <Card 
                key={voyage.id}
                tag={voyage.tag}
                title={voyage.title}
                description={voyage.description}
                delay={0.1 * index}
                className={styles.activeCard}
              >
                <div className={styles.cardActions}>
                  <div className={styles.playerTokens}>
                    <div className={styles.token}>AR</div>
                    <div className={styles.token}>KX</div>
                  </div>
                  <Button variant="primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                    RESUME VOYAGE &gt;
                  </Button>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}><BookCopy size={20} /> FINISHED TALES</h3>
        <div className={styles.finishedGrid}>
          {finishedTales.map((tale, index) => (
            <Card 
              key={tale.id}
              tag={tale.tag}
              title={tale.title}
              description={tale.description}
              image={tale.featured ? tale.image : null}
              delay={0.2 + (0.1 * index)}
              className={`${styles.finishedCard} ${tale.featured ? styles.featuredTale : ''}`}
            >
              <div className={styles.footerAction}>
                <Button variant="secondary" className={styles.revisitBtn}>
                  {tale.featured ? 'RELIVE THE LEGEND' : 'REVISIT MEMORIES'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Chronicles;
