import { useCallback, useState } from 'react';
import { createSim, snapshot } from '../game/gameEngine';
export function useBasketballGame() {
  const [sim] = useState(createSim);
  const [hud, setHud] = useState(() => snapshot(sim));
  const tick = useCallback(() => setHud(snapshot(sim)), [sim]);
  return { sim, hud, tick };
}
