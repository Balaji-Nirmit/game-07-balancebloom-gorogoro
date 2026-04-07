import { useRef, useEffect, useCallback, useState } from 'react';
import Matter from 'matter-js';
import { LevelConfig, GamePiece } from '../game/levels';
import { soundEngine } from '../game/SoundEngine';

const COLORS: Record<string, string> = {
  'game-object-1': '#c2654a',
  'game-object-2': '#a68660',
  'game-object-3': '#b3a26b',
  'game-object-4': '#994d3a',
  'game-object-5': '#8c7a5e',
  'game-beam': '#6b5c45',
  'game-pivot': '#c2654a',
};

interface Props {
  level: LevelConfig;
  onWin: (stars: number) => void;
  onLose: () => void;
}

export default function GameCanvas({ level, onWin, onLose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderLoopRef = useRef<number>(0);
  const [piecesLeft, setPiecesLeft] = useState(level.pieces.length);
  const [balanceTimer, setBalanceTimer] = useState(0);
  const [isBalanced, setIsBalanced] = useState(false);
  const [dropX, setDropX] = useState(0.5);
  const gameOverRef = useRef(false);
  const balanceStartRef = useRef<number | null>(null);
  const piecesPlacedRef = useRef(0);
  const beamRef = useRef<Matter.Body | null>(null);
  const droppedBodiesRef = useRef<Matter.Body[]>([]);

  const getCanvasSize = useCallback(() => {
    const w = Math.min(window.innerWidth, 500);
    const h = Math.min(window.innerHeight - 120, 700);
    return { w, h };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    gameOverRef.current = false;
    piecesPlacedRef.current = 0;
    balanceStartRef.current = null;
    droppedBodiesRef.current = [];
    setPiecesLeft(level.pieces.length);
    setBalanceTimer(0);
    setIsBalanced(false);

    const { w, h } = getCanvasSize();
    canvas.width = w * 2;
    canvas.height = h * 2;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const engine = Matter.Engine.create({ gravity: { x: 0, y: level.gravity } });
    engineRef.current = engine;

    // Walls
    const wallThickness = 60;
    const walls = [
      Matter.Bodies.rectangle(w, h + wallThickness / 2, w * 3, wallThickness, { isStatic: true, render: { visible: false } }),
      Matter.Bodies.rectangle(-wallThickness / 2, h / 2, wallThickness, h * 3, { isStatic: true }),
      Matter.Bodies.rectangle(w + wallThickness / 2, h / 2, wallThickness, h * 3, { isStatic: true }),
    ];
    walls.forEach(wall => { (wall as any).isWall = true; });

    // Pivot
    const pivotX = w / 2 + level.pivotOffset * w * level.beamLength * 0.5;
    const pivotY = h * 0.72;
    const pivotH = h * 0.12;
    const pivot = Matter.Bodies.trapezoid(pivotX, pivotY + pivotH / 2, 30, pivotH, 0.4, {
      isStatic: true,
      chamfer: { radius: 4 },
    });
    (pivot as any).isPivot = true;

    // Beam
    const beamW = w * level.beamLength;
    const beamH = 12;
    const beam = Matter.Bodies.rectangle(pivotX, pivotY - beamH / 2 - 2, beamW, beamH, {
      density: 0.005,
      friction: 0.9,
      frictionStatic: 1.0,
      chamfer: { radius: 3 },
    });
    (beam as any).isBeam = true;
    beamRef.current = beam;

    // Pivot constraint
    const constraint = Matter.Constraint.create({
      pointA: { x: pivotX, y: pivotY - 2 },
      bodyB: beam,
      pointB: { x: level.pivotOffset * beamW * 0.5, y: beamH / 2 },
      length: 0,
      stiffness: 1,
      damping: 0,
    });

    Matter.Composite.add(engine.world, [...walls, pivot, beam, constraint]);

    // Render loop
    const ctx = canvas.getContext('2d')!;
    let lastTime = performance.now();

    const drawBody = (body: Matter.Body) => {
      const verts = body.vertices;
      if ((body as any).isWall) return;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(verts[0].x * 2, verts[0].y * 2);
      for (let i = 1; i < verts.length; i++) {
        ctx.lineTo(verts[i].x * 2, verts[i].y * 2);
      }
      ctx.closePath();

      if ((body as any).isPivot) {
        ctx.fillStyle = COLORS['game-pivot'];
        ctx.fill();
      } else if ((body as any).isBeam) {
        ctx.fillStyle = COLORS['game-beam'];
        ctx.fill();
        // Beam texture lines
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 1;
        ctx.stroke();
      } else if ((body as any).gameColor) {
        ctx.fillStyle = COLORS[(body as any).gameColor] || COLORS['game-object-1'];
        ctx.fill();
        // Soft highlight
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else {
        ctx.fillStyle = '#b8a88a';
        ctx.fill();
      }
      ctx.restore();
    };

    const drawCircleBody = (body: Matter.Body) => {
      if ((body as any).isWall) return;
      const pos = body.position;
      const r = (body as any).circleRadius || 20;
      ctx.save();
      ctx.beginPath();
      ctx.arc(pos.x * 2, pos.y * 2, r * 2, 0, Math.PI * 2);
      ctx.fillStyle = COLORS[(body as any).gameColor] || COLORS['game-object-2'];
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      // rotation indicator
      ctx.beginPath();
      ctx.moveTo(pos.x * 2, pos.y * 2);
      ctx.lineTo(pos.x * 2 + Math.cos(body.angle) * r * 1.5, pos.y * 2 + Math.sin(body.angle) * r * 1.5);
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    };

    const loop = (time: number) => {
      const delta = Math.min(time - lastTime, 33);
      lastTime = time;

      Matter.Engine.update(engine, delta);

      // Clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, '#f5f0e8');
      grad.addColorStop(1, '#ebe4d6');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Ground decoration
      ctx.fillStyle = '#ddd5c4';
      ctx.fillRect(0, canvas.height - 30, canvas.width, 30);

      // Drop indicator line
      if (piecesPlacedRef.current < level.pieces.length && !gameOverRef.current) {
        const dx = dropX * w;
        ctx.setLineDash([8, 8]);
        ctx.strokeStyle = 'rgba(194,101,74,0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(dx * 2, 0);
        ctx.lineTo(dx * 2, (pivotY - 80) * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Preview piece
        const piece = level.pieces[piecesPlacedRef.current];
        ctx.save();
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = COLORS[piece.color] || COLORS['game-object-1'];
        const previewY = 50;
        if (piece.type === 'circle') {
          ctx.beginPath();
          ctx.arc(dx * 2, previewY * 2, piece.width * 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (piece.type === 'rect') {
          ctx.fillRect((dx - piece.width / 2) * 2, (previewY - piece.height / 2) * 2, piece.width * 2, piece.height * 2);
        } else {
          ctx.beginPath();
          ctx.moveTo(dx * 2, (previewY - piece.height / 2) * 2);
          ctx.lineTo((dx + piece.width / 2) * 2, (previewY + piece.height / 2) * 2);
          ctx.lineTo((dx - piece.width / 2) * 2, (previewY + piece.height / 2) * 2);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }

      // Draw all bodies
      const bodies = Matter.Composite.allBodies(engine.world);
      bodies.forEach(body => {
        if ((body as any).circleRadius) {
          drawCircleBody(body);
        } else {
          drawBody(body);
        }
      });

      // Check if any piece fell off the beam (below pivot level or off-screen)
      if (droppedBodiesRef.current.length > 0 && !gameOverRef.current) {
        const fellOff = droppedBodiesRef.current.some(b => b.position.y > pivotY + pivotH + 10 || b.position.y > h + 50);
        if (fellOff) {
          gameOverRef.current = true;
          soundEngine.fail();
          onLose();
          return;
        }
      }

      // Balance check
      if (piecesPlacedRef.current >= level.pieces.length && !gameOverRef.current) {
        const angle = Math.abs(beam.angle * (180 / Math.PI));
        const balanced = angle < level.balanceThreshold;
        setIsBalanced(balanced);

        if (balanced) {
          if (!balanceStartRef.current) balanceStartRef.current = time;
          const elapsed = (time - balanceStartRef.current) / 1000;
          setBalanceTimer(Math.min(elapsed, level.balanceTime));

          if (elapsed >= level.balanceTime) {
            gameOverRef.current = true;
            const finalAngle = angle;
            let stars = 1;
            if (finalAngle < level.balanceThreshold * 0.3) stars = 3;
            else if (finalAngle < level.balanceThreshold * 0.6) stars = 2;
            soundEngine.success();
            onWin(stars);
          }
        } else {
          balanceStartRef.current = null;
          setBalanceTimer(0);
        }
      }

      // Balance timer ring
      if (piecesPlacedRef.current >= level.pieces.length && !gameOverRef.current) {
        const progress = balanceTimer / level.balanceTime;
        const cx = w;
        const cy = 80;
        const r = 30;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(194,101,74,0.15)';
        ctx.lineWidth = 6;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
        ctx.strokeStyle = isBalanced ? '#6aab6a' : '#c2654a';
        ctx.lineWidth = 6;
        ctx.stroke();
      }

      renderLoopRef.current = requestAnimationFrame(loop);
    };

    renderLoopRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(renderLoopRef.current);
      Matter.Engine.clear(engine);
      engineRef.current = null;
    };
  }, [level, getCanvasSize, onWin, onLose]);

  const dropPiece = useCallback(() => {
    if (!engineRef.current || gameOverRef.current) return;
    if (piecesPlacedRef.current >= level.pieces.length) return;

    const { w } = getCanvasSize();
    const piece = level.pieces[piecesPlacedRef.current];
    const x = dropX * w;
    const y = 60;

    let body: Matter.Body;
    const opts: Matter.IBodyDefinition = {
      density: piece.mass * 0.01,
      friction: 0.8,
      frictionStatic: 1.2,
      restitution: 0.1,
      chamfer: { radius: 2 },
    };

    if (piece.type === 'circle') {
      body = Matter.Bodies.circle(x, y, piece.width, opts);
    } else if (piece.type === 'triangle') {
      const verts = [
        { x: 0, y: -piece.height / 2 },
        { x: piece.width / 2, y: piece.height / 2 },
        { x: -piece.width / 2, y: piece.height / 2 },
      ];
      body = Matter.Bodies.fromVertices(x, y, [verts], opts);
    } else {
      body = Matter.Bodies.rectangle(x, y, piece.width, piece.height, opts);
    }

    (body as any).gameColor = piece.color;
    droppedBodiesRef.current.push(body);
    Matter.Composite.add(engineRef.current.world, body);

    piecesPlacedRef.current++;
    setPiecesLeft(level.pieces.length - piecesPlacedRef.current);
    soundEngine.drop();
  }, [level, dropX, getCanvasSize]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width;
    setDropX(Math.max(0.05, Math.min(0.95, x)));
  }, []);

  const handleClick = useCallback((e: React.PointerEvent) => {
    handlePointerMove(e);
    dropPiece();
  }, [dropPiece, handlePointerMove]);

  return (
    <div className="flex flex-col items-center w-full">
      {/* HUD */}
      <div className="flex items-center justify-between w-full max-w-[500px] px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-game-text-sub">Pieces</span>
          <span className="text-lg font-bold text-foreground">{piecesLeft}</span>
        </div>
        {piecesLeft === 0 && (
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isBalanced ? 'bg-game-success animate-pulse-soft' : 'bg-game-warning'}`} />
            <span className="text-sm font-medium text-game-text-sub">
              {isBalanced ? `Balancing... ${balanceTimer.toFixed(1)}s` : 'Stabilize!'}
            </span>
          </div>
        )}
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="rounded-2xl game-shadow-lg cursor-crosshair touch-none"
        onPointerMove={handlePointerMove}
        onPointerDown={handleClick}
      />

      {piecesLeft > 0 && (
        <p className="text-xs text-game-text-sub mt-3 animate-pulse-soft">
          Tap to drop · Slide to aim
        </p>
      )}
    </div>
  );
}
