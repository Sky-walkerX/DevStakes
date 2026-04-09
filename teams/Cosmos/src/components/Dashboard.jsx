import { Flame, Trophy, Calendar } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

export function Dashboard({ setCurrentView, streak, scores }) {
  const latestScore = scores.length > 0 ? scores[scores.length - 1].score : 0;
  const totalQuizzes = scores.length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-primary-600/20 to-accent/20 border border-primary-500/30 rounded-2xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 blur-[100px] rounded-full pointer-events-none" />
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Welcome back to StudyBro! 👋</h2>
        <p className="text-gray-400 max-w-lg text-base md:text-lg">
          Maintain your learning streak by completing your Daily 10 or reviewing your flashcards.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-6 relative z-10">
          <Button onClick={() => setCurrentView('quiz')}>Start Daily 10</Button>
          <Button variant="secondary" onClick={() => setCurrentView('flashcards')}>Review Flashcards</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex items-center space-x-4 border-t-2 border-t-amber-500 hover:shadow-amber-500/10 transition-shadow">
          <div className="p-3 bg-amber-500/20 rounded-xl">
            <Flame className="w-8 h-8 text-amber-500" />
          </div>
          <div>
            <p className="text-sm text-gray-400 font-medium">Current Streak</p>
            <p className="text-2xl font-bold text-white">{streak} Days 🔥</p>
          </div>
        </Card>

        <Card className="flex items-center space-x-4 border-t-2 border-t-primary-500 hover:shadow-primary-500/10 transition-shadow">
          <div className="p-3 bg-primary-500/20 rounded-xl">
            <Trophy className="w-8 h-8 text-primary-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400 font-medium">Latest Score</p>
            <p className="text-2xl font-bold text-white">{totalQuizzes > 0 ? `${latestScore}/5` : 'N/A'}</p>
          </div>
        </Card>

        <Card className="flex items-center space-x-4 border-t-2 border-t-accent hover:shadow-accent/10 transition-shadow">
          <div className="p-3 bg-accent/20 rounded-xl">
            <Calendar className="w-8 h-8 text-accent" />
          </div>
          <div>
            <p className="text-sm text-gray-400 font-medium">Total Quizzes</p>
            <p className="text-2xl font-bold text-white">{totalQuizzes}</p>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="text-xl font-bold mb-4">Recent Quiz History</h3>
        {totalQuizzes === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No quizzes taken yet. Start your first Daily 10!
          </div>
        ) : (
          <div className="space-y-3">
            {scores.slice().reverse().slice(0, 5).map((session, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-card border border-cardBorder/50 hover:bg-card/80 transition-colors">
                <span className="text-gray-300">{new Date(session.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                <span className="font-bold text-primary-400 bg-primary-500/10 px-3 py-1 rounded-md">{session.score} / 5</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
