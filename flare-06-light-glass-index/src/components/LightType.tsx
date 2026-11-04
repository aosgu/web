import { useEffect, useRef, type CSSProperties, type PointerEvent } from "react";
import { Lens } from "./Glass";

type Cap = { x: number; y: number; w: number; h: number; o: "v" | "h"; g: string; r?: number };

/** F L A R E built only from capsules, in a 1480 × 460 field. */
const caps: Cap[] = [
  { x: 60, y: 60, w: 64, h: 340, o: "v", g: "sun" },
  { x: 60, y: 60, w: 232, h: 64, o: "h", g: "rose" },
  { x: 60, y: 198, w: 190, h: 64, o: "h", g: "prism" },

  { x: 330, y: 60, w: 64, h: 340, o: "v", g: "azure" },
  { x: 330, y: 336, w: 218, h: 64, o: "h", g: "sun" },

  { x: 643, y: 38, w: 64, h: 384, o: "v", g: "prism", r: 20.9 },
  { x: 774, y: 38, w: 64, h: 384, o: "v", g: "rose", r: -20.9 },
  { x: 650, y: 262, w: 180, h: 64, o: "h", g: "gold" },

  { x: 940, y: 60, w: 64, h: 340, o: "v", g: "cobalt" },
  { x: 940, y: 60, w: 212, h: 64, o: "h", g: "ice" },
  { x: 1088, y: 60, w: 64, h: 200, o: "v", g: "azure" },
  { x: 940, y: 196, w: 212, h: 64, o: "h", g: "rose" },
  { x: 1058, y: 198, w: 64, h: 232, o: "v", g: "sun", r: -30.2 },

  { x: 1210, y: 60, w: 64, h: 340, o: "v", g: "prism" },
  { x: 1210, y: 60, w: 240, h: 64, o: "h", g: "gold" },
  { x: 1210, y: 198, w: 200, h: 64, o: "h", g: "sun" },
  { x: 1210, y: 336, w: 240, h: 64, o: "h", g: "rose" },
];

const gradients: Record<string, [number, string][]> = {
  sun: [[0, "#fffbe0"], [0.3, "#ffe600"], [0.62, "#ffb000"], [1, "#ff4a00"]],
  rose: [[0, "#fff0f6"], [0.3, "#ff8ab8"], [0.66, "#ff2d7a"], [1, "#a8003a"]],
  prism: [[0, "#5a3cff"], [0.3, "#ff3fa8"], [0.66, "#ff7a2a"], [1, "#ffd24a"]],
  azure: [[0, "#e6f6ff"], [0.3, "#5fc4ff"], [0.7, "#0055ff"], [1, "#0a1e7a"]],
  cobalt: [[0, "#c9b8ff"], [0.35, "#6a5cff"], [0.7, "#2a2cff"], [1, "#0a0a6a"]],
  ice: [[0, "#ffffff"], [0.3, "#b8f0ff"], [0.66, "#00c8f0"], [1, "#005a70"]],
  gold: [[0, "#ffffff"], [0.3, "#fff4c0"], [0.7, "#ffe600"], [1, "#ffa000"]],
};

const centre = (cap: Cap) => `${cap.x + cap.w / 2} ${cap.y + cap.h / 2}`;

