import React from 'react';
import { useAuthStore } from '../store/authStore';
import { User, LogOut, Award, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function ProfileBadge() {
  const { user, userStats, signOut, openAuthModal } = useAuthStore();

  if (!user) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={openAuthModal}
          className="flex items-center gap-3 bg-[#8b5cf6]/20 hover:bg-[#8b5cf6]/30 backdrop-blur-md rounded-full px-6 py-2.5 border border-[#8b5cf6]/40 shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all"
          style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(139, 92, 246, 0.2)', backdropFilter: 'blur(12px)', borderRadius: '9999px', padding: '10px 24px', border: '1px solid rgba(139, 92, 246, 0.4)', color: '#fff', cursor: 'pointer', outline: 'none' }}
        >
          <User size={18} className="text-[#c4b5fd]" style={{ color: '#c4b5fd' }} />
          <span className="text-sm font-mono font-bold tracking-widest uppercase" style={{ fontSize: '13px', fontFamily: 'monospace', fontWeight: 'bold', letterSpacing: '0.1em' }}>
            Initialize Agent
          </span>
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-5 bg-[#080d14]/80 backdrop-blur-md rounded-full px-5 py-2.5 border border-[#ffffff10] shadow-lg"
      style={{ display: 'flex', alignItems: 'center', gap: '20px', background: 'rgba(8, 13, 20, 0.8)', backdropFilter: 'blur(12px)', borderRadius: '9999px', padding: '10px 20px', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-center gap-3" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#8b5cf6]/20 border border-[#8b5cf6]/30 text-[#8b5cf6]"
             style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.2)', border: '1px solid rgba(139, 92, 246, 0.3)', color: '#8b5cf6' }}>
          <User size={18} />
        </div>
        <div className="flex flex-col" style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="text-sm font-mono font-bold text-[#eef2ff]" style={{ fontSize: '14px', fontFamily: 'monospace', fontWeight: 'bold', color: '#eef2ff' }}>
            {userStats?.username || user.email?.split('@')[0]}
          </span>
          <span className="text-[11px] uppercase tracking-wider text-[#06b6d4]" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#06b6d4' }}>
            Operative Status Active
          </span>
        </div>
      </div>

      <div className="w-[1px] h-8 bg-[#ffffff10]" style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.1)' }} />

      <div className="flex items-center gap-5" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Award size={16} className="text-[#f59e0b]" style={{ color: '#f59e0b' }} />
          <span className="text-sm font-mono text-[#eef2ff]" style={{ fontSize: '13px', fontFamily: 'monospace', color: '#eef2ff' }}>
            {userStats?.total_score || 0} Pts
          </span>
        </div>
        <div className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={16} className="text-[#10b981]" style={{ color: '#10b981' }} />
          <span className="text-sm font-mono text-[#eef2ff]" style={{ fontSize: '13px', fontFamily: 'monospace', color: '#eef2ff' }}>
            {userStats?.cases_solved_count || 0} Solved
          </span>
        </div>
      </div>

      <button 
        onClick={() => signOut()}
        className="ml-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-500/20 text-[#3d4f6a] hover:text-red-400 transition-colors"
        style={{ marginLeft: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', background: 'transparent', border: 'none', color: '#3d4f6a' }}
        title="Sign Out"
      >
        <LogOut size={16} />
      </button>
    </motion.div>
  );
}
