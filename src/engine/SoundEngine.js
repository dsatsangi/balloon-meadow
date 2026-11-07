// Audio synthesis engine using Web Audio API
// 100% self-contained: no external audio assets needed!

export class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.unlocked = false;
  }

  init() {
    if (this.unlocked) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        if (this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
        this.unlocked = true;
      }
    } catch (e) {
      console.warn('Web Audio not supported:', e);
    }
  }

  // Realistic balloon pop sound: fast noise impulse + deep resonant drop
  playPop() {
    this.init();
    if (this.isMuted || !this.ctx) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;

    // 1. Noise burst (snap of rubber bursting)
    const bufferSize = ctx.sampleRate * 0.06; // 60ms
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1800, now);
    filter.frequency.exponentialRampToValueAtTime(150, now + 0.06);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.7, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    whiteNoise.start(now);
    whiteNoise.stop(now + 0.07);

    // 2. Body thump (air pressure release)
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(190, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.08);

    oscGain.gain.setValueAtTime(0.6, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  // Musical xylophone / marimba chime in pentatonic scale
  playChime(noteIndex = 0) {
    this.init();
    if (this.isMuted || !this.ctx) return;

    // Pentatonic scale frequencies (C4, D4, E4, G4, A4, C5, D5, E5, G5, A5)
    const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00];
    const freq = scale[Math.abs(noteIndex) % scale.length];

    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    const overtone = ctx.createOscillator();
    const overtoneGain = ctx.createGain();
    overtone.type = 'triangle';
    overtone.frequency.setValueAtTime(freq * 3, now);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    overtoneGain.gain.setValueAtTime(0.12, now);
    overtoneGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    overtone.connect(overtoneGain);
    gain.connect(ctx.destination);
    overtoneGain.connect(ctx.destination);

    osc.start(now);
    overtone.start(now);
    osc.stop(now + 0.65);
    overtone.stop(now + 0.3);
  }

  // Cheerful success fanfare
  playCelebration() {
    this.init();
    if (this.isMuted || !this.ctx) return;

    const chordNotes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    chordNotes.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.28, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.85);
      }, idx * 110);
    });
  }

  // Bouncy spring "boing" when interacting with the sun or clouds
  playBoing() {
    this.init();
    if (this.isMuted || !this.ctx) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.18);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.35);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }
}

export const soundEngine = new SoundEngine();
