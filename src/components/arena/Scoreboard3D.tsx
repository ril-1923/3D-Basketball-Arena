import { Text } from '@react-three/drei';
import type { HudState } from '../../game/gameState';
export default function Scoreboard3D({ hud }: { hud: HudState }) {
  return (
    <group position={[0, 9.5, 0]}>
      <mesh><boxGeometry args={[6, 2.8, 6]} /><meshStandardMaterial color="#0b0f1d" metalness={0.6} roughness={0.4} /></mesh>
      {[0, Math.PI / 2, Math.PI, -Math.PI / 2].map((r) => (
        <group key={r} rotation-y={r}>
          <group position={[0, 0, 3.02]}>
            <Text position={[-1.7, 0.85, 0]} fontSize={0.3} color="#6fa0ff">BLUE HAWKS</Text>
            <Text position={[1.7, 0.85, 0]} fontSize={0.3} color="#ff7b7b">RED TITANS</Text>
            <Text position={[-1.7, 0, 0]} fontSize={1} color="#fff">{String(hud.score.blue)}</Text>
            <Text position={[1.7, 0, 0]} fontSize={1} color="#fff">{String(hud.score.red)}</Text>
            <Text position={[0, 0.5, 0]} fontSize={0.5} color="#ffb347">{`Q${hud.quarter}`}</Text>
            <Text position={[0, -0.35, 0]} fontSize={0.5} color="#ffb347">{hud.clock}</Text>
          </group>
        </group>
      ))}
    </group>
  );
}
