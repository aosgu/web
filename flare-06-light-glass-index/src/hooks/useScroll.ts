import { useEffect, useRef, type RefObject } from "react";

export type ProgressMode = "pin" | "pass" | "exit" | "enter";

export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Reports a 0–1 progress value for a section, throttled to one measurement per frame.
 * pin   – progress across a tall section whose child is position: sticky
 * pass  – progress from the section entering the bottom to leaving the top
 * exit  – progress while the section scrolls out of the top of the viewport
 * enter – progress while the section's top travels from viewport bottom to top
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  onProgress: (progress: number) => void,
  mode: ProgressMode = "pin",
) {
  const callback = useRef(onProgress);
  callback.current = onProgress;

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const element = ref.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const viewport = window.innerHeight;
      let progress = 0;

      if (mode === "pin") {
        const span = rect.height - viewport;
        progress = span > 0 ? -rect.top / span : 0;
      } else if (mode === "pass") {
        progress = (viewport - rect.top) / (viewport + rect.height);
      } else if (mode === "exit") {
        progress = -rect.top / rect.height;
      } else {
        progress = 1 - rect.top / viewport;
      }

      callback.current(clamp(progress));
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
      cancelAnimationFrame(frame);
    };
  }, [ref, mode]);
}

/** Adds `.in` to every [data-reveal] element the first time it enters the viewport. */
export function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -6% 0px" },
    );

    document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}
