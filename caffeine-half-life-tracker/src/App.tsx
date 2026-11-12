import { useCallback, useEffect, useRef, useState } from "react";
import {
  ABSORB,
  Cup,
  DOSE,
  HALF_LIFE,
  cupLevel,
  fmtTime,
  lastCupBy,
  totalLevel,
} from "./caffeine";

// ---- design space (everything is laid out in a 965 × 966 frame) ----
const W = 965;
const H = 966;
const X0 = 112.5;
const X1 = 856;
const T0 = 6;
const SPAN = 24;
const STEP = 7.5;
const NC = 99;
const NR = 52;
const BASE_Y = 703;
const MG_PX = (BASE_Y - 607.5) / 50;
const AXIS_Y = 716;
const MARK_Y = 745;
const BG = "#0e0e0e";
const BLUE: [number, number, number] = [72, 136, 246];
const FONT = `"JetBrains Mono", "SF Mono", ui-monospace, Menlo, monospace`;

const xOf = (t: number) => X0 + ((t - T0) / SPAN) * (X1 - X0);
const tOf = (x: number) => T0 + ((x - X0) / (X1 - X0)) * SPAN;
const colX = (i: number) => X0 + STEP / 2 + i * STEP;
const rowY = (j: number) => 700 - j * STEP;
const rowMg = (j: number) => (BASE_Y - rowY(j)) / MG_PX;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const snap = (t: number) => Math.round(t * 60) / 60;

type Drag =
  | { kind: "cup"; id: number; off: number; moved: boolean }
  | { kind: "bed"; off: number }
  | null;

let nextId = 4;

function peakAfter(cups: Cup[], t: number) {
  let p = 0;
  for (let k = 0; k <= 24; k++) p = Math.max(p, totalLevel(cups, t + (k / 24) * 2));
  return p;
}

