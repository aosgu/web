import { useEffect, useRef, useState } from "react";

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/** Fires once when the element first crosses the threshold. */
export function useInView<T extends Element>(threshold = 0.25) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [inView, threshold]);

  return { ref, inView };
}

/** Animates 0 → 1 (eased) once `active` becomes true. */
export function useProgress(active: boolean, duration = 1400, delay = 0) {
  const [p, setP] = useState(0);

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let start: number | null = null;
    const step = (now: number) => {
      if (start === null) start = now;
      const k = Math.min(1, (now - start) / duration);
      setP(easeOutCubic(k));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    const t = window.setTimeout(() => {
      raf = requestAnimationFrame(step);
    }, delay);
    return () => {
      window.clearTimeout(t);
      cancelAnimationFrame(raf);
    };
  }, [active, duration, delay]);

  return p;
}

/** Smoothly tweens a number toward `target` whenever it changes. */
export function useTween(target: number, duration = 700) {
  const [v, setV] = useState(target);
  const fromRef = useRef(target);

  useEffect(() => {
    const from = fromRef.current;
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const k = Math.min(1, (now - start) / duration);
      const val = from + (target - from) * easeOutCubic(k);
      fromRef.current = val;
      setV(val);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return v;
}
