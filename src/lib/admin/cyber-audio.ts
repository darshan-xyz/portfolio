/**
 * ARCHON CYBER-ACOUSTIC ENGINE
 *
 * Procedural Web Audio API synthesizer for real-time tactical auditory telemetry.
 * 100% native browser synthesis using Oscillators, BiquadFilters, StereoPanner, and Gain nodes.
 * ZERO external audio files or MP3 dependencies.
 */

class CyberAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true; // Default muted to strictly comply with browser autoplay policies
  private masterGain: GainNode | null = null;
  private heartbeatInterval: number | null = null;

  constructor() {
    // Lazy initialize on first interaction or un-mute
  }

  private initContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.35, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    this.initContext();
    if (this.ctx && this.masterGain) {
      const targetGain = this.isMuted ? 0 : 0.35;
      this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.05);
    }
    if (!this.isMuted) {
      this.playTacticalClick(800, 0.04);
    }
    return !this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Spatial Stereo Sonar Chirp for inbound telemetry packets
   * Longitude maps to stereo panning:
   * -180 (Americas/Pacific) -> Pan Left (-1.0)
   * 0 (Europe/Africa) -> Center (0.0)
   * +180 (Asia/Pacific) -> Pan Right (+1.0)
   */
  public playPacketChirp(longitude: number = 0) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Normalize longitude (-180 to 180) to -1.0 to 1.0 stereo pan
      const panVal = Math.max(-1, Math.min(1, longitude / 180));
      let outputNode: AudioNode = gain;

      if ("createStereoPanner" in this.ctx) {
        const panner = this.ctx.createStereoPanner();
        panner.pan.setValueAtTime(panVal, t);
        gain.connect(panner);
        outputNode = panner;
      }

      // High-tech frequency sweep from 1200Hz to 2800Hz
      osc.type = "sine";
      osc.frequency.setValueAtTime(1400, t);
      osc.frequency.exponentialRampToValueAtTime(2600, t + 0.06);
      osc.frequency.exponentialRampToValueAtTime(800, t + 0.12);

      // Lowpass filter for warm cybernetic tone
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(3200, t);

      // Fast envelope (120ms ping)
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.4, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);

      osc.connect(filter);
      filter.connect(gain);
      outputNode.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.13);
    } catch {
      // AudioContext protection
    }
  }

  /**
   * Sub-Bass Active Visitor Heartbeat
   * Modulates pulse interval depending on active visitors count:
   * 0 visitors = Silent
   * 1-3 visitors = Slow 60bpm (1000ms)
   * 4-10 visitors = Elevated 90bpm (660ms)
   * >10 visitors = High alert 120bpm (500ms)
   */
  public updateHeartbeat(activeVisitors: number) {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    if (activeVisitors <= 0 || this.isMuted) return;

    let intervalMs = 1200;
    if (activeVisitors >= 10) intervalMs = 500;
    else if (activeVisitors >= 4) intervalMs = 750;

    this.heartbeatInterval = window.setInterval(() => {
      this.playHeartbeatThud();
    }, intervalMs);
  }

  private playHeartbeatThud() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Deep 55Hz sub-bass dropping to 30Hz
      osc.type = "triangle";
      osc.frequency.setValueAtTime(65, t);
      osc.frequency.exponentialRampToValueAtTime(32, t + 0.22);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.5, t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.26);
    } catch {
      // Ignore
    }
  }

  /**
   * Sub-millisecond mechanical relay click for UI & Keystrokes
   */
  public playTacticalClick(freq = 1200, duration = 0.03) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.4, t + duration);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + duration + 0.01);
    } catch {
      // Ignore
    }
  }

  /**
   * Warning Siren / Quarantined Threat Alert
   */
  public playSecurityAlert() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(880, t);
      osc.frequency.linearRampToValueAtTime(440, t + 0.15);
      osc.frequency.linearRampToValueAtTime(880, t + 0.3);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.32);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.33);
    } catch {
      // Ignore
    }
  }
}

export const cyberAudio = new CyberAudioEngine();
