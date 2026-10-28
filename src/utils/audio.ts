/**
 * Web Audio API Chiptune Sound Synthesizer for Super Mario Pancasila
 * Synthesizes classic 8-bit sound effects & cheerful background melody
 */

let audioCtx: AudioContext | null = null;
let isMuted: boolean = false;
let bgmInterval: number | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const soundManager = {
  isMuted: () => isMuted,

  toggleMute: () => {
    isMuted = !isMuted;
    if (isMuted && bgmInterval) {
      clearInterval(bgmInterval);
      bgmInterval = null;
    }
    return isMuted;
  },

  setMute: (muted: boolean) => {
    isMuted = muted;
    if (isMuted && bgmInterval) {
      clearInterval(bgmInterval);
      bgmInterval = null;
    }
  },

  playJump: () => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.12);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // Audio context error ignore
    }
  },

  playCoin: () => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      // Classic Mario Coin sound: B5 (987.77 Hz) to E6 (1318.51 Hz)
      osc.frequency.setValueAtTime(987.77, now);
      osc.frequency.setValueAtTime(1318.51, now + 0.08);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.setValueAtTime(0.2, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.42);
    } catch {
      // Audio context error ignore
    }
  },

  playBump: () => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.linearRampToValueAtTime(60, now + 0.08);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // Audio context error ignore
    }
  },

  playPowerup: () => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [330, 392, 659, 523, 587, 784];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const noteStart = now + idx * 0.06;

        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, noteStart);
        gain.gain.setValueAtTime(0.12, noteStart);
        gain.gain.linearRampToValueAtTime(0.01, noteStart + 0.06);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 0.07);
      });
    } catch {
      // Audio context error ignore
    }
  },

  playCorrect: () => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Bright triumphant arpeggio C5 - E5 - G5 - C6
      const freqs = [523.25, 659.25, 783.99, 1046.5];
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + i * 0.08;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, start);

        gain.gain.setValueAtTime(0.2, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + (i === 3 ? 0.35 : 0.12));

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + (i === 3 ? 0.4 : 0.15));
      });
    } catch {
      // Audio context error ignore
    }
  },

  playWrong: () => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.18);
      osc.frequency.setValueAtTime(110, now + 0.2);
      osc.frequency.linearRampToValueAtTime(70, now + 0.45);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.48);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch {
      // Audio context error ignore
    }
  },

  playFlagpole: () => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.linearRampToValueAtTime(200, now + 0.8);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.85);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.9);
    } catch {
      // Audio context error ignore
    }
  },

  playVictory: () => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // High-energy 8-bit Stage Clear Fanfare
      const notes = [
        { f: 523.25, d: 0.12 }, // C
        { f: 659.25, d: 0.12 }, // E
        { f: 783.99, d: 0.12 }, // G
        { f: 1046.5, d: 0.2 },  // High C
        { f: 987.77, d: 0.12 }, // B
        { f: 783.99, d: 0.12 }, // G
        { f: 1046.5, d: 0.45 }, // High C sustain
      ];

      let elapsed = 0;
      notes.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + elapsed;

        osc.type = 'square';
        osc.frequency.setValueAtTime(n.f, start);

        gain.gain.setValueAtTime(0.2, start);
        gain.gain.linearRampToValueAtTime(0.01, start + n.d);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + n.d + 0.05);

        elapsed += n.d + 0.02;
      });
    } catch {
      // Audio context error ignore
    }
  },

  startBgm: () => {
    if (bgmInterval || isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    // Mario-inspired overworld upbeat motif
    const melody = [
      659.25, 659.25, 0, 659.25, 0, 523.25, 659.25, 0, 783.99, 0, 0, 0, 392.00, 0, 0, 0,
      523.25, 0, 0, 392.00, 0, 0, 329.63, 0, 0, 440.00, 0, 493.88, 0, 466.16, 440.00, 0
    ];
    let noteIdx = 0;

    bgmInterval = window.setInterval(() => {
      if (isMuted || !ctx) return;
      const freq = melody[noteIdx];
      noteIdx = (noteIdx + 1) % melody.length;

      if (freq > 0) {
        try {
          const now = ctx.currentTime;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(0.05, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.13);
        } catch {
          // ignore
        }
      }
    }, 160);
  },

  stopBgm: () => {
    if (bgmInterval) {
      clearInterval(bgmInterval);
      bgmInterval = null;
    }
  }
};
