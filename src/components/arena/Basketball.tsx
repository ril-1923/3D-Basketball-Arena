import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type * as THREE from 'three';
import type { Sim } from '../../game/gameState';
export default function Basketball({ sim }: { sim: Sim }) {
  const g = useRef<THREE.Group>(null);
  useFrame(() => {
    const b = sim.ball, o = g.current; if (!o) return;
    o.position.set(b.x, b.y, b.z); o.rotation.set(b.spin, 0, b.spin * 0.5);
  });
  return (
    <group ref={g} scale={0.17}>
      <mesh castShadow><sphereGeometry args={[1, 24, 16]} /><meshStandardMaterial color="#e8691a" roughness={0.75} /></mesh>
      <mesh><torusGeometry args={[1.005, 0.025, 6, 40]} /><meshBasicMaterial color="#111" /></mesh>
      <mesh rotation-y={Math.PI / 2}><torusGeometry args={[1.005, 0.025, 6, 40]} /><meshBasicMaterial color="#111" /></mesh>
      <mesh rotation-x={Math.PI / 2}><torusGeometry args={[1.005, 0.025, 6, 40]} /><meshBasicMaterial color="#111" /></mesh>
    </group>
  );
}
