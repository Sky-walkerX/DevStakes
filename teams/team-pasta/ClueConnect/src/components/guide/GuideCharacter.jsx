import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { Sparkles, GripVertical } from 'lucide-react';
import { useGuideStore } from '../../store/guideStore';
import { useGameStore } from '../../store/gameStore';
import { GuideDialog } from './GuideDialog';

export const GuideCharacter = () => {
  const { isOpen, isDormant, openTutorial, agentSpeak, startBriefing } = useGuideStore();
  const { gamePhase, currentCase } = useGameStore();
  const dragControls = useDragControls();
  const constraintsRef = useRef(null);

  useEffect(() => {
    if (gamePhase === 'briefing' && currentCase) {
      startBriefing(currentCase);
    } else if (gamePhase === 'playing') {
      agentSpeak('The clock is ticking! Start dragging evidence onto the board.');
    } else if (gamePhase === 'accusing') {
      agentSpeak('You think you got them? Make sure the connections are solid!');
    } else if (gamePhase === 'result') {
      agentSpeak("Let's see how we did!");
    }
  }, [gamePhase, currentCase, startBriefing, agentSpeak]);

  return (
    <>
      {/* Full-screen invisible drag constraint area */}
      <div
        ref={constraintsRef}
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 49,
        }}
      />

      <AnimatePresence>
        {(isOpen || isDormant) && (
          <motion.div
            drag
            dragControls={dragControls}
            dragMomentum={false}
            dragElastic={0.08}
            dragConstraints={constraintsRef}
            initial={{ opacity: 0, scale: 0.7, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 30 }}
            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
            style={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 50,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-end',
              gap: 12,
              cursor: 'default',
              userSelect: 'none',
              touchAction: 'none',
            }}
          >
            {/* Dialog box */}
            <AnimatePresence>
              {isOpen && !isDormant && (
                <div className="guide-dialog-outer">
                  <GuideDialog />
                </div>
              )}
            </AnimatePresence>

            {/* Avatar + drag handle column */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>

              {/* Drag handle pill — drag from here */}
              <motion.div
                onPointerDown={(e) => dragControls.start(e)}
                whileHover={{ opacity: 1, scale: 1.1 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 18,
                  borderRadius: 99,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  cursor: 'grab',
                  opacity: 0.5,
                  transition: 'opacity 0.2s',
                }}
                title="Drag to move"
              >
                <GripVertical size={12} style={{ color: 'rgba(255,255,255,0.5)', transform: 'rotate(90deg)' }} />
              </motion.div>

              {/* Avatar button */}
              <motion.button
                onClick={isDormant ? openTutorial : undefined}
                animate={{
                  scale: isDormant ? 0.7 : 1,
                  opacity: 1,
                }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className={`gc-btn-active ${isDormant ? 'gc-btn-dormant' : 'gc-btn-playing animate-float'}`}
                style={{ cursor: isDormant ? 'pointer' : 'default' }}
              >
                {/* Glow rings */}
                <div className="gc-ping" />
                <div className={`gc-blur ${isOpen ? 'opacity-100' : 'opacity-0'}`} />

                {/* Character */}
                <div className="gc-avatar-box">
                  <img
                    src="/agent.png"
                    alt="Agent Assistant"
                    className="gc-img"
                    draggable={false}
                  />
                  <div className="gc-gradient-overlay" />

                  {!isDormant && (
                    <motion.div
                      className="gc-sparkles"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                    >
                      <Sparkles size={14} />
                    </motion.div>
                  )}
                </div>

                {isDormant && (
                  <div className="gc-prompt">Call Assistant</div>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};