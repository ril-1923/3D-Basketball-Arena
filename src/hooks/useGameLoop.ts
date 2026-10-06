import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Sim } from '../game/gameState';
import { stepSim } from '../game/gameEngine';
export function useGameLoop(sim: Sim, onTick: () => void) {
  const acc = useRef(0);
  useFrame((_, dt) => {
    stepSim(sim, Math.min(dt, 0.05));
    acc.current += dt; if (acc.current > 0.2) { acc.current = 0; onTick(); }
  });
}
