import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Sparkles, 
  Zap, 
  Moon, 
  Flame, 
  Ghost, 
  Cpu,
  BrainCircuit
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './CreateStory.css';

const INSPIRATION_SEEDS = [
  { label: 'Cyberpunk Noir', icon: <Cpu size={14} />, text: 'A detective in Neo-Tokyo investigating a ghost in the machine...' },
  { label: 'High Fantasy', icon: <Flame size={14} />, text: 'An ancient dragon awakes to find its kingdom replaced by an industrial empire...' },
  { label: 'Cosmic Horror', icon: <Moon size={14} />, text: 'An astronaut on a derelict ship discovers a signal from a dead god...' },
  { label: 'Gothic Mystery', icon: <Ghost size={14} />, text: 'A traveler arrives at a remote manor where time seems to bleed backwards...' },
];

export default function CreateStory() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    // Calculate prompt strength (0-100)
    const len = prompt.trim().length;
    const s = Math.min(100, (len / 150) * 100);
    setStrength(s);
  }, [prompt]);

  const handleStart = () => {
    if (!prompt.trim()) return;
    navigate('/gameplay', { state: { transition: 'fade', genre: 'Custom', prompt: prompt.trim() } });
  };

  const applySeed = (text) => {
    setPrompt(text);
  };

  return (
    <div className="create-story-root">
      <div className="forge-backdrop" />
      
      {/* Header UI */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="genre-header text-center"
      >
        <button 
          onClick={() => navigate('/', { state: { transition: 'push_back' } })}
          className="btn-back mx-auto mb-6 flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity"
        >
          <ArrowLeft size={18} />
          <span>Origin Point</span>
        </button>
        <h1 className="genre-title text-5xl font-headline font-bold mb-4">
          The <span className="text-highlight">Neuro-Forge</span>
        </h1>
        <p className="genre-desc max-w-2xl mx-auto text-lg opacity-70">
          Inject your neural signatures into the simulation. The Architect will manifest your imagination into existence.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="create-story-content"
      >
        <div className="create-story-panel">
          
          <div className="input-header-group">
            <div className="flex items-center justify-between">
              <label className="input-label flex items-center gap-3">
                <BrainCircuit size={20} className="text-primary" />
                <span>Neural Input Stream</span>
              </label>
              <div className="text-xs uppercase tracking-widest opacity-40">
                {prompt.length} Characters
              </div>
            </div>
            
            <div className="prompt-textarea-wrapper">
              <textarea
                className="prompt-textarea hide-scrollbar"
                placeholder="Describe your vision... settings, characters, or even just a feeling."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            {/* Strength Meter */}
            <div className="meter-container">
              <div className="meter-header">
                <span>Signal Integrity</span>
                <span>{Math.round(strength)}%</span>
              </div>
              <div className="meter-track">
                <div 
                  className="meter-fill" 
                  style={{ width: `${strength}%`, background: strength > 70 ? 'linear-gradient(90deg, #00e5ff, #00ff9d)' : '#00e5ff' }}
                />
              </div>
            </div>
          </div>

          {/* Inspiration Seeds */}
          <div className="seeds-section">
            <span className="text-xs uppercase tracking-widest opacity-40 mb-4 block">Inspiration Seeds</span>
            <div className="seeds-container">
              {INSPIRATION_SEEDS.map((seed, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => applySeed(seed.text)}
                  className="seed-chip"
                >
                  {seed.icon}
                  <span>{seed.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="btn-forge-container">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`btn-forge-custom ${!prompt.trim() ? 'disabled' : ''}`}
              onClick={handleStart}
              disabled={!prompt.trim()}
            >
              <Sparkles size={18} />
              <span>Initialize Simulation</span>
              <AnimatePresence>
                {prompt.trim() && (
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute -top-1 -right-1"
                  >
                    <div className="w-3 h-3 bg-white rounded-full animate-ping" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
