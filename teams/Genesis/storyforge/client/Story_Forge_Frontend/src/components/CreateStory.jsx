import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Edit3, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './CreateStory.css';

export default function CreateStory() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');

  const handleStart = () => {
    if (!prompt.trim()) return;
    navigate('/gameplay', { state: { transition: 'fade', genre: 'Custom', prompt: prompt.trim() } });
  };

  return (
    <div className="create-story-root">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="genre-header"
      >
        <button 
          onClick={() => navigate('/', { state: { transition: 'push_back' } })}
          className="btn-back"
        >
          <ArrowLeft size={20} />
          <span>Back to Origin</span>
        </button>
        <h1 className="genre-title">Forge Your <span className="text-highlight">Custom Path</span></h1>
        <p className="genre-desc">Define the exact scenario, setting, and mood. The AI Architect will build from your imagination.</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="create-story-content"
      >
        <div className="glass-panel create-story-panel">
          <div className="input-group">
            <label className="input-label flex items-center gap-2">
              <Edit3 size={18} className="text-primary" />
              <span>Starting Prompt</span>
            </label>
            <textarea
              className="prompt-textarea hide-scrollbar"
              placeholder="e.g. You wake up in a cyberpunk alleyway with no memory. Rain is pouring down, and a neon sign flickers above you..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={6}
            />
          </div>

          <button 
            className={`btn-forge-custom ${!prompt.trim() ? 'disabled' : ''}`}
            onClick={handleStart}
            disabled={!prompt.trim()}
          >
            <Sparkles size={20} />
            <span>Initialize Narrative Protocol</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
