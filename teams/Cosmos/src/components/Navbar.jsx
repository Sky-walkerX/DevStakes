import { LayoutDashboard, Gamepad2, BrainCircuit, Wand2 } from 'lucide-react';
import { cn } from './ui/Button';

export function Navbar({ currentView, setCurrentView }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'quiz', label: 'Daily 10', icon: Gamepad2 },
    { id: 'flashcards', label: 'Flashcards', icon: BrainCircuit },
    { id: 'ai-generator', label: 'AI Notes', icon: Wand2 },
  ];

  return (
    <header className="w-full border-b border-cardBorder bg-background/80 backdrop-blur-xl z-20 sticky top-0 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between py-3">
          
          <div className="flex items-center space-x-3 mb-3 md:mb-0">
            <div className="bg-primary-500 p-2 rounded-lg flex-shrink-0 shadow-lg shadow-primary-500/20">
              <BrainCircuit className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-accent">StudyBro</h1>
          </div>
          
          <nav className="flex overflow-x-auto space-x-2 pb-1 custom-scroll md:pb-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all font-medium whitespace-nowrap",
                    isActive 
                      ? "bg-primary-500 text-white shadow-lg shadow-primary-500/20" 
                      : "text-gray-400 hover:bg-card hover:text-white"
                  )}
                >
                  <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-gray-400")} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

        </div>
      </div>
    </header>
  );
}
