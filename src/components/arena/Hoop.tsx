export default function Hoop({ side }: { side: 1 | -1 }) {
  const s = side;
  return (
    <group>
      <mesh position={[s * 15.2, 1.8, 0]}><cylinderGeometry args={[0.12, 0.14, 3.6, 12]} /><meshStandardMaterial color="#8892a6" metalness={0.8} roughness={0.3} /></mesh>
      <mesh position={[s * 14, 3.5, 0]}><boxGeometry args={[2.4, 0.14, 0.14]} /><meshStandardMaterial color="#8892a6" metalness={0.8} roughness={0.3} /></mesh>
      <mesh position={[s * 12.95, 3.6, 0]}><boxGeometry args={[0.06, 1.05, 1.8]} /><meshPhysicalMaterial color="#cfe8ff" transparent opacity={0.35} roughness={0.05} /></mesh>
      <mesh position={[s * 12.91, 3.35, 0]}><boxGeometry args={[0.03, 0.45, 0.59]} /><meshBasicMaterial color="#fff" wireframe /></mesh>
      <mesh position={[s * 12.75, 3.05, 0]}><boxGeometry args={[0.4, 0.05, 0.05]} /><meshStandardMaterial color="#ff7a00" /></mesh>
      <mesh position={[s * 12.55, 3.05, 0]} rotation-x={Math.PI / 2}><torusGeometry args={[0.23, 0.018, 8, 24]} /><meshStandardMaterial color="#ff7a00" emissive="#ff4400" emissiveIntensity={0.4} /></mesh>
      <mesh position={[s * 12.55, 2.82, 0]}><cylinderGeometry args={[0.23, 0.13, 0.45, 12, 3, true]} /><meshBasicMaterial color="#fff" wireframe /></mesh>
      <pointLight position={[s * 11, 6, 0]} color={s === 1 ? '#ff5a5a' : '#4a8bff'} intensity={25} distance={14} />
    </group>
  );
}
