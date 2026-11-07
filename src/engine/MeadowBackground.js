// Whimsical interactive meadow background with interactive Sun, clouds, hills, and butterflies
import { soundEngine } from './SoundEngine';

export class MeadowBackground {
  constructor(canvasWidth, canvasHeight) {
    this.width = canvasWidth;
    this.height = canvasHeight;

    this.sun = {
      x: canvasWidth * 0.88,
      y: canvasHeight * 0.16,
      radius: Math.min(canvasWidth, canvasHeight) * 0.09,
      rayAngle: 0,
      spinSpeed: 0.005,
      isSpinningFast: false,
      fastSpinTimer: 0,
      blinkTimer: 0,
      isBlinking: false
    };

    this.clouds = [
      { x: canvasWidth * 0.15, y: canvasHeight * 0.12, scale: 0.85, speed: 0.25 },
      { x: canvasWidth * 0.52, y: canvasHeight * 0.08, scale: 1.1, speed: 0.18 },
      { x: canvasWidth * 0.85, y: canvasHeight * 0.22, scale: 0.7, speed: 0.3 }
    ];

    this.butterflies = [
      {
        x: canvasWidth * 0.2,
        y: canvasHeight * 0.8,
        color: '#FF69B4',
        wingAngle: 0,
        wingSpeed: 0.2,
        vx: 0.6,
        vy: -0.2
      },
      {
        x: canvasWidth * 0.7,
        y: canvasHeight * 0.85,
        color: '#FFD700',
        wingAngle: 0,
        wingSpeed: 0.25,
        vx: -0.5,
        vy: 0.1
      }
    ];

    this.windTime = 0;
  }

  resize(w, h) {
    this.width = w;
    this.height = h;
    this.sun.x = w * 0.88;
    this.sun.y = h * 0.16;
    this.sun.radius = Math.min(w, h) * 0.09;
  }

  update() {
    this.windTime += 0.02;

    this.sun.rayAngle += this.sun.isSpinningFast ? 0.08 : 0.006;
    if (this.sun.isSpinningFast) {
      this.sun.fastSpinTimer--;
      if (this.sun.fastSpinTimer <= 0) {
        this.sun.isSpinningFast = false;
      }
    }

    this.sun.blinkTimer++;
    if (this.sun.blinkTimer > 180) {
      this.sun.isBlinking = true;
      if (this.sun.blinkTimer > 192) {
        this.sun.isBlinking = false;
        this.sun.blinkTimer = 0;
      }
    }

    for (const cloud of this.clouds) {
      cloud.x += cloud.speed;
      if (cloud.x - 150 * cloud.scale > this.width) {
        cloud.x = -150 * cloud.scale;
        cloud.y = this.height * (0.05 + Math.random() * 0.2);
      }
    }

    for (const b of this.butterflies) {
      b.x += b.vx;
      b.y += b.vy + Math.sin(this.windTime * 2) * 0.6;
      b.wingAngle += b.wingSpeed;

      if (b.x < 20 || b.x > this.width - 20) b.vx *= -1;
      if (b.y < this.height * 0.65 || b.y > this.height * 0.95) b.vy *= -1;
    }
  }

  checkSunClick(px, py) {
    const dx = px - this.sun.x;
    const dy = py - this.sun.y;
    if (Math.hypot(dx, dy) <= this.sun.radius * 1.5) {
      this.sun.isSpinningFast = true;
      this.sun.fastSpinTimer = 60;
      soundEngine.playBoing();
      return true;
    }
    return false;
  }

  draw(ctx) {
    // Sky
    const skyGrad = ctx.createLinearGradient(0, 0, 0, this.height);
    skyGrad.addColorStop(0, '#74D4FF');
    skyGrad.addColorStop(0.55, '#BAEEFF');
    skyGrad.addColorStop(1, '#FFF5D6');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, this.width, this.height);

    // Sun
    this.drawSun(ctx);

    // Clouds
    for (const cloud of this.clouds) {
      this.drawCloud(ctx, cloud.x, cloud.y, cloud.scale);
    }

    // Distant Hills
    this.drawHills(
      ctx,
      this.height * 0.66,
      '#99E2B4',
      this.width * 0.35,
      Math.sin(this.windTime * 0.5) * 5
    );

    // Midground Hills
    this.drawHills(
      ctx,
      this.height * 0.74,
      '#56CF86',
      this.width * 0.55,
      Math.sin(this.windTime * 0.8) * 8
    );

    // Foreground Meadow
    this.drawForegroundMeadow(ctx);

