let audioCtx: AudioContext | null = null;

function getContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

export function ensureAudioContext(): void {
  const ctx = getContext();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
}

function playBeep(ctx: AudioContext, frequency: number, startTime: number, duration: number): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = frequency;
  gain.gain.value = 0.3;
  gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(startTime);
  osc.stop(startTime + duration);
}

export function playNotification(): void {
  const ctx = getContext();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  const now = ctx.currentTime;
  playBeep(ctx, 880, now, 0.15);
  playBeep(ctx, 880, now + 0.2, 0.15);
  playBeep(ctx, 1760, now + 0.4, 0.3);
}
