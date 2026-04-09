import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

export function useTimer() {
  const { timerRunning, timeRemaining, tickTimer } = useGameStore();
  const intervalRef = useRef(null);

  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => {
        tickTimer();
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [timerRunning, tickTimer]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const urgencyLevel =
    timeRemaining <= 60 ? 'critical' :
    timeRemaining <= 120 ? 'warning' :
    'normal';

  return { timeRemaining, timerRunning, formatTime, urgencyLevel };
}
