import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import styles from './Home.module.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <motion.h1 
          className={styles.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Forge Your<br />
          <span className="heading-purple" style={{ fontStyle: 'italic' }}>Narrative</span>
        </motion.h1>
        
        <motion.p 
          className={styles.subtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Step into an infinite loom of possibilities where every choice weaves<br />
          a new destiny in the digital grimoire.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Button 
            variant="primary" 
            onClick={() => navigate('/destiny')}
            style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}
          >
            Start Story
          </Button>
        </motion.div>
      </header>

      <section className={styles.features}>
        <Card 
          tag="ARTIFICIAL INTELLIGENCE"
          title="AI-Driven Plot Lines"
          description="Our Weaver engine synthesizes complex narrative structures in real-time, responding to the nuance of your intent rather than rigid scripts."
          delay={0.2}
        />
        
        <Card 
          tag="CORE MECHANICS"
          title="Dynamic Decisions"
          description="Every choice ripples through the chronology, altering character loyalties and the world's state forever."
          delay={0.4}
        />
        
        <Card 
          tag="INFINITE REPLAYABILITY"
          title="Unique Paths"
          description="No two chronicles are ever the same. Your journey is algorithmically unique, creating a legacy that belongs solely to you."
          delay={0.6}
          className={styles.wideCard}
        >
          <div className={styles.tagsContainer}>
            <span className={styles.featureTag}>PROCEDURAL LORE</span>
            <span className={styles.featureTag}>NON-LINEAR DESIGN</span>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default Home;