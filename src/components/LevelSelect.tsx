import { motion } from 'framer-motion';
import { levels } from '../game/levels';
import { soundEngine } from '../game/SoundEngine';

interface Props {
  completedLevels: Record<number, number>;
  isLevelUnlocked: (id: number) => boolean;
  onSelectLevel: (id: number) => void;
  onBack: () => void;
}

export default function LevelSelect({ completedLevels, isLevelUnlocked, onSelectLevel, onBack }: Props) {
  const sections = [
    { name: 'Tutorial', range: [1, 5] },
    { name: 'Easy', range: [6, 10] },
    { name: 'Medium', range: [11, 15] },
    { name: 'Hard', range: [16, 20] },
    { name: 'Expert', range: [21, 25] },
    { name: 'Master', range: [26, 30] },
    { name: 'Bonus', range: [31, 32] },
  ];

  return (
    <div className="h-screen overflow-y-auto bg-background">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between px-5 py-4 max-w-lg mx-auto">
          <button
            className="text-primary font-medium text-sm flex items-center gap-1"
            onClick={() => { soundEngine.click(); onBack(); }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Menu
          </button>
          <h2 className="font-display text-xl text-foreground">Levels</h2>
          <div className="w-12" />
        </div>
      </div>

      {/* Level grid */}
      <div className="max-w-lg mx-auto px-5 py-6 pb-20">
        {sections.map(({ name, range }) => (
          <div key={name} className="mb-8">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-game-text-sub mb-3">{name}</h3>
            <div className="grid grid-cols-5 gap-3">
              {levels.filter(l => l.id >= range[0] && l.id <= range[1]).map((level, i) => {
                const unlocked = isLevelUnlocked(level.id);
                const stars = completedLevels[level.id] || 0;

                return (
                  <motion.button
                    key={level.id}
                    className={`relative aspect-square rounded-xl flex flex-col items-center justify-center transition-all ${
                      unlocked
                        ? 'bg-card game-shadow-sm active:scale-95 hover:game-shadow-md'
                        : 'bg-muted opacity-50 cursor-not-allowed'
                    }`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => {
                      if (!unlocked) return;
                      soundEngine.click();
                      onSelectLevel(level.id);
                    }}
                    disabled={!unlocked}
                  >
                    <span className={`text-lg font-bold ${unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {level.id}
                    </span>
                    {stars > 0 && (
                      <div className="flex gap-0.5 mt-0.5">
                        {[1, 2, 3].map(s => (
                          <svg key={s} width="8" height="8" viewBox="0 0 24 24" fill={s <= stars ? 'hsl(40,85%,55%)' : 'hsl(30,15%,80%)'}>
                            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                          </svg>
                        ))}
                      </div>
                    )}
                    {!unlocked && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground absolute">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
