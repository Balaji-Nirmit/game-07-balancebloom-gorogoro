import { useState, useCallback } from 'react';
import { levels, getTotalStars } from './levels';

export type Screen = 'menu' | 'levels' | 'game' | 'complete';

interface GameState {
  screen: Screen;
  currentLevel: number;
  completedLevels: Record<number, number>; // levelId -> stars (1-3)
  totalStars: number;
}

const STORAGE_KEY = 'balance-game-progress';

function loadProgress(): Record<number, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveProgress(data: Record<number, number>) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

export function useGameState() {
  const [state, setState] = useState<GameState>(() => {
    const completed = loadProgress();
    return {
      screen: 'menu',
      currentLevel: 1,
      completedLevels: completed,
      totalStars: getTotalStars(completed),
    };
  });

  const goToMenu = useCallback(() => setState(s => ({ ...s, screen: 'menu' })), []);
  const goToLevels = useCallback(() => setState(s => ({ ...s, screen: 'levels' })), []);

  const startLevel = useCallback((levelId: number) => {
    setState(s => ({ ...s, screen: 'game', currentLevel: levelId }));
  }, []);

  const completeLevel = useCallback((levelId: number, stars: number) => {
    setState(s => {
      const prev = s.completedLevels[levelId] || 0;
      const newCompleted = { ...s.completedLevels, [levelId]: Math.max(prev, stars) };
      saveProgress(newCompleted);
      return {
        ...s,
        screen: 'complete',
        completedLevels: newCompleted,
        totalStars: getTotalStars(newCompleted),
      };
    });
  }, []);

  const nextLevel = useCallback(() => {
    setState(s => {
      const next = s.currentLevel + 1;
      if (next > levels.length) return { ...s, screen: 'levels' };
      return { ...s, screen: 'game', currentLevel: next };
    });
  }, []);

  const retryLevel = useCallback(() => {
    setState(s => ({ ...s, screen: 'game' }));
  }, []);

  const isLevelUnlocked = useCallback((levelId: number) => {
    if (levelId === 1) return true;
    return !!state.completedLevels[levelId - 1];
  }, [state.completedLevels]);

  const resetProgress = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState({ screen: 'menu', currentLevel: 1, completedLevels: {}, totalStars: 0 });
  }, []);

  return {
    ...state,
    goToMenu,
    goToLevels,
    startLevel,
    completeLevel,
    nextLevel,
    retryLevel,
    isLevelUnlocked,
    resetProgress,
    levelConfig: levels.find(l => l.id === state.currentLevel) || levels[0],
  };
}
