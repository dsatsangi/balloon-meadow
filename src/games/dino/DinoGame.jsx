import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Home, Volume2, Sparkles, Maximize2, Minimize2, Cookie, Heart } from 'lucide-react';
import { DinoRenderer } from './DinoRenderer';
import { DinoFoodItem } from './DinoFoodItem';
import { generateFoodOptions } from './dinoData';
import { soundEngine } from '../../engine/SoundEngine';
import { speechEngine } from '../../engine/SpeechEngine';
import { ParticleSystem } from '../../engine/ParticleSystem';
import { CreditsBadge } from '../../components/CreditsBadge';

export const DinoGame = ({ onBackToHome, isFullscreen, onToggleFullscreen }) => {
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const particlesRef = useRef(new ParticleSystem());

  const [foodState, setFoodState] = useState(() => generateFoodOptions(4));
  const [snacksFed, setSnacksFed] = useState(0);
  const [isFeeding, setIsFeeding] = useState(false);
  const [flyingFood, setFlyingFood] = useState(null);

  // Initialize canvas and renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (rendererRef.current) {
        rendererRef.current.resize(canvas.width, canvas.height);
      } else {
        rendererRef.current = new DinoRenderer(canvas.width, canvas.height);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Speak initial request after brief delay
    const timer = setTimeout(() => {
      if (foodState.target) {
        speechEngine.speakDinoPrompt(foodState.target.color.name, foodState.target.shape.name);
      }
    }, 600);

    let animId;
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (rendererRef.current) {
        rendererRef.current.update();
        rendererRef.current.draw(ctx);
      }

      particlesRef.current.update();
      particlesRef.current.draw(ctx);

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Repeat speech prompt
  const handleRepeatPrompt = () => {
    if (foodState.target) {
      speechEngine.speakDinoPrompt(foodState.target.color.name, foodState.target.shape.name);
    }
  };

  // Feeding logic
  const handleFeed = useCallback((foodItem) => {
    if (isFeeding) return;
    setIsFeeding(true);
    soundEngine.init();

    const renderer = rendererRef.current;
    const target = foodState.target;
    const isMatch = foodItem.id === target.id;

    // Dino anticipates food: opens mouth wide
    if (renderer) {
      renderer.setMouthOpen(true);
    }
    soundEngine.playWhoosh();

    // Trigger mouth chomp after food flies in
    setTimeout(() => {
      if (renderer) {
        renderer.startChewing();
      }
      soundEngine.playChomp();

      if (isMatch) {
        // Correct match!
        speechEngine.speakDinoMunch();
        setSnacksFed((prev) => {
          const next = prev + 1;
          if (next % 5 === 0) {
            // Milestone reached!
            soundEngine.playCelebration();
            soundEngine.playGiggle();
            if (canvasRef.current) {
              particlesRef.current.createSuperCelebration(
                canvasRef.current.width,
                canvasRef.current.height
              );
            }
          }
          return next;
        });

        // Pick next food after chewing finishes
        setTimeout(() => {
          const nextOptions = generateFoodOptions(4);
          setFoodState(nextOptions);
          setIsFeeding(false);
          speechEngine.speakDinoPrompt(nextOptions.target.color.name, nextOptions.target.shape.name);
        }, 1600);
      } else {
        // Different item: gentle friendly encouragement
        speechEngine.speakDinoGentleRedirect(
          foodItem.color.name,
          foodItem.shape.name,
          target.color.name,
          target.shape.name
        );
        setTimeout(() => {
          setIsFeeding(false);
          if (renderer) {
            renderer.setMouthOpen(false);
          }
        }, 1400);
      }
    }, 400);
  }, [isFeeding, foodState]);

  const target = foodState.target;

  return (
    <div className="dino-game-container">
      {/* Top HUD */}
      <header className="hud-container">
        <div className="hud-left">
          <button
            className="home-nav-btn"
            onClick={onBackToHome}
            title="Back to All Games"
            aria-label="Back to All Games"
          >
            <Home size={20} />
            <span>Games Menu</span>
          </button>
        </div>

        {/* Dino Tummy Meter (5 snacks) */}
        <div className="hud-center">
          <div className="tummy-meter" title="Dino Tummy Fill Meter">
            <span className="tummy-label">Dino Tummy:</span>
            <div className="tummy-slots">
              {[0, 1, 2, 3, 4].map((idx) => {
                const isFilled = idx < (snacksFed % 5 || (snacksFed > 0 && snacksFed % 5 === 0 ? 5 : 0));
                return (
                  <span
                    key={idx}
                    className={`tummy-dot ${isFilled ? 'filled' : ''}`}
                  >
                    {isFilled ? '🍪' : '⚪'}
                  </span>
                );
              })}
            </div>
            <span className="tummy-count">⭐ {snacksFed}</span>
          </div>
        </div>

        <div className="hud-right">
          <button
            className="circle-btn"
            onClick={onToggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={22} /> : <Maximize2 size={22} />}
          </button>
        </div>
      </header>

      {/* Dinosaur Thought Bubble Request */}
      {target && (
        <div
          className="dino-thought-bubble"
          onClick={handleRepeatPrompt}
          role="button"
          tabIndex={0}
          title="Tap to hear Dino's request"
        >
          <div className="thought-header">
            <span>Rexy wants:</span>
            <Volume2 size={18} className="thought-audio-icon" />
          </div>
          <div className="thought-body">
            <span
              className="target-swatch"
              style={{ backgroundColor: target.color.hex }}
            />
            <span className="target-text">
              <strong>{target.color.name}</strong> {target.shape.name}
            </span>
          </div>
        </div>
      )}

      {/* Main Dinosaur Canvas */}
      <canvas ref={canvasRef} id="dinoCanvas" className="dino-canvas" />

      {/* Bottom Food Tray */}
      <div className="food-tray-container">
        <div className="food-tray-shelf">
          <div className="food-tray-label">
            <span>🍽️ Tap to feed Rexy!</span>
          </div>
          <div className="food-grid">
            {foodState.options.map((item) => (
              <DinoFoodItem
                key={item.id}
                item={item}
                isTarget={target && item.id === target.id}
                onFeed={handleFeed}
                disabled={isFeeding}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Credits Badge at bottom */}
      <CreditsBadge />
    </div>
  );
};
