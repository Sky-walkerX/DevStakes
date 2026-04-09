import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, ChevronRight } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { Button } from './Shared/Button';

export function DecisionModal() {
  const {
    currentCase,
    gamePhase,
    closeAccuseModal,
    makeAccusation,
    discoveredEvidenceIds,
  } = useGameStore();

  const [selectedSuspectId, setSelectedSuspectId] = useState(null);
  const [confirming, setConfirming] = useState(false);

  if (gamePhase !== 'accusing' || !currentCase) return null;

  const handleAccuse = () => {
    if (!selectedSuspectId) return;
    if (!confirming) {
      setConfirming(true);
      return;
    }
    makeAccusation(selectedSuspectId);
  };

  const handleClose = () => {
    setSelectedSuspectId(null);
    setConfirming(false);
    closeAccuseModal();
  };

  const evidenceCount = discoveredEvidenceIds.length;
  const selectedSuspect = currentCase.suspects.find((s) => s.id === selectedSuspectId);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal-backdrop"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', damping: 24, stiffness: 300 }}
          className="decision-modal"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="modal-header">
            <div>
              <h2 className="modal-title">
                ⚖️ Make Your Accusation
              </h2>
              <p className="modal-subtitle">
                Choose wisely — a wrong accusation loses 500 points.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="modal-close-btn"
            >
              <X size={16} />
            </button>
          </div>

          {/* Evidence summary */}
          <div className="modal-summary">
            <span className="summary-label">Evidence gathered:</span>
            <span className="summary-value summary-purple">{evidenceCount} items</span>
            <span className="summary-dot">·</span>
            <span className="summary-label">Suspects to choose from:</span>
            <span className="summary-value summary-amber">{currentCase.suspects.length}</span>
          </div>

          {/* Suspect selector */}
          <div className="modal-suspect-selector">
            <p className="selector-title">Select the perpetrator:</p>
            <div className="suspect-option-list">
              {currentCase.suspects.map((suspect, i) => {
                const isSelected = selectedSuspectId === suspect.id;
                return (
                  <motion.button
                    key={suspect.id}
                    onClick={() => { setSelectedSuspectId(suspect.id); setConfirming(false); }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className={`suspect-option-card ${isSelected ? 'selected' : ''}`}
                  >
                    <div
                      className="suspect-option-photo"
                      style={{ background: `${suspect.color}20`, border: `1px solid ${suspect.color}35` }}
                    >
                      {suspect.photo}
                    </div>
                    <div className="suspect-option-info">
                      <div className="suspect-option-name">{suspect.name}</div>
                      <div className="suspect-option-occupation">{suspect.occupation} · {suspect.relation}</div>
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="suspect-selected-check"
                      >
                        <ChevronRight size={11} className="check-icon" />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Confirmation warning */}
          <AnimatePresence>
            {confirming && selectedSuspect && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="modal-warning-wrap"
              >
                <div className="modal-warning">
                  <AlertTriangle size={14} className="warning-icon" />
                  <div>
                    <p className="warning-title">Confirm accusation?</p>
                    <p className="warning-desc">
                      You are accusing <strong>{selectedSuspect.name}</strong>. This cannot be undone.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action buttons */}
          <div className="modal-actions flex gap-3">
            <Button variant="ghost" size="md" onClick={handleClose} className="flex-1">
              Back to Investigation
            </Button>
            <Button
              variant="danger"
              size="md"
              onClick={handleAccuse}
              disabled={!selectedSuspectId}
              className="flex-1"
              icon="⚖️"
            >
              {confirming ? 'Confirm Accusation' : 'Accuse Suspect'}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
