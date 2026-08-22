import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
  g: number;
  kind: "gold" | "cyan" | "ember";
}

export default function ParticleField({ density = 70 }: { density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const particles: Particle[] = [];
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      w = canvas.width = window.innerWidth * devicePixelRatio;
      h = canvas.height = window.innerHeight * devicePixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };

    const spawn = (n: number) => {
      for (let i = 0; i < n; i++) {
        const roll = Math.random();
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.15,
          vy: -0.18 - Math.random() * 0.45,
          r: (Math.random() * 1.6 + 0.4) * devicePixelRatio,
          a: 0.15 + Math.random() * 0.55,
          g: 0.3 + Math.random() * 0.7,
          kind: roll > 0.82 ? "cyan" : roll > 0.7 ? "ember" : "gold",
        });
      }
    };

    const color = (p: Particle) => {
      if (p.kind === "cyan") return `rgba(94,234,212,${p.a})`;
      if (p.kind === "ember") return `rgba(232,93,4,${p.a})`;
      return `rgba(240,215,140,${p.a})`;
    };

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 18000 * devicePixelRatio) {
          p.vx += dx * 0.00004;
          p.vy += dy * 0.00002;
        }
        p.x += p.vx * p.g;
        p.y += p.vy * p.g;
        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        ctx.beginPath();
        ctx.fillStyle = color(p);
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX * devicePixelRatio;
      mouse.y = e.clientY * devicePixelRatio;
    };

    resize();
    spawn(density);
    tick();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, [density]);

  return <canvas ref={ref} className="pointer-events-none absolute inset-0 z-[2]" />;
}
