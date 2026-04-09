import { useCallback } from 'react';
import { useGameStore } from '../store/gameStore';

export function useGameLogic() {
  const store = useGameStore();

  const handleEvidenceClick = useCallback(
    (evidenceId) => {
      store.discoverEvidence(evidenceId);
      store.addEvidenceToBoard(evidenceId);

      // Auto-unlock connected evidence after a delay (simulates investigation)
      const evidence = store.currentCase?.evidence.find((e) => e.id === evidenceId);
      if (evidence?.connectsTo?.length) {
        setTimeout(() => {
          evidence.connectsTo.forEach((connId) => {
            store.discoverEvidence(connId);
          });
        }, 1500);
      }
    },
    [store]
  );

  const investigationProgress = useCallback(() => {
    if (!store.currentCase) return 0;
    const total = store.currentCase.evidence.length;
    const found = store.discoveredEvidenceIds.length;
    return Math.round((found / total) * 100);
  }, [store.currentCase, store.discoveredEvidenceIds]);

  const hasContradiction = useCallback(
    (suspectId) => {
      const suspect = store.currentCase?.suspects.find((s) => s.id === suspectId);
      if (!suspect) return false;
      return suspect.contradictions.some((eId) =>
        store.discoveredEvidenceIds.includes(eId)
      );
    },
    [store.currentCase, store.discoveredEvidenceIds]
  );

  const contradictionCount = useCallback(
    (suspectId) => {
      const suspect = store.currentCase?.suspects.find((s) => s.id === suspectId);
      if (!suspect) return 0;
      return suspect.contradictions.filter((eId) =>
        store.discoveredEvidenceIds.includes(eId)
      ).length;
    },
    [store.currentCase, store.discoveredEvidenceIds]
  );

  return {
    handleEvidenceClick,
    investigationProgress,
    hasContradiction,
    contradictionCount,
  };
}
