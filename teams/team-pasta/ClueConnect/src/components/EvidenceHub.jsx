import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, Clock, ChevronRight, Fingerprint, Image, FileText, Users } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { useGameLogic } from '../hooks/useGameLogic';
import { Button } from './Shared/Button';

const TABS = [
  { id: 'evidence', label: 'Evidence', icon: Fingerprint },
  { id: 'photos',   label: 'Photos',   icon: Image },
  { id: 'timeline', label: 'Timeline', icon: Clock },
  { id: 'suspects', label: 'Suspects', icon: Users },
];

export function EvidenceHub() {
  const { currentCase, discoveredEvidenceIds, activeEvidenceTab, setActiveEvidenceTab, addEvidenceToBoard, boardItems } =
    useGameStore();
  const { handleEvidenceClick } = useGameLogic();
  const [expandedId, setExpandedId] = useState(null);

  if (!currentCase) return null;

  const allEvidence = currentCase.evidence;

  const visibleEvidence =
    activeEvidenceTab === 'evidence' ? allEvidence :
    activeEvidenceTab === 'photos'   ? allEvidence.filter(e => e.type === 'photo') :
    allEvidence;

  const onBoardIds = new Set(boardItems.map(b => b.evidenceId));

  return (
    <div className="hub-container">
      {/* Hub Header */}
      <div className="hub-header">
        <h3 className="hub-title">
          <span className="hub-title-dot pulse-glow"></span>
          Evidence Hub
        </h3>
        <p className="hub-subtitle">
          {discoveredEvidenceIds.length}/{allEvidence.length} items discovered
        </p>
      </div>

      {/* Tabs */}
      <div className="hub-tabs">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeEvidenceTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveEvidenceTab(tab.id)}
              className={`hub-tab ${isActive ? 'active' : ''}`}
            >
              <Icon size={13} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="hub-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeEvidenceTab}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.18 }}
          >
            {activeEvidenceTab === 'timeline' ? (
              <TimelineView timeline={currentCase.timeline} suspects={currentCase.suspects} />
            ) : activeEvidenceTab === 'suspects' ? (
              <SuspectMiniList suspects={currentCase.suspects} />
            ) : (
              <EvidenceList
                evidence={visibleEvidence}
                discoveredIds={discoveredEvidenceIds}
                onBoardIds={onBoardIds}
                expandedId={expandedId}
                setExpandedId={setExpandedId}
                onDiscover={handleEvidenceClick}
                onAddToBoard={addEvidenceToBoard}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Evidence List ────────────────────────────────────────────────────────────

function EvidenceList({ evidence, discoveredIds, onBoardIds, expandedId, setExpandedId, onDiscover, onAddToBoard }) {
  return (
    <div className="evidence-list-spaced">
      {evidence.map((item, i) => {
        const isDiscovered = discoveredIds.includes(item.id);
        const isExpanded   = expandedId === item.id;
        const onBoard      = onBoardIds.has(item.id);

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`evidence-item-card ${isDiscovered ? 'discovered' : 'locked'}`}
          >
            {/* Evidence card header */}
            <button
              onClick={() => {
                if (!isDiscovered) {
                  onDiscover(item.id);
                } else {
                  setExpandedId(isExpanded ? null : item.id);
                }
              }}
              className="evidence-item-btn"
            >
              <div className={`evidence-icon-bg ${isDiscovered ? 'discovered' : 'locked'}`}>
                {isDiscovered ? item.icon : <Lock size={14} className="locked-icon" />}
              </div>
              <div className="evidence-item-info">
                <div className="evidence-item-title-row">
                  <span className={`evidence-item-title ${isDiscovered ? 'discovered' : 'locked'}`}>
                    {isDiscovered ? item.title : '??? Locked'}
                  </span>
                  {isDiscovered && (
                    <TypeBadge type={item.type} />
                  )}
                </div>
                {isDiscovered && (
                  <p className="evidence-item-desc">{item.description}</p>
                )}
              </div>
              <ChevronRight
                size={12}
                className={`evidence-item-arrow ${isExpanded ? 'expanded' : ''}`}
              />
            </button>

            {/* Expanded detail */}
            <AnimatePresence>
              {isExpanded && isDiscovered && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="evidence-expanded-content"
                >
                  <p className="evidence-expanded-desc">
                    {item.description}
                  </p>
                  {!onBoard ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onAddToBoard(item.id)}
                      className="w-full text-xs"
                      icon={<Eye size={11} />}
                    >
                      Pin to Board
                    </Button>
                  ) : (
                    <div className="evidence-onboard">
                      <span className="onboard-dot animate-pulse"></span>
                      On Investigation Board
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

// ── Timeline ─────────────────────────────────────────────────────────────────

function TimelineView({ timeline, suspects }) {
  return (
    <div className="timeline-list-spaced">
      {timeline.map((event, i) => {
        const suspect = suspects.find(s => s.id === event.suspect);
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="timeline-item"
          >
            {/* Timeline spine */}
            <div className="timeline-spine">
              <div className="timeline-dot"></div>
              {i < timeline.length - 1 && (
                <div className="timeline-line"></div>
              )}
            </div>

            <div className="timeline-content">
              <div className="timeline-header">
                <span className="timeline-time">{event.time}</span>
                {suspect && (
                  <span className="timeline-suspect-badge">
                    {suspect.name}
                  </span>
                )}
              </div>
              <p className="timeline-event-text">{event.event}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ── Suspect Mini List ─────────────────────────────────────────────────────────

function SuspectMiniList({ suspects }) {
  return (
    <div className="suspect-mini-list-spaced">
      {suspects.map((s, i) => (
        <motion.div
          key={s.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="suspect-mini-card"
          style={{ borderLeftColor: s.color, borderLeftWidth: 2 }}
        >
          <div className="suspect-mini-header">
            <span className="suspect-mini-photo">{s.photo}</span>
            <div className="suspect-mini-info">
              <div className="suspect-mini-name">{s.name}</div>
              <div className="suspect-mini-occupation">{s.occupation}</div>
            </div>
          </div>
          <p className="suspect-mini-alibi">{s.alibi}</p>
        </motion.div>
      ))}
    </div>
  );
}

// ── Type Badge ────────────────────────────────────────────────────────────────

function TypeBadge({ type }) {
  const badgeClass = `badge type-${type}`;
  return (
    <span className={badgeClass}>
      {type}
    </span>
  );
}
