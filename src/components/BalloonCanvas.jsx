import React, { useRef, useEffect, useCallback } from 'react';
import { Balloon, BALLOON_COLORS } from '../engine/Balloon';
import { MeadowBackground } from '../engine/MeadowBackground';
import { ParticleSystem } from '../engine/ParticleSystem';
import { soundEngine } from '../engine/SoundEngine';
import { speechEngine } from '../engine/SpeechEngine';

export const BalloonCanvas = ({
  mode,
  speed,
  targetColor,
  onTargetMatched,
  onAddStar
}) => {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    balloons: [],
    background: null,
    particles: new ParticleSystem(),
    spawnTimer: 0,
    noteCounter: 0,
    mode: mode,
    speed: speed,
    targetColor: targetColor
  });

  // Keep ref synchronized with props for the animation loop
  useEffect(() => {
    stateRef.current.mode = mode;
    stateRef.current.speed = speed;
    stateRef.current.targetColor = targetColor;

    // Update target flags on all active balloons
    stateRef.current.balloons.forEach((b) => {
      b.isTarget = mode === 'quest' && targetColor && b.colorName === targetColor.name;
    });

    // In quest mode, if target color isn't on screen, spawn one!
    if (mode === 'quest' && targetColor) {
      const hasColor = stateRef.current.balloons.some((b) => b.colorName === targetColor.name);
      if (!hasColor && canvasRef.current) {
        spawnBalloon(targetColor);
      }
    }
  }, [mode, speed, targetColor]);

  const spawnBalloon = useCallback((forcedColor = null) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const s = stateRef.current;
    if (s.balloons.length >= 10 && !forcedColor) return;

    let color = forcedColor;
    if (!color && s.mode === 'quest' && s.targetColor && Math.random() < 0.35) {
      color = s.targetColor;
    }

    const b = new Balloon(canvas.width, canvas.height, color);
    if (s.mode === 'quest' && s.targetColor && b.colorName === s.targetColor.name) {
      b.isTarget = true;
    }
    s.balloons.push(b);
  }, []);

  const popBalloon = useCallback((balloon, index) => {
    const s = stateRef.current;
    const x = balloon.currentX;
    const y = balloon.y;

    soundEngine.playPop();
    soundEngine.playChime(s.noteCounter++);
    s.particles.createPopExplosion(x, y, balloon.hex, balloon.colorName);

    s.balloons.splice(index, 1);

    if (s.mode === 'quest' && s.targetColor) {
      if (balloon.colorName === s.targetColor.name) {
        soundEngine.playCelebration();
        speechEngine.speakPraise();
        onTargetMatched();
      } else {
        speechEngine.speakColor(balloon.colorName);
        spawnBalloon(s.targetColor);
        onAddStar();
      }
    } else {
      speechEngine.speakColor(balloon.colorName);
      onAddStar();
    }
  }, [onTargetMatched, onAddStar, spawnBalloon]);

  const handleInteraction = useCallback((x, y) => {
    const s = stateRef.current;
    if (!s.background) return;

    // 1. Check interactive Sun Easter Egg
    if (s.background.checkSunClick(x, y)) {
      s.particles.createPopExplosion(x, y, '#FFD700', '☀️');
      return;
    }

    // 2. Check Balloons (topmost first)
    let popped = false;
    for (let i = s.balloons.length - 1; i >= 0; i--) {
      const b = s.balloons[i];
      if (b.isHit(x, y)) {
        popBalloon(b, i);
        popped = true;
        break;
      }
    }

    // 3. Tap empty space: gentle magical sparkle ripple
    if (!popped) {
      s.particles.createPopExplosion(x, y, '#FFFFFF', '');
      soundEngine.playChime(s.noteCounter++);
    }
  }, [popBalloon]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (stateRef.current.background) {
        stateRef.current.background.resize(canvas.width, canvas.height);
      } else {
        stateRef.current.background = new MeadowBackground(canvas.width, canvas.height);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Multi-touch handler
    const onTouchStart = (e) => {
      e.preventDefault();
      soundEngine.init();
      const rect = canvas.getBoundingClientRect();
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        handleInteraction(touch.clientX - rect.left, touch.clientY - rect.top);
      }
    };

    // Mouse click handler
    const onMouseDown = (e) => {
      soundEngine.init();
      const rect = canvas.getBoundingClientRect();
      handleInteraction(e.clientX - rect.left, e.clientY - rect.top);
    };

    // Keyboard bash handler
    const onKeyDown = (e) => {
      soundEngine.init();
      if (['F11', 'F12', 'Escape'].includes(e.key)) return;
      const s = stateRef.current;
      if (s.balloons.length > 0) {
        popBalloon(s.balloons[0], 0);
      } else {
        spawnBalloon();
      }
    };

    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('keydown', onKeyDown);

    // Main animation loop
    let animId;
    const loop = () => {
      const s = stateRef.current;
      const w = canvas.width;
      const h = canvas.height;

      // Update background
      if (s.background) {
        s.background.update();
      }

      // Spawning
      s.spawnTimer++;
      const interval = s.speed === 'slow' ? 80 : 55;
      if (s.spawnTimer >= interval) {
        spawnBalloon();
        s.spawnTimer = 0;
      }

      // Update balloons
      for (let i = s.balloons.length - 1; i >= 0; i--) {
        const b = s.balloons[i];
        b.update(s.speed);
        if (b.y < -b.radiusY * 3) {
          s.balloons.splice(i, 1);
        }
      }

      // Update particles
      s.particles.update();

      // Draw
      ctx.clearRect(0, 0, w, h);
      if (s.background) s.background.draw(ctx);
      for (const b of s.balloons) {
        b.draw(ctx);
      }
      s.particles.draw(ctx);

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [handleInteraction, popBalloon, spawnBalloon]);

  // Method to trigger super celebration from parent
  useEffect(() => {
    window.triggerSuperCelebration = () => {
      if (canvasRef.current && stateRef.current.particles) {
        stateRef.current.particles.createSuperCelebration(
          canvasRef.current.width,
          canvasRef.current.height
        );
      }
    };
  }, []);

  return <canvas ref={canvasRef} id="gameCanvas" />;
};
