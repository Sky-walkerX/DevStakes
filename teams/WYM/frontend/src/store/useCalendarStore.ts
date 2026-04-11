import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Session } from '../types';
import { todaySessions, backupSessions } from '../data/scheduleData';
import * as api from '../api/client';

/* ──────────────────────────────────────────────────────────
   Calendar Store — API-backed with local fallback
   Manages timeline sessions & burnout risk
   ────────────────────────────────────────────────────────── */

interface CalendarState {
  sessions: Session[];
  burnoutRisk: number;
  isRecalculating: boolean;
  efficiency: number;
  dayStreak: number;
  peakOutput: string;
  isBackendConnected: boolean;
  isLoading: boolean;

  // Actions
  fetchFromBackend: () => Promise<void>;
  missSession: (id: string) => void;
  recalculate: () => void;
  markActive: (id: string) => void;
  completeSession: (id: string) => void;
  addSession: (session: Omit<Session, 'id'>) => void;
  removeSession: (id: string) => void;
}

/** Finds the hour block with the most completed sessions */
function computePeakOutput(sessions: Session[]): string {
  const completed = sessions.filter(s => s.status === 'completed');
  if (completed.length === 0) return '--:--h';
  
  const hourCounts: Record<string, number> = {};
  completed.forEach(s => {
    const hour = s.time.split(':')[0]; // e.g. '09'
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });
  
  const peakHour = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0][0];
  return `${peakHour}:00h`;
}

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set, get) => ({
  sessions: todaySessions,
  burnoutRisk: 42,
  isRecalculating: false,
  efficiency: 94.2,
  dayStreak: 124,
  peakOutput: '09:14h',
  isBackendConnected: false,
  isLoading: false,

  fetchFromBackend: async () => {
    set({ isLoading: true });
    try {
      const [sessions, stats] = await Promise.all([
        api.fetchSessions(),
        api.fetchDashboardStats(),
      ]);
      set({
        sessions,
        burnoutRisk: stats.burnoutRisk,
        efficiency: stats.efficiency,
        dayStreak: stats.dayStreak,
        peakOutput: stats.peakOutput,
        isBackendConnected: true,
        isLoading: false,
      });
    } catch (error) {
      console.warn('⚠️ Backend unreachable, using local data:', error);
      set({ isBackendConnected: false, isLoading: false });
    }
  },

  missSession: (id: string) => {
    const { isBackendConnected } = get();

    // Optimistic update
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === id ? { ...s, status: 'missed' as const } : s
      ),
      burnoutRisk: Math.min(100, state.burnoutRisk + 12),
    }));

    // Sync to backend
    if (isBackendConnected) {
      api.updateSession(id, { status: 'missed' }).catch((err) => {
        console.error('Failed to sync miss to backend:', err);
      });
    }
  },

  recalculate: () => {
    const { isBackendConnected } = get();
    set({ isRecalculating: true });

    if (isBackendConnected) {
      // Use backend smart recalculation
      api.recalculateSessions()
        .then((result) => {
          set({
            sessions: result.sessions,
            burnoutRisk: result.burnoutRisk,
            efficiency: result.efficiency,
            isRecalculating: false,
          });
        })
        .catch((err) => {
          console.error('Backend recalculation failed:', err);
          // Fallback to local recalculation
          localRecalculate(set, get);
        });
    } else {
      localRecalculate(set, get);
    }
  },

  markActive: (id: string) => {
    const { isBackendConnected } = get();

    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === id
          ? { ...s, status: 'active' as const }
          : s
      ),
    }));

    if (isBackendConnected) {
      api.updateSession(id, { status: 'active' }).catch(console.error);
    }
  },

  completeSession: (id) => {
    const { isBackendConnected } = get();

    set((state) => {
      const updatedSessions = state.sessions.map((s) =>
        s.id === id ? { ...s, status: 'completed' as const } : s
      );
      return {
        sessions: updatedSessions,
        efficiency: Math.min(100, state.efficiency + 0.5),
        burnoutRisk: Math.max(0, state.burnoutRisk - 5),
        dayStreak: state.dayStreak + 1,
        peakOutput: computePeakOutput(updatedSessions),
      };
    });

    if (isBackendConnected) {
      api.updateSession(id, { status: 'completed' }).catch(console.error);
    }
  },

  addSession: (session) => {
    const { isBackendConnected } = get();

    if (isBackendConnected) {
      api.createSession(session as any)
        .then((created) => {
          set((state) => ({
            sessions: [...state.sessions, created].sort((a, b) =>
              a.time.localeCompare(b.time)
            ),
          }));
        })
        .catch(console.error);
    } else {
      // Local-only fallback
      set((state) => {
        const newId = `session-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const subjectSessions = state.sessions.filter(s => s.subject === session.subject);
        const sessionNumber = session.sessionNumber || subjectSessions.length + 1;

        const updatedSessions = [
          ...state.sessions,
          { ...session, id: newId, sessionNumber }
        ].sort((a, b) => a.time.localeCompare(b.time));

        return { sessions: updatedSessions };
      });
    }
  },

  removeSession: (id) => {
    const { isBackendConnected } = get();

    set((state) => ({
      sessions: state.sessions.filter((s) => s.id !== id),
    }));

    if (isBackendConnected) {
      api.deleteSession(id).catch(console.error);
    }
  },
    }),
    {
      name: 'calendar-storage',
    }
  )
);


/** Local fallback recalculation (original logic) */
function localRecalculate(
  set: (fn: (state: CalendarState) => Partial<CalendarState>) => void,
  get: () => CalendarState
) {
  setTimeout(() => {
    const { sessions } = get();
    const missedSessions = sessions.filter((s) => s.status === 'missed');
    const activeSessions = sessions.filter((s) => s.status !== 'missed');

    const rescheduled = [
      ...activeSessions,
      ...backupSessions.slice(0, missedSessions.length),
    ].sort((a, b) => a.time.localeCompare(b.time));

    set(() => ({
      sessions: rescheduled,
      burnoutRisk: Math.max(15, get().burnoutRisk - 20),
      isRecalculating: false,
      efficiency: Math.min(99.9, get().efficiency + 1.5),
    }));
  }, 2000);
}
