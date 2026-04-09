import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Shield, Clock, ChevronRight, Zap, Eye, Lock, Star, Search, AlertTriangle, FileText, Trophy, CheckCircle, RefreshCw, X } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { useAuthStore } from '../store/authStore';
import { CASES } from '../data/cases';
import { ProfileBadge } from '../components/ProfileBadge';
import '../leaderboard.css';

const DIFFICULTY_META = {
  Beginner:     { color: '#10b981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.25)', label: '● BEGINNER' },
  Intermediate: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', label: '●● INTERMEDIATE' },
  Hard:         { color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.25)',  label: '●●● HARD' },
};

const SORTED_CASES = [...CASES].sort((a, b) => {
  const diffOrder = { 'Beginner': 0, 'Intermediate': 1, 'Hard': 2 };
  const orderA = diffOrder[a.difficulty] ?? 99;
  const orderB = diffOrder[b.difficulty] ?? 99;
  return orderA - orderB;
});

const TICKER_ITEMS = [
  '🔍 NEW CASE UNLOCKED', '⚠ EVIDENCE CLASSIFIED', '🚨 ACTIVE INVESTIGATION',
  '📡 SIGNAL INTERCEPTED', '🔒 FILE ENCRYPTED', '⚖ JUSTICE PENDING',
  '🧪 LAB RESULTS IN', '📷 SURVEILLANCE ACTIVE', '🔍 NEW CASE UNLOCKED',
  '⚠ EVIDENCE CLASSIFIED', '🚨 ACTIVE INVESTIGATION', '📡 SIGNAL INTERCEPTED',
];

/* ── Cursor-following spotlight ── */
function CursorSpotlight() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 80, damping: 25 });
  const springY = useSpring(y, { stiffness: 80, damping: 25 });

  useEffect(() => {
    const move = (e) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: 600,
        height: 600,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 1,
        x: useTransform(springX, v => v - 300),
        y: useTransform(springY, v => v - 300),
        translateX: 0,
        translateY: 0,
      }}
    />
  );
}

