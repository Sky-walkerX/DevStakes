import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

export function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Start playing on first interaction if not playing yet
    const handleFirstInteraction = () => {
      if (!interacted && audioRef.current) {
        audioRef.current.volume = 0.4; // Slightly lower volume for BGM
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setInteracted(true);
          })
          .catch(() => {
            // Autoplay blocked
          });
      }
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [interacted]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <audio 
        ref={audioRef} 
        src="/bg-music.mp3" 
        loop 
      />
      <motion.button
        title={isPlaying ? "Mute Music" : "Play Music"}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={togglePlay}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 99999,
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isPlaying ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.05)',
          border: isPlaying ? '1px solid rgba(139,92,246,0.4)' : '1px solid rgba(255,255,255,0.1)',
          color: isPlaying ? '#a78bfa' : '#94a3b8',
          cursor: 'pointer',
          boxShadow: isPlaying ? '0 0 16px rgba(139,92,246,0.2)' : '0 4px 12px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(8px)'
        }}
      >
        {isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
      </motion.button>
    </>
  );
}
