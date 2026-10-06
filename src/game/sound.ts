import type { EventKind } from './gameState';
let ctx: AudioContext | null = null;
function tone(f: number, dur: number, type: OscillatorType, vol: number, delay = 0) {
  try {
    ctx = ctx ?? new AudioContext(); const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime + delay;
    o.type = type; o.frequency.value = f; g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + dur);
  } catch { /* audio unavailable: game still works */ }
}
export function playSound(k: EventKind) {
  if (k === 'pass') tone(180, 0.08, 'triangle', 0.15);
  else if (k === 'score') { tone(520, 0.15, 'square', 0.08); tone(780, 0.3, 'square', 0.08, 0.12); }
  else if (k === 'quarterEnd') tone(120, 0.9, 'sawtooth', 0.12);
  else if (k === 'shot') tone(300, 0.1, 'sine', 0.1);
}
