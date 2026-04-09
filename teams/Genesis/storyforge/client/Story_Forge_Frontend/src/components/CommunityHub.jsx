import React from 'react';
import { motion } from 'motion/react';
import { Search, Hash, TrendingUp, Users, ArrowLeft, MessageSquare, Heart, Share2, Filter, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './CommunityHub.css';

export default function CommunityHub() {
  const navigate = useNavigate();
  return (
    <div className="hub-root">
      <div className="hub-layout">
        {/* Main Content */}
        <div className="hub-main">
          <header className="hub-header">
            <button 
              onClick={() => navigate('/', { state: { transition: 'push_back' } })}
              className="btn-back"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="hub-badge">
              <Users size={20} />
              <span>Collective Imagination</span>
            </div>
            <h1 className="hub-title">The Nexus Hub</h1>
            <div className="hub-search-container">
              <Search className="hub-search-icon" size={20} />
              <input 
                type="text" 
                placeholder="Search realms, architects, or lore..." 
                className="hub-search-input glass-panel"
              />
            </div>
          </header>

          <section className="hub-feed">
            <div className="feed-header">
              <h2>Recent Forgings</h2>
              <div className="feed-actions">
                <button className="btn-feed-action glass-panel">
                  <Filter size={16} />
                  <span>Filter</span>
                </button>
                <button className="btn-feed-action glass-panel">
                  <TrendingUp size={16} />
                  <span>Trending</span>
                </button>
              </div>
            </div>

            <div className="posts-container">
              <PostCard 
                author="Aria_Vane" 
                avatar="https://picsum.photos/seed/aria/100/100"
                time="2h ago"
                content="Just finished forging the 'Crystal Spires' in the Aether Realm. The neural rendering on the light refraction is incredible! Who wants to join the next chapter?"
                image="https://picsum.photos/seed/crystal/800/400"
                likes={1240}
                comments={89}
              />
              <PostCard 
                author="Kaelen_The_Wise" 
                avatar="https://picsum.photos/seed/kaelen/100/100"
                time="5h ago"
                content="The Great Collapse lore has been updated. Check out the new timeline in the Chronos Archive. Major implications for the upcoming Siege of Iron."
                likes={856}
                comments={42}
              />
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="hub-sidebar">
          <div className="sidebar-panel glass-panel">
            <h3>Top Architects</h3>
            <div className="architect-list">
              <ArchitectItem name="Nova_Prime" rank={1} level={99} />
              <ArchitectItem name="Shadow_Weaver" rank={2} level={94} />
              <ArchitectItem name="Elias_Thorne" rank={3} level={88} isUser onClick={() => navigate('/identity', { state: { transition: 'slide_up' } })} />
              <ArchitectItem name="Luna_X" rank={4} level={82} />
            </div>
            <button className="btn-sidebar-viewall">View Leaderboard</button>
          </div>

          <div className="sidebar-panel glass-panel">
            <h3>Active Realms</h3>
            <div className="realm-list">
              <RealmItem name="Neon Syndicate" players={12400} />
              <RealmItem name="Dragon's Peak" players={8900} />
              <RealmItem name="The Void" players={5600} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function PostCard({ author, avatar, time, content, image, likes, comments }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="post-card glass-panel"
    >
      <div className="post-header">
        <div className="post-author-info">
          <img src={avatar} alt={author} className="post-avatar" referrerPolicy="no-referrer" />
          <div className="post-author-text">
            <span className="post-author-name">{author}</span>
            <span className="post-time">{time}</span>
          </div>
        </div>
        <button className="btn-more-options">
          <MoreHorizontal size={24} />
        </button>
      </div>
      <p className="post-content">{content}</p>
      {image && (
        <div className="post-image-container">
          <img src={image} alt="Post content" className="post-image" referrerPolicy="no-referrer" />
        </div>
      )}
      <div className="post-actions">
        <button className="btn-post-action action-like group">
          <Heart size={20} className="icon-like" />
          <span>{likes}</span>
        </button>
        <button className="btn-post-action action-comment">
          <MessageSquare size={20} />
          <span>{comments}</span>
        </button>
        <button className="btn-post-action action-share">
          <Share2 size={20} />
        </button>
      </div>
    </motion.div>
  );
}

function ArchitectItem({ name, rank, level, isUser, onClick }) {
  return (
    <div 
      className={`architect-item ${isUser ? 'is-user' : ''}`}
      onClick={onClick}
    >
      <span className="architect-rank">#{rank}</span>
      <div className="architect-avatar-placeholder" />
      <div className="architect-info">
        <span className={`architect-name ${isUser ? 'text-primary' : ''}`}>{name}</span>
        <span className="architect-level">Level {level}</span>
      </div>
    </div>
  );
}

function RealmItem({ name, players }) {
  return (
    <div className="sidebar-realm-item">
      <span className="sidebar-realm-name">{name}</span>
      <span className="sidebar-realm-players">{players.toLocaleString()} architects</span>
    </div>
  );
}
