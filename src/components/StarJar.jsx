import React from 'react';
import { Star } from 'lucide-react';

export const StarJar = ({ stars, isBouncing }) => {
  return (
    <div 
      className={`star-jar ${isBouncing ? 'bounce' : ''}`}
      title="Stars Collected"
    >
      <Star size={24} className="star-icon" fill="#F59E0B" color="#D97706" />
      <span className="star-count">{stars}</span>
    </div>
  );
};
