// Tiny Web Audio synth: every sound is generated in code, no audio files.
// Audio only starts after the first user gesture (browser autoplay policy).

type ToneOpts = {
  freq: number;
  to?: number;
  type?: OscillatorType;
  dur?: number;
  vol?: number;
  delay?: number;
};

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noiseBuf: AudioBuffer | null = null;
let enabled = true;
let unlocked = false;

function ensureCtx(): AudioContext | null {
  if (!ctx) {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.3;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function live(): { c: AudioContext; out: GainNode } | null {
  if (!enabled || !unlocked) return null;
  const c = ensureCtx();
  return c && master ? { c, out: master } : null;
}

function unlock() {
  unlocked = true;
  ensureCtx();
  window.removeEventListener("pointerdown", unlock);
  window.removeEventListener("keydown", unlock);
}

if (typeof window !== "undefined") {
  window.addEventListener("pointerdown", unlock);
  window.addEventListener("keydown", unlock);
}

export function setSound(on: boolean) {
  enabled = on;
}

function tone({ freq, to, type = "sine", dur = 0.12, vol = 0.15, delay = 0 }: ToneOpts) {
  const l = live();
  if (!l) return;
  const { c, out } = l;
  const t0 = c.currentTime + delay;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(out);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

function sweep({ dur = 0.6, from = 300, to = 2800, vol = 0.12, q = 1.2 }) {
  const l = live();
  if (!l) return;
  const { c, out } = l;
  if (!noiseBuf) {
    noiseBuf = c.createBuffer(1, c.sampleRate, c.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const t0 = c.currentTime;
  const src = c.createBufferSource();
  src.buffer = noiseBuf;
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.Q.value = q;
  bp.frequency.setValueAtTime(from, t0);
  bp.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + dur * 0.35);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(bp).connect(g).connect(out);
  src.start(t0);
  src.stop(t0 + dur);
}

export const sfx = {
  /** Soft blip; p in 0..1 sets the pitch. */
  hover(p = 0.5) {
    tone({ freq: 520 + p * 760, type: "sine", dur: 0.09, vol: 0.05 });
  },
  /** Two-note pluck for selections and mode changes. */
  select() {
    tone({ freq: 620, to: 940, type: "triangle", dur: 0.14, vol: 0.12 });
    tone({ freq: 1240, type: "sine", dur: 0.18, vol: 0.04, delay: 0.05 });
  },
  /** Mechanical tick for toggles. */
  tick() {
    tone({ freq: 1500, to: 700, type: "square", dur: 0.035, vol: 0.02 });
  },
  /** Filtered noise sweep when a section enters the viewport. */
  whoosh() {
    sweep({ dur: 0.7, from: 260, to: 2600, vol: 0.1 });
  },
  /** Ascending arpeggio for the most important reveal. */
  chime() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
      tone({ freq: f, type: "sine", dur: 0.7, vol: 0.07, delay: i * 0.08 })
    );
  },
  /** Falling tone for "low" states. */
  low() {
    tone({ freq: 360, to: 150, type: "triangle", dur: 0.4, vol: 0.09 });
  },
};
