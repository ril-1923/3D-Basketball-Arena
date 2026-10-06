import type { CamMode } from '../arena/BasketballArena';
type Props = { cam: CamMode; setCam: (c: CamMode) => void; paused: boolean; onPause: () => void; onReset: () => void; sound: boolean; onSound: () => void; speed: number; setSpeed: (n: number) => void; explore: boolean; onExplore: () => void };
const CAMS: [CamMode, string][] = [['broadcast', 'Broadcast'], ['courtside', 'Courtside'], ['overhead', 'Overhead'], ['player', 'Player']];
export default function GameControls(p: Props) {
  return (
    <div className="controls">
      <div className="btn-group btn-group-sm" role="group" aria-label="Camera">
        {CAMS.map(([c, l]) => <button key={c} className={`btn ${p.cam === c && !p.explore ? 'active' : ''}`} onClick={() => p.setCam(c)}>{l}</button>)}
      </div>
      <div className="btn-group btn-group-sm" role="group" aria-label="Game">
        <button className="btn" onClick={p.onPause}>{p.paused ? 'Resume' : 'Pause'}</button>
        <button className="btn" onClick={p.onReset}>Reset</button>
        <button className="btn" onClick={p.onSound}>{p.sound ? '🔊 Sound on' : '🔇 Sound off'}</button>
        <button className="btn" onClick={p.onExplore}>{p.explore ? 'Return to game' : 'Explore'}</button>
      </div>
      <div className="btn-group btn-group-sm" role="group" aria-label="Speed">
        {[0.5, 1, 2].map((s) => <button key={s} className={`btn ${p.speed === s ? 'active' : ''}`} onClick={() => p.setSpeed(s)}>{s}x</button>)}
      </div>
    </div>
  );
}
