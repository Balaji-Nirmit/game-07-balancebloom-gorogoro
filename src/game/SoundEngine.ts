// Web Audio API sound engine - generates sounds procedurally
class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private muted = false;

  private getCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.3;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }

  private get gain(): GainNode {
    this.getCtx();
    return this.masterGain!;
  }

  setMuted(m: boolean) { this.muted = m; }
  isMuted() { return this.muted; }

  private play(fn: (ctx: AudioContext, dest: GainNode) => void) {
    if (this.muted) return;
    try { fn(this.getCtx(), this.gain); } catch {}
  }

  drop() {
    this.play((ctx, dest) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15);
      g.gain.setValueAtTime(0.4, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.connect(g).connect(dest);
      osc.start(); osc.stop(ctx.currentTime + 0.15);
    });
  }

  place() {
    this.play((ctx, dest) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.08);
      g.gain.setValueAtTime(0.3, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      osc.connect(g).connect(dest);
      osc.start(); osc.stop(ctx.currentTime + 0.12);
    });
  }

  success() {
    this.play((ctx, dest) => {
      [0, 0.1, 0.2, 0.35].forEach((t, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = [523, 659, 784, 1047][i];
        g.gain.setValueAtTime(0.25, ctx.currentTime + t);
        g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + t + 0.2);
        osc.connect(g).connect(dest);
        osc.start(ctx.currentTime + t);
        osc.stop(ctx.currentTime + t + 0.2);
      });
    });
  }

  fail() {
    this.play((ctx, dest) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.4);
      g.gain.setValueAtTime(0.2, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.connect(g).connect(dest);
      osc.start(); osc.stop(ctx.currentTime + 0.4);
    });
  }

  click() {
    this.play((ctx, dest) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 1000;
      g.gain.setValueAtTime(0.15, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
      osc.connect(g).connect(dest);
      osc.start(); osc.stop(ctx.currentTime + 0.05);
    });
  }

  star() {
    this.play((ctx, dest) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.1);
      g.gain.setValueAtTime(0.2, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.connect(g).connect(dest);
      osc.start(); osc.stop(ctx.currentTime + 0.15);
    });
  }
}

export const soundEngine = new SoundEngine();
