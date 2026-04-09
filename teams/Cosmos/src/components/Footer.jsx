import { Globe, MessageCircle, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-cardBorder bg-background/30 py-8 mt-12 animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
        <div className="mb-4 md:mb-0 text-center md:text-left">
          <p className="font-bold text-gray-400 text-base mb-1">StudyBro</p>
          <p>© {new Date().getFullYear()} StudyBro MVP. Developed for the Hackathon.</p>
        </div>
        
        <div className="flex space-x-6 mb-4 md:mb-0">
          <a href="#" className="hover:text-primary-400 transition-colors">Terms & Conditions</a>
          <a href="#" className="hover:text-primary-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary-400 transition-colors">Contact Support</a>
        </div>

        <div className="flex space-x-4">
          <a href="#" className="p-2 bg-card rounded-md hover:bg-cardBorder transition-colors">
            <Globe className="w-4 h-4" />
          </a>
          <a href="#" className="p-2 bg-card rounded-md hover:bg-cardBorder transition-colors">
            <MessageCircle className="w-4 h-4" />
          </a>
          <a href="#" className="p-2 bg-card rounded-md hover:bg-cardBorder transition-colors text-accent">
            <Mail className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
