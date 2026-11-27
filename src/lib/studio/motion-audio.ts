/** Credit-free instrumental loops and uploaded-audio mixing for motion clips. */
export type MotionMusicTrack =
  | "none"
  | "uplift"
  | "bright"
  | "assured"
  | "steady"
  | "organic"
  | "custom";

export const MUSIC_LABEL: Record<MotionMusicTrack, string> = {
  none: "No music",
  uplift: "Uplifting beat",
  bright: "Bright & friendly",
  assured: "Clean corporate",
  steady: "Calm & steady",
  organic: "Warm & natural",
  custom: "My uploaded music",
};

export type MotionAudioSpec = {
  track: MotionMusicTrack;
  /** 0–1, controlled in the editor. */
  volume: number;
  customUrl: string | null;
};

type TrackConfig = {
  bpm: number;
  root: number;
  notes: number[];
  bass: number[];
  wave: OscillatorType;
};

const TRACKS: Record<Exclude<MotionMusicTrack, "none" | "custom">, TrackConfig> = {
  uplift: { bpm: 112, root: 261.63, notes: [0, 4, 7, 11, 7, 4, 9, 7], bass: [0, 0, 5, 7], wave: "triangle" },
  bright: { bpm: 104, root: 293.66, notes: [0, 7, 4, 9, 7, 12, 9, 4], bass: [0, 5, 7, 5], wave: "sine" },
  assured: { bpm: 92, root: 220, notes: [0, 4, 7, 4, 2, 5, 9, 5], bass: [0, 0, 2, 7], wave: "triangle" },
  steady: { bpm: 84, root: 196, notes: [0, 7, 4, 7, 5, 9, 4, 7], bass: [0, 5, 0, 7], wave: "sine" },
  organic: { bpm: 88, root: 174.61, notes: [0, 4, 9, 7, 4, 2, 7, 4], bass: [0, 7, 5, 0], wave: "sine" },
};

function noteFrequency(root: number, semitones: number): number {
  return root * Math.pow(2, semitones / 12);
}

function scheduleTone(
  context: AudioContext,
  destination: AudioNode,
  frequency: number,
  start: number,
  length: number,
  level: number,
  wave: OscillatorType,
): OscillatorNode {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = wave;
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(Math.max(level, 0.0002), start + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + length);
  oscillator.connect(gain);
  gain.connect(destination);
  oscillator.start(start);
  oscillator.stop(start + length + 0.03);
  return oscillator;
}

function scheduleKick(context: AudioContext, destination: AudioNode, start: number): OscillatorNode {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(105, start);
  oscillator.frequency.exponentialRampToValueAtTime(46, start + 0.13);
  gain.gain.setValueAtTime(0.11, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.16);
  oscillator.connect(gain);
  gain.connect(destination);
  oscillator.start(start);
  oscillator.stop(start + 0.18);
  return oscillator;
}

export type MotionAudioHandle = {
  stream: MediaStream | null;
  stop: () => void;
};

/**
 * Start a preview or recording audio graph. Built-in tracks are synthesized
 * locally, so they need no downloaded stock music or AI credits.
 */
export async function startMotionAudio(
  spec: MotionAudioSpec,
  duration: number,
  recording: boolean,
): Promise<MotionAudioHandle> {
  if (spec.track === "none" || spec.volume <= 0 || typeof window === "undefined") {
    return { stream: null, stop: () => undefined };
  }
  const AudioContextClass = window.AudioContext;
  if (!AudioContextClass) throw new Error("This browser cannot add sound to the video.");
  const context = new AudioContextClass();
  await context.resume();
  const master = context.createGain();
  master.gain.setValueAtTime(Math.min(Math.max(spec.volume, 0), 1) * 0.72, context.currentTime);
  const streamDestination = recording ? context.createMediaStreamDestination() : null;
  if (streamDestination) master.connect(streamDestination);
  else master.connect(context.destination);

  const sources: AudioScheduledSourceNode[] = [];
  let closed = false;
  const stop = () => {
    if (closed) return;
    closed = true;
    sources.forEach((source) => {
      try { source.stop(); } catch { /* Already stopped. */ }
    });
    void context.close().catch(() => undefined);
  };

  if (spec.track === "custom") {
    if (!spec.customUrl) {
      stop();
      throw new Error("Choose an audio file first.");
    }
    try {
      const response = await fetch(spec.customUrl);
      const buffer = await context.decodeAudioData(await response.arrayBuffer());
      const source = context.createBufferSource();
      source.buffer = buffer;
      source.loop = buffer.duration < duration;
      source.connect(master);
      source.start();
      source.stop(context.currentTime + duration + 0.1);
      sources.push(source);
    } catch {
      stop();
      throw new Error("This audio file could not be read. Try an MP3, M4A or WAV file.");
    }
  } else {
    const config = TRACKS[spec.track];
    const started = context.currentTime + 0.04;
    const beat = 60 / config.bpm;
    const steps = Math.ceil((duration / beat) * 2) + 1;
    for (let step = 0; step < steps; step += 1) {
      const start = started + step * beat * 0.5;
      const note = config.notes[step % config.notes.length] ?? 0;
      sources.push(scheduleTone(context, master, noteFrequency(config.root * 2, note), start, beat * 0.42, 0.065, config.wave));
      if (step % 2 === 0) {
        sources.push(scheduleKick(context, master, start));
        const bass = config.bass[(step / 2) % config.bass.length] ?? 0;
        sources.push(scheduleTone(context, master, noteFrequency(config.root / 2, bass), start, beat * 0.72, 0.075, "sine"));
      }
      if (step % 8 === 0) {
        sources.push(scheduleTone(context, master, noteFrequency(config.root, config.notes[step % config.notes.length] ?? 0), start, beat * 3.5, 0.035, "sine"));
      }
    }
  }

  return { stream: streamDestination?.stream ?? null, stop };
}
