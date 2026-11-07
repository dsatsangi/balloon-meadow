import React from 'react';
import { Volume2 } from 'lucide-react';
import { speechEngine } from '../engine/SpeechEngine';

export const QuestBanner = ({ targetColor }) => {
  if (!targetColor) return null;

  const handleBannerClick = () => {
    speechEngine.speakPrompt(targetColor.name);
  };

  return (
    <div 
      className="quest-banner" 
      onClick={handleBannerClick}
      title="Tap to repeat instructions"
      role="button"
      tabIndex={0}
    >
      <span 
        className="quest-swatch" 
        style={{ backgroundColor: targetColor.hex }} 
      />
      <span className="quest-text">Find the {targetColor.name} balloon!</span>
      <Volume2 size={20} className="audio-icon" />
    </div>
  );
};
