import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Question } from '../types/game';
import { soundManager } from '../utils/audio';
import { ArrowLeft, ArrowRight, ArrowUp, Volume2, VolumeX, HelpCircle } from 'lucide-react';

interface MarioGameCanvasProps {
  currentWorld: number;
  questions: Question[];
  answeredQuestions: Set<number>;
  onTriggerQuestion: (question: Question) => void;
  onFinishGame: () => void;
  score: number;
  coins: number;
  onAddScore: (points: number, coinCount: number) => void;
  isPaused?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
}

interface Block {
  x: number;
  y: number;
  width: number;
  height: number;
  questionId: number;
  hit: boolean;
  bounceOffset: number;
}

interface Goomba {
  x: number;
  y: number;
  vx: number;
  squished: boolean;
  squishTimer: number;
}

export const MarioGameCanvas: React.FC<MarioGameCanvasProps> = ({
  currentWorld,
  questions,
  answeredQuestions,
  onTriggerQuestion,
  onFinishGame,
  score,
  coins,
  onAddScore,
  isPaused = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(soundManager.isMuted());
  const [nearbyQuestion, setNearbyQuestion] = useState<Question | null>(null);

  // Input state
  const keys = useRef<{ left: boolean; right: boolean; jump: boolean }>({
    left: false,
    right: false,
    jump: false,
  });

  // World dimensions
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 450;
  const GROUND_Y = 380;
  const LEVEL_WIDTH = 3200;

  // Mario state
  const mario = useRef({
    x: 120,
    y: GROUND_Y - 36,
    width: 28,
    height: 36,
    vx: 0,
    vy: 0,
    grounded: false,
    facing: 'right' as 'left' | 'right',
    animFrame: 0,
    animTimer: 0,
    invincibleTimer: 0,
    slidingFlag: false,
  });

  // Flagpole state (at the end of level)
  const flagPole = useRef({
    x: LEVEL_WIDTH - 250,
    y: GROUND_Y - 260,
    height: 260,
    flagY: GROUND_Y - 250,
    finished: false,
  });

  // Level elements
  const blocksRef = useRef<Block[]>([]);
  const goombasRef = useRef<Goomba[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const cameraXRef = useRef<number>(0);

  // Initialize level ONLY when currentWorld changes
  const initLevel = useCallback(() => {
    const worldQuestions = questions.filter((q) => q.world === currentWorld);

    // Setup 10 question blocks spaced comfortably
    const newBlocks: Block[] = [];
    const blockSpacing = 240;
    const startX = 220; // Starts close so student sees first block immediately!

    worldQuestions.forEach((q, idx) => {
      newBlocks.push({
        x: startX + idx * blockSpacing,
        y: GROUND_Y - (idx % 2 === 0 ? 100 : 130),
        width: 36,
        height: 36,
        questionId: q.id,
        hit: answeredQuestions.has(q.id),
        bounceOffset: 0,
      });
    });
    blocksRef.current = newBlocks;

    // Goombas
    const newGoombas: Goomba[] = [
      { x: 420, y: GROUND_Y - 24, vx: -0.9, squished: false, squishTimer: 0 },
      { x: 950, y: GROUND_Y - 24, vx: -0.9, squished: false, squishTimer: 0 },
      { x: 1500, y: GROUND_Y - 24, vx: -0.9, squished: false, squishTimer: 0 },
      { x: 2100, y: GROUND_Y - 24, vx: -0.9, squished: false, squishTimer: 0 },
      { x: 2650, y: GROUND_Y - 24, vx: -0.9, squished: false, squishTimer: 0 },
    ];
    goombasRef.current = newGoombas;

    // Reset Mario to starting position of this world
    mario.current.x = 100;
    mario.current.y = GROUND_Y - 36;
    mario.current.vx = 0;
    mario.current.vy = 0;
    mario.current.slidingFlag = false;

    // Reset Flag
    flagPole.current.flagY = GROUND_Y - 250;
    flagPole.current.finished = false;
    cameraXRef.current = 0;
  }, [currentWorld, questions]); // Deliberately omit answeredQuestions to prevent Mario reset!

  useEffect(() => {
    initLevel();
  }, [initLevel]);

  // Update block hit status without resetting Mario
  useEffect(() => {
    blocksRef.current.forEach((b) => {
      if (answeredQuestions.has(b.questionId)) {
        b.hit = true;
      }
    });
  }, [answeredQuestions]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused) return;

      if (['ArrowLeft', 'KeyA', 'a'].includes(e.code)) {
        keys.current.left = true;
      }
      if (['ArrowRight', 'KeyD', 'd'].includes(e.code)) {
        keys.current.right = true;
      }
      if (['ArrowUp', 'Space', 'KeyW', 'w'].includes(e.code)) {
        if (!keys.current.jump && mario.current.grounded) {
          mario.current.vy = -13;
          mario.current.grounded = false;
          soundManager.playJump();
        }
        keys.current.jump = true;
      }
      // Enter or E to trigger nearby question block
      if (['Enter', 'KeyE', 'e'].includes(e.code) && nearbyQuestion) {
        onTriggerQuestion(nearbyQuestion);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA', 'a'].includes(e.code)) {
        keys.current.left = false;
      }
      if (['ArrowRight', 'KeyD', 'd'].includes(e.code)) {
        keys.current.right = false;
      }
      if (['ArrowUp', 'Space', 'KeyW', 'w'].includes(e.code)) {
        keys.current.jump = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPaused, nearbyQuestion, onTriggerQuestion]);

  // Canvas Click / Tap Handler: Clicking on or near question blocks directly triggers them
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;

    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;
    const worldClickX = clickX + cameraXRef.current;

    // Check if clicked any question block (generous hit radius)
    for (const block of blocksRef.current) {
      const dist = Math.hypot(worldClickX - (block.x + block.width / 2), clickY - (block.y + block.height / 2));
      if (dist < 45) {
        soundManager.playBump();
        const q = questions.find((item) => item.id === block.questionId);
        if (q) {
          block.bounceOffset = 8;
          soundManager.playCoin();
          onTriggerQuestion(q);
          return;
        }
      }
    }
  };

  // Main Canvas Game Loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const spawnParticles = (x: number, y: number, color: string, count = 8) => {
      for (let i = 0; i < count; i++) {
        particlesRef.current.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.8) * 6,
          color,
          size: Math.random() * 4 + 2,
          life: 25,
        });
      }
    };

    const render = () => {
      const m = mario.current;

      // Only update physics when not paused
      if (!isPaused) {
        if (!m.slidingFlag) {
          // Horizontal Movement
          const speed = 4.4;
          if (keys.current.left) {
            m.vx = -speed;
            m.facing = 'left';
          } else if (keys.current.right) {
            m.vx = speed;
            m.facing = 'right';
          } else {
            m.vx *= 0.75; // Friction
            if (Math.abs(m.vx) < 0.1) m.vx = 0;
          }

          // Animation timer
          if (m.vx !== 0 && m.grounded) {
            m.animTimer++;
            if (m.animTimer > 6) {
              m.animFrame = (m.animFrame + 1) % 3;
              m.animTimer = 0;
            }
          } else {
            m.animFrame = 0;
          }

          // Apply Gravity
          m.vy += 0.65;
          if (m.vy > 12) m.vy = 12;

          // Position update
          m.x += m.vx;
          m.y += m.vy;

          // Level boundaries
          if (m.x < 10) m.x = 10;
          if (m.x > LEVEL_WIDTH - 80) m.x = LEVEL_WIDTH - 80;

          // Ground Collision
          if (m.y + m.height >= GROUND_Y) {
            m.y = GROUND_Y - m.height;
            m.vy = 0;
            m.grounded = true;
          } else {
            m.grounded = false;
          }

          // Invincibility cooldown
          if (m.invincibleTimer > 0) m.invincibleTimer--;

          // Proximity & Block Collision Check
          let closestQuestion: Question | null = null;
          let minDistance = 9999;

          blocksRef.current.forEach((block) => {
            // Decay bounce animation
            if (block.bounceOffset > 0) {
              block.bounceOffset -= 1.5;
              if (block.bounceOffset < 0) block.bounceOffset = 0;
            }

            // Check distance to Mario
            const blockCenterX = block.x + block.width / 2;
            const blockCenterY = block.y + block.height / 2;
            const marioCenterX = m.x + m.width / 2;
            const marioCenterY = m.y + m.height / 2;
            const dist = Math.hypot(marioCenterX - blockCenterX, marioCenterY - blockCenterY);

            if (dist < 75 && dist < minDistance && !block.hit) {
              minDistance = dist;
              const q = questions.find((item) => item.id === block.questionId);
              if (q) closestQuestion = q;
            }

            // FORGIVING COLLISION DETECTION:
            // 1. Underneath head hit:
            const horizontalOverlap = m.x + m.width >= block.x - 6 && m.x <= block.x + block.width + 6;
            const headHit =
              horizontalOverlap &&
              m.y <= block.y + block.height + 6 &&
              m.y >= block.y + 4 &&
              m.vy < 3;

            // 2. Body collision into unhit block:
            const bodyOverlap =
              m.x + m.width >= block.x &&
              m.x <= block.x + block.width &&
              m.y + m.height >= block.y &&
              m.y <= block.y + block.height;

            if (headHit || (bodyOverlap && !block.hit)) {
              m.y = block.y + block.height + 2;
              m.vy = 1;
              block.bounceOffset = 10;
              soundManager.playBump();

              if (!block.hit) {
                soundManager.playCoin();
                spawnParticles(block.x + 18, block.y, '#facc15', 14);
                const q = questions.find((item) => item.id === block.questionId);
                if (q) {
                  onTriggerQuestion(q);
                }
              }
            }

            // Stand on top of block
            const isOnTop =
              m.x + m.width > block.x + 2 &&
              m.x < block.x + block.width - 2 &&
              m.y + m.height >= block.y &&
              m.y + m.height <= block.y + 14 &&
              m.vy >= 0;

            if (isOnTop) {
              m.y = block.y - m.height;
              m.vy = 0;
              m.grounded = true;
            }
          });

          setNearbyQuestion(closestQuestion);

          // Goombas
          goombasRef.current.forEach((g) => {
            if (g.squished) {
              g.squishTimer++;
              return;
            }

            g.x += g.vx;
            if (g.x < 300 || g.x > LEVEL_WIDTH - 300) {
              g.vx = -g.vx;
            }

            // Mario Goomba Collision
            const isTouching =
              m.x + m.width > g.x &&
              m.x < g.x + 26 &&
              m.y + m.height > g.y &&
              m.y < g.y + 24;

            if (isTouching) {
              if (m.vy > 0 && m.y + m.height < g.y + 16) {
                g.squished = true;
                m.vy = -8.5;
                soundManager.playCoin();
                onAddScore(100, 1);
                spawnParticles(g.x + 13, g.y + 10, '#b45309', 8);
              } else if (m.invincibleTimer === 0) {
                m.invincibleTimer = 40;
                m.vx = m.facing === 'right' ? -6 : 6;
                m.vy = -4;
                soundManager.playBump();
              }
            }
          });

          // Check Flagpole Collision
          const pole = flagPole.current;
          if (
            !pole.finished &&
            m.x + m.width >= pole.x &&
            m.x <= pole.x + 20 &&
            m.y <= GROUND_Y
          ) {
            m.slidingFlag = true;
            pole.finished = true;
            soundManager.playFlagpole();
          }
        } else {
          // Sliding down flagpole
          const pole = flagPole.current;
          m.x = pole.x - 10;
          if (m.y + m.height < GROUND_Y) {
            m.y += 3.5;
          }
          if (pole.flagY < GROUND_Y - 40) {
            pole.flagY += 3.5;
          } else {
            m.x += 2.5;
            if (m.x > pole.x + 130) {
              soundManager.playVictory();
              onFinishGame();
              return;
            }
          }
        }

        // Camera follow
        const targetCamX = m.x - CANVAS_WIDTH * 0.35;
        cameraXRef.current += (targetCamX - cameraXRef.current) * 0.1;
        if (cameraXRef.current < 0) cameraXRef.current = 0;
        if (cameraXRef.current > LEVEL_WIDTH - CANVAS_WIDTH) {
          cameraXRef.current = LEVEL_WIDTH - CANVAS_WIDTH;
        }
      }

      const camX = Math.floor(cameraXRef.current);

      // 2. RENDER GRAPHICS
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Sky Blue Background
      ctx.fillStyle = '#5c94fc';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Clouds
      ctx.save();
      ctx.translate(-camX * 0.3, 0);
      drawClouds(ctx);
      ctx.restore();

      // Hills
      ctx.save();
      ctx.translate(-camX * 0.6, 0);
      drawDistantHills(ctx);
      ctx.restore();

      // World Items
      ctx.save();
      ctx.translate(-camX, 0);

      // Ground
      drawGround(ctx);

      // Pipes
      drawPipes(ctx);

      // Question Blocks
      blocksRef.current.forEach((b) => {
        drawQuestionBlock(ctx, b);
      });

      // Flagpole & Castle
      drawFlagpoleAndCastle(ctx, flagPole.current);

      // Goombas
      goombasRef.current.forEach((g) => {
        drawGoomba(ctx, g);
      });

      // Mario
      if (m.invincibleTimer % 4 < 2) {
        drawMario(ctx, m);
      }

      // Proximity Indicator Prompt above Mario if near a Question Block
      if (nearbyQuestion && !isPaused) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        const promptY = m.y - 18 + Math.sin(Date.now() / 150) * 3;
        ctx.strokeText(`[?] SOAL ${nearbyQuestion.id}`, m.x + m.width / 2, promptY);
        ctx.fillText(`[?] SOAL ${nearbyQuestion.id}`, m.x + m.width / 2, promptY);
      }

      // Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2;
        p.life--;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        if (p.life <= 0) particlesRef.current.splice(i, 1);
      }

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [questions, onTriggerQuestion, onFinishGame, onAddScore, isPaused, nearbyQuestion]);

  // Helper Drawing Functions
  const drawClouds = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 15; i++) {
      const cx = i * 280 + 50;
      const cy = 60 + (i % 3) * 35;
      ctx.beginPath();
      ctx.arc(cx, cy, 22, 0, Math.PI * 2);
      ctx.arc(cx + 18, cy - 8, 26, 0, Math.PI * 2);
      ctx.arc(cx + 40, cy, 22, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawDistantHills = (ctx: CanvasRenderingContext2D) => {
    for (let i = 0; i < 10; i++) {
      const hx = i * 450;
      ctx.fillStyle = '#00a800';
      ctx.beginPath();
      ctx.arc(hx + 100, GROUND_Y, 75, Math.PI, 0);
      ctx.fill();

      ctx.fillStyle = '#80d010';
      ctx.beginPath();
      ctx.arc(hx + 300, GROUND_Y, 35, Math.PI, 0);
      ctx.arc(hx + 330, GROUND_Y, 45, Math.PI, 0);
      ctx.arc(hx + 360, GROUND_Y, 35, Math.PI, 0);
      ctx.fill();
    }
  };

  const drawGround = (ctx: CanvasRenderingContext2D) => {
    const tileSize = 32;
    for (let x = 0; x < LEVEL_WIDTH; x += tileSize) {
      ctx.fillStyle = '#00a800';
      ctx.fillRect(x, GROUND_Y, tileSize, 8);
      ctx.fillStyle = '#c84c0c';
      ctx.fillRect(x, GROUND_Y + 8, tileSize, CANVAS_HEIGHT - (GROUND_Y + 8));

      ctx.fillStyle = '#fcbc3c';
      ctx.fillRect(x + 2, GROUND_Y + 12, 12, 6);
      ctx.fillRect(x + 18, GROUND_Y + 22, 12, 6);

      ctx.fillStyle = '#000000';
      ctx.fillRect(x, GROUND_Y, tileSize, 1);
    }
  };

  const drawPipes = (ctx: CanvasRenderingContext2D) => {
    const pipes = [650, 1350, 1950, 2600];
    pipes.forEach((px) => {
      const pHeight = 55;
      const py = GROUND_Y - pHeight;
      ctx.fillStyle = '#00a800';
      ctx.fillRect(px - 4, py, 48, 20);
      ctx.fillStyle = '#80d010';
      ctx.fillRect(px - 2, py + 2, 8, 16);
      ctx.fillStyle = '#005000';
      ctx.fillRect(px + 40, py, 4, 20);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.strokeRect(px - 4, py, 48, 20);

      ctx.fillStyle = '#00a800';
      ctx.fillRect(px, py + 20, 40, pHeight - 20);
      ctx.fillStyle = '#80d010';
      ctx.fillRect(px + 2, py + 20, 6, pHeight - 20);
      ctx.fillStyle = '#005000';
      ctx.fillRect(px + 36, py + 20, 4, pHeight - 20);
      ctx.strokeRect(px, py + 20, 40, pHeight - 20);
    });
  };

  const drawQuestionBlock = (ctx: CanvasRenderingContext2D, b: Block) => {
    const by = b.y - b.bounceOffset;

    if (b.hit) {
      // Metallic used block
      ctx.fillStyle = '#8c5224';
      ctx.fillRect(b.x, by, b.width, b.height);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.strokeRect(b.x, by, b.width, b.height);

      ctx.fillStyle = '#3a200f';
      ctx.fillRect(b.x + 3, by + 3, 3, 3);
      ctx.fillRect(b.x + b.width - 6, by + 3, 3, 3);
      ctx.fillRect(b.x + 3, by + b.height - 6, 3, 3);
      ctx.fillRect(b.x + b.width - 6, by + b.height - 6, 3, 3);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('✓', b.x + b.width / 2, by + b.height / 2 + 5);
    } else {
      // Golden animated Question block
      ctx.fillStyle = '#fc9838';
      ctx.fillRect(b.x, by, b.width, b.height);

      ctx.fillStyle = '#fcbc3c';
      ctx.fillRect(b.x + 2, by + 2, b.width - 4, b.height - 4);

      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.strokeRect(b.x, by, b.width, b.height);

      ctx.fillStyle = '#000000';
      ctx.fillRect(b.x + 2, by + 2, 2, 2);
      ctx.fillRect(b.x + b.width - 4, by + 2, 2, 2);
      ctx.fillRect(b.x + 2, by + b.height - 4, 2, 2);
      ctx.fillRect(b.x + b.width - 4, by + b.height - 4, 2, 2);

      // Question ID and '?'
      ctx.fillStyle = '#802800';
      ctx.font = 'bold 14px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('?', b.x + b.width / 2, by + b.height / 2 + 5);

      // Tiny badge indicating question number above the block
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(b.x + 2, by - 16, b.width - 4, 13);
      ctx.fillStyle = '#ffffff';
      ctx.font = '9px monospace';
      ctx.fillText(`No.${b.questionId}`, b.x + b.width / 2, by - 6);
    }
  };

  const drawGoomba = (ctx: CanvasRenderingContext2D, g: Goomba) => {
    if (g.squished) {
      if (g.squishTimer < 20) {
        ctx.fillStyle = '#b45309';
        ctx.fillRect(g.x, GROUND_Y - 8, 28, 8);
        ctx.fillStyle = '#000000';
        ctx.fillRect(g.x + 4, GROUND_Y - 6, 4, 2);
        ctx.fillRect(g.x + 20, GROUND_Y - 6, 4, 2);
      }
      return;
    }

    const gy = g.y;
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.arc(g.x + 13, gy + 8, 12, Math.PI, 0);
    ctx.lineTo(g.x + 25, gy + 16);
    ctx.lineTo(g.x + 1, gy + 16);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(g.x + 5, gy + 14, 16, 7);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(g.x + 6, gy + 6, 4, 6);
    ctx.fillRect(g.x + 16, gy + 6, 4, 6);

    ctx.fillStyle = '#000000';
    ctx.fillRect(g.x + 8, gy + 8, 2, 4);
    ctx.fillRect(g.x + 16, gy + 8, 2, 4);

    ctx.fillRect(g.x + 4, gy + 4, 7, 2);
    ctx.fillRect(g.x + 15, gy + 4, 7, 2);

    ctx.fillStyle = '#000000';
    ctx.fillRect(g.x + 2, gy + 20, 8, 4);
    ctx.fillRect(g.x + 16, gy + 20, 8, 4);
  };

  const drawFlagpoleAndCastle = (ctx: CanvasRenderingContext2D, pole: typeof flagPole.current) => {
    ctx.fillStyle = '#00a800';
    ctx.fillRect(pole.x - 8, GROUND_Y - 20, 32, 20);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(pole.x - 8, GROUND_Y - 20, 32, 20);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(pole.x + 6, pole.y, 4, pole.height - 20);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(pole.x + 8, pole.y, 2, pole.height - 20);

    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(pole.x + 8, pole.y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Indonesian Flag
    const flagW = 48;
    const flagH = 32;
    const fx = pole.x + 10;
    const fy = pole.flagY;

    ctx.fillStyle = '#dc2626';
    ctx.fillRect(fx, fy, flagW, flagH / 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(fx, fy + flagH / 2, flagW, flagH / 2);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(fx, fy, flagW, flagH);

    // Castle
    const cx = pole.x + 110;
    const cy = GROUND_Y - 140;

    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(cx, cy, 140, 140);
    ctx.strokeRect(cx, cy, 140, 140);

    for (let b = 0; b < 4; b++) {
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(cx + b * 36, cy - 16, 24, 16);
      ctx.strokeRect(cx + b * 36, cy - 16, 24, 16);
    }

    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(cx + 70, cy + 85, 24, Math.PI, 0);
    ctx.lineTo(cx + 94, GROUND_Y);
    ctx.lineTo(cx + 46, GROUND_Y);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#dc2626';
    ctx.fillRect(cx + 56, cy + 15, 28, 10);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cx + 56, cy + 25, 28, 10);
    ctx.strokeRect(cx + 56, cy + 15, 28, 20);
  };

  const drawMario = (ctx: CanvasRenderingContext2D, m: typeof mario.current) => {
    ctx.save();
    ctx.translate(m.x + m.width / 2, m.y + m.height / 2);

    if (m.facing === 'left') {
      ctx.scale(-1, 1);
    }

    const ox = -m.width / 2;
    const oy = -m.height / 2;

    if (m.slidingFlag) {
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(ox + 4, oy + 2, 20, 8);
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(ox + 6, oy + 10, 16, 10);
      ctx.fillStyle = '#000000';
      ctx.fillRect(ox + 16, oy + 12, 3, 4);
      ctx.fillRect(ox + 12, oy + 15, 8, 4);
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(ox + 6, oy + 20, 16, 12);
      ctx.fillStyle = '#b45309';
      ctx.fillRect(ox + 4, oy + 30, 8, 6);
      ctx.fillRect(ox + 14, oy + 30, 8, 6);
      ctx.restore();
      return;
    }

    if (!m.grounded) {
      // Jump pose
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(ox + 6, oy + 2, 20, 8);
      ctx.fillRect(ox + 10, oy, 12, 4);

      ctx.fillStyle = '#78350f';
      ctx.fillRect(ox + 2, oy + 8, 8, 8);
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(ox + 10, oy + 8, 14, 10);

      ctx.fillStyle = '#000000';
      ctx.fillRect(ox + 18, oy + 10, 3, 3);
      ctx.fillRect(ox + 14, oy + 14, 10, 4);

      ctx.fillStyle = '#dc2626';
      ctx.fillRect(ox + 6, oy + 18, 16, 8);
      ctx.fillRect(ox + 20, oy + 10, 8, 6);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(ox + 24, oy + 6, 6, 6);

      ctx.fillStyle = '#2563eb';
      ctx.fillRect(ox + 6, oy + 22, 16, 10);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(ox + 10, oy + 23, 3, 3);

      ctx.fillStyle = '#78350f';
      ctx.fillRect(ox + 2, oy + 30, 10, 6);
      ctx.fillRect(ox + 16, oy + 28, 10, 6);
    } else if (m.animFrame === 0) {
      // Idle pose
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(ox + 6, oy + 2, 18, 8);
      ctx.fillRect(ox + 10, oy, 10, 4);

      ctx.fillStyle = '#78350f';
      ctx.fillRect(ox + 4, oy + 8, 6, 8);
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(ox + 10, oy + 8, 14, 10);

      ctx.fillStyle = '#000000';
      ctx.fillRect(ox + 18, oy + 10, 3, 3);
      ctx.fillRect(ox + 14, oy + 14, 10, 4);

      ctx.fillStyle = '#dc2626';
      ctx.fillRect(ox + 6, oy + 18, 16, 6);

      ctx.fillStyle = '#2563eb';
      ctx.fillRect(ox + 6, oy + 22, 16, 8);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(ox + 10, oy + 23, 3, 3);

      ctx.fillStyle = '#78350f';
      ctx.fillRect(ox + 4, oy + 30, 9, 6);
      ctx.fillRect(ox + 15, oy + 30, 9, 6);
    } else {
      // Running frames
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(ox + 8, oy + 2, 18, 8);

      ctx.fillStyle = '#78350f';
      ctx.fillRect(ox + 4, oy + 8, 6, 8);
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(ox + 10, oy + 8, 14, 10);

      ctx.fillStyle = '#000000';
      ctx.fillRect(ox + 18, oy + 10, 3, 3);
      ctx.fillRect(ox + 14, oy + 14, 10, 4);

      ctx.fillStyle = '#dc2626';
      ctx.fillRect(ox + 6, oy + 18, 16, 6);
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(ox + 6, oy + 22, 16, 8);

      ctx.fillStyle = '#78350f';
      if (m.animFrame === 1) {
        ctx.fillRect(ox + 2, oy + 28, 9, 7);
        ctx.fillRect(ox + 18, oy + 30, 8, 5);
      } else {
        ctx.fillRect(ox + 6, oy + 30, 8, 5);
        ctx.fillRect(ox + 18, oy + 28, 9, 7);
      }
    }

    ctx.restore();
  };

  const toggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsAudioMuted(muted);
    if (!muted) {
      soundManager.startBgm();
    } else {
      soundManager.stopBgm();
    }
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-yellow-400 bg-sky-400">
      {/* Top HUD Bar */}
      <div className="bg-slate-900/95 text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-retro border-b-2 border-yellow-400">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-yellow-400">MARIO</span>
            <div className="text-sm font-bold text-white tabular-nums tracking-wider">{String(score).padStart(6, '0')}</div>
          </div>
          <div>
            <span className="text-yellow-400">KOIN</span>
            <div className="text-sm font-bold text-yellow-300 tabular-nums">🪙 x{String(coins).padStart(2, '0')}</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-center">
            <span className="text-yellow-400">WORLD</span>
            <div className="text-sm font-bold text-sky-300">{currentWorld}-1</div>
          </div>
          <div className="text-center">
            <span className="text-yellow-400">TERJAWAB</span>
            <div className="text-sm font-bold text-emerald-400 tabular-nums">
              {answeredQuestions.size}/{questions.length}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {nearbyQuestion && (
            <button
              onClick={() => onTriggerQuestion(nearbyQuestion)}
              className="px-3 py-1 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold rounded animate-pulse cursor-pointer flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>BUKA SOAL {nearbyQuestion.id}</span>
            </button>
          )}

          <button
            onClick={toggleSound}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-yellow-300 rounded border border-yellow-400/50 cursor-pointer"
            title={isAudioMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Main Game Canvas with Click / Touch to open block */}
      <div className="relative w-full aspect-16/9 bg-sky-400 overflow-hidden cursor-crosshair">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onClick={handleCanvasClick}
          className="w-full h-full block pixelated"
        />

        {/* Informative Guidance Banner */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 pointer-events-none bg-slate-900/80 backdrop-blur-xs px-4 py-1.5 rounded-full text-[11px] text-yellow-300 font-semibold tracking-wide border border-yellow-400/50 shadow-md">
          ✨ Sundul Blok "?" dari bawah, ketuk blok pada layar, atau klik tombol soal di bawah!
        </div>

        {/* Quick Click Button if Mario is near any question */}
        {nearbyQuestion && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <button
              onClick={() => onTriggerQuestion(nearbyQuestion)}
              className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-retro text-xs font-bold rounded-xl shadow-2xl border-2 border-slate-950 animate-bounce cursor-pointer flex items-center gap-2"
            >
              <span>❓ BUKA & JAWAB SOAL NO. {nearbyQuestion.id}</span>
            </button>
          </div>
        )}
      </div>

      {/* Mobile Touch Controls */}
      <div className="bg-slate-900 px-4 py-3 border-t-2 border-yellow-400 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <button
            onPointerDown={() => { keys.current.left = true; }}
            onPointerUp={() => { keys.current.left = false; }}
            onPointerLeave={() => { keys.current.left = false; }}
            className="w-13 h-13 bg-slate-800 active:bg-yellow-400 text-white active:text-slate-950 font-bold rounded-2xl border-2 border-slate-700 flex items-center justify-center shadow-lg active:scale-95 transition-transform touch-none cursor-pointer"
            aria-label="Kiri"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button
            onPointerDown={() => { keys.current.right = true; }}
            onPointerUp={() => { keys.current.right = false; }}
            onPointerLeave={() => { keys.current.right = false; }}
            className="w-13 h-13 bg-slate-800 active:bg-yellow-400 text-white active:text-slate-950 font-bold rounded-2xl border-2 border-slate-700 flex items-center justify-center shadow-lg active:scale-95 transition-transform touch-none cursor-pointer"
            aria-label="Kanan"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>

        <div className="text-[11px] text-slate-300 font-medium text-center">
          {nearbyQuestion ? (
            <span className="text-yellow-300 font-bold">Tekan Spasi / Enter untuk Buka Soal!</span>
          ) : (
            <span>Gunakan Panah / A-D & Spasi untuk Berpetualang</span>
          )}
        </div>

        <div>
          <button
            onPointerDown={() => {
              if (mario.current.grounded) {
                mario.current.vy = -13;
                mario.current.grounded = false;
                soundManager.playJump();
              }
            }}
            className="w-14 h-14 bg-red-600 active:bg-red-500 text-white font-retro font-bold text-xs rounded-2xl border-2 border-red-400 flex items-center justify-center shadow-lg active:scale-95 transition-transform touch-none cursor-pointer"
            aria-label="Lompat"
          >
            <div className="flex flex-col items-center">
              <ArrowUp className="w-5 h-5 mb-0.5" />
              <span className="text-[9px]">LOMPAT</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
