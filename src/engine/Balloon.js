// Balloon definitions, rendering, shapes, and physics

export const BALLOON_COLORS = [
  { name: 'Red', hex: '#FF3B30', dark: '#C41C12' },
  { name: 'Orange', hex: '#FF9500', dark: '#C96800' },
  { name: 'Yellow', hex: '#FFCC00', dark: '#C79A00' },
  { name: 'Green', hex: '#34C759', dark: '#1E8E3E' },
  { name: 'Blue', hex: '#007AFF', dark: '#0051A8' },
  { name: 'Purple', hex: '#AF52DE', dark: '#7525A3' },
  { name: 'Pink', hex: '#FF2D55', dark: '#BA1737' }
];

export const BALLOON_SHAPES = ['oval', 'oval', 'bear', 'heart', 'star'];

export class Balloon {
  constructor(canvasWidth, canvasHeight, forcedColor = null, forcedShape = null) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    const colorObj = forcedColor || BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
    this.colorName = colorObj.name;
    this.hex = colorObj.hex;
    this.darkHex = colorObj.dark;

    this.shape = forcedShape || BALLOON_SHAPES[Math.floor(Math.random() * BALLOON_SHAPES.length)];

    const baseSize = Math.min(canvasWidth, canvasHeight) * 0.14;
    this.radiusX = Math.max(38, Math.min(65, baseSize));
    this.radiusY = this.radiusX * 1.22;

    const margin = this.radiusX * 1.5;
    this.x = margin + Math.random() * (canvasWidth - margin * 2);
    this.y = canvasHeight + this.radiusY * 2 + Math.random() * 80;

    this.baseSpeed = 1.2 + Math.random() * 0.8;
    this.speedMultiplier = 1.0;
    this.wobbleSpeed = 0.02 + Math.random() * 0.02;
    this.wobbleAmp = 18 + Math.random() * 15;
    this.wobbleOffset = Math.random() * Math.PI * 2;

    this.stringLength = this.radiusY * 1.4;
    this.stringWobble = 0;
    this.hasFace = Math.random() > 0.3;

