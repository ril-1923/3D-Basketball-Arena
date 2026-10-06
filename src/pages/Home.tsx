import { useEffect, useState } from 'react';
import BasketballArena, { type CamMode } from '../components/arena/BasketballArena';
import GameHUD from '../components/ui/GameHUD';
import ScorePanel from '../components/ui/ScorePanel';
import GameControls from '../components/ui/GameControls';
import TeamPanel from '../components/ui/TeamPanel';
import { useBasketballGame } from '../hooks/useBasketballGame';
import { resetSim } from '../game/gameEngine';
import { playSound } from '../game/sound';
const MSGS = ['Loading Basketball Arena...', 'Loading players...', 'Loading court...', 'Starting game...'];
export default function Home() {
  const { sim, hud, tick } = useBasketballGame();
  const [mode, setMode] = useState<'start' | 'play'>('start');
  const [explore, setExplore] = useState(false);
  const [cam, setCam] = useState<CamMode>('broadcast');
  const [paused, setPaused] = useState(false);
  const [sound, setSound] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [selected, setSelected] = useState<number | null>(null);
  const [load, setLoad] = useState(0);
  useEffect(() => { const id = setInterval(() => setLoad((n) => n + 1), 400); return () => clearInterval(id); }, []);
  useEffect(() => { sim.playing = !paused && !explore; sim.speed = speed; }, [sim, paused, explore, speed]);
  useEffect(() => { sim.onEvent = sound ? playSound : undefined; }, [sim, sound]);
  const start = () => { resetSim(sim); setMode('play'); setCam('broadcast'); setPaused(false); setExplore(false); tick(); };
  const reset = () => { resetSim(sim); setSelected(null); tick(); };
  const sel = selected !== null ? sim.players[selected] : null;
  return (
    <div className="stage">
      <BasketballArena sim={sim} hud={hud} cam={cam} explore={explore} selected={selected} onSelect={setSelected} onTick={tick} />
      {mode === 'play' && <>
        <ScorePanel hud={hud} />
        {!explore && <GameHUD hud={hud} />}
        {sel && selected !== null && <TeamPanel player={sel} index={selected} hud={hud} />}
        <GameControls cam={cam} setCam={(c) => { setCam(c); setExplore(false); }} paused={paused} onPause={() => setPaused(!paused)} onReset={reset}
          sound={sound} onSound={() => setSound(!sound)} speed={speed} setSpeed={setSpeed} explore={explore} onExplore={() => setExplore(!explore)} />
      </>}
      {mode === 'start' && !explore && (
        <div className="start">
          <h1>3D Basketball Arena</h1>
          <p className="vs"><span className="b">Blue Hawks</span> vs <span className="r">Red Titans</span></p>
          <div className="d-flex gap-2 justify-content-center flex-wrap">
            <button className="btn go" onClick={start}>Start game</button>
            <button className="btn alt" onClick={() => { start(); setExplore(true); }}>Explore arena</button>
          </div>
        </div>)}
      {load < 4 && <div className="loading"><div className="spin" /><p>{MSGS[Math.min(load, 3)]}</p></div>}
    </div>
  );
}
