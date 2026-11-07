// Cartoon Realistic Dinosaur Canvas Renderer
// Renders an expressive, animated, 3D-shaded baby Dino (Rexy)

export class DinoRenderer {
  constructor(canvasWidth, canvasHeight) {
    this.width = canvasWidth;
    this.height = canvasHeight;

    // Dinosaur animation states
    this.state = 'idle'; // 'idle', 'mouthOpen', 'chewing', 'happy'
    this.chewTimer = 0;
    this.happyTimer = 0;
    this.mouthOpenAmount = 0; // 0 = closed/smiling, 1 = wide open

    // Procedural animations
    this.time = 0;
    this.blinkTimer = 0;
    this.isBlinking = false;
    this.tailAngle = 0;
    this.bodyYOffset = 0;
    this.blushAlpha = 0;

    // Heart particles when Dino is happy
    this.hearts = [];
  }

  resize(w, h) {
    this.width = w;
    this.height = h;
  }

  setMouthOpen(open) {
    this.targetMouthOpen = open ? 1 : 0;
  }

  startChewing() {
    this.state = 'chewing';
    this.chewTimer = 75; // ~1.25s
    this.blushAlpha = 0.8;
  }

  startHappy() {
    this.state = 'happy';
    this.happyTimer = 90; // ~1.5s
    this.blushAlpha = 1.0;
    this.spawnHearts();
  }

  spawnHearts() {
    for (let i = 0; i < 8; i++) {
      this.hearts.push({
        x: this.width * 0.5 + (Math.random() - 0.5) * 80,
        y: this.height * 0.45 + (Math.random() - 0.5) * 40,
        vx: (Math.random() - 0.5) * 3,
        vy: -Math.random() * 3 - 2,
        size: 16 + Math.random() * 14,
        color: Math.random() > 0.5 ? '#FF4081' : '#FF80AB',
        life: 1.0,
        decay: 0.018
      });
    }
  }

  update() {
    this.time += 0.04;

    // Blinking
    this.blinkTimer++;
    if (this.blinkTimer > 160) {
      this.isBlinking = true;
      if (this.blinkTimer > 172) {
        this.isBlinking = false;
        this.blinkTimer = 0;
      }
    }

    // Breathing / Gentle idle bounce
    if (this.state === 'happy') {
      this.happyTimer--;
      this.bodyYOffset = Math.sin(this.time * 8) * 14;
      if (this.happyTimer <= 0) {
        this.state = 'idle';
      }
    } else if (this.state === 'chewing') {
      this.chewTimer--;
      // Rapid munching jaw oscillation
      this.mouthOpenAmount = 0.3 + Math.abs(Math.sin(this.time * 12)) * 0.5;
      this.bodyYOffset = Math.sin(this.time * 6) * 4;
      if (this.chewTimer <= 0) {
        this.startHappy();
      }
    } else {
      this.bodyYOffset = Math.sin(this.time * 2) * 5;
      // Smooth mouth open interpolation
      const target = this.targetMouthOpen || 0;
      this.mouthOpenAmount += (target - this.mouthOpenAmount) * 0.15;
    }

    // Tail wag
    this.tailAngle = Math.sin(this.time * 2.5) * 0.15;

    // Fade blush slowly
    if (this.blushAlpha > 0.2) {
      this.blushAlpha -= 0.005;
    }

    // Update hearts
    for (let i = this.hearts.length - 1; i >= 0; i--) {
      const h = this.hearts[i];
      h.x += h.vx;
      h.y += h.vy;
      h.life -= h.decay;
      if (h.life <= 0) {
        this.hearts.splice(i, 1);
      }
    }
  }

  // Returns mouth position in canvas coordinates for food targeting
  getMouthCoords() {
    const scale = Math.min(this.width, this.height) / 700;
    const cx = this.width * 0.5;
    const cy = this.height * 0.44 + this.bodyYOffset;
    return {
      x: cx + 55 * scale,
      y: cy - 25 * scale,
      radius: 65 * scale
    };
  }

  draw(ctx) {
    ctx.save();

    const scale = Math.min(this.width, this.height) / 720;
    const cx = this.width * 0.5;
    const cy = this.height * 0.48 + this.bodyYOffset;

    // Draw Pre-historic Jungle backdrop elements
    this.drawBackgroundScenery(ctx);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);

