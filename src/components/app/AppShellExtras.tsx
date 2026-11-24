import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import logo from "@/assets/ndh-logo-gateway-cropped.png";

/** Branded opening screen, shown once per visit. */
function Splash() {
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    const seen = sessionStorage.getItem("ndh_splash");
    if (seen && seen !== "showing") return;
    sessionStorage.setItem("ndh_splash", "showing");
    setShow(true);
    setLeaving(false);
    const a = setTimeout(() => setLeaving(true), 1100);
    const b = setTimeout(() => { setShow(false); sessionStorage.setItem("ndh_splash", "1"); }, 1500);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, []);
  if (!show) return null;
  return (
    <div className={`ndh-splash ${leaving ? "is-leaving" : ""}`} aria-hidden="true">
      <img src={logo} alt="" className="ndh-splash-logo" />
      <p className="ndh-splash-parent notranslate">NAJEEB DIGITAL HUB</p>
      <p className="ndh-splash-name notranslate">NDH</p>
      <span className="ndh-splash-bar" />
    </div>
  );
}

/** Thin glowing line at the top while a page is loading. */
function LoadingLine() {
  const loading = useRouterState({ select: (s) => s.status === "pending" || s.isLoading });
  return <div className={`ndh-loadline ${loading ? "is-on" : ""}`} aria-hidden="true" />;
}

function RunnerGame({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [over, setOver] = useState(false);
  const jump = useRef<() => void>(() => {});
  const restart = useRef<() => void>(() => {});

  useEffect(() => {
    setBest(Number(localStorage.getItem("ndh_runner_best") || 0));
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    const img = new Image();
    img.src = logo;
    const W = 320, H = 160, G = 130;
    let y = G, vy = 0, obs: { x: number; w: number; h: number }[] = [], t = 0, sp = 3, alive = true, raf = 0, s = 0;
    const reset = () => { y = G; vy = 0; obs = []; t = 0; sp = 3; s = 0; alive = true; setOver(false); setScore(0); };
    jump.current = () => { if (!alive) return reset(); if (y >= G) vy = -9; };
    restart.current = reset;
    const css = getComputedStyle(document.documentElement);
    const fg = css.getPropertyValue("--primary").trim() || "#38bdf8";
    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "rgba(148,163,184,.5)";
      ctx.fillRect(0, G + 22, W, 2);
      if (alive) {
        vy += 0.5; y = Math.min(G, y + vy); t++;
        if (t % Math.max(45, 90 - Math.floor(s / 10)) === 0) obs.push({ x: W, w: 12 + Math.random() * 10, h: 14 + Math.random() * 18 });
        obs.forEach((o) => (o.x -= sp));
        obs = obs.filter((o) => o.x + o.w > 0);
        sp += 0.002; s += 0.2;
        if (Math.floor(s) !== score) setScore(Math.floor(s));
        for (const o of obs) if (30 < o.x + o.w && 52 > o.x && y + 22 > G + 22 - o.h) {
          alive = false; setOver(true);
          const b = Math.max(Number(localStorage.getItem("ndh_runner_best") || 0), Math.floor(s));
          localStorage.setItem("ndh_runner_best", String(b)); setBest(b);
        }
      }
      ctx.fillStyle = fg.startsWith("oklch") || fg.startsWith("#") ? fg : "#38bdf8";
      obs.forEach((o) => ctx.fillRect(o.x, G + 22 - o.h, o.w, o.h));
      if (img.complete) ctx.drawImage(img, 30, y, 22, 22);
      raf = requestAnimationFrame(loop);
    };
    loop();
    const key = (e: KeyboardEvent) => { if (e.code === "Space" || e.code === "ArrowUp") { e.preventDefault(); jump.current(); } };
    window.addEventListener("keydown", key);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("keydown", key); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="ndh-game" role="dialog" aria-label="Gateway Runner game">
      <div className="ndh-game-card">
        <div className="ndh-game-head">
          <strong>Gateway Runner</strong>
          <button type="button" onClick={onClose} aria-label="Close game">✕</button>
        </div>
        <p className="ndh-game-sub">You're offline. Tap to jump while you wait.</p>
        <canvas ref={ref} width={320} height={160} onPointerDown={() => jump.current()} className="ndh-game-canvas" />
        <div className="ndh-game-score">
          <span>Score {score}</span><span>Best {best}</span>
        </div>
        {over && <button type="button" className="ndh-game-btn" onClick={() => restart.current()}>Play again</button>}
      </div>
    </div>
  );
}

/** Offline / back-online notice with the mini-game. */
function NetworkNotice() {
  const [online, setOnline] = useState(true);
  const [back, setBack] = useState(false);
  const [game, setGame] = useState(false);
  useEffect(() => {
    setOnline(navigator.onLine);
    const off = () => { setOnline(false); setBack(false); };
    const on = () => { setOnline(true); setBack(true); setTimeout(() => setBack(false), 4000); };
    window.addEventListener("offline", off);
    window.addEventListener("online", on);
    return () => { window.removeEventListener("offline", off); window.removeEventListener("online", on); };
  }, []);
  return (
    <>
      {!online && (
        <div className="ndh-net is-off" role="status">
          <span>Offline • Showing saved page</span>
          <button type="button" onClick={() => setGame(true)}>Play game</button>
        </div>
      )}
      {online && back && (
        <div className="ndh-net is-on" role="status">
          <span>Back online</span>
          <button type="button" onClick={() => location.reload()}>Refresh</button>
        </div>
      )}
      {game && <RunnerGame onClose={() => setGame(false)} />}
    </>
  );
}

export function AppShellExtras() {
  return (
    <>
      <Splash />
      <LoadingLine />
      <NetworkNotice />
    </>
  );
}