export function HomePage() {
  const { selectCase, replayCase, goLeaderboard, solvedCaseIds } = useGameStore();
  const { user, openAuthModal } = useAuthStore();
  const [hoveredCase, setHoveredCase] = useState(null);
  const [alreadySolvedCase, setAlreadySolvedCase] = useState(null);
  const heroRef = useRef(null);
  const scrollRef = useRef(null);

  // Mouse drag-to-scroll
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const scrollStartX = useRef(0);

  const totalEvidence = SORTED_CASES.reduce((acc, c) => acc + c.evidence.length, 0);
  const totalSuspects = SORTED_CASES.reduce((acc, c) => acc + c.suspects.length, 0);

  const onMouseDown = (e) => {
    isDragging.current = true;
    dragStartX.current = e.pageX;
    scrollStartX.current = scrollRef.current.scrollLeft;
    scrollRef.current.style.cursor = 'grabbing';
  };
  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const dx = e.pageX - dragStartX.current;
    scrollRef.current.scrollLeft = scrollStartX.current - dx;
  };
  const onMouseUp = () => {
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = 'grab';
  };

  const getIsCaseLocked = (caseData) => {
    if (caseData.difficulty === 'Beginner') return false;

    const beginnerSolved = SORTED_CASES.filter(c => c.difficulty === 'Beginner' && solvedCaseIds.includes(c.id)).length;
    const totalBeginner = SORTED_CASES.filter(c => c.difficulty === 'Beginner').length;
    
    if (beginnerSolved < totalBeginner) return true;

    const intermediateSolved = SORTED_CASES.filter(c => c.difficulty === 'Intermediate' && solvedCaseIds.includes(c.id)).length;
    const totalIntermediate = SORTED_CASES.filter(c => c.difficulty === 'Intermediate').length;

    if (caseData.difficulty === 'Intermediate') {
      const index = SORTED_CASES.filter(c => c.difficulty === 'Intermediate').findIndex(c => c.id === caseData.id);
      return index > intermediateSolved;
    }

    if (caseData.difficulty === 'Hard') {
      if (intermediateSolved < totalIntermediate) return true;
      const index = SORTED_CASES.filter(c => c.difficulty === 'Hard').findIndex(c => c.id === caseData.id);
      return index > SORTED_CASES.filter(c => c.difficulty === 'Hard' && solvedCaseIds.includes(c.id)).length;
    }

    return true;
  };

  const handleSelectCase = (caseId) => {
    if (!user) {
      openAuthModal();
      return;
    }

    const targetCase = SORTED_CASES.find((c) => c.id === caseId);
    if (getIsCaseLocked(targetCase)) return;

    if (solvedCaseIds.includes(caseId)) {
      setAlreadySolvedCase(targetCase);
      return;
    }
    selectCase(caseId);
  };

  const handleReplayConfirm = () => {
    if (!alreadySolvedCase) return;
    replayCase(alreadySolvedCase.id);
    setAlreadySolvedCase(null);
  };

  const handleReplayCancel = () => setAlreadySolvedCase(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col relative overflow-hidden bg-[#030508]"
    >

      {/* ── ALREADY SOLVED MODAL ── */}
      <AlreadySolvedModal
        caseData={alreadySolvedCase}
        onConfirm={handleReplayConfirm}
        onCancel={handleReplayCancel}
      />

      {/* ── CURSOR GLOW ── */}
      <CursorSpotlight />

      {/* ── ATMOSPHERIC BG LAYERS ── */}
      <AtmosphericBackground />

      {/* ── BLOOD MARKS ── */}
      <BloodMarks />

      {/* ── CRIME TICKER TAPE (top) ── */}
      <div className="relative z-20 w-full overflow-hidden border-b border-amber-500/15 bg-amber-500/3 py-1.5">
        <div className="ticker-wrap">
          <div className="ticker-inner">
            {TICKER_ITEMS.map((item, i) => (
              <span key={i} className="inline-flex items-center gap-2 mx-8 text-[10px] font-mono font-semibold text-amber-400/70 tracking-widest uppercase">
                {item}
                <span className="w-1 h-1 rounded-full bg-amber-500/40 mx-2"></span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── HEADER ── */}
      <header className="relative z-20 flex items-center justify-between px-8 py-5">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, type: 'spring', damping: 20 }}
          className="header-brand"
        >
          <div style={{ position: 'relative' }}>
            <div className="header-logo-badge glow-purple">
              <Shield size={18} style={{ color: "var(--accent-purple)" }} />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#030508] animate-pulse"></span>
          </div>
          <div>
            <div className="text-sm font-bold text-white tracking-widest font-crime">ClueConnect</div>
            <div className="text-[9px] text-purple-400/60 font-mono tracking-[0.25em] uppercase">Detective Simulator</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, type: 'spring', damping: 20 }}
          style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
        >
          <ProfileBadge />

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={goLeaderboard}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '9px 18px', borderRadius: 10,
              background: 'rgba(251,191,36,0.08)',
              border: '1px solid rgba(251,191,36,0.22)',
              color: '#fbbf24', cursor: 'pointer',
              fontSize: 13, fontWeight: 700,
              fontFamily: 'JetBrains Mono, monospace',
              letterSpacing: '0.06em',
            }}
          >
            <Trophy size={14} />
            <span className="hidden-sm-down">LEADERBOARD</span>
          </motion.button>

          <div className="status-chip live hidden-sm-down">
            <span className="status-dot"></span>
            <span>LIVE</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/4 border border-white/8">
            <Zap size={13} className="text-amber-400" />
            <span className="text-[11px] text-slate-400 font-semibold">Dev Stakes Edition</span>
          </div>
        </motion.div>
      </header>

      {/* ── HERO SECTION ── */}
      <section ref={heroRef} className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-8 pb-12 hero-grid">

        {/* Decorative rings — now more visible */}
        <div className="hero-rings">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="hero-ring-inner"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
            className="hero-ring-outer"
          />
          {/* Extra inner ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute',
              width: 280,
              height: 280,
              borderRadius: '50%',
              border: '1px dashed rgba(239,68,68,0.07)',
            }}
          />
        </div>

        {/* Case file badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hero-badge"
        >
          <span className="hero-badge-pulse"></span>
          <span>Interactive Case Files · {SORTED_CASES.length} Active Investigations</span>
        </motion.div>

        {/* Main title */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="hero-title"
        >
          {/* Glowing magnifier emoji */}
          <motion.div
            animate={{
              y: [0, -8, 0],
              filter: [
                'drop-shadow(0 0 16px rgba(139,92,246,0.3))',
                'drop-shadow(0 0 40px rgba(139,92,246,0.9))',
                'drop-shadow(0 0 16px rgba(139,92,246,0.3))',
              ],
            }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            className="hero-emoji"
          >
            🔍
          </motion.div>

          <h1 className="font-crime text-[72px] md:text-[96px] leading-none tracking-tight mb-4">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, type: 'spring', damping: 18 }}
              className="title-word shimmer-text"
            >
              CLUE
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, type: 'spring', damping: 18 }}
              className="title-word text-glow-white"
              style={{ color: '#fff' }}
            >
              CONNECT
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="hero-subtitle"
          >
            Analyse evidence. Expose contradictions.
            <span className="text-purple-300"> Name the culprit</span> before time runs out.
          </motion.p>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="hero-stats"
        >
          {[
            { value: SORTED_CASES.length.toString(), label: 'Cases',          icon: '📁' },
            { value: totalEvidence.toString(), label: 'Evidence Items', icon: '🔎' },
            { value: totalSuspects.toString(), label: 'Suspects',       icon: '👤' },
            { value: '15–20m',label: 'Per Case',       icon: '⏱' },
          ].map((stat, i) => (
            <React.Fragment key={stat.label}>
              <motion.div
                className="stat-item"
                whileHover={{ background: 'rgba(139,92,246,0.06)' }}
                transition={{ duration: 0.2 }}
              >
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
              {i < 3 && <div className="stat-divider" />}
            </React.Fragment>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-1 text-slate-700"
        >
          <span className="text-[10px] font-mono tracking-widest">SELECT CASE</span>
          <ChevronRight size={14} className="rotate-90" />
        </motion.div>
      </section>

      {/* ── CASE SELECTION ── */}
      <section className="case-selection">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="case-label-row"
        >
          <div className="flex-1 h-px bg-linear-to-r from-transparent to-purple-500/20" />
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/5">
            <Eye size={12} className="text-purple-400" />
            <span className="text-[11px] font-mono text-purple-400 tracking-widest uppercase">Active Case Files</span>
          </div>
          <div className="flex-1 h-px bg-linear-to-l from-transparent to-purple-500/20" />
        </motion.div>

        {/* ── Scroll hint ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}
        >
          <div style={{ height: 1, width: 40, background: 'linear-gradient(to right, transparent, rgba(139,92,246,0.2))' }} />
          <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>← drag to explore →</span>
          <div style={{ height: 1, width: 40, background: 'linear-gradient(to left, transparent, rgba(139,92,246,0.2))' }} />
        </motion.div>

        <div
          className="case-grid"
          ref={scrollRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          {SORTED_CASES.map((c, i) => (
            <PremiumCaseCard
              key={c.id}
              caseData={c}
              index={i}
              isHovered={hoveredCase === c.id}
              isSolved={solvedCaseIds.includes(c.id)}
              isLocked={getIsCaseLocked(c)}
              onHover={() => setHoveredCase(c.id)}
              onLeave={() => setHoveredCase(null)}
              onSelect={() => handleSelectCase(c.id)}
            />
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <div className="footer-wrap">
        <div className="crime-tape footer-tape" />
        <footer className="footer-content">
          <span>
            BUILT WITH ❤ BY{' '}
            <span className="text-purple-500/70 font-bold tracking-[0.3em]">PASTA</span>
          </span>
        </footer>
      </div>
    </motion.div>
  );
}

// ── BLOOD MARKS ──────────────────────────────────────────────────────────────
const DRIPS = [
  { id: 'd1', x: '8%',  y: 0, delay: 0.3,  dur: 1.2, h: 120, w: 10, opacity: 0.55 },
  { id: 'd2', x: '15%', y: 0, delay: 1.1,  dur: 0.9, h: 80,  w: 7,  opacity: 0.4  },
  { id: 'd3', x: '88%', y: 0, delay: 0.6,  dur: 1.4, h: 150, w: 12, opacity: 0.5  },
  { id: 'd4', x: '93%', y: 0, delay: 1.8,  dur: 1.0, h: 60,  w: 6,  opacity: 0.35 },
  { id: 'd5', x: '72%', y: 0, delay: 2.4,  dur: 1.1, h: 95,  w: 9,  opacity: 0.45 },
  { id: 'd6', x: '3%',  y: 0, delay: 3.0,  dur: 1.3, h: 70,  w: 7,  opacity: 0.3  },
];

const SPATTERS = [
  { id: 's1', cx: '10%',  cy: '18%', r: 28 },
  { id: 's2', cx: '85%',  cy: '12%', r: 22 },
  { id: 's3', cx: '5%',   cy: '55%', r: 18 },
  { id: 's4', cx: '92%',  cy: '48%', r: 32 },
  { id: 's5', cx: '18%',  cy: '80%', r: 20 },
  { id: 's6', cx: '78%',  cy: '75%', r: 15 },
];

function BloodMarks() {
  return (
    <div className="blood-marks-container">
      {DRIPS.map((d) => (
        <motion.div
          key={d.id}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: d.opacity }}
          transition={{ delay: d.delay, duration: d.dur, ease: [0.4, 0, 0.6, 1] }}
          style={{
            position: 'absolute', top: 0, left: d.x, width: d.w, height: d.h,
            transformOrigin: 'top center',
            background: 'linear-gradient(180deg,#8b0000 0%,#a00000 40%,#700000cc 75%,transparent 100%)',
            borderRadius: '0 0 50% 50%', filter: 'blur(0.5px)',
          }}
        />
      ))}
      {DRIPS.map((d) => (
        <motion.div
          key={`drop-${d.id}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: d.opacity * 0.9 }}
          transition={{ delay: d.delay + d.dur * 0.85, duration: 0.35, type: 'spring', stiffness: 300 }}
          style={{
            position: 'absolute', top: d.h - 6,
            left: `calc(${d.x} - ${d.w * 0.4}px)`,
            width: d.w * 1.8, height: d.w * 1.8,
            borderRadius: '50%', background: '#8b0000', filter: 'blur(0.5px)',
          }}
        />
      ))}
      <svg className="blood-svg-layer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="blood-blur"><feGaussianBlur in="SourceGraphic" stdDeviation="0.15" /></filter>
          <filter id="blood-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.25" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
          </filter>
        </defs>
        {SPATTERS.map((s, i) => (
          <motion.g key={s.id} filter="url(#blood-goo)">
            <motion.circle cx={s.cx} cy={s.cy} r={s.r * 0.018} fill="#8b0000"
              initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 0.5 }}
              transition={{ delay: 1.5 + i * 0.25, duration: 0.5, type: 'spring', stiffness: 200 }}
              style={{ transformOrigin: `${s.cx} ${s.cy}` }}
            />
            {[...Array(5)].map((_, j) => {
              const angle = (j / 5) * Math.PI * 2;
              return (
                <motion.circle key={j}
                  cx={`${parseFloat(s.cx) + Math.cos(angle) * s.r * 0.025}%`}
                  cy={`${parseFloat(s.cy) + Math.sin(angle) * s.r * 0.02}%`}
                  r={s.r * 0.005 + j * 0.001} fill="#700000"
                  initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 0.4 }}
                  transition={{ delay: 1.7 + i * 0.25 + j * 0.06, duration: 0.3 }}
                />
              );
            })}
          </motion.g>
        ))}
        <motion.path d="M 2 5 Q 8 12 5 22 Q 3 28 8 35" stroke="#6b0000" strokeWidth="0.8" fill="none" strokeLinecap="round"
          opacity={0} animate={{ opacity: 0.35 }} transition={{ delay: 3.2, duration: 1.5 }} style={{ filter: 'blur(0.3px)' }} />
        <motion.path d="M 95 82 Q 90 78 93 70 Q 95 64 91 58" stroke="#6b0000" strokeWidth="0.6" fill="none" strokeLinecap="round"
          opacity={0} animate={{ opacity: 0.3 }} transition={{ delay: 3.8, duration: 1.5 }} style={{ filter: 'blur(0.3px)' }} />
      </svg>
      <motion.svg viewBox="0 0 60 90" xmlns="http://www.w3.org/2000/svg"
        initial={{ opacity: 0, rotate: -15 }} animate={{ opacity: 0.18, rotate: -15 }} transition={{ delay: 4.5, duration: 1.2 }}
        style={{ position: 'absolute', left: '-8px', top: '38%', width: 60, height: 90 }}>
        <ellipse cx="30" cy="65" rx="18" ry="20" fill="#8b0000" filter="url(#blood-blur)" />
        {/* Thumb */}
        <ellipse cx="10" cy="58" rx="6" ry="10" fill="#8b0000" transform="rotate(-30 10 58)" />
        {/* Fingers */}
        <ellipse cx="16" cy="38" rx="5" ry="14" fill="#8b0000" transform="rotate(-10 16 38)" />
        <ellipse cx="26" cy="32" rx="5" ry="15" fill="#8b0000" />
        <ellipse cx="36" cy="33" rx="5" ry="14" fill="#8b0000" transform="rotate(5 36 33)" />
        <ellipse cx="46" cy="38" rx="5" ry="13" fill="#8b0000" transform="rotate(15 46 38)" />
      </motion.svg>
      <motion.div
        animate={{ opacity: [0, 0.07, 0.04, 0.08, 0.03] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 55%, rgba(139,0,0,0.35) 100%)', pointerEvents: 'none' }}
      />
    </div>
  );
}

// ── ATMOSPHERIC BACKGROUND ────────────────────────────────────────────────
function AtmosphericBackground() {
  return (
    <div className="atmospheric-bg">
      {/* User's provided background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
        style={{ backgroundImage: 'url("/homepage-bg.jpg")' }} 
      />
      {/* Dark overlay to ensure the UI remains highly readable on top of the complex background */}
      <div className="absolute inset-0 bg-black/65" />
      
      <div className="scanline-overlay" />

      {/* Animated grain layer */}
      <motion.div
        animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: 'mirror', ease: 'linear' }}
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
          opacity: 0.4,
        }}
      />

      {/* Removed the floating colored orbs so as not to distract from the image */}
    </div>
  );
}

