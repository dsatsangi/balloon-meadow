import React from 'react';
import { Heart, Sparkles } from 'lucide-react';

export const CreditsBadge = ({ onClick }) => {
  return (
    <footer 
      className="credits-badge" 
      onClick={onClick}
      role="contentinfo"
      title="Developed by Dhruv & Dhriti"
    >
      <Sparkles size={14} className="sparkle-icon" />
      <span>Developed with <Heart size={13} className="heart-icon" /> by <strong>Dhruv &amp; Dhriti</strong></span>
      <Sparkles size={14} className="sparkle-icon" />
    </footer>
  );
};
