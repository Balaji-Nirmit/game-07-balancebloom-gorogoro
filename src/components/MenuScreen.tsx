import { useState } from 'react';
import { motion } from 'framer-motion';
import { soundEngine } from '../game/SoundEngine';

interface Props {
  onPlay: () => void;
  totalStars: number;
  onResetProgress: () => void;
}

export default function MenuScreen({ onPlay, totalStars, onResetProgress }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-background">
      {/* Decorative shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-[15%] left-[10%] w-16 h-16 rounded-lg bg-game-object-1 opacity-10"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute top-[25%] right-[15%] w-12 h-12 rounded-full bg-game-object-2 opacity-10"
          animate={{ y: [-10, 10] }}
          transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[20%] left-[20%] w-10 h-10 rounded-full bg-game-object-3 opacity-10"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[30%] right-[10%] w-14 h-14 rounded-lg bg-game-object-5 opacity-10 rotate-45"
          animate={{ rotate: [45, 405] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Logo / Title */}
        <motion.div
          className="mb-2"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center game-shadow-lg mb-6">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect x="5" y="18" width="30" height="4" rx="2" fill="hsl(36,33%,96%)" />
              <polygon points="20,30 15,38 25,38" fill="hsl(36,33%,96%)" />
              <circle cx="12" cy="14" r="5" fill="hsl(36,33%,96%)" opacity="0.8" />
              <rect x="25" y="10" width="8" height="8" rx="1.5" fill="hsl(36,33%,96%)" opacity="0.8" />
            </svg>
          </div>
        </motion.div>

        <h1 className="font-display text-5xl sm:text-6xl text-foreground mb-2 tracking-tight">
          Balance
        </h1>
        <p className="text-game-text-sub text-base mb-10 text-balance text-center max-w-[260px]">
          Stack. Balance. Find harmony in physics.
        </p>

        {/* Play button */}
        <motion.button
          className="w-full max-w-[280px] py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg game-shadow-lg active:scale-95 transition-transform"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => { soundEngine.click(); onPlay(); }}
        >
          Play
        </motion.button>

        {/* Stars */}
        {totalStars > 0 && (
          <motion.div
            className="mt-6 flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="hsl(40,85%,55%)">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
            </svg>
            <span className="text-sm font-medium text-game-text-sub">{totalStars} stars collected</span>
          </motion.div>
        )}

        {/* Sound toggle + Reset */}
        <div className="mt-8 flex items-center gap-6">
          <SoundToggle />
          {totalStars > 0 && (
            <button
              className="text-xs text-game-text-sub underline decoration-dotted underline-offset-4 hover:text-foreground transition-colors"
              onClick={() => { soundEngine.click(); onResetProgress(); }}
            >
              Reset progress
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function SoundToggle() {
  const [muted, setMuted] = useState(soundEngine.isMuted());
  return (
    <button
      className="text-game-text-sub hover:text-foreground transition-colors"
      onClick={() => {
        const next = !muted;
        soundEngine.setMuted(next);
        setMuted(next);
        if (!next) soundEngine.click();
      }}
    >
      {muted ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      )}
    </button>
  );
}
