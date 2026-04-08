import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Sparkles, ArrowLeft, RotateCcw, Home, Award, Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import './StoryPlayer.css';

const API_URL = 'http://localhost:3000/api/story';

export default function StoryPlayer() {
  const navigate = useNavigate();
  const location = useLocation();
  const genre = location.state?.genre || 'Sci-Fi';
  const prompt = location.state?.prompt;
  const [currentNode, setCurrentNode] = useState(null);
  const [history, setHistory] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    startGame();
  }, []);

  const startGame = async () => {
    setIsLoading(true);
    setHistory([]);
    setIsFinished(false);
    setTotalScore(0);
    try {
      const response = await fetch(`${API_URL}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ genre, prompt })
      });
      const data = await response.json();
      if (data.success) {
        setSessionId(data.sessionId);
        setCurrentNode(data.node);
      } else {
        console.error("Failed to start story:", data.error);
      }
    } catch (error) {
      console.error("Networking error:", error);
    }
    setIsLoading(false);
  };

  const handleChoice = async (choice) => {
    // Optimistic UI updates
    setHistory([...history, { text: currentNode.text, choiceMade: choice.text }]);
    setTotalScore(prev => prev + (choice.score || 0));
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/next`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sessionId, 
          choiceText: choice.text, 
          choiceScore: choice.score 
        })
      });
      const data = await response.json();
      if (data.success) {
        setTotalScore(data.score); // Sync exact score
        
        // If choices array is empty, we consider it a terminal node
        if (!data.node.choices || data.node.choices.length === 0 || data.node.isTerminal) {
          setCurrentNode(data.node);
          setTimeout(() => setIsFinished(true), 3000); // 3 sec delay to read ending
        } else {
          setCurrentNode(data.node);
        }
      } else {
        console.error("Failed to fetch next node:", data.error);
      }
    } catch (error) {
      console.error("Networking error:", error);
    }
    
    setIsLoading(false);
  };

  const getRating = () => {
    if (totalScore >= 100) return { rank: 'S', title: 'Legendary Architect', color: 'text-yellow-400' };
    if (totalScore >= 60) return { rank: 'A', title: 'Master Forge', color: 'text-purple-400' };
    if (totalScore >= 40) return { rank: 'B', title: 'Skilled Operative', color: 'text-blue-400' };
    return { rank: 'C', title: 'Novice Runner', color: 'text-slate-400' };
  };

  return (
    <div className="story-player-root border-subtle">
      <AnimatePresence mode="wait">
        {isLoading && !currentNode ? (
          <motion.div 
            key="loading-initial"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen text-primary"
          >
            <Loader2 className="w-12 h-12 animate-spin mb-4" />
            <h2 className="font-headline text-2xl tracking-widest uppercase">Initializing Neural Link...</h2>
            <p className="text-on-surface-variant mt-2 max-w-md text-center">Dialing into the {genre} sector. Stand by.</p>
          </motion.div>
        ) : !isFinished ? (
          <GameScene 
            key={currentNode?.text || 'scene'} 
            node={currentNode} 
            onChoice={handleChoice} 
            onNavigate={navigate}
            isLoading={isLoading}
          />
        ) : (
          <SummaryScreen 
            key="summary" 
            history={history} 
            ratingInfo={getRating()} 
            finalText={currentNode.text}
            onRestart={startGame}
            onNavigate={navigate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function GameScene({ node, onChoice, onNavigate, isLoading }) {
  if (!node) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 1 }}
      className="game-scene-container"
    >
      {node.image && <img src={node.image} alt="Scene Background" className="scene-background" />}
      <div className="scene-overlay" />
      
      <div className="scene-header">
        <button className="btn-back-hud" onClick={() => navigate('/', { state: { transition: 'push_back' } })} disabled={isLoading}>
          <ArrowLeft size={20} />
          <span>Exit Simulation</span>
        </button>
        <div className="hud-indicator">
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          <span>{isLoading ? 'Processing Timeline...' : 'Neural Link Active'}</span>
        </div>
      </div>

      <div className="scene-content">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="narrative-box glass-panel-hud"
        >
          <p className="narrative-text">
             {node.text}
          </p>
          {(node.setting || node.mood) && (
            <div className="mt-4 flex gap-4 opacity-50 uppercase tracking-widest text-[10px] font-bold">
              {node.setting && <span>SETTING // {node.setting}</span>}
              {node.mood && <span>MOOD // {node.mood}</span>}
            </div>
          )}
        </motion.div>

        {!node.isTerminal && node.choices && node.choices.length > 0 && (
          <div className="choices-container">
            {node.choices.map((choice, idx) => (
              <motion.button
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + (idx * 0.2), duration: 0.5 }}
                onClick={() => onChoice(choice)}
                disabled={isLoading}
                className={`choice-btn glass-panel-hud group ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="choice-indicator ml-2 mr-4 opacity-50 group-hover:opacity-100 transition-opacity">►</span>
                <span className="choice-text">{choice.text}</span>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function SummaryScreen({ history, ratingInfo, finalText, onRestart, onNavigate }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="summary-container"
    >
      <div className="summary-bg" />
      <div className="summary-content max-w-4xl mx-auto glass-panel p-12 rounded-[2rem]">
        
        <div className="summary-header">
          <h2 className="summary-title">Simulation Complete</h2>
          <div className="rating-box">
            <span className="rating-label">Final Rating</span>
            <span className={`rating-rank ${ratingInfo.color}`}>{ratingInfo.rank}</span>
            <span className="rating-title">{ratingInfo.title}</span>
          </div>
        </div>

        <div className="summary-body">
          <div className="final-verdict-box">
            <h3 className="verdict-title flex items-center gap-2"><Award size={20}/> Outcome</h3>
            <p className="verdict-text">{finalText}</p>
          </div>

          <div className="history-box">
            <h3 className="history-title flex items-center gap-2"><Shield size={20}/> Choices Recorded</h3>
            <ul className="history-list max-h-64 overflow-y-auto pr-4">
              {history.map((item, idx) => (
                <li key={idx} className="history-item flex-col items-start gap-1">
                  <div className="flex items-center gap-2">
                    <div className="history-dot shrink-0" />
                    <span className="history-choice-text text-primary text-sm font-bold">{item.choiceMade}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="summary-actions">
          <button onClick={onRestart} className="btn-summary-action primary-action">
            <RotateCcw size={20} />
            <span>Forge New Path</span>
          </button>
          <button onClick={() => navigate('/', { state: { transition: 'push_back' } })} className="btn-summary-action secondary-action">
            <Home size={20} />
            <span>Return to Nexus</span>
          </button>
        </div>

      </div>
    </motion.div>
  );
}
