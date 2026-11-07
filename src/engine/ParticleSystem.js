// Particle and FX engine for balloon burst effects, confetti, and floating text

export class ParticleSystem {
  constructor() {
    this.particles = [];
    this.floatingTexts = [];
  }

  createPopExplosion(x, y, balloonColor, balloonName) {
    const confettiCount = 28;
    const starCount = 12;

    // Confetti ribbons
    for (let i = 0; i < confettiCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      const colors = [balloonColor, '#FFF', '#FFD700', '#FF85A2', '#85E3FF'];
      const color = colors[Math.floor(Math.random() * colors.length)];

      this.particles.push({
        type: 'confetti',
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.5,
        color: color,
        width: Math.random() * 8 + 6,
        height: Math.random() * 12 + 8,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.25,
        tilt: Math.random() * Math.PI,
        tiltSpeed: Math.random() * 0.15 + 0.05,
        life: 1.0,
        decay: Math.random() * 0.015 + 0.012
      });
    }

    // Sparkle stars
    for (let i = 0; i < starCount; i++) {
      const angle = (i / starCount) * Math.PI * 2 + (Math.random() * 0.2);
      const speed = Math.random() * 5 + 4;
      this.particles.push({
        type: 'star',
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 10 + 8,
        color: '#FFD700',
        life: 1.0,
        decay: Math.random() * 0.025 + 0.02
      });
    }

    // Shockwave ring
    this.particles.push({
      type: 'ring',
      x: x,
      y: y,
      radius: 12,
      maxRadius: 75,
      color: balloonColor,
      life: 1.0,
      decay: 0.04
    });

    // Floating celebratory text
    if (balloonName) {
      this.floatingTexts.push({
        x: x,
        y: y - 20,
        text: balloonName,
        color: balloonColor,
        life: 1.0,
        vy: -1.8,
        scale: 0.5
      });
    }
  }

  createSuperCelebration(canvasWidth, canvasHeight) {
    for (let i = 0; i < 90; i++) {
      const x = Math.random() * canvasWidth;
      const y = Math.random() * (canvasHeight * 0.5);
      const palette = ['#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#007AFF', '#AF52DE', '#FF2D55'];
      const color = palette[Math.floor(Math.random() * palette.length)];

      this.particles.push({
        type: 'confetti',
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 6,
        vy: Math.random() * -5 - 2,
        color: color,
        width: Math.random() * 10 + 6,
        height: Math.random() * 14 + 10,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.2,
        tilt: Math.random() * Math.PI,
        tiltSpeed: Math.random() * 0.12 + 0.04,
        life: 1.0,
        decay: Math.random() * 0.008 + 0.006
      });
    }
  }

  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      if (p.type === 'confetti') {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.16;
        p.vx *= 0.98;
        p.rotation += p.rotSpeed;
        p.tilt += p.tiltSpeed;
      } else if (p.type === 'star') {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.94;
        p.vy *= 0.94;
      } else if (p.type === 'ring') {
        p.radius += (p.maxRadius - p.radius) * 0.15;
      }

      p.life -= p.decay;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const t = this.floatingTexts[i];
      t.y += t.vy;
      t.life -= 0.02;
      if (t.scale < 1.0) {
        t.scale += 0.1;
      }
      if (t.life <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    ctx.save();

    for (const p of this.particles) {
      ctx.globalAlpha = Math.max(0, p.life);

      if (p.type === 'confetti') {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        const w = p.width * Math.cos(p.tilt);
        ctx.fillStyle = p.color;
        ctx.fillRect(-w / 2, -p.height / 2, Math.abs(w), p.height);
        ctx.restore();
      } else if (p.type === 'star') {
        this.drawStar(ctx, p.x, p.y, 5, p.size, p.size / 2, p.color);
      } else if (p.type === 'ring') {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 4 * p.life;
        ctx.stroke();
      }
    }

    for (const t of this.floatingTexts) {
      ctx.globalAlpha = Math.max(0, t.life);
      ctx.save();
      ctx.translate(t.x, t.y);
      ctx.scale(t.scale, t.scale);

      ctx.font = '900 28px "Fredoka", -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 7;
      ctx.lineJoin = 'round';
      ctx.strokeText(t.text.toUpperCase(), 0, 0);

      ctx.fillStyle = t.color;
      ctx.fillText(t.text.toUpperCase(), 0, 0);

      ctx.restore();
    }

    ctx.restore();
  }

  drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius, color) {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }
}
