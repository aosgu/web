import { useRef } from "react";
import type { ReactNode, RefObject } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  type MotionValue,
} from "framer-motion";

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smooth = (t: number) => {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
};

/** Scroll progress (0 → 1) across a tall section, pinned while it scrolls. */
export function useSectionProgress(
  ref: RefObject<HTMLElement | null>,
): MotionValue<number> {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  return useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
}

/** A 0→1→0 envelope over a window of the section progress. Hook-safe per component. */
export function useBump(
  progress: MotionValue<number>,
  start: number,
  end: number,
  fade = 0.05,
): MotionValue<number> {
  return useTransform(progress, (v) => {
    if (v <= start || v >= end) return 0;
    return Math.min(1, (v - start) / fade, (end - v) / fade);
  });
}

/** Normalise a window of the section progress into its own 0 → 1 ramp. */
export function useRamp(
  progress: MotionValue<number>,
  start: number,
  end: number,
): MotionValue<number> {
  return useTransform(progress, (p) => clamp01((p - start) / Math.max(0.0001, end - start)));
}

export function useRange(
  progress: MotionValue<number>,
  from: number,
  to: number,
  start = 0,
  end = 1,
): MotionValue<number> {
  const r = useRamp(progress, start, end);
  return useTransform(r, (v) => lerp(from, to, v));
}

/**
 * Full-bleed pinned scene. `children` receives the section's scroll progress so
 * every layer inside can be driven by the scrub position.
 */
export function StickyScene({
  id,
  vh = 300,
  className = "",
  children,
}: {
  id?: string;
  vh?: number;
  className?: string;
  children: (progress: MotionValue<number>) => ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const progress = useSectionProgress(ref);
  return (
    <section id={id} ref={ref} style={{ height: `${vh}vh` }} className={`relative ${className}`}>
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">{children(progress)}</div>
    </section>
  );
}

/** Renders a motion value as text without re-rendering on every frame. */
export function Count({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
}: {
  value: MotionValue<number>;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}) {
  const text = useTransform(value, (v) => {
    const n = decimals
      ? v.toFixed(decimals)
      : Math.round(v).toLocaleString("en-US");
    return `${prefix}${n}${suffix}`;
  });
  return <motion.span>{text}</motion.span>;
}

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className = "",
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.35 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function InViewFlag({
  children,
  amount = 0.4,
}: {
  children: (inView: boolean) => ReactNode;
  amount?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount, once: false });
  return <div ref={ref}>{children(inView)}</div>;
}
