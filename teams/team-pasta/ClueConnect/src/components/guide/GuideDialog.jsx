import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGuideStore, tutorialSteps } from '../../store/guideStore';
import { ChevronRight, SkipForward, Bot } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

export const GuideDialog = () => {
  const {
    currentStepIndex,
    nextStep,
    skipTutorial,
    setTyping,
    isTyping,
    customMessage,
    isDormant,
    audioUnlocked
  } = useGuideStore();
  const { gamePhase } = useGameStore();
  const [displayedText, setDisplayedText] = useState('');

  const currentStep = tutorialSteps ? tutorialSteps[currentStepIndex] : { text: '' };
  const targetText = customMessage || currentStep?.text || '';

  useEffect(() => {
    setDisplayedText('');
    setTyping(true);

    let i = 0;
    let typingInterval;

    // Emotion & Pacing Heuristics based on text punctuation
    let emotionalRate = 1.05; // Default natural
    let emotionalPitch = 0.9; // Default relaxed male
    let textInterval = 40;    // Default typing match

    if (targetText.includes('!')) {
      // Excited, Urgent, or Emphatic
      emotionalRate = 1.15;
      emotionalPitch = 1.0;
      textInterval = 30;
    } else if (targetText.includes('...')) {
      // Dramatic, Hesitant, or Suspenseful
      emotionalRate = 0.85;
      emotionalPitch = 0.8;
      textInterval = 60;
    } else if (targetText.includes('?')) {
      // Questioning, Curious
      emotionalRate = 1.0;
      emotionalPitch = 1.05;
      textInterval = 45;
    }

    const startTyping = () => {
      typingInterval = setInterval(() => {
        if (i < targetText.length) {
          setDisplayedText(targetText.substring(0, i + 1));
          i++;
        } else {
          clearInterval(typingInterval);
          setTyping(false);
        }
      }, textInterval);
    };

    if (window.speechSynthesis && targetText && !isDormant) {
      // Simplest, most reliable pattern to prevent queue-locking
      window.speechSynthesis.cancel();

      // IF audio is not yet unlocked by a user click, we skip speaking but still type.
      // App.jsx handles the global click which sets audioUnlocked to true.
      if (audioUnlocked) {
        const utterance = new SpeechSynthesisUtterance(targetText);

        // Dynamic emotionally-mapped text speed
        utterance.rate = emotionalRate;
        utterance.pitch = emotionalPitch;

        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          // Try to find Google's highly-regarded male voice first, then any generic English male
          let preferredVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google UK English Male'));
          if (!preferredVoice) preferredVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Male'));
          if (!preferredVoice) preferredVoice = voices.find(v => v.lang.startsWith('en')); // Fallback

          if (preferredVoice) utterance.voice = preferredVoice;
        }

        window.speechSynthesis.speak(utterance);
      }

      // Start typing immediately. Relying on API events is too buggy on Mac.
      startTyping();

      return () => {
        clearInterval(typingInterval);
        // We do NOT call cancel() here anymore. It triggers React strict mode unmount bugs.
      };

    } else {
      startTyping();
      return () => {
        clearInterval(typingInterval);
      };
    }

  }, [currentStepIndex, targetText, isDormant, audioUnlocked]);

  const handleNext = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (customMessage) {
      skipTutorial();
    } else {
      nextStep();
    }
  };

  const handleSkip = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    skipTutorial();
  };

  if (isDormant) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, x: 20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.9, x: 20 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="guide-dialog"
    >
      <div className="guide-dialog-arrow" />

      {/* Header */}
      <div className="gd-header">
        <h3 className="gd-title">
          <Bot size={20} className="gd-icon" />
          {gamePhase === 'home' && !customMessage ? 'System Initialization' : 'Agent Assist'}
        </h3>
        {(!customMessage) && tutorialSteps && (
          <div className="gd-step">
            Seq {currentStepIndex + 1}/{tutorialSteps.length}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="gd-content">
        <div className="absolute inset-0 scanlines opacity-20 pointer-events-none"></div>
        <div className="gd-text-wrap">
          {displayedText}
          {isTyping && <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.5 }} className="gd-cursor" />}
        </div>
      </div>

      {/* Footer Controls */}
      <div className="gd-footer">
        {!customMessage && tutorialSteps && currentStepIndex < tutorialSteps.length - 1 && (
          <button onClick={handleSkip} className="gd-btn-skip">
            <SkipForward size={16} /> Skip
          </button>
        )}

        <button onClick={handleNext} className="gd-btn-next">
          {customMessage || (tutorialSteps && currentStepIndex === tutorialSteps.length - 1) ? 'Got it!' : 'Next'}
          <ChevronRight size={18} />
        </button>
      </div>
    </motion.div>
  );
};
