import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Sparkles, Library } from 'lucide-react';
import styles from './Destiny.module.css';

const realms = [
  {
    id: 'ethereal',
    title: 'The Ethereal Realms',
    description: 'A world of arcane surges and forgotten deities. Where dragons sleep in the ribs of fallen giants...',
    tag: 'ANCIENT LORE',
    btnText: 'START VOYAGE'
  },
  {
    id: 'horizon',
    title: 'Infinite Horizon',
    description: 'Advanced Dyson spheres and sentient algorithms. Venture into the silence of the void where humanity is merely a legacy code.',
    tag: 'VOID ECHOES',
    btnText: 'START VOYAGE'
  },
  {
    id: 'veil',
    title: 'The Veil Below',
    description: 'The shadows have teeth here. Face cosmic dread and psychological terrors that lurk in the gaps of your memory.',
    tag: 'DARK FANTASY',
    btnText: 'ENTER THE DARKNESS'
  },
  {
    id: 'neon',
    title: 'Neon Spires',
    description: 'Chrome veins and corporate conspiracies. In a world of synthetic light, who will you sell your ghost to?',
    tag: 'CYBERPUNK',
    btnText: 'JACK IN'
  },
  {
    id: 'unseen',
    title: 'The Unseen Ledger',
    description: 'Whodunits and noir-drenched puzzles. Every clue is a thread, every truth is a trap waiting to be sprung.',
    tag: 'MYSTERY',
    btnText: 'SOLVE THE ENIGMA'
  }
];

const Destiny = () => {
  const navigate = useNavigate();

  const handleStartStory = (realmId) => {
    navigate('/game');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <motion.h1 
          className={styles.title}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Forge Your <span className="heading-purple" style={{ fontStyle: 'italic' }}>Destiny</span>
        </motion.h1>
        <motion.p 
          className={styles.subtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Select a starting realm to anchor your narrative or weave a custom<br/>reality from the threads of your own imagination.
        </motion.p>
      </header>

      <div className={styles.realmsGrid}>
        {realms.map((realm, index) => (
          <Card 
            key={realm.id}
            tag={realm.tag}
            title={realm.title}
            description={realm.description}
            delay={0.1 * index}
            className={`${styles.realmCard} ${index === 0 ? styles.featuredRealm : ''}`}
            interactive
          >
            <Button 
              variant={index === 0 ? 'primary' : 'secondary'} 
              className={styles.realmBtn}
              onClick={() => handleStartStory(realm.id)}
            >
              {realm.btnText}
            </Button>
          </Card>
        ))}
      </div>

      <motion.section 
        className={styles.seedSection}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <h2 className={styles.seedTitle}>Seed Your Story</h2>
        <p className={styles.seedSubtitle}>Whisper the beginning of a saga to the Forge</p>
        
        <div className={styles.seedBox}>
          <textarea 
            className={styles.seedInput} 
            placeholder="Once, in a kingdom where the sun never set, a lone clockmaker discovered a secret ticking inside a stone..."
            rows={4}
          />
          <div className={styles.seedFooter}>
            <div className={styles.seedActions}>
              <button className={styles.seedActionButton}><Library size={16} /> TONE</button>
              <button className={styles.seedActionButton}><Sparkles size={16} /> CHAOS LEVEL</button>
            </div>
            <Button variant="primary" icon={Sparkles} onClick={() => handleStartStory('custom')}>
              WEAVE NARRATIVE
            </Button>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Destiny;