function draw(
  ctx: CanvasRenderingContext2D,
  cups: Cup[],
  bed: number,
  activeId: number | null,
  reveal: number
) {
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);

  const sorted = [...cups].sort((a, b) => a.t - b.t);
  const activeIdx = sorted.findIndex((c) => c.id === activeId);
  const revealX = X0 + (X1 - X0 + 20) * reveal;

  // ring columns: column nearest each cup's drink time
  const ringCol = new Map<number, number>();
  sorted.forEach((c, k) => {
    const ci = Math.round((xOf(c.t) - X0 - STEP / 2) / STEP);
    if (ci >= 0 && ci < NC) ringCol.set(ci, k);
  });

  // ---- 50 mg dashed reference ----
  ctx.save();
  ctx.strokeStyle = "#353535";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(X0, 607.5);
  ctx.lineTo(X1, 607.5);
  ctx.stroke();
  ctx.restore();

  // ---- guide lines from markers up to the peak they cause ----
  sorted.forEach((c, k) => {
    const x = xOf(c.t);
    if (x > revealX) return;
    const peak = peakAfter(sorted, c.t);
    const top = BASE_Y - peak * MG_PX;
    const active = k === activeIdx;
    ctx.fillStyle = active ? `rgba(${BLUE.join(",")},0.95)` : "rgba(140,140,140,0.55)";
    for (let y = MARK_Y - 10; y >= top; y -= 3.6) {
      ctx.beginPath();
      ctx.arc(x, y, active ? 0.8 : 0.7, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // ---- dot matrix ----
  const levels: number[] = new Array(sorted.length);
  const ages: number[] = new Array(sorted.length);
  for (let i = 0; i < NC; i++) {
    const x = colX(i);
    const t = tOf(x);
    let level = 0;
    for (let k = 0; k < sorted.length; k++) {
      levels[k] = cupLevel(sorted[k], t);
      ages[k] = t - sorted[k].t;
      level += levels[k];
    }
    const revealed = x <= revealX;
    const ringK = ringCol.get(i);

    let k = 0;
    let cum = sorted.length ? levels[0] : 0;
    for (let j = 0; j < NR; j++) {
      const y = rowY(j);
      const m = rowMg(j);

      if (revealed && m <= level && sorted.length) {
        while (m > cum && k < sorted.length - 1) {
          k++;
          cum += levels[k];
        }

        // drink-time column: prior caffeine drawn as rings
        if (ringK !== undefined && k < ringK) {
          if (ringK === activeIdx) {
            ctx.fillStyle = "#d9d9d9";
            ctx.beginPath();
            ctx.arc(x, y, 2.6, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.strokeStyle = "#cfcfcf";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.stroke();
          }
          continue;
        }

        const age = ages[k];
        const post = Math.max(0, age - ABSORB);
        const sizeF = age <= ABSORB ? 1 : Math.exp(-post / 0.32);
        const colorF = age <= ABSORB ? 1 : Math.exp(-post / 1.1);
        const g = 0.24 + 0.32 * Math.exp(-post / 6);
        const gv = g * 255;
        const r = 0.95 + (g / 0.56) * 0.6 + 1.55 * sizeF;

        let cr: number, cg: number, cb: number;
        if (k === activeIdx) {
          cr = gv + (BLUE[0] - gv) * colorF;
          cg = gv + (BLUE[1] - gv) * colorF;
          cb = gv + (BLUE[2] - gv) * colorF;
        } else {
          const v = gv + (232 - gv) * sizeF;
          cr = cg = cb = v;
        }
        ctx.fillStyle = `rgb(${cr | 0},${cg | 0},${cb | 0})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // faint background grid with a glow above the curve
        const glow = revealed && sorted.length ? Math.exp(-(m - level) / 32) : 0;
        const base = 0.045 + 0.03 * (1 - j / NR);
        const a = base + 0.2 * glow;
        ctx.fillStyle = `rgba(255,255,255,${a.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(x, y, 0.6 + 0.5 * glow, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // ---- axis ----
  ctx.strokeStyle = "#3a3a3a";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(X0, AXIS_Y);
  ctx.lineTo(X1, AXIS_Y);
  for (let h = 0; h <= 24; h += 3) {
    const x = xOf(T0 + h);
    ctx.moveTo(x, AXIS_Y);
    ctx.lineTo(x, AXIS_Y + 7);
  }
  ctx.stroke();

  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.font = `400 17px ${FONT}`;
  ctx.fillStyle = "#474747";
  ["06", "12", "18", "00", "06"].forEach((l, n) => ctx.fillText(l, xOf(T0 + n * 6), 782));

  // 50 label
  ctx.textAlign = "left";
  ctx.font = `400 18px ${FONT}`;
  ctx.fillStyle = "#8a8a8a";
  ctx.fillText("50", 866, 607.5);

  // ---- bed line ----
  const bx = xOf(bed);
  ctx.strokeStyle = "#8c8c8c";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(bx, 308);
  ctx.lineTo(bx, 708);
  ctx.stroke();

  const bedMg = Math.round(totalLevel(sorted, bed));
  const l1 = `BED ${fmtTime(bed)}`;
  const l2 = `${bedMg} MG STILL IN YOU`;
  ctx.font = `400 18px ${FONT}`;
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#ececec";
  const tw = Math.max(ctx.measureText(l1).width, ctx.measureText(l2).width);
  const flip = bx + 11 + tw > W - 12;
  ctx.textAlign = flip ? "right" : "left";
  const lx = flip ? bx - 11 : bx + 11;
  ctx.fillText(l1, lx, 284);
  ctx.fillText(l2, lx, 306);

  // ---- markers ----
  sorted.forEach((c, k) => {
    const x = xOf(c.t);
    const active = k === activeIdx;
    ctx.fillStyle = active ? `rgb(${BLUE.join(",")})` : "#dcdcdc";
    ctx.beginPath();
    ctx.arc(x, MARK_Y, active ? 9 : 7.5, 0, Math.PI * 2);
    ctx.fill();
  });
  if (activeIdx >= 0) {
    const c = sorted[activeIdx];
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `400 18px ${FONT}`;
    ctx.fillStyle = `rgb(${BLUE.join(",")})`;
    ctx.fillText(fmtTime(c.t), xOf(c.t), 764);
  }

  // ---- header / footer ----
  const total = sorted.reduce((s, c) => s + c.mg, 0);
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.font = `500 20px ${FONT}`;
  ctx.fillStyle = "#ececec";
  ctx.fillText("CAFFEINE", 24, 34);
  ctx.font = `400 18px ${FONT}`;
  ctx.fillStyle = "#8a8a8a";
  ctx.fillText(
    `${sorted.length} CUP${sorted.length === 1 ? "" : "S"} · ${total} MG · HALF-LIFE ${HALF_LIFE}H`,
    24,
    61
  );

  const by = lastCupBy(sorted, bed);
  ctx.font = `400 18px ${FONT}`;
  ctx.fillStyle = "#ececec";
  ctx.fillText(by === null ? "NO MORE CUPS TODAY" : `LAST CUP BY ${fmtTime(by)}`, 24, 943);

  ctx.textAlign = "right";
  ctx.font = `400 10.5px ${FONT}`;
  ctx.fillStyle = "#3a3a3a";
  ctx.fillText("DRAG CUPS · CLICK BELOW AXIS TO ADD · DOUBLE-CLICK TO REMOVE", W - 24, 943);
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState(() => Math.min(window.innerWidth, window.innerHeight));
  const [cups, setCups] = useState<Cup[]>([
    { id: 1, t: 8, mg: DOSE },
    { id: 2, t: 11, mg: DOSE },
    { id: 3, t: 16 + 3 / 60, mg: DOSE },
  ]);
  const [bed, setBed] = useState(23);
  const [activeId, setActiveId] = useState<number | null>(3);
  const [reveal, setReveal] = useState(0);
  const [fontTick, setFontTick] = useState(0);
  const [cursor, setCursor] = useState("default");
  const drag = useRef<Drag>(null);

  useEffect(() => {
    const onResize = () => setSize(Math.min(window.innerWidth, window.innerHeight));
    window.addEventListener("resize", onResize);
    document.fonts?.ready.then(() => setFontTick((n) => n + 1));
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // intro sweep
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1500);
      setReveal(1 - Math.pow(1 - p, 3));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const dpr = window.devicePixelRatio || 1;
    const px = Math.round(size * dpr);
    if (cv.width !== px) {
      cv.width = px;
      cv.height = Math.round(size * (H / W) * dpr);
    }
    const ctx = cv.getContext("2d")!;
    const s = (size / W) * dpr;
    ctx.setTransform(s, 0, 0, s, 0, 0);
    draw(ctx, cups, bed, activeId, reveal);
  }, [size, cups, bed, activeId, reveal, fontTick]);

  const toDesign = (e: React.PointerEvent | React.MouseEvent) => {
    const r = canvasRef.current!.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H };
  };

  const hitCup = useCallback(
    (x: number, y: number): Cup | null => {
      let best: Cup | null = null;
      let bestD = Infinity;
      for (const c of cups) {
        const dx = Math.abs(x - xOf(c.t));
        const inMarker = y > MARK_Y - 16 && y < MARK_Y + 16 && dx < 13;
        const top = BASE_Y - peakAfter(cups, c.t) * MG_PX;
        const inGuide = y >= top - 6 && y <= MARK_Y && dx < 6;
        if ((inMarker || inGuide) && dx < bestD) {
          best = c;
          bestD = dx;
        }
      }
      return best;
    },
    [cups]
  );

  const hitBed = (x: number, y: number) => Math.abs(x - xOf(bed)) < 8 && y > 262 && y < 712;
  const inStrip = (x: number, y: number) =>
    y > AXIS_Y + 8 && y < MARK_Y + 22 && x >= X0 - 4 && x <= X1 + 4;

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const { x, y } = toDesign(e);
    const c = hitCup(x, y);
    if (c) {
      drag.current = { kind: "cup", id: c.id, off: x - xOf(c.t), moved: false };
      setActiveId(c.id);
    } else if (hitBed(x, y)) {
      drag.current = { kind: "bed", off: x - xOf(bed) };
    } else if (inStrip(x, y) && cups.length < 8) {
      const id = nextId++;
      const t = snap(clamp(tOf(x), T0, T0 + SPAN));
      setCups((cs) => [...cs, { id, t, mg: DOSE }]);
      setActiveId(id);
      drag.current = { kind: "cup", id, off: 0, moved: false };
    } else return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setCursor(drag.current?.kind === "bed" ? "ew-resize" : "grabbing");
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const { x, y } = toDesign(e);
    const d = drag.current;
    if (d?.kind === "cup") {
      d.moved = true;
      const t = snap(clamp(tOf(x - d.off), T0, T0 + SPAN));
      setCups((cs) => cs.map((c) => (c.id === d.id ? { ...c, t } : c)));
      return;
    }
    if (d?.kind === "bed") {
      setBed(snap(clamp(tOf(x - d.off), T0 + 10, T0 + SPAN)));
      return;
    }
    const c = hitCup(x, y);
    if (c) {
      setCursor("grab");
      setActiveId(c.id);
    } else if (hitBed(x, y)) setCursor("ew-resize");
    else if (inStrip(x, y)) setCursor("copy");
    else setCursor("default");
  };

  const endDrag = () => {
    drag.current = null;
    setCursor("default");
  };

  const onDoubleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = toDesign(e);
    const c = hitCup(x, y);
    if (!c) return;
    setCups((cs) => {
      const rest = cs.filter((k) => k.id !== c.id);
      const last = [...rest].sort((a, b) => b.t - a.t)[0];
      setActiveId(last ? last.id : null);
      return rest;
    });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (activeId == null) return;
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        const dt = (e.shiftKey ? 30 : 5) / 60;
        const sign = e.key === "ArrowLeft" ? -1 : 1;
        setCups((cs) =>
          cs.map((c) => (c.id === activeId ? { ...c, t: snap(clamp(c.t + sign * dt, T0, T0 + SPAN)) } : c))
        );
      } else if (e.key === "Delete" || e.key === "Backspace") {
        setCups((cs) => cs.filter((c) => c.id !== activeId));
        setActiveId(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeId]);

  return (
    <div className="flex h-full w-full items-center justify-center bg-[#0e0e0e] select-none">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Caffeine level over 24 hours"
        style={{ width: size, height: size * (H / W), cursor, touchAction: "none" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={() => !drag.current && setCursor("default")}
        onDoubleClick={onDoubleClick}
      />
    </div>
  );
}
