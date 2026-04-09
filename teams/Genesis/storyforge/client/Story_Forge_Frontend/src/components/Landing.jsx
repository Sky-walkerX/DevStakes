import React from 'react';
import { motion } from 'motion/react';
import { 
  Play, 
  ArrowRight, 
  Sparkles, 
  Compass, 
  Shield, 
  Zap,
  Globe,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="landing-root">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-wrapper">
          <img 
            src="https://picsum.photos/seed/nebula/1920/1080?blur=4" 
            alt="Background" 
            className="hero-bg-img"
            referrerPolicy="no-referrer"
          />
          <div className="hero-gradient-overlay-1" />
          <div className="hero-gradient-overlay-2" />
        </div>

        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="hero-content"
        >
          <div className="hero-badge">
            <Sparkles size={20} />
            <span>Neural Imagination Engine</span>
          </div>
          <h1 className="hero-title text-glow-primary">
            Forge Your <br />
            <span className="text-highlight">Own Reality</span>
          </h1>
          <p className="hero-desc">
            Step into a cinematic multi-screen narrative experience where every choice ripples through the multiverse. Your story isn't just told—it's forged in the fires of neural imagination.
          </p>
          <div className="hero-actions">
            <button 
              onClick={() => navigate('/create-story', { state: { transition: 'push' } })}
              className="btn-primary-large group"
            >
              <div className="btn-primary-overlay" />
              <div className="btn-content">
                <span>Begin Your Journey</span>
                <Play size={20} fill="currentColor" />
              </div>
            </button>
            <button 
              onClick={() => navigate('/genre-selection', { state: { transition: 'push' } })}
              className="btn-secondary-large glass-panel"
            >
              <span>Explore Realms</span>
              <Compass size={20} />
            </button>
          </div>
        </motion.div>

        <NexusCore />

        {/* Floating Stats/Elements */}
        <div className="hero-stats hidden-xl">
          <StatCard label="Active Stories" value="1.2M" />
          <StatCard label="Architects" value="450K" />
          <StatCard label="Nexus Nodes" value="89" />
        </div>
      </section>

      {/* Featured Realms */}
      <section className="realms-section">
        <div className="section-header">
          <div className="section-header-text">
            <h2>Trending Realms</h2>
            <p>Discover the most immersive worlds currently being forged by the community.</p>
          </div>
          <button 
            className="btn-link"
            onClick={() => navigate('/genre-selection', { state: { transition: 'push' } })}
          >
            <span>View All Realms</span>
            <ArrowRight size={20} />
          </button>
        </div>

        <div className="realms-grid">
          <RealmCard 
            title="Neo-Tokyo 2099" 
            genre="Cyberpunk" 
            image="https://picsum.photos/seed/cyberpunk/600/800" 
            rating={4.9}
          />
          <RealmCard 
            title="The Shattered Isles" 
            genre="High Fantasy" 
            image="https://picsum.photos/seed/fantasy/600/800" 
            rating={4.8}
          />
          <RealmCard 
            title="Void Runner" 
            genre="Sci-Fi Horror" 
            image="https://picsum.photos/seed/space/600/800" 
            rating={4.7}
          />
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section">
        <div className="features-grid">
          <FeatureItem 
            icon={<Zap size={32} className="feature-icon-color" />} 
            title="Instant Forging" 
            desc="AI-powered world building that responds to your intent in real-time."
          />
          <FeatureItem 
            icon={<Shield size={32} className="feature-icon-color" />} 
            title="Persistent Lore" 
            desc="Your choices are etched into the blockchain of the StoryForge multiverse."
          />
          <FeatureItem 
            icon={<Globe size={32} className="feature-icon-color" />} 
            title="Global Nexus" 
            desc="Collaborate with thousands of architects to build massive shared universes."
          />
          <FeatureItem 
            icon={<Star size={32} className="feature-icon-color" />} 
            title="Cinematic Visuals" 
            desc="Every story is rendered with high-fidelity neural graphics for total immersion."
          />
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <motion.div 
      whileHover={{ x: -10 }}
      className="stat-card glass-panel"
    >
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </motion.div>
  );
}

function RealmCard({ title, genre, image, rating }) {
  return (
    <motion.div 
      whileHover={{ y: -12 }}
      className="realm-card group"
    >
      <img 
        src={image} 
        alt={title} 
        className="realm-card-img"
        referrerPolicy="no-referrer"
      />
      <div className="realm-card-overlay" />
      <div className="realm-card-content">
        <div className="realm-card-header">
          <span className="realm-badge">
            {genre}
          </span>
          <div className="realm-rating">
            <Star size={12} fill="currentColor" />
            <span>{rating}</span>
          </div>
        </div>
        <h3 className="realm-title">{title}</h3>
        <p className="realm-desc">
          Explore the depths of this realm and forge your own legend among the stars.
        </p>
      </div>
    </motion.div>
  );
}

function FeatureItem({ icon, title, desc }) {
  return (
    <div className="feature-item glass-panel group">
      <div className="feature-icon-wrapper">
        {icon}
      </div>
      <div className="feature-text">
        <h4>{title}</h4>
        <p>{desc}</p>
      </div>
    </div>
  );
}

function NexusCore() {
  return (
    <div className="nexus-core-container">
      <motion.div 
        animate={{ rotateX: 360, rotateY: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="nexus-core"
      >
        <div className="core-face face-front" />
        <div className="core-face face-back" />
        <div className="core-face face-left" />
        <div className="core-face face-right" />
        <div className="core-face face-top" />
        <div className="core-face face-bottom" />
        <div className="core-glow" />
      </motion.div>
    </div>
  );
}