// ── ALREADY SOLVED MODAL ─────────────────────────────────────────────────
function AlreadySolvedModal({ caseData, onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {caseData && (
        <motion.div
          key="already-solved-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(3,5,8,0.82)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <motion.div
            key="already-solved-card"
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 24 }}
            transition={{ type: 'spring', damping: 20, stiffness: 240 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: 'min(420px, 90vw)',
              background: 'linear-gradient(160deg, rgba(16,14,30,0.98) 0%, rgba(8,6,16,0.99) 100%)',
              border: '1px solid rgba(16,185,129,0.22)',
              borderRadius: 20,
              padding: '36px 32px 28px',
              boxShadow: '0 0 60px rgba(16,185,129,0.08), 0 32px 80px rgba(0,0,0,0.7)',
              textAlign: 'center',
            }}
          >
            {/* Close button */}
            <button
              onClick={onCancel}
              style={{
                position: 'absolute', top: 14, right: 14,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 8, padding: '4px 6px',
                cursor: 'pointer', display: 'flex', alignItems: 'center',
              }}
            >
              <X size={14} color="rgba(255,255,255,0.4)" />
            </button>

            {/* Icon */}
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'rgba(16,185,129,0.1)',
                border: '1px solid rgba(16,185,129,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 0 28px rgba(16,185,129,0.15)',
              }}
            >
              <CheckCircle size={30} color="#10b981" strokeWidth={1.8} />
            </motion.div>

            {/* Label */}
            <div style={{
              fontSize: 10, fontFamily: 'JetBrains Mono, monospace',
              color: '#10b981', letterSpacing: '0.2em', marginBottom: 10,
              textTransform: 'uppercase', fontWeight: 700,
            }}>Case Already Solved</div>

            {/* Title */}
            <h2 style={{
              fontSize: 20, fontWeight: 800, color: '#fff',
              fontFamily: 'Inter, sans-serif', marginBottom: 10, lineHeight: 1.3,
            }}>
              {caseData.emoji} {caseData.title}
            </h2>

            <p style={{
              fontSize: 13, color: 'rgba(255,255,255,0.45)',
              lineHeight: 1.65, marginBottom: 6,
              fontFamily: 'Inter, sans-serif',
            }}>
              You've already cracked this case. Want to replay it for fun?
            </p>
            <p style={{
              fontSize: 11, color: 'rgba(239,68,68,0.65)',
              fontFamily: 'JetBrains Mono, monospace',
              letterSpacing: '0.06em', marginBottom: 28,
            }}>
              ⚠ Score will NOT be added for a replay.
            </p>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={onCancel}
                style={{
                  flex: 1, padding: '11px 0', borderRadius: 10,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  color: 'rgba(255,255,255,0.5)',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
                  cursor: 'pointer', textTransform: 'uppercase',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.75)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                }}
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onConfirm}
                style={{
                  flex: 1, padding: '11px 0', borderRadius: 10,
                  background: 'linear-gradient(135deg, rgba(16,185,129,0.18), rgba(16,185,129,0.08))',
                  border: '1px solid rgba(16,185,129,0.35)',
                  color: '#10b981',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
                  cursor: 'pointer', textTransform: 'uppercase',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  boxShadow: '0 0 20px rgba(16,185,129,0.06)',
                }}
              >
                <RefreshCw size={12} />
                Yes, Replay
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── PREMIUM CASE CARD ─────────────────────────────────────────────────────
function PremiumCaseCard({ caseData, index, isHovered, isSolved, isLocked, onHover, onLeave, onSelect }) {
  const meta = DIFFICULTY_META[caseData.difficulty] || DIFFICULTY_META.Hard;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 + index * 0.15, type: 'spring', damping: 16, stiffness: 150 }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onSelect}
      className="case-card-wrapper"
      style={{ 
        transform: isHovered && !isLocked ? 'translateY(-6px)' : 'translateY(0)', 
        transition: 'transform 0.35s cubic-bezier(0.22,1,0.36,1)',
        opacity: isLocked ? 0.6 : 1,
        cursor: isLocked ? 'not-allowed' : 'pointer'
      }}
    >
      {/* Outer gradient border glow */}
      <motion.div
        className="case-card-glow"
        animate={{ opacity: isHovered && !isLocked ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{ background: `linear-gradient(135deg, ${meta.color}60, transparent, ${meta.color}30)` }}
      />

      {/* Card body */}
      <div
        className="case-card"
        style={{
          boxShadow: (isHovered && !isLocked)
            ? `0 24px 70px rgba(0,0,0,0.65), 0 0 40px ${meta.color}18, inset 0 1px 0 rgba(255,255,255,0.07)`
            : '0 4px 24px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.03)',
          borderColor: (isHovered && !isLocked) ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
          background: (isHovered && !isLocked)
            ? `linear-gradient(160deg, rgba(18,14,32,0.97) 0%, rgba(10,8,18,0.98) 100%)`
            : undefined,
          transition: 'all 0.35s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        {/* Top accent strip */}
        <motion.div
          className="case-accent-strip"
          animate={{ opacity: (isHovered && !isLocked) ? 1 : 0.25, scaleX: (isHovered && !isLocked) ? 1 : 0.6 }}
          transition={{ duration: 0.35 }}
          style={{ background: `linear-gradient(90deg, transparent, ${meta.color}, transparent)`, transformOrigin: 'center' }}
        />

        {/* Hero image banner */}
        <div className="relative w-full h-[180px] overflow-hidden rounded-t-[18px]">
          <motion.div
            animate={{ scale: (isHovered && !isLocked) ? 1.06 : 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              position: 'absolute', inset: -2,
              backgroundImage: `url(${caseData.coverImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: isLocked ? 'grayscale(100%) blur(1px)' : 'none'
            }}
          />
          {/* Subtle gradient overlay to blend into the dark card */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(10,8,18,0.1) 0%, rgba(10,8,18,0.98) 100%)' }} />
          
          {isLocked && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[2px]">
               <div className="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center mb-3">
                 <Lock size={20} color="#94a3b8" />
               </div>
               <span className="text-xs font-bold text-slate-400 font-mono tracking-widest">CLASSIFIED</span>
            </div>
          )}

          <div className="case-watermark hidden sm:block" style={{ top: 20, right: 20 }}>{String(index + 1).padStart(2, '0')}</div>

          <div className="absolute top-5 left-5 right-5 flex justify-between items-center z-10">
            <span className="difficulty-badge" style={{ color: meta.color, background: 'rgba(0,0,0,0.5)', borderColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}>
              {meta.label}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {isSolved && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 3,
                    fontSize: 9, fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: 700, letterSpacing: '0.12em',
                    color: '#10b981',
                    background: 'rgba(16,185,129,0.1)',
                    border: '1px solid rgba(16,185,129,0.3)',
                    borderRadius: 5, padding: '2px 6px',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <CheckCircle size={8} />
                  SOLVED
                </motion.span>
              )}
              <div className="flex items-center gap-1.5 text-[10px] text-white/90 font-mono bg-black/50 px-2.5 py-1.5 rounded-lg border border-white/10 backdrop-blur-sm">
                <Clock size={10} />
                {Math.floor(caseData.timeLimit / 60)}m
              </div>
            </div>
            </div>

          <motion.div
            animate={(isHovered && !isLocked) ? { y: -6, scale: 1.12, rotate: [-2, 2, -1] } : { y: 0, scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 12, stiffness: 180 }}
            className="absolute bottom-2 left-6 text-[48px] will-change-transform select-none"
            style={{ 
              filter: (isHovered && !isLocked) ? `drop-shadow(0 0 24px ${meta.color}90)` : 'drop-shadow(0 8px 12px rgba(0,0,0,0.8))',
              opacity: isLocked ? 0.4 : 1
            }}
          >
            {caseData.emoji}
          </motion.div>
        </div>

        {/* Header zone */}
        <div className="case-card-header" style={{ paddingTop: '16px' }}>

          <h3 className="case-title">{caseData.title.toUpperCase()}</h3>
          <p className="case-subtitle">{caseData.subtitle}</p>

          <div className="location-chip">
            <span>📍</span>{caseData.location}
          </div>
        </div>

        {/* Divider */}
        <div className="mx-5 h-px bg-white/5" />

        {/* Body */}
        <div className="case-card-body">
          <p className="case-description">{caseData.description}</p>

          <div className="case-chips-row">
            <InfoChip icon="🧩" value={caseData.suspects.length} label="Suspects" color={meta.color} />
            <InfoChip icon="🔎" value={caseData.evidence.length} label="Evidence" color={meta.color} />
            <InfoChip icon="📍" value={caseData.timeline.length} label="Events" color={meta.color} />
          </div>

          {/* CTA */}
          <motion.div
            animate={{ opacity: (isHovered && !isLocked) ? 1 : 0, y: (isHovered && !isLocked) ? 0 : 6 }}
            transition={{ duration: 0.25 }}
            className="case-cta-row"
          >
            <span className="case-cta-text" style={{ color: isLocked ? '#64748b' : meta.color }}>
              {isLocked ? 'LOCKED' : isSolved ? 'Replay Case' : 'Open Case File'}
            </span>
            <motion.div
              animate={{ x: (isHovered && !isLocked) ? 4 : 0 }}
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: isLocked ? 'rgba(255,255,255,0.05)' : meta.bg, border: `1px solid ${isLocked ? 'transparent' : meta.border}` }}
            >
              {isLocked 
                ? <Lock size={12} style={{ color: '#64748b' }} />
                : isSolved
                ? <RefreshCw size={12} style={{ color: meta.color }} />
                : <ChevronRight size={12} style={{ color: meta.color }} />}
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom hover line */}
        <motion.div
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.35 }}
          className="case-hover-line"
          style={{ background: `linear-gradient(90deg, transparent, ${meta.color}, transparent)`, transformOrigin: 'center' }}
        />
      </div>
    </motion.div>
  );
}

function InfoChip({ icon, value, label, color }) {
  return (
    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/3 border border-white/5 flex-1 justify-center">
      <span className="text-[10px]">{icon}</span>
      <span className="text-[10px] font-bold font-mono" style={{ color }}>{value}</span>
      <span className="text-[9px] text-slate-700 hidden sm:block">{label}</span>
    </div>
  );
}