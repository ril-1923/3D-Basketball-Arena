import type { HudState } from '../../game/gameState';
export default function ScorePanel({ hud }: { hud: HudState }) {
  const poss = hud.holder >= 0 ? hud.attack : hud.attack;
  return (
    <div className="score-panel" aria-live="polite">
      <div className="side blue"><span>Blue Hawks</span><b>{hud.score.blue}</b></div>
      <div className="mid"><em>Q{hud.quarter}</em><strong>{hud.clock}</strong></div>
      <div className="side red"><b>{hud.score.red}</b><span>Red Titans</span></div>
      <div className={`poss ${poss}`}>{poss === 'blue' ? 'Blue Hawks' : 'Red Titans'} possession</div>
    </div>
  );
}
