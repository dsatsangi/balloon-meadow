# 🎈 Pop & Match Balloon Meadow

A modern web-based toddler learning game built with **React** and **Vite** for fun, color recognition, and hand-eye coordination.

> **Credits:** Developed with ❤️ by **Dhruv & Dhriti**

---

## 🌟 Key Features for Toddlers (Ages 1.5 - 3.5)

1. **Zero-Fail State:**
   - No "Game Over", no penalty timers, and no buzzers.
   - Popping *any* balloon brings joy, sounds a melodic pentatonic chime, shoots confetti, and announces the color name.
2. **Two Game Modes:**
   - 🎈 **Free Pop Mode:** Pure sensory cause-and-effect. Balloons float gently upward; toddlers can tap anywhere to pop balloons and hear musical notes.
   - 🎯 **Color Quest Mode:** A cheerful audio prompt asks to find a specific color (e.g., *"Can you find the Yellow balloon?"*). The target balloon has a gentle glowing halo. Tapping the target plays a celebration fanfare!
3. **Designed for Little Hands:**
   - **Multi-Touch Support:** Toddlers often touch screens with their whole palm or multiple fingers. All touch points register simultaneously.
   - **Oversized Hitboxes:** Balloons and swinging strings feature generous touch detection (+28px margin) so taps never miss.
   - **Keyboard Bash Support:** Pressing any key on a laptop or desktop pops balloons—great for toddlers mimicking parents on a keyboard!
4. **Rich Visuals & Variety:**
   - 4 cute balloon shapes: Classic Oval, Bear Ears 🐻, Sweet Heart 💖, and Star ⭐.
   - Kawaii smiling faces, glossy shine highlights, and swaying strings.
   - Interactive background: Tap the smiling sun ☀️ to make it spin and boing!
5. **100% Offline-Ready & Asset-Free:**
   - **Web Audio API:** Synthesizes balloon pops, pentatonic xylophone chimes, and celebration fanfares dynamically.
   - **Web Speech API:** Announces color names and positive encouragement in real-time.
   - **Canvas Particle Physics:** Generates multi-color confetti ribbons, shockwave rings, and golden sparkle stars.

---

## 🚀 How to Run the App

### Start Development Server
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser.

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

---

## 🛠️ Tech Stack & Architecture

- **React 19** + **Vite**
- **Lucide React** (icons)
- **Web Audio API** (sound synthesis)
- **Web Speech API** (speech synthesis)
- **HTML5 Canvas** (high-performance 60 FPS animation & physics)
- **Credits:** Dedicated credits badge on screen and within parent settings modal by **Dhruv & Dhriti**.
