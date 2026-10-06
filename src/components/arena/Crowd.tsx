import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
const ROWS = 8, PALETTE = ['#3b5bdb', '#e03131', '#f08c00', '#2f9e44', '#9c36b5', '#dee2e6', '#1c7ed6'];
export default function Crowd() {
  const body = useRef<THREE.InstancedMesh>(null), head = useRef<THREE.InstancedMesh>(null), f = useRef(0);
  const reduce = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  const pts = useMemo(() => {
    const out: number[] = [];
    for (let r = 0; r < ROWS; r++) {
      const y = 0.6 + r * 0.95, a = 18.9 + 1.58 * (y - 0.6) + 0.3, b = a * 0.62, n = Math.floor(2 * Math.PI * Math.sqrt((a * a + b * b) / 2) / 0.95);
      for (let i = 0; i < n; i++) { const t = (i / n) * Math.PI * 2; out.push(Math.cos(t) * a, y, Math.sin(t) * b, t); }
    }
    return new Float32Array(out);
  }, []);
  const count = pts.length / 4, dummy = useMemo(() => new THREE.Object3D(), []);
  const place = (i: number, bob: number) => {
    const x = pts[i * 4], y = pts[i * 4 + 1] + bob, z = pts[i * 4 + 2];
    dummy.rotation.set(0, -pts[i * 4 + 3] - Math.PI / 2, 0); dummy.position.set(x, y + 0.4, z); dummy.updateMatrix(); body.current!.setMatrixAt(i, dummy.matrix);
    dummy.position.set(x, y + 0.95, z); dummy.updateMatrix(); head.current!.setMatrixAt(i, dummy.matrix);
  };
  useLayoutEffect(() => {
    const c = new THREE.Color();
    for (let i = 0; i < count; i++) { place(i, 0); c.set(PALETTE[(i * 7919) % PALETTE.length]); body.current!.setColorAt(i, c); c.set('#d9a77c'); head.current!.setColorAt(i, c); }
    body.current!.instanceMatrix.needsUpdate = head.current!.instanceMatrix.needsUpdate = true;
    body.current!.instanceColor!.needsUpdate = head.current!.instanceColor!.needsUpdate = true;
  });
  useFrame(({ clock }) => {
    if (reduce || !body.current || !head.current) return;
    f.current++; const t = clock.elapsedTime;
    for (let i = f.current % 4; i < count; i += 4) place(i, Math.max(0, Math.sin(t * 3 + i * 1.7)) * 0.08);
    body.current.instanceMatrix.needsUpdate = head.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <>
      <instancedMesh ref={body} args={[undefined, undefined, count]}><boxGeometry args={[0.5, 0.7, 0.35]} /><meshStandardMaterial roughness={0.9} /></instancedMesh>
      <instancedMesh ref={head} args={[undefined, undefined, count]}><sphereGeometry args={[0.15, 6, 5]} /><meshStandardMaterial roughness={0.9} /></instancedMesh>
    </>
  );
}
const ADS = ['NOVA COLA', 'VELOCITY SHOES', 'ZENITH BANK', 'AEROFLEX', 'PULSE ENERGY', 'ORBIT TV'];
export function ArenaShell() {
  return (
    <group>
      <mesh position={[0, 4.75, 0]} scale={[1, 1, 0.62]}><cylinderGeometry args={[33, 18, 9.5, 64, 1, true]} /><meshStandardMaterial color="#1a2238" side={THREE.DoubleSide} roughness={0.9} /></mesh>
      <mesh position={[0, 12.75, 0]} scale={[1, 1, 0.62]}><cylinderGeometry args={[33, 33, 6.5, 64, 1, true]} /><meshStandardMaterial color="#0e1630" side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 16, 0]} rotation-x={Math.PI / 2} scale={[1, 0.62, 1]}><circleGeometry args={[34, 48]} /><meshBasicMaterial color="#05070d" side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, -0.02, 0]} rotation-x={-Math.PI / 2} scale={[1, 0.62, 1]}><circleGeometry args={[34, 48]} /><meshStandardMaterial color="#0b1020" /></mesh>
      <mesh position={[0, 13, 0]} rotation-x={Math.PI / 2} scale={[1, 0.62, 1]}><torusGeometry args={[14, 0.12, 6, 48]} /><meshStandardMaterial color="#9aa5bd" metalness={0.9} roughness={0.3} /></mesh>
      {[-1, 1].map((s) => ADS.map((t, i) => (
        <group key={`${s}${i}`} position={[(i % 3 - 1) * 8, 0.5, s * 8.6]} rotation-y={s === 1 ? Math.PI : 0}>
          <mesh><boxGeometry args={[7.4, 1, 0.1]} /><meshStandardMaterial color="#10162b" emissive={i % 2 ? '#0a3d91' : '#7a1212'} emissiveIntensity={0.9} /></mesh>
          <Text position={[0, 0, 0.07]} fontSize={0.42} color="#fff">{t}</Text>
        </group>
      )).slice(0, 3))}
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 20, 11, 0]} rotation-y={-s * Math.PI / 2}>
          <mesh><boxGeometry args={[3, 5, 0.1]} /><meshStandardMaterial color={s === 1 ? '#c0392b' : '#1e6bff'} emissive={s === 1 ? '#7a1212' : '#0a3d91'} emissiveIntensity={0.6} /></mesh>
          <Text position={[0, 0, 0.08]} fontSize={0.5} color="#fff">{s === 1 ? 'RED TITANS' : 'BLUE HAWKS'}</Text>
        </group>
      ))}
      <group position={[0, 12, -20.5]}><Text fontSize={2.4} color="#ff8a1f" outlineWidth={0.04} outlineColor="#000">BASKETBALL</Text></group>
    </group>
  );
}
