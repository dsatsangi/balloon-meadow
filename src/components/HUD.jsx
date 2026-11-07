import React from 'react';
import { Settings, Maximize2, Minimize2, Sparkles, Target } from 'lucide-react';
import { QuestBanner } from './QuestBanner';
import { StarJar } from './StarJar';

export const HUD = ({
  mode,
  onModeChange,
  targetColor,
  stars,
  isStarBouncing,
  onOpenSettings,
  isFullscreen,
  onToggleFullscreen
}) => {
  return (
    <header className="hud-container">
      <div className="hud-left">
        <nav className="mode-switcher" aria-label="Game Modes">
          <button
            className={`mode-btn ${mode === 'free' ? 'active' : ''}`}
            onClick={() => onModeChange('free')}
            title="Free Play Sensory Mode"
          >
            <Sparkles size={18} />
            <span>Free Pop</span>
          </button>
          <button
            className={`mode-btn ${mode === 'quest' ? 'active' : ''}`}
            onClick={() => onModeChange('quest')}
            title="Color Quest Guided Mode"
          >
            <Target size={18} />
            <span>Color Quest</span>
          </button>
        </nav>
      </div>

      <div className="hud-center">
        {mode === 'quest' && <QuestBanner targetColor={targetColor} />}
      </div>

      <div className="hud-right">
        <StarJar stars={stars} isBouncing={isStarBouncing} />

        <button
          className="circle-btn"
          onClick={onToggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          aria-label="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 size={22} /> : <Maximize2 size={22} />}
        </button>

        <button
          className="circle-btn"
          onClick={onOpenSettings}
          title="Game Settings & Credits"
          aria-label="Settings"
        >
          <Settings size={22} />
        </button>
      </div>
    </header>
  );
};
