import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from './store/gameStore';
import { useAuthStore } from './store/authStore';
import { Auth } from './components/Auth';
import { HomePage } from './pages/HomePage';
import { GamePage } from './pages/GamePage';
import { ResultsScreen } from './components/ResultsScreen';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { GuideCharacter } from './components/guide/GuideCharacter';
import { AudioPlayer } from './components/AudioPlayer';

export default function App() {
  const { gamePhase, isSystemBooted } = useGameStore();
  const { loading } = useAuthStore();

  useEffect(() => {
    useAuthStore.getState().initialize();

    // Global interaction listener to "unlock" audio synthesis for browsers
    const unlockAudio = () => {
      const state = useGameStore.getState();
      // Importing useGuideStore dynamically or via closure
      import('./store/guideStore').then(m => {
        m.useGuideStore.getState().unlockAudio();
      });
      document.removeEventListener('mousedown', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
    };

    document.addEventListener('mousedown', unlockAudio);
    document.addEventListener('keydown', unlockAudio);
    document.addEventListener('touchstart', unlockAudio);

    return () => {
      document.removeEventListener('mousedown', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
    };
  }, []);

  return (
    <>
      {/* Thin loading overlay — only blocks briefly while Supabase resolves */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99999,
              background: '#030508',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            {/* Spinning ring */}
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                border: '2px solid rgba(139,92,246,0.15)',
                borderTopColor: '#8b5cf6',
                animation: 'spin 0.9s linear infinite',
              }}
            />
            <span
              style={{
                fontSize: 11,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.25)',
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            >
              Accessing files…
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <Auth />
      <AnimatePresence mode="wait">
        {gamePhase === 'home' && <HomePage key="home" />}
        {(gamePhase === 'briefing' || gamePhase === 'playing' || gamePhase === 'accusing') && (
          <GamePage key="game" />
        )}
        {gamePhase === 'result' && <ResultsScreen key="result" />}
        {gamePhase === 'leaderboard' && <LeaderboardPage key="leaderboard" />}
      </AnimatePresence>
      <GuideCharacter />
      <AudioPlayer />
    </>
  );
}