export function LightType() {
  const stageRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const motion = useRef({ tx: 0, ty: 0, x: 0, y: 0, vx: 0, last: -9999, visible: false, w: 1, h: 1, lw: 1, lh: 1 });

  useEffect(() => {
    const stage = stageRef.current;
    const lens = lensRef.current;
    if (!stage || !lens) return;
    const state = motion.current;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;

    const measure = () => {
      state.w = stage.clientWidth;
      state.h = stage.clientHeight;
      state.lw = lens.offsetWidth;
      state.lh = lens.offsetHeight;
    };
    measure();
    state.x = state.tx = state.w * 0.28;
    state.y = state.ty = state.h * 0.5;

    const tick = (time: number) => {
      if (time - state.last > 1600) {
        const k = still ? 0 : time / 1000;
        state.tx = state.w * (0.5 + 0.38 * Math.sin(k * 0.45 - 0.6));
        state.ty = state.h * (0.5 + 0.18 * Math.sin(k * 0.9 + 1));
      }
      const previous = state.x;
      state.x += (state.tx - state.x) * 0.1;
      state.y += (state.ty - state.y) * 0.1;
      state.vx += (state.x - previous - state.vx) * 0.2;
      const tilt = Math.max(-14, Math.min(14, state.vx * 0.6));
      lens.style.transform = `translate3d(${state.x - state.lw / 2}px, ${state.y - state.lh / 2}px, 0) rotate(${tilt}deg)`;
      frame = state.visible ? requestAnimationFrame(tick) : 0;
    };

    const resize = new ResizeObserver(measure);
    resize.observe(stage);
    resize.observe(lens);

    const visibility = new IntersectionObserver(([entry]) => {
      state.visible = entry.isIntersecting;
      if (state.visible && !frame) frame = requestAnimationFrame(tick);
    });
    visibility.observe(stage);

    return () => {
      resize.disconnect();
      visibility.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  const follow = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const state = motion.current;
    state.tx = event.clientX - rect.left;
    state.ty = event.clientY - rect.top;
    state.last = performance.now();
  };

  const renderCaps = (glow: boolean) =>
    caps.map((cap, index) => (
      <g key={index} transform={cap.r ? `rotate(${cap.r} ${centre(cap)})` : undefined}>
        <g className="cap" style={{ "--i": index } as CSSProperties}>
          <rect x={cap.x} y={cap.y} width={cap.w} height={cap.h} rx={32} fill={`url(#t-${cap.g}-${cap.o})`} />
          {!glow && <rect x={cap.x} y={cap.y} width={cap.w} height={cap.h} rx={32} fill={`url(#spec-${cap.o})`} />}
        </g>
      </g>
    ));

  return (
    <section id="type" className="type" data-reveal="">
      <div className="type__head">
        <div>
          <p className="kicker">02 — Typography</p>
          <h2 className="type__title">
            <span className="line"><span>Letters,</span></span>
            <span className="line"><span style={{ "--d": ".1s" } as CSSProperties}><em className="serif-i">cast</em> in light.</span></span>
          </h2>
        </div>
        <p className="type__aside">Every stroke is a capsule. Every capsule throws its own colour onto the wall behind it.</p>
      </div>

      <div ref={stageRef} className="type__stage" onPointerMove={follow}>
        <svg className="type__word" viewBox="0 0 1480 460" role="img" aria-label="The word FLARE built from glowing capsules">
          <defs>
            {Object.entries(gradients).flatMap(([name, stops]) =>
              (["v", "h"] as const).map((orientation) => (
                <linearGradient
                  key={`${name}-${orientation}`}
                  id={`t-${name}-${orientation}`}
                  x1="0"
                  y1="0"
                  x2={orientation === "h" ? "1" : "0"}
                  y2={orientation === "v" ? "1" : "0"}
                >
                  {stops.map(([offset, color]) => <stop key={offset} offset={offset} stopColor={color} />)}
                </linearGradient>
              )),
            )}
            <linearGradient id="spec-v" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#fff" stopOpacity=".75" />
              <stop offset=".1" stopColor="#fff" stopOpacity=".18" />
              <stop offset=".3" stopColor="#fff" stopOpacity="0" />
              <stop offset=".7" stopColor="#000" stopOpacity="0" />
              <stop offset="1" stopColor="#0a0420" stopOpacity=".38" />
            </linearGradient>
            <linearGradient id="spec-h" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity=".75" />
              <stop offset=".12" stopColor="#fff" stopOpacity=".18" />
              <stop offset=".34" stopColor="#fff" stopOpacity="0" />
              <stop offset=".7" stopColor="#000" stopOpacity="0" />
              <stop offset="1" stopColor="#0a0420" stopOpacity=".38" />
            </linearGradient>
            <filter id="type-bloom" x="-20%" y="-40%" width="140%" height="180%">
              <feGaussianBlur stdDeviation="26" />
            </filter>
          </defs>
          <g className="type__glow" filter="url(#type-bloom)">{renderCaps(true)}</g>
          <g>{renderCaps(false)}</g>
        </svg>

        <div ref={lensRef} className="type__lens" aria-hidden="true">
          <Lens rim="warm" className="fill" />
        </div>
      </div>

      <div className="type__foot">
        <span className="kicker">Move across the word — the lens follows and refracts</span>
        <span className="kicker">17 capsules / 7 gradients / 1 pane</span>
      </div>
    </section>
  );
}
