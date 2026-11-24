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

/** Pop-up notices: offline, back online, and install app. They slide in, then leave by themselves. */
type Note = { kind: "off" | "on" | "install"; text: string };

function useAutoHide(ms: number) {
  const [note, setNote] = useState<Note | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const show = (n: Note) => {
    setNote(n);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setNote(null), ms);
  };
  return { note, show, hide: () => setNote(null) };
}

function NetworkNotice() {
  const { note, show, hide } = useAutoHide(6000);
  const [game, setGame] = useState(false);
  const prompt = useRef<any>(null);

  useEffect(() => {
    const off = () => show({ kind: "off", text: "You're offline • Showing saved page" });
    const on = () => show({ kind: "on", text: "Back online" });
    window.addEventListener("offline", off);
    window.addEventListener("online", on);

    const installed =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone === true;
    const inFrame = window.top !== window.self;
    const onPrompt = (e: Event) => {
      e.preventDefault();
      prompt.current = e;
      if (!installed && !inFrame) show({ kind: "install", text: "Get the NDH Hub app on your phone" });
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    // iPhone has no install event, so show a short tip on each open instead.
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    let t: ReturnType<typeof setTimeout> | undefined;
    if (isIos && !installed && !inFrame) {
      t = setTimeout(() => show({ kind: "install", text: "Tap Share, then 'Add to Home Screen'" }), 1800);
    }
    if (!navigator.onLine) off();
    return () => {
      window.removeEventListener("offline", off);
      window.removeEventListener("online", on);
      window.removeEventListener("beforeinstallprompt", onPrompt);
      if (t) clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const install = async () => {
    const p = prompt.current;
    hide();
    if (!p) return;
    p.prompt();
    await p.userChoice.catch(() => null);
    prompt.current = null;
  };

  return (
    <>
      {note && (
        <div key={note.text} className={`ndh-toast is-${note.kind}`} role="status">
          <img src={logo} alt="" className="ndh-toast-icon" />
          <span>{note.text}</span>
          {note.kind === "off" && <button type="button" onClick={() => { hide(); setGame(true); }}>Play</button>}
          {note.kind === "on" && <button type="button" onClick={() => location.reload()}>Refresh</button>}
          {note.kind === "install" && prompt.current && <button type="button" onClick={install}>Install</button>}
          <button type="button" className="ndh-toast-x" onClick={hide} aria-label="Close">✕</button>
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
