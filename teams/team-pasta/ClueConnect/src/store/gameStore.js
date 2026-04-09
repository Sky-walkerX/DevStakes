import { create } from 'zustand';
import { getCaseById } from '../data/cases';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './authStore';

const INITIAL_STATE = {
  // Navigation
  gamePhase: 'home', // 'home' | 'briefing' | 'playing' | 'accusing' | 'result' | 'leaderboard'
  currentCaseId: null,
  currentCase: null,

  // Evidence state
  discoveredEvidenceIds: [],
  boardItems: [], // { id, evidenceId, x, y }
  connections: [], // { id, from, to }

  // Suspect state
  activeSuspectId: null,
  accusedSuspectId: null,

  // Timer
  timeRemaining: 0,
  timerRunning: false,

  // Score
  score: 0,
  scoreBreakdown: null,

  // UI
  activeEvidenceTab: 'evidence',
  showBriefing: true,
  isSystemBooted: true,

  // Solved cases (persisted across home navigation)
  solvedCaseIds: [],
  // Flag: if true, current run is a replay — score won't be submitted
  isReplay: false,
};

export const useGameStore = create((set, get) => ({
  ...INITIAL_STATE,

  // ── NAVIGATION ──────────────────────────────────────────

  goHome: () => {
    window.scrollTo(0, 0);
    set((state) => ({ ...INITIAL_STATE, solvedCaseIds: state.solvedCaseIds }));
  },
  goLeaderboard: () => set((state) => ({ ...INITIAL_STATE, solvedCaseIds: state.solvedCaseIds, gamePhase: 'leaderboard' })),

  selectCase: (caseId) => {
    const caseData = getCaseById(caseId);
    const initialEvidence = caseData.evidence
      .filter((e) => e.unlocked)
      .map((e) => e.id);

    set((state) => ({
      currentCaseId: caseId,
      currentCase: caseData,
      gamePhase: 'briefing',
      discoveredEvidenceIds: initialEvidence,
      boardItems: [],
      connections: [],
      activeSuspectId: null,
      accusedSuspectId: null,
      timeRemaining: caseData.timeLimit,
      timerRunning: false,
      score: 0,
      scoreBreakdown: null,
      activeEvidenceTab: 'evidence',
      showBriefing: true,
      solvedCaseIds: state.solvedCaseIds,
      isReplay: false,
    }));
  },

  // Start a replay — same as selectCase but marks isReplay = true
  replayCase: (caseId) => {
    const caseData = getCaseById(caseId);
    const initialEvidence = caseData.evidence
      .filter((e) => e.unlocked)
      .map((e) => e.id);

    set((state) => ({
      currentCaseId: caseId,
      currentCase: caseData,
      gamePhase: 'briefing',
      discoveredEvidenceIds: initialEvidence,
      boardItems: [],
      connections: [],
      activeSuspectId: null,
      accusedSuspectId: null,
      timeRemaining: caseData.timeLimit,
      timerRunning: false,
      score: 0,
      scoreBreakdown: null,
      activeEvidenceTab: 'evidence',
      showBriefing: true,
      solvedCaseIds: state.solvedCaseIds,
      isReplay: true,
    }));
  },

  startGame: () => {
    set({ gamePhase: 'playing', showBriefing: false, timerRunning: true });
  },

  openAccuseModal: () => set({ gamePhase: 'accusing' }),
  closeAccuseModal: () => set({ gamePhase: 'playing' }),

  // ── EVIDENCE ────────────────────────────────────────────

  discoverEvidence: (evidenceId) => {
    const { discoveredEvidenceIds } = get();
    if (!discoveredEvidenceIds.includes(evidenceId)) {
      set({ discoveredEvidenceIds: [...discoveredEvidenceIds, evidenceId] });
    }
  },

  addEvidenceToBoard: (evidenceId) => {
    const { boardItems } = get();
    if (boardItems.find((i) => i.evidenceId === evidenceId)) return;
    const newItem = {
      id: `board-${Date.now()}`,
      evidenceId,
      x: 100 + Math.random() * 400,
      y: 80 + Math.random() * 300,
    };
    set({ boardItems: [...boardItems, newItem] });
  },

  removeFromBoard: (boardItemId) => {
    const { boardItems, connections } = get();
    set({
      boardItems: boardItems.filter((i) => i.id !== boardItemId),
      connections: connections.filter(
        (c) => c.from !== boardItemId && c.to !== boardItemId
      ),
    });
  },

  updateBoardItemPosition: (boardItemId, x, y) => {
    set((state) => ({
      boardItems: state.boardItems.map((item) =>
        item.id === boardItemId ? { ...item, x, y } : item
      ),
    }));
  },

  addConnection: (fromId, toId) => {
    const { connections } = get();
    const exists = connections.find(
      (c) =>
        (c.from === fromId && c.to === toId) ||
        (c.from === toId && c.to === fromId)
    );
    if (!exists) {
      set({
        connections: [
          ...connections,
          { id: `conn-${Date.now()}`, from: fromId, to: toId },
        ],
      });
    }
  },

  removeConnection: (connectionId) => {
    set((state) => ({
      connections: state.connections.filter((c) => c.id !== connectionId),
    }));
  },

  // ── SUSPECTS ────────────────────────────────────────────

  setActiveSuspect: (suspectId) => set({ activeSuspectId: suspectId }),

  // ── TIMER ───────────────────────────────────────────────

  tickTimer: () => {
    const { timeRemaining } = get();
    if (timeRemaining <= 0) {
      set({ timerRunning: false });
      get().endGame(null); // time up — no accusation
      return;
    }
    set({ timeRemaining: timeRemaining - 1 });
  },

  pauseTimer: () => set({ timerRunning: false }),
  resumeTimer: () => set({ timerRunning: true }),

  // ── GAME END ────────────────────────────────────────────

  makeAccusation: (suspectId) => {
    const { currentCase, timeRemaining, discoveredEvidenceIds, connections, isReplay } = get();
    const isCorrect = suspectId === currentCase.correctSuspectId;

    const evidencePoints = discoveredEvidenceIds.length * 100;
    const connectionPoints = connections.length * 75;
    const timeBonus = Math.floor(timeRemaining * 0.5);
    const accuracyBonus = isCorrect ? 500 : 0;
    const totalScore = evidencePoints + connectionPoints + timeBonus + accuracyBonus;

    set((state) => ({
      accusedSuspectId: suspectId,
      timerRunning: false,
      gamePhase: 'result',
      score: totalScore,
      scoreBreakdown: {
        evidencePoints,
        connectionPoints,
        timeBonus,
        accuracyBonus,
        isCorrect,
      },
      // Mark this case as solved (only on correct non-replay)
      solvedCaseIds:
        isCorrect && !isReplay && !state.solvedCaseIds.includes(currentCase.id)
          ? [...state.solvedCaseIds, currentCase.id]
          : state.solvedCaseIds,
    }));

    // Sync to Supabase — skip if this is a replay
    const user = useAuthStore.getState().user;
    if (user && !isReplay) {
      (async () => {
        try {
          if (isCorrect) {
            await supabase.from('solved_cases_log').insert({
              user_id: user.id,
              case_id: currentCase.id,
              score_earned: totalScore,
            });
          }

          const { data: currentStats } = await supabase.from('user_stats').select('*').eq('id', user.id).single();
          if (currentStats) {
            await supabase.from('user_stats').update({
              total_score: (currentStats.total_score || 0) + totalScore,
              cases_solved_count: (currentStats.cases_solved_count || 0) + (isCorrect ? 1 : 0)
            }).eq('id', user.id);

            useAuthStore.getState().fetchUserStats(user.id);
          }
        } catch (err) {
          console.error('Supabase sync error', err);
        }
      })();
    }
  },

  endGame: (suspectId) => {
    get().makeAccusation(suspectId || '');
  },

  // ── UI STATE ────────────────────────────────────────────

  setActiveEvidenceTab: (tab) => set({ activeEvidenceTab: tab }),

  bootSystem: () => set({ isSystemBooted: true }),

  // ── SOLVED CASES SYNC ───────────────────────────────────

  setSolvedCaseIds: (ids) => set({ solvedCaseIds: ids }),

  fetchSolvedCases: async (userId) => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('solved_cases_log')
        .select('case_id')
        .eq('user_id', userId);
      if (data && !error) {
        set({ solvedCaseIds: data.map((d) => d.case_id) });
      }
    } catch (err) {
      console.error('Error fetching solved cases:', err);
    }
  },
}));
