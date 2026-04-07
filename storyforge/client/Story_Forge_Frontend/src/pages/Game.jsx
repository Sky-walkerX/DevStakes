import React from 'react';
import { motion } from 'framer-motion';
import { EyeOff, MessageSquare, PersonStanding } from 'lucide-react';
import Button from '../components/ui/Button';
import styles from './Game.module.css';

const Game = () => {
  return (
    <div className={styles.layout}>
      {/* Sidebar Navigation */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarSection}>
          <h4 className={styles.sidebarTitle}>CURRENT PATH</h4>
          <ul className={styles.pathList}>
            <li className={`${styles.pathItem} ${styles.pathCompleted}`}>
              <div className={styles.pathNode}></div>
              <p>ACT I: THE AWAKENING</p>
              <span>Accepted the stranger's offer at the Crossroads.</span>
            </li>
            <li className={`${styles.pathItem} ${styles.pathCompleted}`}>
              <div className={styles.pathNode}></div>
              <p>ACT I: THE OUTSKIRTS</p>
              <span>Bypassed the Obsidian Gates via the sewer tunnels.</span>
            </li>
            <li className={`${styles.pathItem} ${styles.pathCurrent}`}>
              <div className={styles.pathNode}></div>
              <p>CURRENT CHAPTER</p>
              <span>Standing before the Iron Citadel at midnight.</span>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main Reading Area */}
      <main className={styles.mainContent}>
        <motion.div 
          className={styles.storyContainer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className={styles.locationHeader}>
            <div className={styles.locationImagePlaceholder}>
              <span className={styles.locationTag}>LOCATION: IRON CITADEL</span>
            </div>
            <h1 className={styles.chapterTitle}>The Shadow<br/>of the Spires</h1>
          </div>

          <div className={styles.storyText}>
            <p>
              <span className={styles.dropCap}>T</span>he Iron Citadel loomed over you like a jagged tooth against the bleeding violet sky. Rain, slick with the metallic scent of old magic, began to fall, sizzling as it struck the glowing runes carved into the fortress walls. Somewhere within these monoliths lies the Arcanum, and with it, the truth of your lineage.
            </p>
            <p>
              Two guards stand motionless at the main portcullis, their armor etched with the sigil of the Void-Watchers. They do not breathe, their presence more spectral than physical. To the east, a narrow drainage grate might offer a stealthier entry, though the ichor dripping from it smells of ancient decay.
            </p>
          </div>

          <div className={styles.actionButtons}>
            <Button variant="secondary" icon={EyeOff} className={styles.actionBtn}>
              INFILTRATE THE CITADEL
            </Button>
            <Button variant="secondary" icon={MessageSquare} className={styles.actionBtn}>
              NEGOTIATE WITH THE GUARD
            </Button>
            <Button variant="secondary" icon={PersonStanding} className={styles.actionBtn}>
              RETREAT TO THE SHADOWS
            </Button>
          </div>
        </motion.div>
      </main>

      {/* Right Properties Panel */}
      <aside className={styles.propertiesPanel}>
        <div className={styles.panelSection}>
          <h4 className={styles.sidebarTitle}>KNOWN ENTITIES</h4>
          <div className={styles.entityCard}>
            <div className={styles.entityAvatar}></div>
            <div className={styles.entityInfo}>
              <h5>Elowen the Scribe</h5>
              <span>ALLY • TIER II</span>
            </div>
          </div>
          <div className={`${styles.entityCard} ${styles.entityUnknown}`}>
            <div className={styles.entityAvatar}>?</div>
            <div className={styles.entityInfo}>
              <h5>The Architect</h5>
              <span>UNKNOWN</span>
            </div>
          </div>
        </div>

        <div className={styles.panelSection}>
          <h4 className={styles.sidebarTitle}>ARTIFACTS</h4>
          <div className={styles.artifactsGrid}>
            <div className={styles.artifactSlot}>SUNSTONE SHARD</div>
            <div className={styles.artifactSlot}>SEWER KEY</div>
            <div className={`${styles.artifactSlot} ${styles.artifactEmpty}`}>+</div>
            <div className={`${styles.artifactSlot} ${styles.artifactEmpty}`}>+</div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Game;
