import React, { useState, useEffect, useCallback } from 'react';
import { LandingPage } from './components/LandingPage';
import { HUD } from './components/HUD';
import { BalloonCanvas } from './components/BalloonCanvas';
import { SettingsModal } from './components/SettingsModal';
import { CreditsBadge } from './components/CreditsBadge';
import { DinoGame } from './games/dino/DinoGame';
import { BALLOON_COLORS } from './engine/Balloon';
import { soundEngine } from './engine/SoundEngine';
import { speechEngine } from './engine/SpeechEngine';

export const App = () => {
  // Navigation: 'home' | 'balloon-meadow' | 'hungry-dino'
  const [currentView, setCurrentView] = useState('home');

  // Balloon game state
  const [mode, setMode] = useState('free');
  const [speed, setSpeed] = useState('slow');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [targetColor, setTargetColor] = useState(null);
  const [stars, setStars] = useState(0);
  const [isStarBouncing, setIsStarBouncing] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Pick a new target color for quest mode
  const pickNewQuestColor = useCallback(() => {
    const nextColor = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
    setTargetColor(nextColor);
    speechEngine.speakPrompt(nextColor.name);
  }, []);

  // Handle mode change
  const handleModeChange = (newMode) => {
    soundEngine.init();
    setMode(newMode);
    if (newMode === 'quest') {
      pickNewQuestColor();
    } else {
      setTargetColor(null);
    }
  };

  // Add star and bounce star jar
  const handleAddStar = useCallback(() => {
    setStars((prev) => {
      const next = prev + 1;
      if (next % 5 === 0) {
        soundEngine.playCelebration();
        if (window.triggerSuperCelebration) {
          window.triggerSuperCelebration();
        }
      }
      return next;
    });

    setIsStarBouncing(true);
    setTimeout(() => setIsStarBouncing(false), 500);
  }, []);

  // Target color matched in quest mode
  const handleTargetMatched = useCallback(() => {
    handleAddStar();
    setTimeout(() => {
      pickNewQuestColor();
    }, 1400);
  }, [handleAddStar, pickNewQuestColor]);

  // Speed toggle
  const toggleSpeed = () => {
    soundEngine.init();
    setSpeed((prev) => (prev === 'slow' ? 'normal' : 'slow'));
  };

  // Voice toggle
  const toggleVoice = () => {
    const isNowOn = speechEngine.toggleSpeech();
    setVoiceEnabled(isNowOn);
  };

  // Sound FX toggle
  const toggleSound = () => {
    const isMuted = soundEngine.toggleMute();
    setSoundEnabled(!isMuted);
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(() => {});
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(() => {});
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  // 1. Landing Page View
  if (currentView === 'home') {
    return (
      <LandingPage
        onSelectGame={(gameId) => setCurrentView(gameId)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        voiceEnabled={voiceEnabled}
        onToggleVoice={toggleVoice}
      />
    );
  }

  // 2. Hungry Dino Game View
  if (currentView === 'hungry-dino') {
    return (
      <DinoGame
        onBackToHome={() => setCurrentView('home')}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />
    );
  }

  // 3. Balloon Meadow Game View
  return (
    <div className="game-container">
      {/* Top HUD */}
      <HUD
        onBackToHome={() => setCurrentView('home')}
        mode={mode}
        onModeChange={handleModeChange}
        targetColor={targetColor}
        stars={stars}
        isStarBouncing={isStarBouncing}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />

      {/* Main Interactive Balloon Canvas */}
      <BalloonCanvas
        mode={mode}
        speed={speed}
        targetColor={targetColor}
        onTargetMatched={handleTargetMatched}
        onAddStar={handleAddStar}
      />

      {/* Credits Badge at bottom */}
      <CreditsBadge onClick={() => setIsSettingsOpen(true)} />

      {/* Settings Modal Drawer */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        speed={speed}
        onToggleSpeed={toggleSpeed}
        voiceEnabled={voiceEnabled}
        onToggleVoice={toggleVoice}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
      />
    </div>
  );
};

export default App;
