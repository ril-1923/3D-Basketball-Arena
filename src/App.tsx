import Home from './pages/Home';
function hasWebGL(): boolean {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; }
}
export default function App() {
  if (!hasWebGL()) return <div className="fallback"><h1>3D Basketball Arena</h1><p>Your browser couldn't start WebGL. Enable hardware acceleration or try a current version of Chrome, Firefox or Safari.</p></div>;
  return <Home />;
}