    this.isTarget = false;
    this.pulseTimer = 0;
  }

  update(speedSetting = 'slow') {
    const speedFactor = speedSetting === 'slow' ? 0.85 : 1.3;
    this.y -= this.baseSpeed * speedFactor * this.speedMultiplier;

    this.wobbleOffset += this.wobbleSpeed;
    this.currentX = this.x + Math.sin(this.wobbleOffset) * this.wobbleAmp;
    this.stringWobble = Math.sin(this.wobbleOffset - 0.5) * 12;

    if (this.isTarget) {
      this.pulseTimer += 0.05;
    }
  }

  isHit(px, py) {
    const cx = this.currentX;
    const cy = this.y;
    const tolerance = 28;
    const dx = px - cx;
    const dy = py - cy;

    const normalized = (dx * dx) / ((this.radiusX + tolerance) ** 2) +
                       (dy * dy) / ((this.radiusY + tolerance) ** 2);

    if (normalized <= 1.0) return true;

    if (Math.abs(dx) < 32 && dy > 0 && dy < this.stringLength + tolerance) {
      return true;
    }

    return false;
  }

  draw(ctx) {
    ctx.save();
    const cx = this.currentX;
    const cy = this.y;

    if (this.isTarget) {
      const pulse = 1.0 + Math.sin(this.pulseTimer * 3) * 0.12;
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, (this.radiusY + 22) * pulse, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 235, 59, 0.4)';
      ctx.shadowColor = '#FFD700';
      ctx.shadowBlur = 25;
      ctx.fill();

      ctx.strokeStyle = '#FFE082';
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.restore();
    }

    // String
    ctx.beginPath();
    const knotY = cy + this.radiusY;
    ctx.moveTo(cx, knotY);
    ctx.quadraticCurveTo(
      cx + this.stringWobble,
      knotY + this.stringLength * 0.5,
      cx + this.stringWobble * 0.5,
      knotY + this.stringLength
    );
    ctx.strokeStyle = '#E0E0E0';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Knot
    ctx.beginPath();
    ctx.moveTo(cx - 7, knotY + 5);
    ctx.lineTo(cx + 7, knotY + 5);
    ctx.lineTo(cx, knotY - 1);
    ctx.closePath();
    ctx.fillStyle = this.darkHex;
    ctx.fill();

    // Balloon Body
    ctx.save();
    if (this.shape === 'bear') {
      this.drawBearEars(ctx, cx, cy);
      this.drawOvalBody(ctx, cx, cy);
    } else if (this.shape === 'heart') {
      this.drawHeartBody(ctx, cx, cy);
    } else if (this.shape === 'star') {
      this.drawStarBody(ctx, cx, cy);
    } else {
      this.drawOvalBody(ctx, cx, cy);
    }

    this.drawShine(ctx, cx, cy);

    if (this.hasFace) {
      this.drawKawaiiFace(ctx, cx, cy);
    }

    ctx.restore();
    ctx.restore();
  }

  drawOvalBody(ctx, cx, cy) {
    ctx.beginPath();
    ctx.ellipse(cx, cy, this.radiusX, this.radiusY, 0, 0, Math.PI * 2);

    const grad = ctx.createRadialGradient(
      cx - this.radiusX * 0.35, cy - this.radiusY * 0.35, this.radiusX * 0.1,
      cx, cy, this.radiusY
    );
    grad.addColorStop(0, '#FFFFFF');
    grad.addColorStop(0.25, this.hex);
    grad.addColorStop(1, this.darkHex);

    ctx.fillStyle = grad;
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.stroke();
  }

  drawBearEars(ctx, cx, cy) {
    const earRadius = this.radiusX * 0.38;
    const earOffsetX = this.radiusX * 0.72;
    const earOffsetY = this.radiusY * 0.75;

    ctx.beginPath();
    ctx.arc(cx - earOffsetX, cy - earOffsetY, earRadius, 0, Math.PI * 2);
    ctx.fillStyle = this.hex;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx - earOffsetX, cy - earOffsetY, earRadius * 0.55, 0, Math.PI * 2);
    ctx.fillStyle = '#FFEBEF';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx + earOffsetX, cy - earOffsetY, earRadius, 0, Math.PI * 2);
    ctx.fillStyle = this.hex;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + earOffsetX, cy - earOffsetY, earRadius * 0.55, 0, Math.PI * 2);
    ctx.fillStyle = '#FFEBEF';
    ctx.fill();
  }

  drawHeartBody(ctx, cx, cy) {
    const s = this.radiusX * 0.038;
    ctx.save();
    ctx.translate(cx, cy - 8);
    ctx.beginPath();
    ctx.moveTo(0, s * 15);
    ctx.bezierCurveTo(s * 25, -s * 10, s * 45, s * 10, 0, s * 45);
    ctx.bezierCurveTo(-s * 45, s * 10, -s * 25, -s * 10, 0, s * 15);
    ctx.closePath();

    const grad = ctx.createRadialGradient(-s * 10, -s * 5, 5, 0, s * 15, s * 45);
    grad.addColorStop(0, '#FFFFFF');
    grad.addColorStop(0.3, this.hex);
    grad.addColorStop(1, this.darkHex);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
  }

  drawStarBody(ctx, cx, cy) {
    ctx.save();
    ctx.translate(cx, cy);
    const spikes = 5;
    const outer = this.radiusY * 0.95;
    const inner = this.radiusY * 0.55;
    let rot = (Math.PI / 2) * 3;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(0, -outer);
    for (let i = 0; i < spikes; i++) {
      ctx.lineTo(Math.cos(rot) * outer, Math.sin(rot) * outer);
      rot += step;
      ctx.lineTo(Math.cos(rot) * inner, Math.sin(rot) * inner);
      rot += step;
    }
    ctx.closePath();

    const grad = ctx.createRadialGradient(-outer * 0.3, -outer * 0.3, 5, 0, 0, outer);
    grad.addColorStop(0, '#FFFFFF');
    grad.addColorStop(0.3, this.hex);
    grad.addColorStop(1, this.darkHex);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
  }

  drawShine(ctx, cx, cy) {
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(
      cx - this.radiusX * 0.42,
      cy - this.radiusY * 0.45,
      this.radiusX * 0.22,
      this.radiusY * 0.14,
      -Math.PI / 4,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx - this.radiusX * 0.22, cy - this.radiusY * 0.62, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.fill();
    ctx.restore();
  }

  drawKawaiiFace(ctx, cx, cy) {
    ctx.save();
    const eyeSpacing = this.radiusX * 0.35;
    const eyeY = cy - 2;

    ctx.fillStyle = '#222222';

    // Left Eye
    ctx.beginPath();
    ctx.arc(cx - eyeSpacing, eyeY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(cx - eyeSpacing - 1, eyeY - 1, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Right Eye
    ctx.fillStyle = '#222222';
    ctx.beginPath();
    ctx.arc(cx + eyeSpacing, eyeY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(cx + eyeSpacing - 1, eyeY - 1, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Cheeks
    ctx.fillStyle = 'rgba(255, 105, 180, 0.5)';
    ctx.beginPath();
    ctx.ellipse(cx - eyeSpacing - 4, eyeY + 7, 5, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + eyeSpacing + 4, eyeY + 7, 5, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Smile
    ctx.beginPath();
    ctx.arc(cx, eyeY + 4, 7, 0.15 * Math.PI, 0.85 * Math.PI, false);
    ctx.strokeStyle = '#222222';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.restore();
  }
}
