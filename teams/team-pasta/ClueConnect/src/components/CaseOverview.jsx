import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Clock, User, AlertTriangle, FileText, Shield, Lock } from 'lucide-react';
import { Button } from './Shared/Button';
import { useGameStore } from '../store/gameStore';

export function CaseOverview() {
  const { currentCase, startGame, showBriefing } = useGameStore();
  if (!showBriefing || !currentCase) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(3,5,8,0.92)', backdropFilter: 'blur(20px)' }}
      >
        {/* Atmospheric glow */}
        <div className="overview-spotlight-wrapper">
          <div className="overview-spotlight" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.90, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ type: 'spring', damping: 24, stiffness: 240 }}
          className="overview-modal-wrap"
        >
          {/* Animated border glow */}
          <div className="overview-glow-border" />

          <div className="overview-modal-content">
            {/* Crime tape top edge */}
            <div className="overview-crime-tape" />

            {/* Classification header bar */}
            <div className="overview-classification">
              <div className="class-left">
                <span className="class-pulse-dot" />
                <Lock size={10} style={{ color: '#ef4444', opacity: 0.7 }} />
                <span className="class-title">TOP SECRET · CASE BRIEFING</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="class-id">
                  CASE #{currentCase.id.replace('case-', '').padStart(4, '0')}
                </span>
                <div style={{
                  padding: '2px 8px', borderRadius: 4,
                  background: 'rgba(239,68,68,0.12)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  fontSize: 9, fontFamily: 'JetBrains Mono, monospace',
                  color: '#f87171', letterSpacing: '0.1em', fontWeight: 700,
                }}>
                  CLASSIFIED
                </div>
              </div>
            </div>

            {/* Hero area */}
            <div className="overview-hero">
              {/* Emoji with glow */}
              <motion.div
                animate={{
                  y: [0, -8, 0],
                  filter: [
                    'drop-shadow(0 0 16px rgba(139,92,246,0.4))',
                    'drop-shadow(0 0 48px rgba(139,92,246,0.9))',
                    'drop-shadow(0 0 16px rgba(139,92,246,0.4))',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="overview-emoji"
              >
                {currentCase.emoji}
              </motion.div>

              <h2 className="font-display text-3xl text-white mb-1.5 text-glow-white">
                {currentCase.title.toUpperCase()}
              </h2>
              <p className="text-sm text-slate-500 mb-5">{currentCase.subtitle}</p>

              {/* Meta chips */}
              <div className="overview-meta-chips">
                <MetaBadge icon={<MapPin size={11} />} text={currentCase.location} color="purple" />
                <MetaBadge icon={<Clock size={11} />} text={currentCase.timeOfCrime} color="amber" />
                <MetaBadge icon={<User size={11} />} text={`Victim: ${currentCase.victim}`} color="red" />
              </div>

              {/* Description box — styled as a classified document */}
              <div className="overview-description">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <FileText size={11} style={{ color: 'rgba(139,92,246,0.6)' }} />
                  <span style={{ fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(139,92,246,0.5)', fontFamily: 'JetBrains Mono, monospace' }}>
                    Case Summary
                  </span>
                </div>
                {currentCase.description}
              </div>

              {/* Stat boxes */}
              <div className="overview-stats-grid">
                <StatBox value={currentCase.suspects.length} label="Suspects" color="#8b5cf6" icon="👤" />
                <StatBox value={currentCase.evidence.length} label="Evidence" color="#06b6d4" icon="🔎" />
                <StatBox value={`${Math.floor(currentCase.timeLimit / 60)}m`} label="Time Limit" color="#f59e0b" icon="⏱" />
              </div>

              {/* Warning strip */}
              <div className="overview-warning">
                <AlertTriangle size={14} className="warning-exclamation" />
                <p className="warning-text">
                  A wrong accusation costs <strong style={{ color: '#f87171' }}>500 points</strong>.
                  Gather evidence before naming a suspect.
                </p>
              </div>

              {/* CTA */}
              <Button onClick={startGame} variant="primary" size="lg" className="overview-start-btn" icon="🔍">
                BEGIN INVESTIGATION
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function MetaBadge({ icon, text, color }) {
  return (
    <span className={`meta-badge color-${color}`}>
      {icon}{text}
    </span>
  );
}

function StatBox({ value, label, color, icon }) {
  return (
    <motion.div
      whileHover={{ scale: 1.04, y: -2 }}
      transition={{ type: 'spring', damping: 14 }}
      className="overview-stat-box"
    >
      <div className="stat-box-icon">{icon}</div>
      <div className="stat-box-val" style={{ color }}>{value}</div>
      <div className="stat-box-label">{label}</div>
    </motion.div>
  );
}