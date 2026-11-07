import React from 'react';
import { Sparkles, Heart, Play, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react';
import { soundEngine } from '../engine/SoundEngine';
import { speechEngine } from '../engine/SpeechEngine';

export const LandingPage = ({
  onSelectGame,
  isFullscreen,
  onToggleFullscreen,
  soundEnabled,
  onToggleSound,
  voiceEnabled,
  onToggleVoice
}) => {
  const handleLaunch = (gameId) => {
    soundEngine.init();
    soundEngine.playBoing();
    onSelectGame(gameId);
  };

  return (
    <div className="landing-container">
      {/* Top Bar Controls */}
      <header className="landing-top-bar">
        <div className="portal-badge">
          <Sparkles size={18} color="#FF6B6B" />
          <span>Toddler Playland</span>
        </div>

        <div className="top-bar-actions">
          <button
            className="circle-btn"
            onClick={onToggleVoice}
            title="Toggle Voice Prompts"
            aria-label="Toggle Voice"
          >
            {voiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>

          <button
            className="circle-btn"
            onClick={onToggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
        </div>
      </header>

      {/* Main Title Hero */}
      <div className="landing-hero">
        <h1 className="landing-title">
          🎈 Toddler Playland 🦖
        </h1>
        <p className="landing-subtitle">
          Joyful, zero-frustration learning games designed with love for little explorers
        </p>
      </div>

      {/* Game Selection Grid */}
      <main className="games-grid">
        {/* Game 1: Balloon Meadow */}
        <div
          className="game-card balloon-card"
          onClick={() => handleLaunch('balloon-meadow')}
          role="button"
          tabIndex={0}
        >
          <div className="card-badge balloon-badge">
            <span>🎨 Color Learning</span>
          </div>

          <div className="card-visual">
            <div className="floating-balloon-preview red-preview">🎈</div>
            <div className="floating-balloon-preview yellow-preview">⭐</div>
            <div className="floating-balloon-preview blue-preview">💖</div>
          </div>

          <div className="card-info">
            <h2 className="game-card-title">Pop &amp; Match Balloon Meadow</h2>
            <p className="game-card-desc">
              Pop floating balloons, listen to pentatonic chimes, and discover magical colors!
            </p>
            <button className="play-btn balloon-play-btn">
              <Play size={20} fill="#FFF" />
              <span>Play Balloons</span>
            </button>
          </div>
        </div>

        {/* Game 2: Hungry Dino */}
        <div
          className="game-card dino-card"
          onClick={() => handleLaunch('hungry-dino')}
          role="button"
          tabIndex={0}
        >
          <div className="card-badge dino-badge">
            <span>🔷 Shapes &amp; Colors</span>
          </div>

          <div className="card-visual">
            <div className="dino-preview-icon">🦖</div>
            <div className="food-bite-preview cookie-preview">🍪</div>
            <div className="food-bite-preview star-preview">⭐</div>
          </div>

          <div className="card-info">
            <h2 className="game-card-title">Hungry Dino: Shapes &amp; Feast</h2>
            <p className="game-card-desc">
              Baby Dino Rexy is hungry! Feed him delicious colored cookies, stars, and triangles.
            </p>
            <button className="play-btn dino-play-btn">
              <Play size={20} fill="#FFF" />
              <span>Feed Dino</span>
            </button>
          </div>
        </div>
      </main>

      {/* Prominent Developer Tribute Footer */}
      <footer className="landing-footer">
        <div className="footer-credits-box">
          <Sparkles size={16} color="#FF4081" />
          <span>
            Proudly Developed with <Heart size={14} className="heart-inline" fill="#FF4081" color="#FF4081" /> by{' '}
            <strong>Dhruv &amp; Dhriti</strong>
          </span>
          <Sparkles size={16} color="#FF4081" />
        </div>
      </footer>
    </div>
  );
};
