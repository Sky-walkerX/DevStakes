import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Shield, User } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { useGameLogic } from '../hooks/useGameLogic';
import { Button } from './Shared/Button';

export function SuspectPanel() {
  const {
    currentCase,
    activeSuspectId,
    discoveredEvidenceIds,
    setActiveSuspect,
    openAccuseModal,
  } = useGameStore();

  const { hasContradiction, contradictionCount } = useGameLogic();

  if (!currentCase) return null;

  const activeSuspect = currentCase.suspects.find((s) => s.id === activeSuspectId);

  return (
    <div className="suspect-panel-container">
      {/* Header */}
      <div className="suspect-panel-header">
        <h3 className="suspect-panel-title">
          <span className="suspect-panel-dot"></span>
          Suspects
        </h3>
        <p className="suspect-panel-subtitle">Click a suspect to examine</p>
      </div>

      {/* Suspect list */}
      <div className="suspect-list-wrap">
        <div className="suspect-list-scroll">
          {currentCase.suspects.map((suspect, i) => {
            const isActive        = activeSuspectId === suspect.id;
            const contradiction   = hasContradiction(suspect.id);
            const contradictions  = contradictionCount(suspect.id);

            return (
              <motion.button
                key={suspect.id}
                onClick={() => setActiveSuspect(suspect.id)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className={`suspect-list-item ${isActive ? 'active' : ''}`}
              >
                <div
                  className="suspect-item-photo"
                  style={{ background: `${suspect.color}18` }}
                >
                  {suspect.photo}
                </div>
                <div className="suspect-item-info">
                  <div className="suspect-item-name-row">
                    <span className="suspect-item-name">{suspect.name}</span>
                    {contradiction && (
                      <motion.span
                        className="suspect-item-alert"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <AlertTriangle size={11} className="alert-icon" />
                      </motion.span>
                    )}
                  </div>
                  <div className="suspect-item-occupation">{suspect.occupation}</div>
                </div>
                {contradictions > 0 && (
                  <span className="suspect-contradiction-badge">
                    {contradictions}⚠
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Active suspect detail */}
      <div className="suspect-detail-wrap">
        <div className="suspect-panel-content">
          {activeSuspect ? (
            <SuspectDetail
              suspect={activeSuspect}
              discoveredEvidenceIds={discoveredEvidenceIds}
              contradictions={contradictionCount(activeSuspect.id)}
              caseEvidence={currentCase.evidence}
            />
          ) : (
            <div className="suspect-detail-empty">
              <User size={30} className="empty-icon" />
              <p className="empty-text">Select a suspect to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Accuse button */}
      <div className="suspect-panel-accuse">
        <Button
          variant="danger"
          size="md"
          className="w-full"
          onClick={openAccuseModal}
          disabled={discoveredEvidenceIds.length < 2}
          icon="⚖️"
        >
          Make Accusation
        </Button>
        {discoveredEvidenceIds.length < 2 && (
          <p className="accuse-hint">
            Discover at least 2 evidence items first
          </p>
        )}
      </div>
    </div>
  );
}

// ── Suspect Detail Panel ─────────────────────────────────────────────────────

function SuspectDetail({ suspect, discoveredEvidenceIds, contradictions, caseEvidence }) {
  const contraItems = caseEvidence.filter(
    (e) => suspect.contradictions?.includes(e.id) && discoveredEvidenceIds.includes(e.id)
  );

  return (
    <motion.div
      key={suspect.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="suspect-detail-section"
    >
      {/* Suspect card */}
      <div
        className="detail-card"
        style={{ borderTopColor: suspect.color, borderTopWidth: 2 }}
      >
        <div className="detail-header">
          <div className="detail-photo">{suspect.photo}</div>
          <div>
            <div className="detail-name">{suspect.name}</div>
            <div className="detail-meta">{suspect.age} yrs · {suspect.relation}</div>
          </div>
        </div>

        <InfoRow label="Occupation">{suspect.occupation}</InfoRow>

        <div className="detail-block">
          <div className="detail-block-title">
            <Shield size={9} /> Alibi
          </div>
          <p className="detail-alibi">
            "{suspect.alibi}"
          </p>
        </div>

        <div className="detail-block">
          <div className="detail-block-title">Motive</div>
          <p className="detail-motive">{suspect.motive}</p>
        </div>
      </div>

      {/* Contradictions */}
      {contraItems.length > 0 && (
        <div className="contra-list">
          <div className="contra-title">
            <AlertTriangle size={10} />
            Alibi Contradictions Found
          </div>
          {contraItems.map((e) => (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              className="contra-item"
            >
              <div className="contra-item-header">
                <span className="contra-icon">{e.icon}</span>
                <span className="contra-name">{e.title}</span>
              </div>
              <p className="contra-desc">{e.description}</p>
            </motion.div>
          ))}
        </div>
      )}

      {contradictions === 0 && (
        <div className="contra-empty">
          <Shield size={20} className="contra-empty-icon" />
          <p className="contra-empty-title">No contradictions found yet</p>
          <p className="contra-empty-desc">Discover more evidence to expose inconsistencies</p>
        </div>
      )}
    </motion.div>
  );
}

function InfoRow({ label, children }) {
  return (
    <div className="info-row">
      <span className="info-label">{label}:</span>
      <span className="info-value">{children}</span>
    </div>
  );
}
