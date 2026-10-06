export type TeamId = 'blue' | 'red';
export type TeamInfo = { id: TeamId; name: string; color: string; score: number };
export type PlayerInfo = { id: string; name: string; number: number; teamId: TeamId; position: string; speed: number; shooting: number; defense: number };
export type Phase = 'tipoff' | 'possession' | 'dribbling' | 'passing' | 'shooting' | 'rebound' | 'transition' | 'timeout' | 'quarterBreak' | 'gameOver';
export type Anim = 'idle' | 'run' | 'defend' | 'dribble' | 'shoot' | 'pass' | 'catch' | 'celebrate';
export type EventKind = 'pass' | 'shot' | 'score' | 'rebound' | 'steal' | 'possessionChange' | 'quarterStart' | 'quarterEnd';
export type GameEvent = { id: number; clock: string; text: string; kind: EventKind };
export type SimPlayer = PlayerInfo & { x: number; z: number; face: number; anim: Anim; jump: number };
export type Flight = { fx: number; fy: number; fz: number; tx: number; ty: number; tz: number; h: number; dur: number; t: number; tgt: number; onEnd?: () => void };
export type Sim = {
  players: SimPlayer[]; ball: { x: number; y: number; z: number; spin: number };
  holder: number; focus: number; shooter: number; passer: number; receiver: number; released: boolean;
  phase: Phase; t: number; nextAct: number; passes: number; dribT: number;
  quarter: number; time: number; score: Record<TeamId, number>; events: GameEvent[]; evId: number;
  playing: boolean; speed: number; flight: Flight | null; attack: TeamId; celebrate: number; celebTeam: TeamId;
  onEvent?: (k: EventKind) => void;
};
export type HudState = { score: Record<TeamId, number>; quarter: number; clock: string; phase: Phase; attack: TeamId; holder: number; events: GameEvent[] };