    // 1. Soft Shadow on ground
    ctx.beginPath();
    ctx.ellipse(0, 185 - this.bodyYOffset * 0.5, 170, 36, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 40, 10, 0.18)';
    ctx.fill();

    // 2. Wagging Tail behind body
    this.drawTail(ctx);

    // 3. Orange Dorsal Plates / Spines
    this.drawSpines(ctx);

    // 4. Chunky Legs & Feet
    this.drawLegs(ctx);

    // 5. Plump Dino Body with Cream Belly
    this.drawBody(ctx);

    // 6. Dino Head & Expressive Face
    this.drawHead(ctx);

    // 7. Cute Front Claws / Arms
    this.drawArms(ctx);

    ctx.restore();

    // 8. Floating hearts when happy
    this.drawHearts(ctx);

    ctx.restore();
  }

  drawBackgroundScenery(ctx) {
    // Warm prehistoric sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, this.height);
    sky.addColorStop(0, '#FFE599'); // Sunlit golden sky
    sky.addColorStop(0.45, '#FFF2CC');
    sky.addColorStop(0.85, '#D9EAD3'); // Lush prehistoric valley
    sky.addColorStop(1, '#B6D7A8');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, this.width, this.height);

    // Prehistoric jungle leaves / giant palms peeking from top corners
    ctx.save();
    // Top-left giant leaf
    ctx.fillStyle = '#6AA84F';
    ctx.beginPath();
    ctx.ellipse(0, 0, 180, 70, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#8FCE00';
    ctx.beginPath();
    ctx.ellipse(0, 0, 150, 50, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    // Top-right giant leaf
    ctx.fillStyle = '#6AA84F';
    ctx.beginPath();
    ctx.ellipse(this.width, 0, 180, 70, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#8FCE00';
    ctx.beginPath();
    ctx.ellipse(this.width, 0, 150, 50, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    // Rolling prehistoric hills
    ctx.fillStyle = '#78AB46';
    ctx.beginPath();
    ctx.arc(this.width * 0.25, this.height + 60, this.width * 0.45, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#5A8A33';
    ctx.beginPath();
    ctx.arc(this.width * 0.78, this.height + 90, this.width * 0.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  drawTail(ctx) {
    ctx.save();
    ctx.translate(-95, 80);
    ctx.rotate(this.tailAngle - 0.2);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-110, -10, -170, -45);
    ctx.quadraticCurveTo(-150, 45, 0, 55);
    ctx.closePath();

    const tailGrad = ctx.createLinearGradient(-170, 0, 0, 0);
    tailGrad.addColorStop(0, '#7CB342');
    tailGrad.addColorStop(1, '#558B2F');
    ctx.fillStyle = tailGrad;
    ctx.fill();

    // Tail tip dorsal spine
    ctx.beginPath();
    ctx.moveTo(-165, -42);
    ctx.lineTo(-185, -60);
    ctx.lineTo(-145, -35);
    ctx.closePath();
    ctx.fillStyle = '#FF9800';
    ctx.fill();

    ctx.restore();
  }

  drawSpines(ctx) {
    ctx.save();
    const spineCoords = [
      { x: -55, y: -90, size: 26, rot: -0.4 },
      { x: -85, y: -40, size: 30, rot: -0.7 },
      { x: -105, y: 20, size: 28, rot: -1.0 },
      { x: -100, y: 75, size: 24, rot: -1.3 }
    ];

    for (const sp of spineCoords) {
      ctx.save();
      ctx.translate(sp.x, sp.y);
      ctx.rotate(sp.rot);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(sp.size * 0.6, -sp.size * 1.1, sp.size, 0);
      ctx.closePath();

      const grad = ctx.createLinearGradient(0, -sp.size, 0, 0);
      grad.addColorStop(0, '#FFB74D');
      grad.addColorStop(1, '#F57C00');
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }

  drawLegs(ctx) {
    ctx.save();
    // Left back foot
    this.drawSingleFoot(ctx, -65, 140, 42, 60);
    // Right front foot
    this.drawSingleFoot(ctx, 45, 145, 45, 62);
    ctx.restore();
  }

  drawSingleFoot(ctx, x, y, w, h) {
    ctx.save();
    ctx.translate(x, y);

    // Chunky foot
    ctx.beginPath();
    ctx.ellipse(0, 0, w, h, 0, 0, Math.PI * 2);
    const grad = ctx.createLinearGradient(0, -h, 0, h);
    grad.addColorStop(0, '#689F38');
    grad.addColorStop(1, '#436B1B');
    ctx.fillStyle = grad;
    ctx.fill();

    // 3 Cute Rounded Claws
    const clawY = h * 0.75;
    for (const cx of [-w * 0.5, 0, w * 0.5]) {
      ctx.beginPath();
      ctx.arc(cx, clawY, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#FFF9C4';
      ctx.fill();
      ctx.strokeStyle = '#D7CCC8';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    ctx.restore();
  }

  drawBody(ctx) {
    ctx.save();

    // Main Torso (Plump, pear-shaped baby dino body)
    ctx.beginPath();
    ctx.ellipse(-10, 50, 115, 110, -0.05, 0, Math.PI * 2);

    const bodyGrad = ctx.createRadialGradient(-35, 15, 15, 0, 50, 120);
    bodyGrad.addColorStop(0, '#9CCC65');
    bodyGrad.addColorStop(0.5, '#7CB342');
    bodyGrad.addColorStop(1, '#558B2F');
    ctx.fillStyle = bodyGrad;
    ctx.fill();

    // Cream Belly with segmented stripes
    ctx.beginPath();
    ctx.ellipse(30, 65, 65, 80, 0.25, 0, Math.PI * 2);
    const bellyGrad = ctx.createLinearGradient(0, -20, 60, 130);
    bellyGrad.addColorStop(0, '#FFF9C4');
    bellyGrad.addColorStop(1, '#FFF176');
    ctx.fillStyle = bellyGrad;
    ctx.fill();

    // Belly soft contour stripes
    ctx.strokeStyle = 'rgba(230, 200, 90, 0.45)';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    for (const sy of [40, 70, 100]) {
      ctx.beginPath();
      ctx.arc(32, sy, 35, -0.4 * Math.PI, 0.4 * Math.PI);
      ctx.stroke();
    }

    ctx.restore();
  }

  drawHead(ctx) {
    ctx.save();
    // Head pivot
    ctx.translate(15, -60);

    // 1. Head Cranium (Big, cute rounded skull)
    ctx.beginPath();
    ctx.ellipse(-15, -45, 95, 80, -0.08, 0, Math.PI * 2);
    const headGrad = ctx.createRadialGradient(-35, -70, 20, -15, -45, 95);
    headGrad.addColorStop(0, '#AED581');
    headGrad.addColorStop(0.5, '#8BC34A');
    headGrad.addColorStop(1, '#558B2F');
    ctx.fillStyle = headGrad;
    ctx.fill();

    // 2. Cute Green Snout / Nose
    ctx.beginPath();
    ctx.ellipse(45, -28, 62, 42, 0.08, 0, Math.PI * 2);
    ctx.fillStyle = '#8BC34A';
    ctx.fill();

    // Snout Nostril
    ctx.beginPath();
    ctx.arc(82, -42, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#33691E';
    ctx.fill();

    // 3. Interactive Mouth & Teeth
    this.drawMouth(ctx);

    // 4. Large 3D Cartoon Eye
    this.drawEye(ctx);

    // 5. Blushing Cheeks
    ctx.fillStyle = `rgba(255, 64, 129, ${this.blushAlpha})`;
    ctx.beginPath();
    ctx.ellipse(5, -12, 18, 12, 0.1, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  drawMouth(ctx) {
    ctx.save();
    const open = this.mouthOpenAmount;

    if (open > 0.05) {
      // Mouth is OPEN (eating or anticipating food)
      ctx.beginPath();
      ctx.moveTo(15, -10);
      // Lower jaw drops down according to open amount
      const jawDrop = open * 48;
      ctx.quadraticCurveTo(55, -8 + jawDrop * 0.4, 90, -15 + jawDrop);
      ctx.quadraticCurveTo(45, 20 + jawDrop, 15, -10);
      ctx.closePath();

      // Deep pink mouth cavity
      ctx.fillStyle = '#880E4F';
      ctx.fill();

      // Cute Pink Tongue
      ctx.beginPath();
      ctx.ellipse(48, 5 + jawDrop * 0.5, 24, 14 * open, 0.1, 0, Math.PI * 2);
      ctx.fillStyle = '#FF4081';
      ctx.fill();

      // Top White Baby Teeth
      for (let tx = 38; tx <= 78; tx += 18) {
        ctx.beginPath();
        ctx.arc(tx, -14, 5.5, 0, Math.PI);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
      }
    } else {
      // Mouth is CLOSED / Cheerful big friendly smile
      ctx.beginPath();
      ctx.arc(42, -28, 48, 0.18 * Math.PI, 0.52 * Math.PI, false);
      ctx.strokeStyle = '#2E7D32';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Cute smile corner dimple
      ctx.beginPath();
      ctx.arc(82, -7, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#2E7D32';
      ctx.fill();
    }

    ctx.restore();
  }

  drawEye(ctx) {
    ctx.save();
    const eyeX = -5;
    const eyeY = -72;
    const eyeRadius = 34;

    if (this.isBlinking || (this.state === 'chewing' && Math.sin(this.time * 12) > 0.2)) {
      // Happy closed curved eye ("^")
      ctx.beginPath();
      ctx.arc(eyeX, eyeY + 5, 24, 1.15 * Math.PI, 1.85 * Math.PI);
      ctx.strokeStyle = '#1B5E20';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Eyelashes
      ctx.beginPath();
      ctx.moveTo(eyeX + 18, eyeY - 2);
      ctx.lineTo(eyeX + 26, eyeY - 12);
      ctx.stroke();
    } else {
      // Big open expressive Disney/Pixar style eye
      // Eye White (Sclera)
      ctx.beginPath();
      ctx.arc(eyeX, eyeY, eyeRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(0,0,0,0.15)';
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Golden Amber Iris
      ctx.beginPath();
      ctx.arc(eyeX + 6, eyeY + 2, eyeRadius * 0.65, 0, Math.PI * 2);
      const irisGrad = ctx.createRadialGradient(eyeX + 4, eyeY, 3, eyeX + 6, eyeY + 2, eyeRadius * 0.65);
      irisGrad.addColorStop(0, '#FFD54F');
      irisGrad.addColorStop(0.7, '#FFA000');
      irisGrad.addColorStop(1, '#E65100');
      ctx.fillStyle = irisGrad;
      ctx.fill();

      // Large Pupil
      ctx.beginPath();
      ctx.arc(eyeX + 8, eyeY + 2, eyeRadius * 0.38, 0, Math.PI * 2);
      ctx.fillStyle = '#212121';
      ctx.fill();

      // Specular Catchlights (double sparkles for lifelike cartoon cuteness)
      ctx.beginPath();
      ctx.arc(eyeX + 3, eyeY - 7, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(eyeX + 13, eyeY + 7, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();

      // Upper Eyelid curve
      ctx.beginPath();
      ctx.arc(eyeX, eyeY, eyeRadius + 1, 1.1 * Math.PI, 1.9 * Math.PI);
      ctx.strokeStyle = '#558B2F';
      ctx.lineWidth = 5;
      ctx.stroke();
    }

    ctx.restore();
  }

  drawArms(ctx) {
    ctx.save();
    // Little front arms
    if (this.state === 'happy') {
      // Clapping / Raised excitedly
      ctx.translate(35, 15);
      ctx.rotate(-0.5 + Math.sin(this.time * 12) * 0.3);
    } else {
      // Gently resting on tummy
      ctx.translate(30, 25);
      ctx.rotate(0.2);
    }

    ctx.beginPath();
    ctx.ellipse(0, 0, 32, 16, -0.2, 0, Math.PI * 2);
    ctx.fillStyle = '#7CB342';
    ctx.fill();

    // 2 Little Claws
    for (const cy of [-6, 6]) {
      ctx.beginPath();
      ctx.arc(28, cy, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#FFF9C4';
      ctx.fill();
    }

    ctx.restore();
  }

  drawHearts(ctx) {
    for (const h of this.hearts) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, h.life);
      ctx.translate(h.x, h.y);

      const s = h.size * 0.05;
      ctx.beginPath();
      ctx.moveTo(0, s * 15);
      ctx.bezierCurveTo(s * 25, -s * 10, s * 45, s * 10, 0, s * 45);
      ctx.bezierCurveTo(-s * 45, s * 10, -s * 25, -s * 10, 0, s * 15);
      ctx.closePath();
      ctx.fillStyle = h.color;
      ctx.fill();

      ctx.restore();
    }
  }
}