    // Butterflies
    for (const b of this.butterflies) {
      this.drawButterfly(ctx, b);
    }
  }

  drawSun(ctx) {
    const { x, y, radius, rayAngle, isBlinking } = this.sun;

    ctx.save();
    ctx.translate(x, y);

    ctx.save();
    ctx.rotate(rayAngle);
    const numRays = 12;
    for (let i = 0; i < numRays; i++) {
      ctx.rotate((Math.PI * 2) / numRays);
      ctx.beginPath();
      ctx.arc(radius * 1.35, 0, radius * 0.22, 0, Math.PI * 2);
      ctx.fillStyle = '#FFE082';
      ctx.fill();
    }
    ctx.restore();

    const sunGrad = ctx.createRadialGradient(0, 0, radius * 0.2, 0, 0, radius);
    sunGrad.addColorStop(0, '#FFF9C4');
    sunGrad.addColorStop(0.6, '#FFEB3B');
    sunGrad.addColorStop(1, '#FBC02D');
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fillStyle = sunGrad;
    ctx.shadowColor = 'rgba(255, 193, 7, 0.5)';
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#4E342E';
    const eyeDist = radius * 0.32;
    const eyeY = -radius * 0.1;

    if (isBlinking) {
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-eyeDist - 5, eyeY);
      ctx.lineTo(-eyeDist + 5, eyeY);
      ctx.moveTo(eyeDist - 5, eyeY);
      ctx.lineTo(eyeDist + 5, eyeY);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(-eyeDist, eyeY, 5, 0, Math.PI * 2);
      ctx.arc(eyeDist, eyeY, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(-eyeDist - 1.5, eyeY - 1.5, 2, 0, Math.PI * 2);
      ctx.arc(eyeDist - 1.5, eyeY - 1.5, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = 'rgba(255, 112, 67, 0.45)';
    ctx.beginPath();
    ctx.arc(-eyeDist - 4, eyeY + 11, 7, 0, Math.PI * 2);
    ctx.arc(eyeDist + 4, eyeY + 11, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, eyeY + 4, radius * 0.35, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.strokeStyle = '#4E342E';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.restore();
  }

  drawCloud(ctx, cx, cy, scale) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(0, 0, 35, 0, Math.PI * 2);
    ctx.arc(35, -10, 42, 0, Math.PI * 2);
    ctx.arc(75, 5, 30, 0, Math.PI * 2);
    ctx.arc(35, 20, 32, 0, Math.PI * 2);
    ctx.arc(-20, 15, 25, 0, Math.PI * 2);
    ctx.closePath();

    ctx.shadowColor = 'rgba(0, 0, 0, 0.05)';
    ctx.shadowOffsetY = 6;
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  drawHills(ctx, baseY, color, wavelength, offset) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, this.height);
    ctx.lineTo(0, baseY);

    for (let x = 0; x <= this.width + 50; x += 30) {
      const y = baseY + Math.sin(x / wavelength + offset) * 35;
      ctx.lineTo(x, y);
    }

    ctx.lineTo(this.width, this.height);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  drawForegroundMeadow(ctx) {
    const baseY = this.height * 0.84;
    ctx.save();

    ctx.fillStyle = '#2EB85C';
    ctx.beginPath();
    ctx.moveTo(0, this.height);
    ctx.lineTo(0, baseY);

    for (let x = 0; x <= this.width + 40; x += 40) {
      const y = baseY + Math.cos(x / 140) * 20;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(this.width, this.height);
    ctx.closePath();
    ctx.fill();

    const flowerCount = Math.floor(this.width / 90);
    const flowerColors = ['#FF69B4', '#FFF', '#FFD700', '#FF85A2', '#85E3FF'];

    for (let i = 0; i < flowerCount; i++) {
      const fx = (i + 0.5) * 90 + Math.sin(i * 3) * 20;
      const fy = baseY + 18 + (i % 3) * 14;
      const color = flowerColors[i % flowerColors.length];

      ctx.beginPath();
      ctx.moveTo(fx, fy);
      ctx.lineTo(fx + Math.sin(this.windTime + i) * 4, fy - 18);
      ctx.strokeStyle = '#207A3D';
      ctx.lineWidth = 3;
      ctx.stroke();

      const flowerHeadX = fx + Math.sin(this.windTime + i) * 4;
      const flowerHeadY = fy - 18;

      ctx.beginPath();
      ctx.arc(flowerHeadX, flowerHeadY, 7, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(flowerHeadX, flowerHeadY, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#FFA000';
      ctx.fill();
    }

    ctx.restore();
  }

  drawButterfly(ctx, b) {
    ctx.save();
    ctx.translate(b.x, b.y);

    const wingSpan = Math.cos(b.wingAngle) * 9;

    ctx.fillStyle = b.color;
    ctx.beginPath();
    ctx.ellipse(-6, -4, Math.abs(wingSpan), 8, -Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(6, -4, Math.abs(wingSpan), 8, Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#333333';
    ctx.beginPath();
    ctx.ellipse(0, 0, 2, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
