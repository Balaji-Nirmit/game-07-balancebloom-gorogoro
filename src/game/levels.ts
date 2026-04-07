export interface GamePiece {
  type: 'circle' | 'rect' | 'triangle';
  width: number;
  height: number;
  mass: number;
  color: string; // tailwind game color key
}

export interface LevelConfig {
  id: number;
  name: string;
  description: string;
  pieces: GamePiece[];
  beamLength: number; // relative to canvas width (0-1)
  pivotOffset: number; // -1 to 1 (0 = center)
  balanceThreshold: number; // max tilt angle in degrees to win
  balanceTime: number; // seconds to hold balance
  gravity: number;
}

const c = (type: GamePiece['type'], w: number, h: number, mass: number, color: string): GamePiece =>
  ({ type, width: w, height: h, mass, color });

const rect = (w: number, h: number, mass: number, color = 'game-object-1') => c('rect', w, h, mass, color);
const circle = (r: number, mass: number, color = 'game-object-2') => c('circle', r, r, mass, color);
const tri = (w: number, h: number, mass: number, color = 'game-object-3') => c('triangle', w, h, mass, color);

export const levels: LevelConfig[] = [
  // Tutorial (1-5): Simple, centered pivot
  { id: 1, name: 'First Steps', description: 'Place the block to balance the beam', pieces: [rect(40, 40, 1, 'game-object-1')], beamLength: 0.5, pivotOffset: 0, balanceThreshold: 8, balanceTime: 2, gravity: 0.8 },
  { id: 2, name: 'Two\'s Company', description: 'Balance two blocks', pieces: [rect(40, 40, 1, 'game-object-1'), rect(40, 40, 1, 'game-object-2')], beamLength: 0.5, pivotOffset: 0, balanceThreshold: 8, balanceTime: 2, gravity: 0.8 },
  { id: 3, name: 'Heavy & Light', description: 'Different weights need different positions', pieces: [rect(50, 50, 2, 'game-object-1'), rect(30, 30, 1, 'game-object-3')], beamLength: 0.55, pivotOffset: 0, balanceThreshold: 8, balanceTime: 2, gravity: 0.8 },
  { id: 4, name: 'Round World', description: 'Circles roll — be careful!', pieces: [circle(25, 1.5, 'game-object-2'), rect(40, 40, 1, 'game-object-1')], beamLength: 0.5, pivotOffset: 0, balanceThreshold: 8, balanceTime: 2, gravity: 0.8 },
  { id: 5, name: 'Triple Threat', description: 'Three pieces, one beam', pieces: [rect(35, 35, 1, 'game-object-1'), rect(35, 35, 1, 'game-object-2'), rect(35, 35, 1, 'game-object-3')], beamLength: 0.55, pivotOffset: 0, balanceThreshold: 7, balanceTime: 2.5, gravity: 0.8 },

  // Easy (6-10): Off-center pivots
  { id: 6, name: 'Off Center', description: 'The pivot isn\'t in the middle anymore', pieces: [rect(40, 40, 1, 'game-object-1'), rect(40, 40, 1, 'game-object-2')], beamLength: 0.55, pivotOffset: 0.15, balanceThreshold: 7, balanceTime: 2.5, gravity: 0.85 },
  { id: 7, name: 'The Big One', description: 'One heavy block changes everything', pieces: [rect(60, 60, 3, 'game-object-4'), rect(30, 30, 1, 'game-object-3')], beamLength: 0.55, pivotOffset: 0.1, balanceThreshold: 7, balanceTime: 2.5, gravity: 0.85 },
  { id: 8, name: 'Rolling Stones', description: 'Multiple circles — chaos!', pieces: [circle(20, 1, 'game-object-2'), circle(20, 1, 'game-object-3'), circle(25, 1.5, 'game-object-5')], beamLength: 0.5, pivotOffset: 0, balanceThreshold: 7, balanceTime: 2.5, gravity: 0.85 },
  { id: 9, name: 'Mixed Bag', description: 'Shapes of all kinds', pieces: [rect(40, 40, 1, 'game-object-1'), circle(22, 1.2, 'game-object-2'), tri(45, 40, 1, 'game-object-3')], beamLength: 0.55, pivotOffset: -0.1, balanceThreshold: 7, balanceTime: 2.5, gravity: 0.85 },
  { id: 10, name: 'Four Play', description: 'Four pieces need precision', pieces: [rect(35, 35, 1, 'game-object-1'), rect(35, 35, 1, 'game-object-2'), rect(30, 30, 0.8, 'game-object-3'), rect(30, 30, 0.8, 'game-object-5')], beamLength: 0.6, pivotOffset: 0, balanceThreshold: 6, balanceTime: 3, gravity: 0.85 },

  // Medium (11-15)
  { id: 11, name: 'Tiny Platform', description: 'Less beam, more skill', pieces: [rect(35, 35, 1, 'game-object-1'), rect(35, 35, 1, 'game-object-2')], beamLength: 0.4, pivotOffset: 0, balanceThreshold: 6, balanceTime: 3, gravity: 0.9 },
  { id: 12, name: 'Giant Steps', description: 'Huge weight differences', pieces: [rect(65, 65, 4, 'game-object-4'), rect(25, 25, 0.5, 'game-object-3'), rect(25, 25, 0.5, 'game-object-5')], beamLength: 0.55, pivotOffset: 0.2, balanceThreshold: 6, balanceTime: 3, gravity: 0.9 },
  { id: 13, name: 'Ball Pit', description: 'So many circles', pieces: [circle(18, 0.8, 'game-object-1'), circle(18, 0.8, 'game-object-2'), circle(18, 0.8, 'game-object-3'), circle(22, 1.2, 'game-object-5')], beamLength: 0.5, pivotOffset: 0.1, balanceThreshold: 6, balanceTime: 3, gravity: 0.9 },
  { id: 14, name: 'Tower Time', description: 'Stack them high', pieces: [rect(50, 20, 1, 'game-object-1'), rect(45, 20, 0.9, 'game-object-2'), rect(40, 20, 0.8, 'game-object-3'), rect(35, 20, 0.7, 'game-object-5')], beamLength: 0.55, pivotOffset: 0, balanceThreshold: 6, balanceTime: 3, gravity: 0.9 },
  { id: 15, name: 'Lean Left', description: 'Heavy pivot offset', pieces: [rect(40, 40, 1.5, 'game-object-1'), rect(40, 40, 1.5, 'game-object-2'), circle(20, 1, 'game-object-3')], beamLength: 0.55, pivotOffset: -0.25, balanceThreshold: 6, balanceTime: 3, gravity: 0.9 },

  // Hard (16-20)
  { id: 16, name: 'Featherweight', description: 'Tiny pieces, big challenge', pieces: [rect(25, 25, 0.5, 'game-object-1'), rect(25, 25, 0.5, 'game-object-2'), circle(15, 0.4, 'game-object-3'), circle(15, 0.4, 'game-object-5'), rect(25, 25, 0.5, 'game-object-4')], beamLength: 0.45, pivotOffset: 0.1, balanceThreshold: 5, balanceTime: 3.5, gravity: 0.95 },
  { id: 17, name: 'The Seesaw', description: 'Extreme offset — counterbalance!', pieces: [rect(55, 55, 3, 'game-object-4'), rect(30, 30, 0.8, 'game-object-1'), rect(30, 30, 0.8, 'game-object-2')], beamLength: 0.6, pivotOffset: 0.3, balanceThreshold: 5, balanceTime: 3.5, gravity: 0.95 },
  { id: 18, name: 'Six Pack', description: 'Six pieces of chaos', pieces: [rect(30, 30, 1, 'game-object-1'), rect(30, 30, 1, 'game-object-2'), circle(18, 0.8, 'game-object-3'), circle(18, 0.8, 'game-object-5'), tri(35, 30, 0.9, 'game-object-4'), rect(25, 25, 0.7, 'game-object-1')], beamLength: 0.6, pivotOffset: -0.1, balanceThreshold: 5, balanceTime: 3.5, gravity: 0.95 },
  { id: 19, name: 'Gravity Well', description: 'Heavy gravity pulls hard', pieces: [rect(40, 40, 1.5, 'game-object-1'), circle(25, 1.2, 'game-object-2'), tri(40, 35, 1, 'game-object-3')], beamLength: 0.5, pivotOffset: 0.15, balanceThreshold: 5, balanceTime: 3.5, gravity: 1.2 },
  { id: 20, name: 'Precision', description: 'No room for error', pieces: [rect(35, 35, 1, 'game-object-1'), rect(35, 35, 1, 'game-object-2'), rect(35, 35, 1, 'game-object-3'), rect(35, 35, 1, 'game-object-4')], beamLength: 0.4, pivotOffset: 0, balanceThreshold: 4, balanceTime: 4, gravity: 1.0 },

  // Expert (21-25)
  { id: 21, name: 'Needle Point', description: 'Tiny beam, many pieces', pieces: [rect(28, 28, 0.8, 'game-object-1'), rect(28, 28, 0.8, 'game-object-2'), circle(16, 0.6, 'game-object-3'), circle(16, 0.6, 'game-object-5'), tri(30, 25, 0.7, 'game-object-4')], beamLength: 0.35, pivotOffset: 0, balanceThreshold: 4, balanceTime: 4, gravity: 1.0 },
  { id: 22, name: 'Asymmetry', description: 'Nothing is equal', pieces: [rect(60, 30, 2.5, 'game-object-4'), rect(25, 50, 1.5, 'game-object-1'), circle(15, 0.5, 'game-object-3'), tri(40, 20, 0.8, 'game-object-5')], beamLength: 0.55, pivotOffset: 0.2, balanceThreshold: 4, balanceTime: 4, gravity: 1.0 },
  { id: 23, name: 'Seven Sins', description: 'Seven pieces of madness', pieces: [rect(28, 28, 1, 'game-object-1'), rect(28, 28, 1, 'game-object-2'), circle(16, 0.7, 'game-object-3'), circle(16, 0.7, 'game-object-5'), tri(30, 25, 0.8, 'game-object-4'), rect(22, 22, 0.5, 'game-object-1'), circle(14, 0.5, 'game-object-2')], beamLength: 0.6, pivotOffset: -0.15, balanceThreshold: 4, balanceTime: 4, gravity: 1.0 },
  { id: 24, name: 'Moon Gravity', description: 'Low gravity — things float!', pieces: [rect(45, 45, 2, 'game-object-1'), circle(30, 2, 'game-object-2'), tri(50, 45, 1.5, 'game-object-3'), rect(30, 30, 1, 'game-object-5')], beamLength: 0.55, pivotOffset: 0.1, balanceThreshold: 4, balanceTime: 4.5, gravity: 0.4 },
  { id: 25, name: 'Titan', description: 'One massive piece + many small', pieces: [rect(70, 70, 5, 'game-object-4'), rect(20, 20, 0.4, 'game-object-1'), rect(20, 20, 0.4, 'game-object-2'), circle(14, 0.3, 'game-object-3'), circle(14, 0.3, 'game-object-5'), rect(20, 20, 0.4, 'game-object-1')], beamLength: 0.6, pivotOffset: 0.3, balanceThreshold: 4, balanceTime: 4.5, gravity: 1.0 },

  // Master (26-30)
  { id: 26, name: 'Razor\'s Edge', description: 'Microscopic margin', pieces: [rect(35, 35, 1.2, 'game-object-1'), rect(35, 35, 1.2, 'game-object-2'), circle(20, 0.9, 'game-object-3'), tri(38, 33, 1, 'game-object-4'), rect(30, 30, 0.8, 'game-object-5')], beamLength: 0.35, pivotOffset: 0.1, balanceThreshold: 3, balanceTime: 5, gravity: 1.1 },
  { id: 27, name: 'Eight Wonders', description: 'Eight pieces, one chance', pieces: [rect(26, 26, 0.8, 'game-object-1'), rect(26, 26, 0.8, 'game-object-2'), circle(15, 0.6, 'game-object-3'), circle(15, 0.6, 'game-object-5'), tri(28, 24, 0.7, 'game-object-4'), rect(22, 22, 0.5, 'game-object-1'), circle(12, 0.4, 'game-object-2'), tri(24, 20, 0.5, 'game-object-3')], beamLength: 0.55, pivotOffset: -0.2, balanceThreshold: 3, balanceTime: 5, gravity: 1.1 },
  { id: 28, name: 'Jupiter', description: 'Crushing gravity', pieces: [rect(40, 40, 1.5, 'game-object-1'), circle(22, 1, 'game-object-2'), tri(35, 30, 0.9, 'game-object-3'), rect(30, 30, 0.8, 'game-object-5')], beamLength: 0.45, pivotOffset: 0.15, balanceThreshold: 3, balanceTime: 5, gravity: 1.6 },
  { id: 29, name: 'Chaos Theory', description: 'Random weights, tiny beam', pieces: [rect(50, 25, 2, 'game-object-4'), rect(25, 50, 2, 'game-object-1'), circle(28, 2.5, 'game-object-2'), tri(45, 40, 1.8, 'game-object-3'), rect(20, 20, 0.3, 'game-object-5'), circle(12, 0.2, 'game-object-1')], beamLength: 0.4, pivotOffset: -0.25, balanceThreshold: 3, balanceTime: 5, gravity: 1.2 },
  { id: 30, name: 'Zen Master', description: 'Perfect balance. Perfect zen.', pieces: [rect(30, 30, 1, 'game-object-1'), rect(30, 30, 1, 'game-object-2'), circle(18, 0.8, 'game-object-3'), circle(18, 0.8, 'game-object-5'), tri(32, 28, 0.9, 'game-object-4'), rect(24, 24, 0.6, 'game-object-1'), circle(14, 0.5, 'game-object-2'), tri(26, 22, 0.6, 'game-object-3'), rect(20, 20, 0.4, 'game-object-4')], beamLength: 0.5, pivotOffset: 0, balanceThreshold: 2, balanceTime: 6, gravity: 1.0 },

  // Bonus (31-32)
  { id: 31, name: 'Impossible', description: 'Good luck.', pieces: [rect(70, 30, 4, 'game-object-4'), circle(35, 3, 'game-object-2'), tri(55, 50, 2.5, 'game-object-3'), rect(20, 20, 0.3, 'game-object-5'), circle(10, 0.2, 'game-object-1'), rect(15, 15, 0.2, 'game-object-3'), circle(10, 0.2, 'game-object-5')], beamLength: 0.35, pivotOffset: 0.3, balanceThreshold: 2, balanceTime: 6, gravity: 1.3 },
  { id: 32, name: 'Enlightenment', description: 'True balance comes from within', pieces: [rect(25, 25, 1, 'game-object-1'), rect(25, 25, 1, 'game-object-2'), rect(25, 25, 1, 'game-object-3'), rect(25, 25, 1, 'game-object-4'), rect(25, 25, 1, 'game-object-5'), circle(15, 0.8, 'game-object-1'), circle(15, 0.8, 'game-object-2'), circle(15, 0.8, 'game-object-3'), tri(28, 24, 0.9, 'game-object-4'), tri(28, 24, 0.9, 'game-object-5')], beamLength: 0.55, pivotOffset: 0, balanceThreshold: 2, balanceTime: 7, gravity: 1.0 },
];

export const getTotalStars = (completedLevels: Record<number, number>): number => {
  return Object.values(completedLevels).reduce((sum, stars) => sum + stars, 0);
};
