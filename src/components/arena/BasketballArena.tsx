import { useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { HudState, Sim } from '../../game/gameState';
import { useGameLoop } from '../../hooks/useGameLoop';
import ArenaLights from './ArenaLights';
import Court from './Court';
import Hoop from './Hoop';
import Basketball from './Basketball';
import Team from './Team';
import Crowd, { ArenaShell } from './Crowd';
import Scoreboard3D from './Scoreboard3D';
export type CamMode = 'broadcast' | 'courtside' | 'overhead' | 'player';
type Props = { sim: Sim; hud: HudState; cam: CamMode; explore: boolean; selected: number | null; onSelect: (i: number | null) => void; onTick: () => void };
function Driver({ sim, onTick }: { sim: Sim; onTick: () => void }) { useGameLoop(sim, onTick); return null; }
function CameraRig({ sim, cam, explore }: { sim: Sim; cam: CamMode; explore: boolean }) {
  const camera = useThree((s) => s.camera);
  const v = useMemo(() => ({ p: new THREE.Vector3(), l: new THREE.Vector3(), look: new THREE.Vector3() }), []);
  useFrame((_, dt) => {
    if (explore) return;
    const b = sim.ball, k = 1 - Math.exp(-Math.min(dt, 0.1) * 2.2);
    if (cam === 'broadcast') { v.p.set(b.x * 0.3, 11, 21); v.l.set(b.x * 0.55, 0.8, 0); }
    else if (cam === 'courtside') { v.p.set(b.x * 0.8, 1.7, 10.2); v.l.set(b.x, 1.2, 0); }
    else if (cam === 'overhead') { v.p.set(b.x * 0.2, 27, 0.1); v.l.set(b.x * 0.2, 0, 0); }
    else { const p = sim.players[sim.focus]; v.p.set(p.x - Math.sin(p.face) * 3.2, 2.6, p.z - Math.cos(p.face) * 3.2); v.l.set(p.x + Math.sin(p.face) * 6, 1.5, p.z + Math.cos(p.face) * 6); }
    camera.position.lerp(v.p, k); v.look.lerp(v.l, k); camera.lookAt(v.look);
  });
  return null;
}
export default function BasketballArena({ sim, hud, cam, explore, selected, onSelect, onTick }: Props) {
  return (
    <Canvas shadows dpr={[1, 1.75]} camera={{ position: [0, 14, 26], fov: 45 }} gl={{ antialias: true, powerPreference: 'high-performance' }} onPointerMissed={() => onSelect(null)}>
      <color attach="background" args={['#070b16']} />
      <fog attach="fog" args={['#070b16', 50, 95]} />
      <ArenaLights /><ArenaShell /><Court /><Hoop side={1} /><Hoop side={-1} /><Crowd />
      <Team sim={sim} team="blue" selected={selected} onSelect={onSelect} />
      <Team sim={sim} team="red" selected={selected} onSelect={onSelect} />
      <Basketball sim={sim} /><Scoreboard3D hud={hud} />
      <Driver sim={sim} onTick={onTick} /><CameraRig sim={sim} cam={cam} explore={explore} />
      {explore && <OrbitControls enableDamping maxPolarAngle={Math.PI / 2.05} minDistance={3} maxDistance={45} />}
    </Canvas>
  );
}
