import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Medal, ArrowLeft, RefreshCw, Crown,
  Target, Clock, CheckCircle, Wifi, WifiOff, User
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useGameStore } from '../store/gameStore';
import { useAuthStore } from '../store/authStore';

const RANK_STYLES = {
  1: { icon: <Crown size={16} />, color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.35)', label: '1ST' },
  2: { icon: <Medal size={16} />, color: '#94a3b8', bg: 'rgba(148,163,184,0.1)',  border: 'rgba(148,163,184,0.3)', label: '2ND' },
  3: { icon: <Medal size={16} />, color: '#cd7c3a', bg: 'rgba(205,124,58,0.1)',   border: 'rgba(205,124,58,0.3)', label: '3RD' },
};

export function LeaderboardPage() {
  const { goHome } = useGameStore();
  const { user } = useAuthStore();

  const [entries, setEntries]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLive, setIsLive]       = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // ── Fetch leaderboard ──────────────────────────────────────────
  const fetchLeaderboard = useCallback(async (silent = false) => {
    if (!supabase) {
      setError('Supabase not configured. Add your credentials to .env.local');
      setLoading(false);
      return;
    }
    if (!silent) setLoading(true);
    setRefreshing(true);
    setError(null);

    try {
      const { data, error: fetchErr } = await supabase
        .from('user_stats')
        .select('id, username, total_score, cases_solved_count, created_at')
        .order('total_score', { ascending: false })
        .limit(50);

      if (fetchErr) {
        // RLS is likely blocking anonymous reads — give a helpful message
        if (fetchErr.code === '42501' || fetchErr.message?.includes('row-level security')) {
          throw new Error(
            'Public read access is disabled. Run this in Supabase SQL Editor:\n' +
            'create policy "Public leaderboard read" on user_stats for select to anon, authenticated using (true);'
          );
        }
        throw fetchErr;
      }

      setEntries(data || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Leaderboard fetch error:', err);
      setError(err.message || 'Failed to load leaderboard. Check your Supabase setup.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => { fetchLeaderboard(); }, [fetchLeaderboard]);

  // ── Real-time subscription ─────────────────────────────────────
  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel('leaderboard-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_stats',
      }, () => {
        fetchLeaderboard(true); // silent refresh on DB change
      })
      .subscribe((status) => {
        setIsLive(status === 'SUBSCRIBED');
      });

    return () => { supabase.removeChannel(channel); };
  }, [fetchLeaderboard]);

  // Manual refresh
  const handleRefresh = () => { fetchLeaderboard(false); };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="lb-page"
    >
      {/* Atmospheric background */}
      <div className="lb-bg">
        <div className="lb-nebula-gold" />
        <div className="lb-nebula-purple" />
        <div className="lb-scanlines" />
      </div>

      {/* ── Header ── */}
      <header className="lb-header">
        <div className="lb-header-left">
          <motion.button
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.96 }}
            onClick={goHome}
            className="lb-back-btn"
          >
            <ArrowLeft size={14} />
            <span>Case Select</span>
          </motion.button>
        </div>

        <div className="lb-header-center">
          <div className="lb-logo-badge">
            <Trophy size={18} style={{ color: '#fbbf24' }} />
          </div>
          <div>
            <div className="lb-header-title">GLOBAL LEADERBOARD</div>
            <div className="lb-header-sub">Live · All Detectives</div>
          </div>
        </div>

        <div className="lb-header-right">
          {/* Live indicator */}
          <div className={`lb-live-chip ${isLive ? 'live' : 'offline'}`}>
            {isLive ? <Wifi size={10} /> : <WifiOff size={10} />}
            <span>{isLive ? 'LIVE' : 'POLLING'}</span>
          </div>

          {/* Refresh button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            onClick={handleRefresh}
            disabled={refreshing}
            className="lb-refresh-btn"
          >
            <motion.div
              animate={refreshing ? { rotate: 360 } : { rotate: 0 }}
              transition={refreshing ? { duration: 0.8, repeat: Infinity, ease: 'linear' } : {}}
            >
              <RefreshCw size={13} />
            </motion.div>
          </motion.button>
        </div>
      </header>

      {/* ── Top 3 Podium ── */}
      <AnimatePresence mode="wait">
        {!loading && !error && entries.length >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: 'spring', damping: 18 }}
            className="lb-podium-section"
          >
            <PodiumCard rank={2} entry={entries[1]} currentUserId={user?.id} />
            <PodiumCard rank={1} entry={entries[0]} currentUserId={user?.id} elevated />
            <PodiumCard rank={3} entry={entries[2]} currentUserId={user?.id} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Table ── */}
      <div className="lb-table-section">
        {/* Column header */}
        <div className="lb-col-header">
          <span className="lb-col-rank">Rank</span>
          <span className="lb-col-detective">Detective</span>
          <span className="lb-col-solved">Solved</span>
          <span className="lb-col-score">Score</span>
        </div>

        {/* States */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="lb-state-box">
              <LoadingRows />
            </motion.div>
          )}

          {error && !loading && (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lb-error-box">
              <div className="lb-error-icon">⚠</div>
              <p className="lb-error-title">Could not load leaderboard</p>
              <p className="lb-error-desc">{error}</p>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={handleRefresh}
                className="lb-retry-btn"
              >
                <RefreshCw size={12} /> Try Again
              </motion.button>
            </motion.div>
          )}

          {!loading && !error && entries.length === 0 && (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lb-empty-box">
              <div style={{ fontSize: 48, marginBottom: 12 }}>🏆</div>
              <p className="lb-empty-title">No detectives yet</p>
              <p className="lb-empty-desc">Be the first to solve a case and claim the top spot.</p>
            </motion.div>
          )}

          {!loading && !error && entries.length > 0 && (
            <motion.div key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {entries.map((entry, i) => (
                <LeaderboardRow
                  key={entry.id}
                  entry={entry}
                  rank={i + 1}
                  index={i}
                  isCurrentUser={user?.id === entry.id}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Last updated */}
      {lastUpdated && (
        <div className="lb-footer">
          Updated {lastUpdated.toLocaleTimeString()} · {entries.length} detectives
        </div>
      )}
    </motion.div>
  );
}

// ── Podium Card ───────────────────────────────────────────────────────────────

function PodiumCard({ rank, entry, currentUserId, elevated }) {
  const style = RANK_STYLES[rank];
  const isYou = currentUserId && entry?.id === currentUserId;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`lb-podium-card ${elevated ? 'lb-podium-elevated' : ''}`}
      style={{
        borderColor: style.border,
        background: `linear-gradient(160deg, ${style.bg} 0%, rgba(8,12,20,0.97) 100%)`,
        boxShadow: elevated
          ? `0 0 40px ${style.color}25, 0 16px 40px rgba(0,0,0,0.6), inset 0 1px 0 ${style.color}20`
          : `0 8px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)`,
      }}
    >
      <div className="lb-podium-rank" style={{ color: style.color }}>
        {style.icon}
        <span>{style.label}</span>
      </div>
      <div className="lb-podium-avatar" style={{ borderColor: style.border, background: style.bg }}>
        <span style={{ fontSize: elevated ? 28 : 22 }}>🕵️</span>
      </div>
      <div className="lb-podium-name">
        {entry?.username || 'Anonymous'}
        {isYou && <span className="lb-you-tag">YOU</span>}
      </div>
      <div className="lb-podium-score" style={{ color: style.color }}>
        {(entry?.total_score || 0).toLocaleString()}
        <span className="lb-podium-pts">pts</span>
      </div>
      <div className="lb-podium-sub">
        <CheckCircle size={10} style={{ opacity: 0.5 }} />
        {entry?.cases_solved_count || 0} cases
      </div>
    </motion.div>
  );
}

