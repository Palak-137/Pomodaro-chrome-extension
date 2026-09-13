class AudioService {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Plays a pleasant harmonic chime when a timer session finishes.
   */
  playChime(volume = 0.7) {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const safeVolume = Math.max(0, Math.min(1, volume));

      // Pleasant chord progression: C5, E5, G5, C6
      const frequencies = [523.25, 659.25, 783.99, 1046.50];

      frequencies.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.08);

        // Attack & exponential decay
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(safeVolume * 0.25, now + index * 0.08 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.08 + 1.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + index * 0.08);
        osc.stop(now + index * 0.08 + 1.9);
      });
    } catch {
      // Audio context might fail if blocked by browser policy prior to user interaction
    }
  }

  /**
   * Plays a subtle click sound for button interactions.
   */
  playClick(volume = 0.2) {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const safeVolume = Math.max(0, Math.min(1, volume));

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);

      gain.gain.setValueAtTime(safeVolume * 0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Audio context might fail if blocked by browser policy
    }
  }
}

export const audioService = new AudioService();

