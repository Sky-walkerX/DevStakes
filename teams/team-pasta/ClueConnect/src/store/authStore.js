import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useGameStore } from './gameStore';

export const useAuthStore = create((set, get) => ({
  user: null,
  userStats: null,
  loading: true,
  _initialized: false,
  isAuthModalOpen: false,

  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),

  initialize: async () => {
    if (get()._initialized) return;
    set({ _initialized: true });

    try {
      if (!supabase) throw new Error("Missing Supabase configuration. Please check your .env.local file.");

      // Check active session
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Supabase Session Error:", error);
        set({ user: null });
      } else {
        set({ user: session?.user || null });
        if (session?.user) {
          await get().fetchUserStats(session.user.id);
          useGameStore.getState().fetchSolvedCases(session.user.id);
        }
      }
    } catch (err) {
      console.error("Supabase Init Error:", err);
      set({ user: null });
    } finally {
      // Always unblock the UI, no matter what happened above
      set({ loading: false });
    }

    // Listen for auth changes
    if (supabase) {
      supabase.auth.onAuthStateChange(async (_event, session) => {
        set({ user: session?.user || null });
        if (session?.user) {
          await get().fetchUserStats(session.user.id);
          useGameStore.getState().fetchSolvedCases(session.user.id);
        } else {
          set({ userStats: null, loading: false });
          useGameStore.getState().setSolvedCaseIds([]);
        }
      });
    }
  },

  fetchUserStats: async (userId) => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user stats:', error);
      }
      
      set({ userStats: data || null, loading: false });
    } catch (err) {
      console.error('Error fetching user stats:', err);
      set({ loading: false });
    }
  },

  signUp: async (email, password, username) => {
    if (!supabase) return { error: new Error('Database connection not established') };
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
        }
      }
    });
    return { data, error };
  },

  signIn: async (email, password) => {
    if (!supabase) return { error: new Error('Database connection not established') };
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  signOut: async () => {
    if (supabase) await supabase.auth.signOut();
    set({ user: null, userStats: null });
    useGameStore.getState().setSolvedCaseIds([]);
  }
}));