// ── Leaderboard Row ───────────────────────────────────────────────────────────

function LeaderboardRow({ entry, rank, index, isCurrentUser }) {
  const style = RANK_STYLES[rank];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, type: 'spring', damping: 18 }}
      className={`lb-row ${isCurrentUser ? 'lb-row-you' : ''} ${rank <= 3 ? 'lb-row-top3' : ''}`}
    >
      {/* Rank */}
      <div className="lb-row-rank">
        {style ? (
          <div className="lb-row-medal" style={{ color: style.color, background: style.bg, borderColor: style.border }}>
            {rank}
          </div>
        ) : (
          <span className="lb-row-num">{rank}</span>
        )}
      </div>

      {/* Detective */}
      <div className="lb-row-detective">
        <div className="lb-row-avatar">
          <User size={14} style={{ color: isCurrentUser ? '#a78bfa' : '#475569' }} />
        </div>
        <div>
          <span className="lb-row-name">
            {entry.username || 'Anonymous Detective'}
          </span>
          {isCurrentUser && <span className="lb-you-tag">YOU</span>}
        </div>
      </div>

      {/* Cases solved */}
      <div className="lb-row-solved">
        <CheckCircle size={12} style={{ color: '#10b981', opacity: 0.7 }} />
        <span>{entry.cases_solved_count || 0}</span>
      </div>

      {/* Score */}
      <div className="lb-row-score">
        <span className="lb-score-num" style={{ color: style?.color || '#e2e8f0' }}>
          {(entry.total_score || 0).toLocaleString()}
        </span>
        <span className="lb-score-label">pts</span>
      </div>
    </motion.div>
  );
}

// ── Skeleton loading rows ─────────────────────────────────────────────────────
function LoadingRows() {
  return (
    <div>
      {[...Array(8)].map((_, i) => (
        <div key={i} className="lb-skeleton-row" style={{ animationDelay: `${i * 0.08}s` }}>
          <div className="lb-skel lb-skel-rank" />
          <div className="lb-skel lb-skel-name" />
          <div className="lb-skel lb-skel-sm" />
          <div className="lb-skel lb-skel-score" />
        </div>
      ))}
    </div>
  );
}
