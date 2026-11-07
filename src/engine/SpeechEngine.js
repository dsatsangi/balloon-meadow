// Speech synthesis helper for speaking color names and encouragement

export class SpeechEngine {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voice = null;
    this.isEnabled = true;
    this.initVoice();

    if (this.synth && this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => this.initVoice();
    }
  }

  initVoice() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    const preferred = [
      'Samantha', 'Karen', 'Moira', 'Victoria', 'Tessa', 
      'Google US English', 'Google UK English Female', 
      'en-US', 'en-GB'
    ];

    for (const name of preferred) {
      const match = voices.find(v => v.name.includes(name) || v.lang.startsWith(name));
      if (match) {
        this.voice = match;
        break;
      }
    }
    if (!this.voice && voices.length > 0) {
      this.voice = voices.find(v => v.lang.startsWith('en')) || voices[0];
    }
  }

  speak(text, priority = false) {
    if (!this.isEnabled || !this.synth) return;

    if (this.synth.speaking) {
      this.synth.cancel();
    }

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      if (this.voice) {
        utterance.voice = this.voice;
      }
      utterance.pitch = 1.25;
      utterance.rate = 0.95;
      utterance.volume = 1.0;
      this.synth.speak(utterance);
    } catch (e) {
      console.warn('Speech error:', e);
    }
  }

  speakColor(colorName) {
    this.speak(colorName);
  }

  speakPrompt(colorName) {
    const prompts = [
      `Can you find the ${colorName} balloon?`,
      `Where is ${colorName}?`,
      `Let's pop ${colorName}!`,
      `Pop the ${colorName} balloon!`
    ];
    const phrase = prompts[Math.floor(Math.random() * prompts.length)];
    this.speak(phrase, true);
  }

  speakPraise() {
    const praises = [
      'Yay!',
      'Great job!',
      'Super star!',
      'You did it!',
      'Awesome!',
      'Hooray!'
    ];
    const phrase = praises[Math.floor(Math.random() * praises.length)];
    this.speak(phrase, true);
  }

  toggleSpeech() {
    this.isEnabled = !this.isEnabled;
    if (!this.isEnabled && this.synth) {
      this.synth.cancel();
    }
    return this.isEnabled;
  }
}

export const speechEngine = new SpeechEngine();
