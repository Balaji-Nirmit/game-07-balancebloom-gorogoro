import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GameCanvas from './GameCanvas';
import { LevelConfig, levels } from '../game/levels';
import { soundEngine } from '../game/SoundEngine';

interface Props {
  level: LevelConfig;
  onBack: () => void;
  onComplete: (stars: number) => void;
  onRetry: () => void;
  onNext: () => void;
}

export default function GameScreen({ level, onBack, onComplete, onRetry, onNext }: Props) {
  const [result, setResult] = useState<{ type: 'win' | 'lose'; stars: number } | null>(null);
  const [key, setKey] = useState(0);

  const handleWin = useCallback((stars: number) => {
    setResult({ type: 'win', stars });
    onComplete(stars);
  }, [onComplete]);

  const handleLose = useCallback(() => {
    setResult({ type: 'lose', stars: 0 });
  }, []);

  const handleRetry = useCallback(() => {
    setResult(null);
    setKey(k => k + 1);
    soundEngine.click();
    onRetry();
  }, [onRetry]);

  const handleNext = useCallback(() => {
    setResult(null);
    setKey(k => k + 1);
    soundEngine.click();
    onNext();
  }, [onNext]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3">
        <button
          className="text-primary font-medium text-sm flex items-center gap-1"
          onClick={() => { soundEngine.click(); onBack(); }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Levels
        </button>
        <div className="text-center">
          <h2 className="font-display text-lg text-foreground">{level.name}</h2>
          <p className="text-xs text-game-text-sub">{level.id} / {levels.length}</p>
        </div>
        <button
          className="text-game-text-sub hover:text-foreground transition-colors"
          onClick={handleRetry}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
        </button>
      </div>

      {/* Description */}
      <p className="text-center text-sm text-game-text-sub px-6 mb-3">{level.description}</p>

      {/* Game */}
      <div className="flex-1 flex items-start justify-center px-2">
        <GameCanvas key={key} level={level} onWin={handleWin} onLose={handleLose} />
      </div>

      {/* Result overlay */}
      <AnimatePresence>
        {result && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-game-overlay/40 backdrop-blur-sm" />
            <motion.div
              className="relative bg-card rounded-3xl p-8 mx-6 max-w-sm w-full game-shadow-xl text-center"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', damping: 20 }}
            >
              {result.type === 'win' ? (
                <>
                  <h3 className="font-display text-3xl text-foreground mb-2">Balanced!</h3>
                  <p className="text-sm text-game-text-sub mb-5">
                    {result.stars === 3 ? 'Perfect balance!' : result.stars === 2 ? 'Great job!' : 'You did it!'}
                  </p>
                  {/* Stars */}
                  <div className="flex justify-center gap-3 mb-6">
                    {[1, 2, 3].map(s => (
                      <motion.svg
                        key={s}
                        width="36"
                        height="36"
                        viewBox="0 0 24 24"
                        fill={s <= result.stars ? 'hsl(40,85%,55%)' : 'hsl(30,15%,80%)'}
                        className={s <= result.stars ? 'animate-star-pop' : ''}
                        style={{ animationDelay: `${s * 0.15}s` }}
                      >
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                      </motion.svg>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button
                      className="flex-1 py-3 rounded-xl bg-secondary text-secondary-foreground font-medium active:scale-95 transition-transform"
                      onClick={handleRetry}
                    >
                      Retry
                    </button>
                    {level.id < levels.length && (
                      <button
                        className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-semibold active:scale-95 transition-transform game-shadow-sm"
                        onClick={handleNext}
                      >
                        Next Level
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <h3 className="font-display text-3xl text-foreground mb-2">Toppled!</h3>
                  <p className="text-sm text-game-text-sub mb-6">The pieces fell off. Try again!</p>
                  <button
                    className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold active:scale-95 transition-transform game-shadow-sm"
                    onClick={handleRetry}
                  >
                    Try Again
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
