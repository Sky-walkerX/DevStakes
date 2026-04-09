import React from 'react';
import { motion } from 'motion/react';
import { 
  Settings, 
  Award, 
  Book, 
  Users, 
  Map, 
  Zap,
  Edit3,
  LogOut,
  Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Identity.css';

export default function Identity() {
  const navigate = useNavigate();
  return (
    <div className="identity-root">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="identity-container"
      >
        {/* Profile Header */}
        <header className="profile-header group">
          <img 
            src="/assets/profile-banner.png" 
            alt="Cover" 
            className="profile-cover-img"
            referrerPolicy="no-referrer"
          />
          <div className="profile-cover-overlay" />
          
          <div className="profile-header-content">
            <div className="profile-avatar-container">
              <div className="profile-avatar-wrapper">
                <img 
                  src="/assets/profile-avatar.png" 
                  alt="Elias Thorne" 
                  className="profile-avatar"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="profile-avatar-badge">
                <Zap size={16} fill="currentColor" />
              </div>
            </div>
            
            <div className="profile-info">
              <div className="profile-title-row">
                <h1 className="profile-name">Elias Thorne</h1>
                <span className="profile-badge">Master Architect</span>
              </div>
              <p className="profile-bio">Forging digital dreams since the First Collapse. Seeker of the Shattered Isles.</p>
            </div>
            
            <div className="profile-actions">
              <button 
                className="btn-edit glass-panel"
                onClick={() => alert('Identity Modification Protocol initiated... (Feature coming soon)')}
              >
                <Edit3 size={16} />
                <span>Edit Identity</span>
              </button>
              <button 
                className="btn-settings glass-panel"
                onClick={() => alert('Accessing neural settings... (Feature coming soon)')}
              >
                <Settings size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="stats-grid">
          <StatBox icon={<Book size={20} className="text-cyan-400" />} label="Stories Forged" value="124" />
          <StatBox icon={<Users size={20} className="text-cyan-400" />} label="Followers" value="45.2K" />
          <StatBox icon={<Map size={20} className="text-cyan-400" />} label="Realms Explored" value="12" />
          <StatBox icon={<Award size={20} className="text-cyan-400" />} label="Achievements" value="89" />
        </div>

        {/* Main Content Area */}
        <div className="main-content-area">
          <div className="active-projects-container">
            <h2>Active Forgings</h2>
            <div className="projects-grid">
              <ProjectCard 
                title="The Neon Syndicate" 
                progress={85} 
                image="/assets/project-neon.png" 
                lastEdit="2 hours ago"
              />
              <ProjectCard 
                title="Aether Drift" 
                progress={42} 
                image="/assets/project-drift.png" 
                lastEdit="Yesterday"
              />
            </div>
          </div>

          <div className="achievements-container">
            <h2>Achievements</h2>
            <div className="achievements-panel glass-panel">
              <AchievementItem title="World Builder" desc="Forged 100+ unique story nodes." icon={<Globe size={24} />} />
              <AchievementItem title="Nexus Pioneer" desc="First 1000 architects to join." icon={<Zap size={24} />} />
              <AchievementItem title="Lore Master" desc="Contributed to 50+ shared realms." icon={<Book size={24} />} />
              <button className="btn-view-all">View All Achievements</button>
            </div>
          </div>
        </div>

        <div className="disconnect-container">
          <button 
            onClick={() => navigate('/', { state: { transition: 'slide_up' } })}
            className="btn-disconnect"
          >
            <LogOut size={20} />
            <span>Disconnect Identity</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function StatBox({ icon, label, value }) {
  return (
    <div className="stat-box glass-panel">
      <div className="stat-box-icon">
        {icon}
      </div>
      <div className="stat-box-content">
        <span className="stat-box-value">{value}</span>
        <span className="stat-box-label">{label}</span>
      </div>
    </div>
  );
}

function ProjectCard({ title, progress, image, lastEdit }) {
  return (
    <div className="project-card glass-panel group">
      <div className="project-card-image-wrapper">
        <img src={image} alt={title} className="project-card-image" referrerPolicy="no-referrer" />
        <div className="project-card-overlay" />
      </div>
      <div className="project-card-details">
        <div className="project-card-header">
          <h3>{title}</h3>
          <span>{lastEdit}</span>
        </div>
        <div className="project-card-progress">
          <div className="project-progress-labels">
            <span>Forging Progress</span>
            <span className="progress-value">{progress}%</span>
          </div>
          <div className="progress-bar-bg">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="progress-bar-fill"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function AchievementItem({ title, desc, icon }) {
  return (
    <div className="achievement-item group">
      <div className="achievement-icon">
        {icon}
      </div>
      <div className="achievement-text">
        <span className="achievement-title">{title}</span>
        <span className="achievement-desc">{desc}</span>
      </div>
    </div>
  );
}
