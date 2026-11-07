// Shape and color definitions for the Hungry Dino game

export const DINO_SHAPES = [
  { id: 'circle', name: 'Circle', label: 'Cookie', icon: '●' },
  { id: 'triangle', name: 'Triangle', label: 'Slice', icon: '▲' },
  { id: 'square', name: 'Square', label: 'Cracker', icon: '■' },
  { id: 'star', name: 'Star', label: 'Star Fruit', icon: '★' },
  { id: 'heart', name: 'Heart', label: 'Berry', icon: '♥' },
  { id: 'diamond', name: 'Diamond', label: 'Jelly', icon: '◆' }
];

export const DINO_COLORS = [
  { name: 'Red', hex: '#FF3B30', dark: '#C41C12' },
  { name: 'Yellow', hex: '#FFCC00', dark: '#C79A00' },
  { name: 'Green', hex: '#34C759', dark: '#1E8E3E' },
  { name: 'Blue', hex: '#007AFF', dark: '#0051A8' },
  { name: 'Orange', hex: '#FF9500', dark: '#C96800' },
  { name: 'Purple', hex: '#AF52DE', dark: '#7525A3' },
  { name: 'Pink', hex: '#FF2D55', dark: '#BA1737' }
];

export const generateFoodOptions = (count = 4) => {
  const options = [];
  const usedKeys = new Set();

  while (options.length < count) {
    const shape = DINO_SHAPES[Math.floor(Math.random() * DINO_SHAPES.length)];
    const color = DINO_COLORS[Math.floor(Math.random() * DINO_COLORS.length)];
    const key = `${color.name}-${shape.id}`;

    if (!usedKeys.has(key)) {
      usedKeys.add(key);
      options.push({
        id: key,
        shape: shape,
        color: color
      });
    }
  }

  // Pick one as the target that Dino is craving!
  const target = options[Math.floor(Math.random() * options.length)];

  return { options, target };
};
