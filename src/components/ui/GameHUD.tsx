import type { HudState } from '../../game/gameState';
export default function GameHUD({ hud }: { hud: HudState }) {
  return (
    <ol className="events" aria-label="Game events">
      {hud.events.map((e) => <li key={e.id}><time>{e.clock}</time> {e.text}</li>)}
    </ol>
  );
}
