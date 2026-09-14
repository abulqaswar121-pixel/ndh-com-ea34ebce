import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, PlayCircle } from 'lucide-react';

type Props = {
  videoId: string;
  startSeconds: number;
  endSeconds: number | null;
  title: string;
  completed: boolean;
  onSegmentWatched: () => void;
};

let apiPromise: Promise<any> | null = null;

function loadPlayerApi(): Promise<any> {
  if (typeof window === 'undefined') return Promise.resolve(null);
  const w = window as any;
  if (w.YT?.Player) return Promise.resolve(w.YT);
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve) => {
    const previous = w.onYouTubeIframeAPIReady;
    w.onYouTubeIframeAPIReady = () => {
      if (typeof previous === 'function') previous();
      resolve(w.YT);
    };
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
  });
  return apiPromise;
}

/**
 * Plays only the stored segment of a YouTube video: it starts at startSeconds,
 * stops at endSeconds, and counts genuinely watched seconds so that skipping
 * ahead never marks a lesson complete.
 */
export function LessonPlayer({ videoId, startSeconds, endSeconds, title, completed, onSegmentWatched }: Props) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);
  const watchedRef = useRef(0);
  const lastTimeRef = useRef(startSeconds);
  const firedRef = useRef(false);
  const [watched, setWatched] = useState(0);
  const [finished, setFinished] = useState(false);

  const segment = Math.max((endSeconds ?? startSeconds + 1) - startSeconds, 1);
  const target = segment * 0.9;

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setInterval> | undefined;
    watchedRef.current = 0;
    lastTimeRef.current = startSeconds;
    firedRef.current = completed;
    setWatched(0);
    setFinished(false);

    void loadPlayerApi().then((YT) => {
      if (cancelled || !YT || !hostRef.current) return;
      playerRef.current = new YT.Player(hostRef.current, {
        videoId,
        playerVars: {
          start: Math.floor(startSeconds),
          ...(endSeconds ? { end: Math.ceil(endSeconds) } : {}),
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
        },
        events: {
          onReady: () => {
            timer = setInterval(() => {
              const player = playerRef.current;
              if (!player?.getCurrentTime) return;
              const state = player.getPlayerState?.();
              const now = player.getCurrentTime();
              const delta = now - lastTimeRef.current;
              lastTimeRef.current = now;
              // Only count small forward steps: scrubbing never earns credit.
              if (state === 1 && delta > 0 && delta < 1.5) {
                watchedRef.current += delta;
                setWatched(watchedRef.current);
              }
              if (endSeconds && now >= endSeconds - 0.4) {
                player.pauseVideo?.();
                setFinished(true);
              }
              if (!firedRef.current && watchedRef.current >= target) {
                firedRef.current = true;
                onSegmentWatched();
              }
            }, 500);
          },
          onStateChange: (event: any) => {
            if (event.data === 0) {
              setFinished(true);
              if (!firedRef.current) {
                firedRef.current = true;
                onSegmentWatched();
              }
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
      try {
        playerRef.current?.destroy?.();
      } catch {
        /* player already gone */
      }
      playerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId, startSeconds, endSeconds]);

  const percent = Math.min(100, Math.round((watched / target) * 100));

  return (
    <div className="lesson-player">
      <div className="video-frame">
        <div ref={hostRef} title={title} />
      </div>
      <div className="lesson-player-status">
        {completed || firedRef.current ? (
          <span className="is-complete">
            <CheckCircle2 size={16} /> {finished ? 'Lesson complete' : 'Counted as watched'}
          </span>
        ) : (
          <span>
            <PlayCircle size={16} /> Watched {percent}% of this segment
          </span>
        )}
        <div className="progress-track">
          <span style={{ width: `${percent}%` }} />
        </div>
      </div>
    </div>
  );
}
