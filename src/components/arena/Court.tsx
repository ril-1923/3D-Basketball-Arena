import { useMemo } from 'react';
import * as THREE from 'three';
function makeTexture(): THREE.CanvasTexture {
  const S = 50, W = 32 * S, H = 19 * S, c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d')!, px = (m: number) => W / 2 + m * S, pz = (m: number) => H / 2 + m * S;
  for (let x = 0; x < W; x += 7) { g.fillStyle = `hsl(32,58%,${44 + ((x / 7) * 37) % 7}%)`; g.fillRect(x, 0, 7, H); }
  g.fillStyle = 'rgba(8,14,30,.55)'; g.fillRect(0, 0, W, H); g.clearRect(px(-14), pz(-7.5), 28 * S, 15 * S);
  for (const s of [1, -1]) { g.fillStyle = s === 1 ? 'rgba(200,50,50,.8)' : 'rgba(30,107,255,.8)'; g.fillRect(s === 1 ? px(14 - 5.8) : px(-14), pz(-2.45), 5.8 * S, 4.9 * S); }
  g.strokeStyle = '#fff'; g.lineWidth = 4; g.strokeRect(px(-14), pz(-7.5), 28 * S, 15 * S);
  g.beginPath(); g.moveTo(px(0), pz(-7.5)); g.lineTo(px(0), pz(7.5)); g.stroke();
  g.fillStyle = 'rgba(30,107,255,.9)'; g.beginPath(); g.arc(px(0), pz(0), 1.8 * S, 0, 7); g.fill(); g.stroke();
  g.fillStyle = '#fff'; g.font = 'bold 24px Impact, Arial Narrow, sans-serif'; g.textAlign = 'center'; g.fillText('BLUE HAWKS', px(0), pz(0) + 8);
  for (const s of [1, -1]) {
    const lx = s * (14 - 5.8), hx = s * 12.4, a = Math.asin(6.6 / 6.75);
    g.strokeRect(s === 1 ? lx : px(-14), pz(-2.45), 5.8 * S, 4.9 * S);
    g.beginPath(); g.arc(px(lx), pz(0), 1.8 * S, 0, 7); g.stroke();
    g.beginPath(); g.arc(px(hx), pz(0), 6.75 * S, s === 1 ? Math.PI - a : -a, s === 1 ? Math.PI + a : a); g.stroke();
    const ex = hx - s * 6.75 * Math.cos(a);
    for (const z of [-6.6, 6.6]) { g.beginPath(); g.moveTo(px(ex), pz(z)); g.lineTo(px(s * 14), pz(z)); g.stroke(); }
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}
export default function Court() {
  const map = useMemo(makeTexture, []);
  return (
    <mesh rotation-x={-Math.PI / 2} receiveShadow>
      <planeGeometry args={[32, 19]} />
      <meshStandardMaterial map={map} roughness={0.28} metalness={0.15} />
    </mesh>
  );
}
