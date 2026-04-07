import { useGameState } from '../game/useGameState';
import MenuScreen from '../components/MenuScreen';
import LevelSelect from '../components/LevelSelect';
import GameScreen from '../components/GameScreen';

export default function Index() {
  const game = useGameState();

  if (game.screen === 'menu') {
    return (
      <MenuScreen
        onPlay={game.goToLevels}
        totalStars={game.totalStars}
        onResetProgress={game.resetProgress}
      />
    );
  }

  if (game.screen === 'levels') {
    return (
      <LevelSelect
        completedLevels={game.completedLevels}
        isLevelUnlocked={game.isLevelUnlocked}
        onSelectLevel={game.startLevel}
        onBack={game.goToMenu}
      />
    );
  }

  if (game.screen === 'game' || game.screen === 'complete') {
    return (
      <GameScreen
        level={game.levelConfig}
        onBack={game.goToLevels}
        onComplete={(stars) => game.completeLevel(game.currentLevel, stars)}
        onRetry={game.retryLevel}
        onNext={game.nextLevel}
      />
    );
  }

  return null;
}
