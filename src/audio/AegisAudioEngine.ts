// Procedural Web Audio API Sound Engine for AEGIS
// Creates cinematic orchestral/synth themes, drone beds, heartbeats, and sound FX in real-time

class AegisAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private activeThemeNodes: { stop: () => void } | null = null;
  private currentChapterId: number = -1;
  private isInitialized: boolean = false;

  public init() {
    if (this.isInitialized) return;
    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.6, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      this.isInitialized = true;
    } catch (e) {
      console.warn("Web Audio API not supported or blocked:", e);
    }
  }

  public ensureContext() {
    if (!this.ctx) {
      this.init();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.7, this.ctx.currentTime, 0.05);
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Fade out existing theme and smoothly crossfade to new chapter music
  public playChapterTheme(chapterId: number) {
    if (this.currentChapterId === chapterId) return;
    this.currentChapterId = chapterId;
    this.ensureContext();
    if (!this.ctx || !this.musicGain) return;

    if (this.activeThemeNodes) {
      this.activeThemeNodes.stop();
      this.activeThemeNodes = null;
    }

    const t = this.ctx.currentTime;
    // Crossfade down briefly
    this.musicGain.gain.setTargetAtTime(0.1, t, 0.2);

    setTimeout(() => {
      if (!this.ctx || !this.musicGain) return;
      this.musicGain.gain.setTargetAtTime(0.5, this.ctx.currentTime, 0.4);

      switch (chapterId) {
        case 0:
          this.activeThemeNodes = this.createDarkAmbientTheme();
          break;
        case 1:
          this.activeThemeNodes = this.createHumanPianoTheme();
          break;
        case 2:
          this.activeThemeNodes = this.createDisciplineRhythmTheme();
          break;
        case 3:
          this.activeThemeNodes = this.createCoreMysticDroneTheme();
          break;
        case 4:
          this.activeThemeNodes = this.createAwakeningSurgeTheme();
          break;
        case 5:
          this.activeThemeNodes = this.createHeroicTransformationTheme();
          break;
        case 6:
          this.activeThemeNodes = this.createPowersActionTheme();
          break;
        case 7:
          this.activeThemeNodes = this.createControlTensionTheme();
          break;
        case 8:
          this.activeThemeNodes = this.createFirstRequestTheme();
          break;
        case 9:
          this.activeThemeNodes = this.createPeopleHopeTheme();
          break;
        case 10:
          this.activeThemeNodes = this.createGuardianTheme();
          break;
        case 99: // Climax / Confession
          this.activeThemeNodes = this.createConfessionAtmosphere();
          break;
        default:
          this.activeThemeNodes = this.createDarkAmbientTheme();
      }
    }, 250);
  }

  // --- CHAPTER THEMES GENERATION ---

  // Chapter 0: Dark ambient drone with low harmonics
  private createDarkAmbientTheme() {
    if (!this.ctx || !this.musicGain) return { stop: () => {} };
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const subGain = this.ctx.createGain();

    osc1.type = "sawtooth";
    osc1.frequency.setValueAtTime(48, this.ctx.currentTime); // Low G
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(96, this.ctx.currentTime);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(140, this.ctx.currentTime);

    subGain.gain.setValueAtTime(0.2, this.ctx.currentTime);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(subGain);
    subGain.connect(this.musicGain);

    osc1.start();
    osc2.start();

    return {
      stop: () => {
        try {
          subGain.gain.setTargetAtTime(0, this.ctx!.currentTime, 0.3);
          setTimeout(() => {
            osc1.stop();
            osc2.stop();
          }, 350);
        } catch { /* ignore */ }
      }
    };
  }

  // Chapter 1: Emotional minimal piano/pad chords (Fm / Ab / Eb / Db)
  private createHumanPianoTheme() {
    if (!this.ctx || !this.musicGain) return { stop: () => {} };
    const freqs = [174.61, 207.65, 261.63, 311.13]; // F3, Ab3, C4, Eb4
    const oscs: OscillatorNode[] = [];
    const localGain = this.ctx.createGain();
    localGain.gain.setValueAtTime(0.18, this.ctx.currentTime);

    freqs.forEach((f, idx) => {
      const osc = this.ctx!.createOscillator();
      const filter = this.ctx!.createBiquadFilter();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(f, this.ctx!.currentTime);
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(400 + idx * 80, this.ctx!.currentTime);
      osc.connect(filter);
      filter.connect(localGain);
      osc.start();
      oscs.push(osc);
    });

    localGain.connect(this.musicGain);

    return {
      stop: () => {
        localGain.gain.setTargetAtTime(0, this.ctx!.currentTime, 0.3);
        setTimeout(() => oscs.forEach(o => { try { o.stop(); } catch { /* ignore */ } }), 350);
      }
    };
  }

  // Chapter 2: Discipline & Training pulse rhythm
  private createDisciplineRhythmTheme() {
    if (!this.ctx || !this.musicGain) return { stop: () => {} };
    let isRunning = true;
    const interval = setInterval(() => {
      if (!isRunning || !this.ctx) return;
      this.triggerDrumHit(60, 0.3);
      setTimeout(() => {
        if (isRunning) this.triggerDrumHit(90, 0.15);
      }, 350);
    }, 700);

    return {
      stop: () => {
        isRunning = false;
        clearInterval(interval);
      }
    };
  }

  // Chapter 3: Ancient floating core mystical drone
  private createCoreMysticDroneTheme() {
    if (!this.ctx || !this.musicGain) return { stop: () => {} };
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    const localGain = this.ctx.createGain();

    osc1.type = "sawtooth";
    osc1.frequency.setValueAtTime(55, this.ctx.currentTime); // A1
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(110.5, this.ctx.currentTime); // Slight detune A2

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(280, this.ctx.currentTime);
    filter.Q.setValueAtTime(3.5, this.ctx.currentTime);

    lfo.frequency.setValueAtTime(0.4, this.ctx.currentTime);
    lfoGain.gain.setValueAtTime(60, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    localGain.gain.setValueAtTime(0.25, this.ctx.currentTime);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(localGain);
    localGain.connect(this.musicGain);

    osc1.start();
    osc2.start();
    lfo.start();

    return {
      stop: () => {
        localGain.gain.setTargetAtTime(0, this.ctx!.currentTime, 0.3);
        setTimeout(() => {
          try { osc1.stop(); osc2.stop(); lfo.stop(); } catch { /* ignore */ }
        }, 350);
      }
    };
  }

  // Chapter 4: Awakening - Heartbeat + rising plasma energy
  private createAwakeningSurgeTheme() {
    if (!this.ctx || !this.musicGain) return { stop: () => {} };
    let running = true;
    const hb = setInterval(() => {
      if (!running) return;
      this.playHeartbeat();
    }, 900);

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(70, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(320, this.ctx.currentTime + 10);
    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.25, this.ctx.currentTime + 8);

    osc.connect(gain);
    gain.connect(this.musicGain);
    osc.start();

    return {
      stop: () => {
        running = false;
        clearInterval(hb);
        gain.gain.setTargetAtTime(0, this.ctx!.currentTime, 0.2);
        setTimeout(() => { try { osc.stop(); } catch { /* ignore */ } }, 250);
      }
    };
  }

  // Chapter 5: Epic Heroic Transformation Theme
  private createHeroicTransformationTheme() {
    if (!this.ctx || !this.musicGain) return { stop: () => {} };
    const notes = [130.81, 164.81, 196.00, 261.63]; // C3, E3, G3, C4
    const oscs: OscillatorNode[] = [];
    const localGain = this.ctx.createGain();
    localGain.gain.setValueAtTime(0.25, this.ctx.currentTime);

    notes.forEach(f => {
      const osc = this.ctx!.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(f, this.ctx!.currentTime);
      const filter = this.ctx!.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(650, this.ctx!.currentTime);
      osc.connect(filter);
      filter.connect(localGain);
      osc.start();
      oscs.push(osc);
    });

    localGain.connect(this.musicGain);

    return {
      stop: () => {
        localGain.gain.setTargetAtTime(0, this.ctx!.currentTime, 0.3);
        setTimeout(() => oscs.forEach(o => { try { o.stop(); } catch { /* ignore */ } }), 350);
      }
    };
  }

  // Chapter 6: Powers action synth sequence
  private createPowersActionTheme() {
    if (!this.ctx || !this.musicGain) return { stop: () => {} };
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(65, this.ctx.currentTime);
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);
    osc.start();

    return {
      stop: () => {
        gain.gain.setTargetAtTime(0, this.ctx!.currentTime, 0.2);
        setTimeout(() => { try { osc.stop(); } catch { /* ignore */ } }, 250);
      }
    };
  }

  // Chapter 7: Control tension
  private createControlTensionTheme() {
    return this.createDarkAmbientTheme();
  }

  // Chapter 8: First Request
  private createFirstRequestTheme() {
    return this.createHumanPianoTheme();
  }

  // Chapter 9: Hope for people
  private createPeopleHopeTheme() {
    if (!this.ctx || !this.musicGain) return { stop: () => {} };
    const notes = [220, 277.18, 329.63, 440]; // A major
    const oscs: OscillatorNode[] = [];
    const localGain = this.ctx.createGain();
    localGain.gain.setValueAtTime(0.18, this.ctx.currentTime);

    notes.forEach(f => {
      const osc = this.ctx!.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, this.ctx!.currentTime);
      osc.connect(localGain);
      osc.start();
      oscs.push(osc);
    });

    localGain.connect(this.musicGain);
    return {
      stop: () => {
        localGain.gain.setTargetAtTime(0, this.ctx!.currentTime, 0.2);
        setTimeout(() => oscs.forEach(o => { try { o.stop(); } catch { /* ignore */ } }), 250);
      }
    };
  }

  // Chapter 10: The Guardian
  private createGuardianTheme() {
    return this.createHeroicTransformationTheme();
  }

  // Confession Atmosphere
  private createConfessionAtmosphere() {
    if (!this.ctx || !this.musicGain) return { stop: () => {} };
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(50, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    osc.connect(gain);
    gain.connect(this.musicGain);
    osc.start();

    return {
      stop: () => {
        gain.gain.setTargetAtTime(0, this.ctx!.currentTime, 0.2);
        setTimeout(() => { try { osc.stop(); } catch { /* ignore */ } }, 250);
      }
    };
  }

  // --- SOUND EFFECTS ---

  public playHeartbeat() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const t = this.ctx.currentTime;

    osc.type = "sine";
    osc.frequency.setValueAtTime(75, t);
    osc.frequency.exponentialRampToValueAtTime(35, t + 0.18);

    gain.gain.setValueAtTime(0.8, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.18);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.2);

    // Double beat
    setTimeout(() => {
      if (!this.ctx || !this.sfxGain || this.isMuted) return;
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      const t2 = this.ctx.currentTime;
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(65, t2);
      osc2.frequency.exponentialRampToValueAtTime(30, t2 + 0.16);
      gain2.gain.setValueAtTime(0.6, t2);
      gain2.gain.exponentialRampToValueAtTime(0.01, t2 + 0.16);
      osc2.connect(gain2);
      gain2.connect(this.sfxGain);
      osc2.start(t2);
      osc2.stop(t2 + 0.18);
    }, 120);
  }

  public playImpact() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const t = this.ctx.currentTime;

    osc.type = "triangle";
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(25, t + 0.8);

    gain.gain.setValueAtTime(0.9, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.85);
  }

  public playSwordHum() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const t = this.ctx.currentTime;

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.4);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.52);
  }

  public playEnergySurge() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const t = this.ctx.currentTime;

    osc.type = "sine";
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(600, t + 0.5);

    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.55);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.58);
  }

  public playLaserScan() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const t = this.ctx.currentTime;

    osc.type = "sine";
    osc.frequency.setValueAtTime(700, t);
    osc.frequency.exponentialRampToValueAtTime(350, t + 0.3);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.32);
  }

  public playUiClick() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const t = this.ctx.currentTime;

    osc.type = "sine";
    osc.frequency.setValueAtTime(520, t);
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.06);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.07);
  }

  public playRatingChime(stars: number) {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const baseFreq = 440;
    const chord = [baseFreq, baseFreq * 1.25, baseFreq * 1.5, baseFreq * 1.75, baseFreq * 2];
    const freq = chord[Math.min(stars - 1, 4)] || 440;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const t = this.ctx.currentTime;

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.45);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.5);
  }

  private triggerDrumHit(freq: number, volume: number) {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const t = this.ctx.currentTime;
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(20, t + 0.2);
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.22);
  }
}

export const aegisAudio = new AegisAudioEngine();
