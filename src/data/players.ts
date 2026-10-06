import type { PlayerInfo, TeamInfo, TeamId } from '../game/gameState';
export const TEAMS: Record<TeamId, TeamInfo> = {
  blue: { id: 'blue', name: 'Blue Hawks', color: '#1e6bff', score: 0 },
  red: { id: 'red', name: 'Red Titans', color: '#ff3b3b', score: 0 },
};
const POS = ['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center'];
const SPD = [92, 88, 85, 80, 74], SHT = [87, 90, 82, 76, 70], DEF = [81, 78, 84, 88, 92];
export const ROSTER: PlayerInfo[] = (['blue', 'red'] as TeamId[]).flatMap((t, ti) =>
  POS.map((position, k) => ({
    id: `${t}Player${k + 1}`, name: `${TEAMS[t].name} #${k + 1}`, number: k + 1, teamId: t, position,
    speed: SPD[k] - ti * 2, shooting: SHT[k] - ti * 3, defense: DEF[k] + ti,
  })));
