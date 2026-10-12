// Web Audio API procedural sound manager with zero external asset dependencies
export type SoundEffect =
  | 'click'
  | 'hover'
  | 'correct'
  | 'incorrect'
  | 'xp'
  | 'levelUp'
  | 'chest'
  | 'missionComplete'
  | 'portal'
  | 'worldUnlock';

class SoundManager {
  private ctx: AudioContext | null = null;
  private sfxEnabled = true;
  private musicEnabled = true;

  constructor() {
    if (typeof window !== 'undefined') {
      const storedSfx = localStorage.getItem('bilimverse_sfx');
      const storedMusic = localStorage.getItem('bilimverse_music');
      if (storedSfx !== null) this.sfxEnabled = storedSfx === 'true';
      if (storedMusic !== null) this.musicEnabled = storedMusic === 'true';
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setSfx(enabled: boolean) {
    this.sfxEnabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('bilimverse_sfx', String(enabled));
    }
  }

  public setMusic(enabled: boolean) {
    this.musicEnabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('bilimverse_music', String(enabled));
    }
  }

  public getSettings() {
    return { sfx: this.sfxEnabled, music: this.musicEnabled };
  }

  public play(effect: SoundEffect) {
    if (!this.sfxEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      switch (effect) {
        case 'click':
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
          osc.start(now);
          osc.stop(now + 0.05);
          break;

        case 'hover':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(587, now);
          gain.gain.setValueAtTime(0.03, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
          osc.start(now);
          osc.stop(now + 0.04);
          break;

        case 'correct':
          // Arpeggio chord (C5 - E5 - G5 - C6)
          [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
            const chordOsc = this.ctx!.createOscillator();
            const chordGain = this.ctx!.createGain();
            chordOsc.type = 'sine';
            chordOsc.frequency.setValueAtTime(freq, now + idx * 0.08);
            chordGain.gain.setValueAtTime(0.15, now + idx * 0.08);
            chordGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.28);
            chordOsc.connect(chordGain);
            chordGain.connect(this.ctx!.destination);
            chordOsc.start(now + idx * 0.08);
            chordOsc.stop(now + idx * 0.08 + 0.3);
          });
          break;

        case 'incorrect':
          // Gentle wobble
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(220, now);
          osc.frequency.linearRampToValueAtTime(180, now + 0.18);
          gain.gain.setValueAtTime(0.09, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
          osc.start(now);
          osc.stop(now + 0.22);
          break;

        case 'xp':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(659, now);
          osc.frequency.exponentialRampToValueAtTime(1318, now + 0.12);
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
          osc.start(now);
          osc.stop(now + 0.15);
          break;

        case 'levelUp':
        case 'missionComplete':
        case 'chest':
          // Victory fanfare
          const notes = [440, 554.37, 659.25, 880, 1108.73];
          notes.forEach((freq, i) => {
            const fanOsc = this.ctx!.createOscillator();
            const fanGain = this.ctx!.createGain();
            fanOsc.type = 'triangle';
            fanOsc.frequency.setValueAtTime(freq, now + i * 0.12);
            fanGain.gain.setValueAtTime(0.18, now + i * 0.12);
            fanGain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.45);
            fanOsc.connect(fanGain);
            fanGain.connect(this.ctx!.destination);
            fanOsc.start(now + i * 0.12);
            fanOsc.stop(now + i * 0.12 + 0.5);
          });
          break;

        case 'portal':
        case 'worldUnlock':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(300, now);
          osc.frequency.exponentialRampToValueAtTime(1200, now + 0.6);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
          osc.start(now);
          osc.stop(now + 0.7);
          break;
      }
    } catch {
      // Ignore audio context errors silently
    }
  }
}

export const sounds = new SoundManager();
