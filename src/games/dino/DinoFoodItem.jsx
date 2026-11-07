import React from 'react';

export const DinoFoodItem = ({ item, isTarget, onFeed, disabled }) => {
  const { shape, color } = item;

  const renderShapeSvg = () => {
    const fill = color.hex;
    const dark = color.dark;

    switch (shape.id) {
      case 'circle':
        return (
          <svg viewBox="0 0 100 100" className="food-svg">
            {/* Cookie body */}
            <circle cx="50" cy="50" r="44" fill={fill} stroke={dark} strokeWidth="4" />
            {/* Gloss highlight */}
            <ellipse cx="36" cy="30" rx="14" ry="8" fill="rgba(255,255,255,0.45)" transform="rotate(-25 36 30)" />
            {/* Choc chip dots */}
            <circle cx="35" cy="48" r="4" fill={dark} />
            <circle cx="58" cy="38" r="4.5" fill={dark} />
            <circle cx="52" cy="62" r="4" fill={dark} />
            <circle cx="68" cy="56" r="3.5" fill={dark} />
          </svg>
        );

      case 'triangle':
        return (
          <svg viewBox="0 0 100 100" className="food-svg">
            {/* Slice */}
            <polygon points="50,12 88,86 12,86" fill={fill} stroke={dark} strokeWidth="4" strokeLinejoin="round" />
            <ellipse cx="45" cy="40" rx="10" ry="5" fill="rgba(255,255,255,0.4)" transform="rotate(-15 45 40)" />
            {/* Seeds/dots */}
            <circle cx="48" cy="50" r="3.5" fill={dark} />
            <circle cx="36" cy="70" r="3.5" fill={dark} />
            <circle cx="62" cy="68" r="3.5" fill={dark} />
          </svg>
        );

      case 'square':
        return (
          <svg viewBox="0 0 100 100" className="food-svg">
            <rect x="15" y="15" width="70" height="70" rx="14" fill={fill} stroke={dark} strokeWidth="4" />
            <ellipse cx="38" cy="28" rx="16" ry="6" fill="rgba(255,255,255,0.45)" />
            {/* Biscuit grid dots */}
            <circle cx="35" cy="40" r="3.5" fill={dark} />
            <circle cx="65" cy="40" r="3.5" fill={dark} />
            <circle cx="35" cy="65" r="3.5" fill={dark} />
            <circle cx="65" cy="65" r="3.5" fill={dark} />
          </svg>
        );

      case 'star':
        return (
          <svg viewBox="0 0 100 100" className="food-svg">
            <polygon
              points="50,10 62,38 92,38 68,56 77,85 50,68 23,85 32,56 8,38 38,38"
              fill={fill}
              stroke={dark}
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <circle cx="44" cy="36" r="5" fill="rgba(255,255,255,0.5)" />
            <circle cx="50" cy="52" r="3.5" fill={dark} />
          </svg>
        );

      case 'heart':
        return (
          <svg viewBox="0 0 100 100" className="food-svg">
            <path
              d="M50,85 C20,60 10,40 10,28 C10,15 22,10 32,10 C42,10 48,18 50,22 C52,18 58,10 68,10 C78,10 90,15 90,28 C90,40 80,60 50,85 Z"
              fill={fill}
              stroke={dark}
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <ellipse cx="32" cy="24" rx="8" ry="4" fill="rgba(255,255,255,0.45)" transform="rotate(-30 32 24)" />
          </svg>
        );

      case 'diamond':
        return (
          <svg viewBox="0 0 100 100" className="food-svg">
            <polygon points="50,12 88,50 50,88 12,50" fill={fill} stroke={dark} strokeWidth="4" strokeLinejoin="round" />
            <polygon points="50,22 76,50 50,78 24,50" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" />
            <ellipse cx="44" cy="34" rx="8" ry="4" fill="rgba(255,255,255,0.6)" transform="rotate(-20 44 34)" />
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <button
      className={`food-plate ${isTarget ? 'is-target' : ''}`}
      onClick={() => !disabled && onFeed(item)}
      disabled={disabled}
      title={`Feed ${color.name} ${shape.name}`}
      aria-label={`Feed ${color.name} ${shape.name}`}
    >
      <div className="plate-base">
        {renderShapeSvg()}
      </div>
      <span className="food-name" style={{ color: color.dark }}>
        {color.name} {shape.name}
      </span>
    </button>
  );
};
