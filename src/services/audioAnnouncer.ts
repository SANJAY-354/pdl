class SoundSynthesizer {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Plays a hospital lounge chime: harmonious 3-tone chime (C5 -> E5 -> G5)
   */
  public playHospitalChime(): Promise<void> {
    return new Promise((resolve) => {
      try {
        const ctx = this.getContext();
        if (!ctx) {
          resolve();
          return;
        }

        const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
        const now = ctx.currentTime;

        frequencies.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.18);

          // Soft bell chime envelope
          gain.gain.setValueAtTime(0, now + idx * 0.18);
          gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.18 + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.18 + 0.8);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + idx * 0.18);
          osc.stop(now + idx * 0.18 + 0.85);
        });

        setTimeout(resolve, 800);
      } catch (e) {
        console.warn('Audio chime playback error:', e);
        resolve();
      }
    });
  }

  /**
   * Speaks the announcement text using the browser's Web Speech API SpeechSynthesis
   */
  public speakAnnouncement(text: string): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel(); // Cancel any prior speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95; // Slightly measured, clear clinic PA cadence
      utterance.pitch = 1.05;
      utterance.volume = 1.0;

      // Pick natural English voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Female')));
      if (preferred) {
        utterance.voice = preferred;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
    });
  }

  /**
   * Plays harmonic chime followed immediately by text-to-speech announcement
   */
  public async playFullAnnouncement(text: string): Promise<void> {
    await this.playHospitalChime();
    await this.speakAnnouncement(text);
  }
}

export const soundSynthesizer = new SoundSynthesizer();
