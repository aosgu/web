import { useEffect, useState, type RefObject } from "react";

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

/**
 * Scroll-linked progress of an element (0 → 1).
 * - "enter":  0 when the element's top touches the bottom of the viewport, 1 when its bottom leaves the top.
 * - "pinned": for tall sections containing a sticky stage; 0 at the start of the pin, 1 at the end.
 */
export function useScrollProgress<T extends HTMLElement>(
  ref: RefObject<T | null>,
  mode: "enter" | "pinned" = "enter",
) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const value =
        mode === "pinned"
          ? clamp(-rect.top / Math.max(1, rect.height - vh))
          : clamp((vh - rect.top) / (vh + rect.height));
      setProgress((prev) => (Math.abs(prev - value) < 0.0005 ? prev : value));
    };

    const request = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref, mode]);

  return progress;
}

/** Becomes true once the element has entered the viewport (never flips back). */
export function useInView<T extends HTMLElement>(ref: RefObject<T | null>, threshold = 0.15) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);

  return inView;
}

// Global scroll delta accumulator, used to couple marquee speed to scroll velocity.
let lastScrollY = 0;
let pendingDelta = 0;
if (typeof window !== "undefined") {
  lastScrollY = window.scrollY;
  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      pendingDelta += y - lastScrollY;
      lastScrollY = y;
    },
    { passive: true },
  );
}

/** Returns the scroll distance (px) since the last call. */
export function consumeScrollDelta() {
  const d = pendingDelta;
  pendingDelta = 0;
  return d;
}

/** Seconds since mount, updated every frame. */
export function useLoopTime() {
  const [t, setT] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      setT((now - start) / 1000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return t;
}
