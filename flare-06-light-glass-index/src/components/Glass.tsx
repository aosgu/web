import type { CSSProperties, ReactNode } from "react";

export type Hue =
  | "sun"
  | "rose"
  | "prism"
  | "azure"
  | "cobalt"
  | "tide"
  | "gold"
  | "ice"
  | "violet"
  | "coral"
  | "volt"
  | "dusk";

export type Rim = "warm" | "cool" | "rose";

/** Lets inline styles carry CSS custom properties without fighting the type checker. */
export const css = (values: Record<string, string | number>) => values as CSSProperties;

type PillProps = {
  hue?: Hue;
  /** Raw gradient (or var()) that overrides the hue preset. */
  paint?: string;
  className?: string;
  style?: CSSProperties;
  bloom?: boolean;
};

/**
 * The luminous capsule from the original artwork: a vertical gradient body with a
 * bright left rim, a shaded right edge, glowing caps, and a blurred copy of itself
 * that spills colour onto whatever surface sits behind it.
 */
export function Pill({ hue, paint, className = "", style, bloom = true }: PillProps) {
  const paintVar = paint ? css({ "--g": paint }) : undefined;
  return (
    <span className={`pill ${hue ? `g-${hue}` : ""} ${className}`} style={{ ...paintVar, ...style }} aria-hidden="true">
      {bloom && <span className="pill__bloom" />}
      <span className="pill__body" />
    </span>
  );
}

type LensProps = {
  rim?: Rim;
  className?: string;
  style?: CSSProperties;
  axis?: boolean;
  children?: ReactNode;
};

/**
 * The frosted glass capsule. It is split down the middle into two halves with
 * different blur and brightness, so the light behind it reads as refracted, and
 * the seam between them is drawn as a hot white line, just like the original.
 */
export function Lens({ rim = "warm", className = "", style, axis = true, children }: LensProps) {
  return (
    <span className={`lens lens--${rim} ${className}`} style={style} aria-hidden="true">
      <span className="lens__half lens__half--l" />
      <span className="lens__half lens__half--r" />
      <span className="lens__rim" />
      {axis && <span className="lens__axis" />}
      {children}
    </span>
  );
}

export function Mark({ className = "" }: { className?: string }) {
  return (
    <svg className={`mark ${className}`} viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id="mk-a" x1="0" x2="0" y1="0" y2="1">
          <stop stopColor="#fffbe0" />
          <stop offset=".45" stopColor="#ffe600" />
          <stop offset="1" stopColor="#ff3d00" />
        </linearGradient>
        <linearGradient id="mk-b" x1="0" x2="0" y1="0" y2="1">
          <stop stopColor="#ffd0e4" />
          <stop offset=".5" stopColor="#ff2d7a" />
          <stop offset="1" stopColor="#6a0a2e" />
        </linearGradient>
        <linearGradient id="mk-c" x1="0" x2="0" y1="0" y2="1">
          <stop stopColor="#d6f2ff" />
          <stop offset=".5" stopColor="#0055ff" />
          <stop offset="1" stopColor="#0a1e7a" />
        </linearGradient>
      </defs>
      <rect x="3" y="5" width="8" height="23" rx="4" fill="url(#mk-a)" />
      <rect x="12" y="3" width="8" height="23" rx="4" fill="url(#mk-b)" />
      <rect x="21" y="6" width="8" height="23" rx="4" fill="url(#mk-c)" />
      <rect x="7.5" y="9" width="9" height="15" rx="4.5" fill="rgba(255,255,255,.18)" stroke="rgba(255,255,255,.9)" strokeWidth=".9" />
      <path d="M12 10.5v12" stroke="#fff" strokeWidth=".8" />
    </svg>
  );
}

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg className={`arrow ${className}`} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
