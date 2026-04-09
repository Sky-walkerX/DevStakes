import React from 'react';
import { motion } from 'motion/react';
import { 
  Sword, 
  Rocket, 
  Ghost, 
  Heart, 
  Zap, 
  Skull, 
  CloudRain, 
  Sun,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './GenreSelection.css';

const GENRES = [
  { id: 'fantasy', name: 'High Fantasy', icon: <Sword />, colorClass: 'genre-gradient-amber', image: 'https://picsum.photos/seed/castle/400/600' },
  { id: 'scifi', name: 'Cyberpunk', icon: <Rocket />, colorClass: 'genre-gradient-cyan', image: 'https://picsum.photos/seed/neon/400/600' },
  { id: 'horror', name: 'Gothic Horror', icon: <Ghost />, colorClass: 'genre-gradient-purple', image: 'https://picsum.photos/seed/dark/400/600' },
  { id: 'romance', name: 'Eternal Romance', icon: <Heart />, colorClass: 'genre-gradient-rose', image: 'https://picsum.photos/seed/love/400/600' },
  { id: 'action', name: 'Adrenaline', icon: <Zap />, colorClass: 'genre-gradient-yellow', image: 'https://picsum.photos/seed/speed/400/600' },
  { id: 'mystery', name: 'Noir Mystery', icon: <Skull />, colorClass: 'genre-gradient-slate', image: 'https://picsum.photos/seed/detective/400/600' },
  { id: 'drama', name: 'Modern Drama', icon: <CloudRain />, colorClass: 'genre-gradient-blue', image: 'https://picsum.photos/seed/rain/400/600' },
  { id: 'adventure', name: 'Epic Adventure', icon: <Sun />, colorClass: 'genre-gradient-emerald', image: 'https://picsum.photos/seed/mountain/400/600' },
];

export default function GenreSelection() {
  const navigate = useNavigate();
  return (
    <div className="genre-root">
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
        <h1 className="genre-title">Select Your <span className="text-highlight">Canvas</span></h1>
        <p className="genre-desc">Every great legend begins with a single choice. Which realm will you forge today?</p>
      </motion.div>

      <div className="genre-grid">
        {GENRES.map((genre, index) => (
          <motion.div
            key={genre.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -10 }}
            onClick={() => navigate('/gameplay', { state: { transition: 'fade', genre: genre.name } })}
            className="genre-card group"
          >
            <img 
              src={genre.image} 
              alt={genre.name} 
              className="genre-card-img"
              referrerPolicy="no-referrer"
            />
            <div className={`genre-color-overlay ${genre.colorClass}`} />
            <div className="genre-dark-overlay" />
            
            <div className="genre-card-content">
              <div className="genre-icon-wrapper">
                {genre.icon}
              </div>
              <h3 className="genre-card-title">{genre.name}</h3>
              <div className="genre-card-indicator" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
