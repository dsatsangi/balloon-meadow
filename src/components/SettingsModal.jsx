import React from 'react';
import { Volume2, VolumeX, Bell, BellOff, Gauge, X, Heart, Sparkles } from 'lucide-react';

export const SettingsModal = ({
  isOpen,
  onClose,
  speed,
  onToggleSpeed,
  voiceEnabled,
  onToggleVoice,
  soundEnabled,
  onToggleSound
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">🧸 Game Settings</h2>
          <button className="icon-close-btn" onClick={onClose} aria-label="Close">
            <X size={22} />
          </button>
        </div>

        <div className="settings-grid">
          <button className="setting-btn" onClick={onToggleSpeed}>
            <Gauge size={22} color="#3182CE" />
            <span>Speed: {speed === 'slow' ? '🐢 Slow (Baby)' : '⚡ Normal'}</span>
          </button>

          <button className="setting-btn" onClick={onToggleVoice}>
            {voiceEnabled ? (
              <Volume2 size={22} color="#38A169" />
            ) : (
              <VolumeX size={22} color="#E53E3E" />
            )}
            <span>Voice: {voiceEnabled ? 'On' : 'Off'}</span>
          </button>

          <button className="setting-btn" onClick={onToggleSound}>
            {soundEnabled ? (
              <Bell size={22} color="#D69E2E" />
            ) : (
              <BellOff size={22} color="#E53E3E" />
            )}
            <span>Sound FX: {soundEnabled ? 'On' : 'Off'}</span>
          </button>
        </div>

        {/* Dedicated Credits Box */}
        <div className="modal-credits-box">
          <div className="credits-title">
            <Sparkles size={16} color="#FF6B6B" />
            <span>Pop &amp; Match Balloon Meadow</span>
            <Sparkles size={16} color="#FF6B6B" />
          </div>
          <p className="credits-author">
            Developed with <Heart size={14} className="heart-inline" fill="#FF4081" color="#FF4081" /> by{' '}
            <strong>Dhruv &amp; Dhriti</strong>
          </p>
          <p className="credits-desc">
            A playful, zero-frustration sensory game built for toddlers to learn colors, sounds, and hand-eye coordination.
          </p>
        </div>

        <button className="close-btn" onClick={onClose}>
          ✨ Back to Playing!
        </button>
      </div>
    </div>
  );
};
