import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/Button';

export function SmartFlashcards({ flashcardList, setFlashcardList }) {

  const handleAction = (id) => {
    // Remove the card visually when user clicks Easy or Hard
    setFlashcardList(flashcardList.filter(card => card.id !== id));
  };

  if (!flashcardList || flashcardList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] animate-fade-in">
        <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-accent">You're all caught up! 🚀</h2>
        <p className="text-gray-400 mb-8 max-w-md text-center">Great job reviewing all your flashcards today. Use the AI generator or reset to get more!</p>
        <Button onClick={() => window.location.reload()} size="lg">Reset Defaults</Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8 p-6 bg-card/50 rounded-2xl border border-cardBorder">
        <h2 className="text-3xl font-bold mb-2 text-white">Smart Flashcards</h2>
        <p className="text-gray-400">Click any card to reveal the answer with a 3D flip. Then mark it Easy or Hard to proceed.</p>
        <div className="mt-4 text-sm font-medium text-primary-400">{flashcardList.length} cards remaining</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <AnimatePresence>
          {flashcardList.map((card) => (
            <Flashcard key={card.id} card={card} onAction={handleAction} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Flashcard({ card, onAction }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.3 } }}
      className="h-72 w-full relative perspective-1000 group mx-auto"
    >
      <motion.div
        className="w-full h-full relative cursor-pointer transform-style-3d transition-transform duration-500 shadow-xl group-hover:shadow-primary-500/10 rounded-xl"
        onClick={() => setIsFlipped(!isFlipped)}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
      >
        {/* Front side */}
        <div className="absolute inset-0 backface-hidden glass-panel p-6 flex flex-col justify-center items-center text-center border-t-4 border-t-primary-500 hover:border-t-primary-400 transition-colors">
          <span className="text-xs text-primary-400/80 uppercase tracking-widest font-bold mb-4 bg-primary-500/10 px-3 py-1 rounded-full">Term</span>
          <h3 className="text-2xl font-bold text-white">{card.term}</h3>
          <p className="text-sm text-gray-500 mt-auto animate-pulse flex items-center space-x-2">
            <span>Click to flip</span>
          </p>
        </div>

        {/* Back side */}
        <div 
          className="absolute inset-0 backface-hidden glass-panel p-6 flex flex-col border-t-4 border-t-accent"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <div className="flex-1 overflow-y-auto text-gray-200 custom-scroll pr-2">
            <span className="text-xs text-accent uppercase tracking-widest font-bold mb-3 block opacity-80">Definition</span>
            <p className="text-base leading-relaxed text-left">{card.definition}</p>
          </div>
          
          {/* Prevent card flip when clicking buttons */}
          <div className="flex space-x-3 mt-4 pt-4 border-t border-cardBorder" onClick={e => e.stopPropagation()}>
            <Button variant="danger" className="flex-1" onClick={() => onAction(card.id)}>
              Hard
            </Button>
            <Button variant="success" className="flex-1" onClick={() => onAction(card.id)}>
              Easy
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
