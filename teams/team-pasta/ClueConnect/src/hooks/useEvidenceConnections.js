import { useState, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';

export function useEvidenceConnections() {
  const { addConnection, removeConnection, connections, boardItems } = useGameStore();
  const [pendingFrom, setPendingFrom] = useState(null); // boardItemId

  const startConnection = useCallback((boardItemId) => {
    setPendingFrom(boardItemId);
  }, []);

  const finishConnection = useCallback(
    (boardItemId) => {
      if (pendingFrom && pendingFrom !== boardItemId) {
        addConnection(pendingFrom, boardItemId);
      }
      setPendingFrom(null);
    },
    [pendingFrom, addConnection]
  );

  const cancelConnection = useCallback(() => {
    setPendingFrom(null);
  }, []);

  const deleteConnection = useCallback(
    (connectionId) => {
      removeConnection(connectionId);
    },
    [removeConnection]
  );

  // Get center position of a board item
  const getItemCenter = useCallback(
    (boardItemId) => {
      const item = boardItems.find((i) => i.id === boardItemId);
      if (!item) return { x: 0, y: 0 };
      return { x: item.x + 60, y: item.y + 40 };
    },
    [boardItems]
  );

  return {
    pendingFrom,
    connections,
    startConnection,
    finishConnection,
    cancelConnection,
    deleteConnection,
    getItemCenter,
  };
}
