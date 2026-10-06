import type { HudState, SimPlayer } from '../../game/gameState';
export default function TeamPanel({ player, index, hud }: { player: SimPlayer; index: number; hud: HudState }) {
  const status = hud.holder === index ? 'Possession' : player.teamId === hud.attack ? 'Off the ball' : 'Defending';
  return (
    <aside className={`player-panel ${player.teamId}`}>
      <h2>{player.name}</h2>
      <dl><dt>Position</dt><dd>{player.position}</dd><dt>Speed</dt><dd>{player.speed}</dd><dt>Shooting</dt><dd>{player.shooting}</dd><dt>Defense</dt><dd>{player.defense}</dd><dt>Status</dt><dd>{status}</dd></dl>
    </aside>
  );
}
