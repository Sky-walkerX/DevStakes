import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Dashboard } from './components/Dashboard';
import { QuizHub } from './components/QuizHub';
import { SmartFlashcards } from './components/SmartFlashcards';
import { AIGenerator } from './components/AIGenerator';
import { useLocalStorage } from './hooks/useLocalStorage';

// Bootstrapping the initial static data arrays
import { quizQuestions as defaultQuizData } from './data/quizQuestions';
import { flashcards as defaultFlashcardData } from './data/flashcards';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  
  // Storage states
  const [streak, setStreak] = useLocalStorage('studybro_streak', 0);
  const [lastQuizDate, setLastQuizDate] = useLocalStorage('studybro_lastQuiz', null);
  const [scores, setScores] = useLocalStorage('studybro_scores', []);

  // Data states hoisted for AI injection
  const [quizList, setQuizList] = useLocalStorage('studybro_quiz_data', defaultQuizData);
  const [flashcardList, setFlashcardList] = useLocalStorage('studybro_flashcard_data', defaultFlashcardData);

  // Check and potentially reset streak on initial load
  useEffect(() => {
    if (lastQuizDate) {
      const lastDate = new Date(lastQuizDate);
      const today = new Date();
      // Remove time part to compare purely dates
      lastDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      
      const diffTime = today.getTime() - lastDate.getTime();
      const diffDays = diffTime / (1000 * 3600 * 24);
      
      if (diffDays > 1) {
        setStreak(0); // Lost streak
      }
    }
  }, []);

  const handleQuizComplete = (score) => {
    const todayStr = new Date().toISOString();
    
    // Check if took quiz today already
    let newStreak = streak;
    if (lastQuizDate) {
      const lastD = new Date(lastQuizDate).setHours(0,0,0,0);
      const currD = new Date().setHours(0,0,0,0);
      if (currD > lastD) {
        newStreak += 1;
      }
    } else {
      newStreak = 1;
    }

    setStreak(newStreak);
    setLastQuizDate(todayStr);
    setScores([...scores, { score, date: todayStr }]);
  };

  const handleAddQuizzes = (newQuizzes) => {
    // We overwrite or append? For MVP, let's prepend generated questions.
    setQuizList([...newQuizzes, ...quizList]);
  };

  const handleAddFlashcards = (newCards) => {
    setFlashcardList([...newCards, ...flashcardList]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-gray-100">
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-6">
        {currentView === 'dashboard' && (
          <Dashboard setCurrentView={setCurrentView} streak={streak} scores={scores} />
        )}
        {currentView === 'quiz' && (
          <QuizHub onComplete={handleQuizComplete} setCurrentView={setCurrentView} quizList={quizList} />
        )}
        {currentView === 'flashcards' && (
          <SmartFlashcards flashcardList={flashcardList} setFlashcardList={setFlashcardList} />
        )}
        {currentView === 'ai-generator' && (
          <AIGenerator 
            addQuizzes={handleAddQuizzes} 
            addFlashcards={handleAddFlashcards} 
            setCurrentView={setCurrentView} 
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
