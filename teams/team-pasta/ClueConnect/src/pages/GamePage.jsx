import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Target, FileText, Radio, Zap } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { useTimer } from '../hooks/useTimer';
import { useGameLogic } from '../hooks/useGameLogic';
import { EvidenceHub } from '../components/EvidenceHub';
import { EvidenceBoardCanvas } from '../components/EvidenceBoardCanvas';
import { SuspectPanel } from '../components/SuspectPanel';
import { CaseOverview } from '../components/CaseOverview';
import { DecisionModal } from '../components/DecisionModal';
import { Timer } from '../components/Shared/Timer';
import { ProgressBar } from '../components/Shared/ProgressBar';
import { Button } from '../components/Shared/Button';

function TimerMount() {
  useTimer();
  return null;
}

export function GamePage() {
  const { currentCase, goHome, openAccuseModal, discoveredEvidenceIds } = useGameStore();
  const { investigationProgress } = useGameLogic();
  const progress = investigationProgress();
  const canAccuse = discoveredEvidenceIds.length >= 2;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-screen flex flex-col overflow-hidden" 
      style={{ background: '#04070f' }}
    >
      <TimerMount />

      {/* ── COMMAND CENTER HEADER ── */}
      <header className="game-header">
        {/* Animated rainbow top glow line */}
        <div className="game-header-glow-line" />

        {/* Scanline overlay on header */}
        <div className="game-header-scanline" />

        {/* LEFT: exit + classification + case name */}
        <div className="game-header-left">
          <motion.button
            whileHover={{ scale: 1.04, x: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={goHome}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-200 border border-white/5 hover:border-white/12 hover:bg-white/4 transition-all"
          >
            <ArrowLeft size={13} />
            <span className="game-exit-text">Case Select</span>
          </motion.button>

          <div className="game-header-divider" />

          {/* LIVE pulse dot */}
          <div className="game-live-chip">
            <span className="game-live-dot" />
            <span>LIVE</span>
          </div>

          <div className="game-header-divider" />

          {/* Case badge */}
          <div className="game-case-badge">
            <div className="game-case-icon">
              <FileText size={11} style={{ color: 'var(--accent-purple)' }} />
            </div>
            <div className="game-case-info">
              <div className="game-case-title">{currentCase?.title?.toUpperCase()}</div>
              <div className="game-case-location">
                <span style={{ color: 'var(--accent-emerald)', marginRight: 4 }}>●</span>
                {currentCase?.location}
              </div>
            </div>
          </div>
        </div>

        {/* CENTRE: investigation progress */}
        <div className="game-header-centre">
          <ProgressBar value={progress} label="Investigation Progress" color="purple" showPercent />
        </div>

        {/* RIGHT: timer + accuse */}
        <div className="game-header-right">
          <Timer />

          <motion.button
            whileHover={canAccuse ? { scale: 1.04 } : {}}
            whileTap={canAccuse ? { scale: 0.96 } : {}}
            onClick={canAccuse ? openAccuseModal : undefined}
            className={`game-accuse-btn ${!canAccuse ? 'disabled' : ''}`}
            title={!canAccuse ? 'Collect at least 2 pieces of evidence first' : 'Make your accusation'}
          >
            <Target size={13} className="accuse-icon" />
            <span className="accuse-text">ACCUSE</span>
            {canAccuse && (
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="accuse-ready-dot"
              />
            )}
          </motion.button>
        </div>
      </header>

      {/* ── 3-PANEL COMMAND CENTER LAYOUT ── */}
      <div className="game-main-content">

        {/* Evidence Hub — Left */}
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.08, type: 'spring', damping: 20 }}
          className="game-panel-side panel game-panel-evidence"
        >
          <div className="panel-top-accent panel-accent-purple" />
          <EvidenceHub />
        </motion.div>

        {/* Canvas — Centre */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.16, type: 'spring', damping: 22 }}
          className="game-panel-centre"
        >
          <EvidenceBoardCanvas />
        </motion.div>

        {/* Suspect Panel — Right */}
        <motion.div
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.08, type: 'spring', damping: 20 }}
          className="game-panel-side panel game-panel-suspects"
        >
          <div className="panel-top-accent panel-accent-red" />
          <SuspectPanel />
        </motion.div>
      </div>

      <CaseOverview />
      <DecisionModal />
    </motion.div>
  );
}