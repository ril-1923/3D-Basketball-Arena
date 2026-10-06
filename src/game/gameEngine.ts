import type { Anim, EventKind, HudState, Phase, Sim, SimPlayer, TeamId } from './gameState';
import { ROSTER, TEAMS } from '../data/players';
export const RIM_X = 12.55, RIM_Y = 3.05;
const SLOTS: [number, number][] = [[7.5, 0], [5, -5.2], [5, 5.2], [9.6, -3.4], [10.2, 3.4]];
const dirOf = (t: TeamId) => (t === 'blue' ? 1 : -1);
const other = (t: TeamId): TeamId => (t === 'blue' ? 'red' : 'blue');
const fmt = (t: number) => { const s = Math.max(0, Math.ceil(t)); return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; };
const label = (p: SimPlayer) => `${TEAMS[p.teamId].name.split(' ')[0]} #${p.number}`;

export function createSim(): Sim {
  const players: SimPlayer[] = ROSTER.map((r, i) => {
    const k = i % 5, d = r.teamId === 'blue' ? -1 : 1;
    return { ...r, x: d * (2.5 + (k % 2) * 1.5), z: (k - 2) * 2.6, face: -d * Math.PI / 2, anim: 'idle', jump: 0 };
  });
  return { players, ball: { x: 0, y: 1.5, z: 0, spin: 0 }, holder: -1, focus: 0, shooter: 0, passer: -1, receiver: -1, released: false,
    phase: 'tipoff', t: 0, nextAct: 2, passes: 0, dribT: 0, quarter: 1, time: 720, score: { blue: 0, red: 0 }, events: [], evId: 0,
    playing: true, speed: 1, flight: null, attack: 'blue', celebrate: 0, celebTeam: 'blue' };
}
export function resetSim(s: Sim) { const keep = { playing: s.playing, speed: s.speed, onEvent: s.onEvent }; Object.assign(s, createSim(), keep); }
export function snapshot(s: Sim): HudState {
  return { score: { ...s.score }, quarter: s.quarter, clock: fmt(s.time), phase: s.phase, attack: s.attack, holder: s.holder, events: [...s.events] };
}
function log(s: Sim, kind: EventKind, text: string) {
  s.events.unshift({ id: ++s.evId, clock: fmt(s.time), text, kind }); if (s.events.length > 5) s.events.length = 5; s.onEvent?.(kind);
}
const setPhase = (s: Sim, p: Phase) => { s.phase = p; s.t = 0; };
function fly(s: Sim, to: [number, number, number], dur: number, h: number, tgt: number, onEnd?: () => void) {
  s.flight = { fx: s.ball.x, fy: s.ball.y, fz: s.ball.z, tx: to[0], ty: to[1], tz: to[2], h, dur, t: 0, tgt, onEnd };
}
function giveTo(s: Sim, i: number) {
  s.holder = i; s.focus = i; s.attack = s.players[i].teamId; s.passes = 0; s.receiver = -1; s.nextAct = 2 + Math.random() * 1.2; setPhase(s, 'possession');
}
function nearest(s: Sim, team: TeamId, x: number, z: number): number {
  let best = -1, bd = 1e9;
  s.players.forEach((p, i) => { if (p.teamId === team) { const d = Math.hypot(p.x - x, p.z - z); if (d < bd) { bd = d; best = i; } } });
  return best;
}
function startPass(s: Sim) {
  const base = s.attack === 'blue' ? 0 : 5, c = [0, 1, 2, 3, 4].map((k) => base + k).filter((i) => i !== s.holder);
  const r = c[(Math.random() * c.length) | 0]; s.passer = s.holder; s.receiver = r;
  log(s, 'pass', `${label(s.players[s.passer])} passed to ${label(s.players[r])}`);
  setPhase(s, 'passing'); s.holder = -1;
  fly(s, [0, 1.3, 0], 0.6, 0.5, r, () => { s.holder = r; s.focus = r; s.passes++; s.receiver = -1; s.passer = -1; setPhase(s, 'dribbling'); s.nextAct = 1.6 + Math.random() * 1.2; });
}
function releaseShot(s: Sim) {
  const sh = s.players[s.shooter], d = dirOf(sh.teamId), rx = d * RIM_X, dist = Math.hypot(rx - sh.x, sh.z), three = dist > 7;
  const made = Math.random() < 0.2 + sh.shooting / 200 - (three ? 0.1 : 0);
  s.released = true; s.holder = -1; log(s, 'shot', `${label(sh)} attempted a ${three ? '3PT' : '2PT'} shot`);
  const to: [number, number, number] = made ? [rx, RIM_Y, 0] : [rx - d * 0.4, RIM_Y + 0.15, (Math.random() - 0.5) * 0.5];
  fly(s, to, 0.9 + dist * 0.04, 1.8 + dist * 0.12, -1, () => {
    const opp = other(sh.teamId); s.attack = opp;
    if (made) {
      s.score[sh.teamId] += three ? 3 : 2; log(s, 'score', `${label(sh)} scored ${three ? 3 : 2} points`);
      s.celebrate = 1.8; s.celebTeam = sh.teamId; setPhase(s, 'transition');
      fly(s, [rx, 0.14, 0], 0.5, 0, -1, () => {
        const n = nearest(s, opp, s.ball.x, s.ball.z); s.receiver = n;
        fly(s, [0, 1.2, 0], 0.9, 0.5, n, () => { log(s, 'possessionChange', `${label(s.players[n])} possession`); giveTo(s, n); });
      });
    } else {
      const n = nearest(s, opp, rx, 0); s.receiver = n; setPhase(s, 'rebound');
      fly(s, [0, 1.3, 0], 0.8, 1.4, n, () => { log(s, 'rebound', `${label(s.players[n])} defensive rebound`); giveTo(s, n); });
    }
  });
}
const angDiff = (a: number, b: number) => ((b - a + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;

function movePlayers(s: Sim, dt: number) {
  const off = s.attack, d = dirOf(off), hx = d * RIM_X, base = off === 'blue' ? 0 : 5;
  s.players.forEach((p, i) => {
    const k = i % 5, isOff = p.teamId === off; let tx = p.x, tz = p.z;
    if (s.phase === 'tipoff' || s.phase === 'gameOver') { const dd = p.teamId === 'blue' ? -1 : 1; tx = dd * (2.5 + (k % 2) * 1.5); tz = (k - 2) * 2.6; }
    else if (s.phase === 'shooting' && i === s.shooter) { /* hold */ }
    else if (isOff) {
      if (i === s.holder) { tx = d * 8; tz = 2.5 * Math.sin(s.dribT * 0.7); }
      else { tx = d * SLOTS[k][0] + Math.sin(s.dribT * 0.8 + k) * 0.7; tz = SLOTS[k][1] + Math.cos(s.dribT * 0.7 + k * 2) * 0.7; }
    } else { const m = s.players[base + k]; tx = m.x + (hx - m.x) * 0.25; tz = m.z * 0.8; }
    const dx = tx - p.x, dz = tz - p.z, dist = Math.hypot(dx, dz), v = (2.4 + p.speed * 0.03) * (dist > 10 ? 1.25 : 1);
    let moving = false;
    if (dist > 0.08) { const sp = Math.min(v, dist * 2.5), st = Math.min(dist, sp * dt); p.x += dx / dist * st; p.z += dz / dist * st; moving = sp > 0.9; }
    let want: number;
    if (s.phase === 'tipoff') want = Math.atan2(-p.x, -p.z);
    else if (dist > 3.5) want = Math.atan2(dx, dz);
    else if (isOff) want = Math.atan2(hx - p.x, -p.z);
    else want = Math.atan2(s.ball.x - p.x, s.ball.z - p.z);
    p.face += angDiff(p.face, want) * Math.min(1, dt * 9);
    let a: Anim = moving ? 'run' : 'idle';
    if (!isOff && s.phase !== 'tipoff' && dist < 3.5) a = 'defend';
    if (i === s.holder) a = 'dribble';
    if (s.phase === 'passing' && i === s.passer && s.t < 0.35) a = 'pass';
    if (i === s.receiver && s.flight) a = 'catch';
    if (s.phase === 'shooting' && i === s.shooter) a = 'shoot';
    if (s.celebrate > 0 && p.teamId === s.celebTeam) a = 'celebrate';
    p.anim = a;
    p.jump = s.phase === 'shooting' && i === s.shooter && s.t < 0.95 ? 0.55 * Math.sin(s.t / 0.95 * Math.PI) : 0;
  });
}
function moveBall(s: Sim, dt: number) {
  const b = s.ball; b.spin += dt * 10;
  const f = s.flight;
  if (f) {
    if (f.tgt >= 0) { const p = s.players[f.tgt]; f.tx = p.x; f.tz = p.z; f.ty = 1.3; }
    f.t += dt; const u = Math.min(1, f.t / f.dur);
    b.x = f.fx + (f.tx - f.fx) * u; b.z = f.fz + (f.tz - f.fz) * u; b.y = f.fy + (f.ty - f.fy) * u + 4 * f.h * u * (1 - u);
    if (u >= 1) { s.flight = null; f.onEnd?.(); }
    return;
  }
  if (s.holder >= 0) {
    const p = s.players[s.holder], sn = Math.sin(p.face), cs = Math.cos(p.face);
    b.x = p.x + sn * 0.45 + cs * 0.25; b.z = p.z + cs * 0.45 - sn * 0.25;
    b.y = p.anim === 'dribble' ? 0.14 + Math.abs(Math.sin(s.dribT * 7)) * 0.85 : 1.6;
  } else if (s.phase === 'tipoff') { b.x = 0; b.z = 0; b.y = 1.2 + 2.2 * Math.abs(Math.sin(s.t * 1.4)); }
}
export function stepSim(s: Sim, raw: number) {
  if (!s.playing) return;
  const dt = raw * s.speed; s.t += dt; s.dribT += dt; if (s.celebrate > 0) s.celebrate -= dt;
  if (s.phase === 'gameOver') { if (s.t > 6) resetSim(s); }
  else {
    if (s.phase !== 'tipoff') {
      s.time -= dt * 5;
      if (s.time <= 0) {
        log(s, 'quarterEnd', `End of Q${s.quarter}`);
        if (s.quarter >= 4) { s.time = 0; s.flight = null; setPhase(s, 'gameOver'); }
        else { s.quarter++; s.time = 720; log(s, 'quarterStart', `Q${s.quarter} begins`); }
      }
    }
    switch (s.phase) {
      case 'tipoff': if (s.t > 2.4) { s.attack = 'blue'; log(s, 'possessionChange', 'Blue #1 wins the tipoff'); giveTo(s, 0); } break;
      case 'possession': if (s.t > 0.8) { setPhase(s, 'dribbling'); } break;
      case 'dribbling': if (s.t > s.nextAct) { if (s.passes >= 2 || (s.passes === 1 && Math.random() < 0.3)) { s.shooter = s.holder; s.released = false; setPhase(s, 'shooting'); } else startPass(s); } break;
      case 'shooting': if (!s.released && s.t >= 0.45) releaseShot(s); break;
      default: break;
    }
  }
  movePlayers(s, dt); moveBall(s, dt);
}
