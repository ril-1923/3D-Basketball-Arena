import type { Sim, TeamId } from '../../game/gameState';
import Player from './Player';
export default function Team({ sim, team, selected, onSelect }: { sim: Sim; team: TeamId; selected: number | null; onSelect: (i: number) => void }) {
  const base = team === 'blue' ? 0 : 5;
  return <>{[0, 1, 2, 3, 4].map((k) => <Player key={base + k} sim={sim} index={base + k} selected={selected === base + k} onSelect={onSelect} />)}</>;
}
