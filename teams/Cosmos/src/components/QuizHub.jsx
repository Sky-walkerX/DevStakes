import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Card } from './ui/Card';
import { Button, cn } from './ui/Button';

export function QuizHub({ onComplete, setCurrentView, quizList }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);

  useEffect(() => {
    // Shuffle and pick up to 10 questions limit for the continuous "Daily 10" simulation
    const shuffled = [...(quizList || [])].sort(() => 0.5 - Math.random());
    setShuffledQuestions(shuffled.slice(0, 10));
  }, [quizList]);

  const handleOptionClick = (index) => {
    if (selectedOption !== null) return; // Prevent double clicks
    
    setSelectedOption(index);
    const Q = shuffledQuestions[currentIndex];
    const isCorrect = index === Q.answerIndex;
    
    if (isCorrect) {
      setScore(s => s + 1);
    }
    
    setTimeout(() => {
      if (currentIndex + 1 < shuffledQuestions.length) {
        setCurrentIndex(i => i + 1);
        setSelectedOption(null);
      } else {
        setIsFinished(true);
        onComplete(score + (isCorrect ? 1 : 0));
      }
    }, 1000);
  };

  if (shuffledQuestions.length === 0) return null;

  if (isFinished) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl mx-auto mt-12"
      >
        <Card className="text-center py-12 px-8 overflow-hidden relative">
          <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-primary-500/20 blur-[100px] rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2" />
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-24 h-24 bg-primary-500/20 text-primary-400 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 box-shadow-[0_0_40px_rgba(139,92,246,0.3)]"
          >
            <TrophyIcon className="w-12 h-12" />
          </motion.div>
          <h2 className="text-3xl font-bold mb-4 relative z-10">Quiz Complete! 🎉</h2>
          <p className="text-xl text-gray-300 mb-8 relative z-10">
            You scored <span className="text-primary-400 font-bold text-3xl mx-1">{score}</span> / {shuffledQuestions.length}
          </p>
          <Button onClick={() => setCurrentView('dashboard')} size="lg" className="w-full relative z-10 shadow-lg shadow-primary-500/25 hidden md:flex">
            Return to Dashboard
          </Button>
          <Button onClick={() => setCurrentView('dashboard')} size="md" className="w-full relative z-10 shadow-lg shadow-primary-500/25 md:hidden">
            Return to Dashboard
          </Button>
        </Card>
      </motion.div>
    );
  }

  const currentQ = shuffledQuestions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto mt-8 sm:mt-4 animate-fade-in">
      <div className="mb-6 flex justify-between items-center text-sm font-medium text-gray-400">
        <span className="bg-card px-3 py-1 rounded-full border border-cardBorder">Question {currentIndex + 1} of {shuffledQuestions.length}</span>
        <span className="bg-card px-3 py-1 rounded-full border border-cardBorder">Score: {score}</span>
      </div>
      
      {/* Progress Bar Container */}
      <div className="w-full bg-cardBorder h-2 rounded-full mb-8 overflow-hidden">
        <motion.div 
          className="bg-gradient-to-r from-primary-600 to-accent h-full"
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex) / shuffledQuestions.length) * 100}%` }}
          transition={{ ease: "easeInOut" }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-t-4 border-t-primary-500 shadow-xl">
            <h3 className="text-xl md:text-2xl font-bold mb-6 min-h-[4rem] text-white">
              {currentQ.question}
            </h3>
            
            <div className="space-y-3">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.answerIndex;
                const showStatus = selectedOption !== null;
                
                let btnVariant = "secondary";
                let StatusIcon = null;

                if (showStatus) {
                  if (isCorrect) {
                     btnVariant = "success";
                     StatusIcon = CheckCircle2;
                  } else if (isSelected && !isCorrect) {
                     btnVariant = "danger";
                     StatusIcon = XCircle;
                  }
                } else if (isSelected) {
                   btnVariant = "primary";
                }

                return (
                  <button
                    key={idx}
                    disabled={selectedOption !== null}
                    onClick={() => handleOptionClick(idx)}
                    className={cn(
                      "w-full text-left px-5 py-4 rounded-xl border-2 transition-all flex justify-between items-center",
                      btnVariant === "secondary" && "bg-card border-cardBorder hover:border-primary-500/50 hover:bg-card/80 text-gray-200",
                      btnVariant === "success" && "bg-green-500/10 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)] text-green-100",
                      btnVariant === "danger" && "bg-red-500/10 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)] text-red-100",
                      btnVariant === "primary" && "bg-primary-600 border-primary-500 text-white"
                    )}
                  >
                    <span className="font-medium text-base md:text-lg">{opt}</span>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: StatusIcon ? 1 : 0 }}
                    >
                      {StatusIcon && <StatusIcon className="w-6 h-6" />}
                    </motion.div>
                  </button>
                );
              })}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function TrophyIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
    </svg>
  );
}
