import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import type { Sim } from '../../game/gameState';
import { TEAMS } from '../../data/players';
const skin = new THREE.MeshStandardMaterial({ color: '#c68a5c', roughness: 0.7 });
const shoe = new THREE.MeshStandardMaterial({ color: '#f2f2f2' });
const jersey = { blue: new THREE.MeshStandardMaterial({ color: TEAMS.blue.color, roughness: 0.6 }), red: new THREE.MeshStandardMaterial({ color: TEAMS.red.color, roughness: 0.6 }) };
const shorts = { blue: new THREE.MeshStandardMaterial({ color: '#0d3a99' }), red: new THREE.MeshStandardMaterial({ color: '#8f1d1d' }) };
const limb = new THREE.BoxGeometry(0.15, 0.55, 0.15), hand = new THREE.SphereGeometry(0.085, 8, 6);
type Props = { sim: Sim; index: number; selected: boolean; onSelect: (i: number) => void };
export default function Player({ sim, index, selected, onSelect }: Props) {
  const root = useRef<THREE.Group>(null), body = useRef<THREE.Group>(null);
  const lL = useRef<THREE.Group>(null), rL = useRef<THREE.Group>(null), lA = useRef<THREE.Group>(null), rA = useRef<THREE.Group>(null);
  const st = useRef({ px: 0, pz: 0, cyc: 0, t: 0 });
  const info = sim.players[index], team = info.teamId;
  useFrame((_, dt) => {
    const p = sim.players[index], r = root.current, b = body.current, a = st.current;
    if (!r || !b || !lL.current || !rL.current || !lA.current || !rA.current || dt <= 0 || !sim.playing) return;
    const v = Math.hypot(p.x - a.px, p.z - a.pz) / dt; a.px = p.x; a.pz = p.z; a.t += dt; a.cyc += Math.min(v, 8) * dt * 1.5;
    r.position.set(p.x, p.jump, p.z); r.rotation.y = p.face;
    const sw = Math.sin(a.cyc) * Math.min(1, v / 3) * 0.9;
    lL.current.rotation.set(sw, 0, 0); rL.current.rotation.set(-sw, 0, 0);
    lA.current.rotation.set(-sw * 0.8, 0, 0.08); rA.current.rotation.set(sw * 0.8, 0, -0.08); b.position.y = 0;
    switch (p.anim) {
      case 'defend': b.position.y = -0.18; lA.current.rotation.set(-0.5, 0, 1.1); rA.current.rotation.set(-0.5, 0, -1.1); lL.current.rotation.set(0, 0, 0.3); rL.current.rotation.set(0, 0, -0.3); break;
      case 'dribble': rA.current.rotation.set(-0.5 - (1 - Math.min(1, sim.ball.y)) * 0.7, 0, -0.1); break;
      case 'shoot': lA.current.rotation.set(-2.7, 0, 0.1); rA.current.rotation.set(-2.7, 0, -0.1); break;
      case 'pass': lA.current.rotation.set(-1.4, 0, 0.2); rA.current.rotation.set(-1.4, 0, -0.2); break;
      case 'catch': lA.current.rotation.set(-1.2, 0, 0.35); rA.current.rotation.set(-1.2, 0, -0.35); break;
      case 'celebrate': lA.current.rotation.set(-3, 0, 0.3); rA.current.rotation.set(-3, 0, -0.3); b.position.y = Math.abs(Math.sin(a.t * 8)) * 0.25; break;
      default: break;
    }
  });
  return (
    <group ref={root} onClick={(e) => { e.stopPropagation(); onSelect(index); }}>
      <group ref={body}>
        <group ref={lL} position={[-0.11, 0.95, 0]}><mesh geometry={limb} position={[0, -0.28, 0]} material={skin} /><mesh position={[0, -0.9, 0.04]} material={shoe}><boxGeometry args={[0.17, 0.1, 0.3]} /></mesh></group>
        <group ref={rL} position={[0.11, 0.95, 0]}><mesh geometry={limb} position={[0, -0.28, 0]} material={skin} /><mesh position={[0, -0.9, 0.04]} material={shoe}><boxGeometry args={[0.17, 0.1, 0.3]} /></mesh></group>
        <mesh position={[0, 0.98, 0]} material={shorts[team]}><boxGeometry args={[0.46, 0.32, 0.26]} /></mesh>
        <mesh position={[0, 1.35, 0]} material={jersey[team]} castShadow><boxGeometry args={[0.48, 0.5, 0.27]} /></mesh>
        <Text position={[0, 1.38, -0.14]} rotation={[0, Math.PI, 0]} fontSize={0.26} color="#fff">{String(info.number)}</Text>
        <Text position={[0, 1.38, 0.14]} fontSize={0.12} color="#fff">{String(info.number)}</Text>
        <mesh position={[0, 1.7, 0]} material={skin}><sphereGeometry args={[0.15, 12, 10]} /></mesh>
        <group ref={lA} position={[-0.31, 1.55, 0]}><mesh geometry={limb} position={[0, -0.26, 0]} material={skin} /><mesh geometry={hand} position={[0, -0.58, 0]} material={skin} /></group>
        <group ref={rA} position={[0.31, 1.55, 0]}><mesh geometry={limb} position={[0, -0.26, 0]} material={skin} /><mesh geometry={hand} position={[0, -0.58, 0]} material={skin} /></group>
      </group>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.03, 0]} visible={selected}><ringGeometry args={[0.55, 0.68, 24]} /><meshBasicMaterial color="#ffd23f" /></mesh>
    </group>
  );
}
