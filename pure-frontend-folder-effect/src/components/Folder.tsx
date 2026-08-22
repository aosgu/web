import { useState, type ReactNode } from 'react';
import Abstract, { type AbstractVariant } from './Abstract';
import { folderFlapPath } from './folderPath';

export type FolderTheme = 'glass' | 'dark' | 'white';

const THEMES: Record<
  FolderTheme,
  {
    front: string;
    stroke: string;
    innerGlow: string;
    title: string;
    subtitle: string;
  }
> = {
  glass: {
    front:
      'linear-gradient(168deg, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.66) 45%, rgba(255,255,255,0.93) 100%)',
    stroke: 'rgba(255,255,255,0.85)',
    innerGlow:
      'linear-gradient(180deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0) 22%, rgba(255,255,255,0) 82%, rgba(255,255,255,0.6) 100%)',
    title: 'text-neutral-800',
    subtitle: 'text-neutral-500',
  },
  dark: {
    front:
      'linear-gradient(172deg, rgba(22,22,26,0.58) 0%, rgba(12,12,14,0.82) 40%, rgba(4,4,6,0.94) 100%)',
    stroke: 'rgba(255,255,255,0.14)',
    innerGlow:
      'linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 20%, rgba(255,255,255,0) 85%, rgba(255,255,255,0.08) 100%)',
    title: 'text-white',
    subtitle: 'text-white/70',
  },
  white: {
    front:
      'linear-gradient(172deg, rgba(255,255,255,0.80) 0%, rgba(250,250,252,0.94) 45%, rgba(240,241,244,0.98) 100%)',
    stroke: 'rgba(255,255,255,0.95)',
    innerGlow:
      'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 18%, rgba(255,255,255,0) 80%, rgba(255,255,255,0.85) 100%)',
    title: 'text-neutral-800',
    subtitle: 'text-neutral-500',
  },
};

export type FolderProps = {
  width?: number;
  height?: number;
  /** how far below the card top the front flap tab starts */
  frontTop?: number;
  /** width of the raised tab on the flap */
  tabWidth?: number;
  /** vertical drop from the tab top to the right-hand top edge */
  step?: number;
  radius?: number;
  theme?: FolderTheme;
  variant?: AbstractVariant;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  /** content that peeks out from inside the folder (sheets of paper, etc.) */
  peek?: ReactNode;
  align?: 'left' | 'right';
  forceOpen?: boolean;
  onAction?: () => void;
};

export default function Folder({
  width = 380,
  height = 280,
  frontTop = 48,
  tabWidth = 178,
  step = 52,
  radius = 22,
  theme = 'glass',
  variant = 'aurora',
  title = 'My Files',
  subtitle,
  action,
  peek,
  align = 'left',
  forceOpen = false,
}: FolderProps) {
  const [hover, setHover] = useState(false);
  const open = hover || forceOpen;
  const t = THEMES[theme];

  const flapH = height - frontTop;
  const path = folderFlapPath(width, flapH, tabWidth, step, radius, Math.min(radius, 16));

  return (
    <div
      className="relative select-none"
      style={{ width, height }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* ambient drop shadow (kept separate so clip-path doesn't cut it) */}
      <div
        className="absolute rounded-[40px] transition-all duration-500 ease-out"
        style={{
          left: 14,
          right: 14,
          top: height * 0.3,
          bottom: open ? -26 : -14,
          background: 'rgba(15,17,22,0.35)',
          filter: `blur(${open ? 30 : 22}px)`,
          opacity: open ? 0.55 : 0.42,
        }}
      />

      {/* back sheet with the abstract artwork */}
      <div
        className="absolute inset-x-0 top-0 overflow-hidden transition-transform duration-500 ease-out"
        style={{
          height: height - 26,
          borderRadius: radius,
          transform: open ? 'translateY(-10px)' : 'translateY(0)',
          boxShadow: '0 10px 24px -12px rgba(10,12,18,0.55)',
        }}
      >
        <Abstract variant={variant} />
      </div>

      {/* items peeking out of the folder */}
      {peek && (
        <div
          className="absolute inset-0 transition-transform duration-500 ease-out"
          style={{ transform: open ? 'translateY(-26px)' : 'translateY(0)' }}
        >
          {peek}
        </div>
      )}

      {/* front flap */}
      <div
        className="absolute inset-x-0 transition-transform duration-500 ease-out"
        style={{
          top: frontTop,
          height: flapH,
          transform: open ? 'translateY(12px)' : 'translateY(0)',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            clipPath: `path('${path}')`,
            WebkitClipPath: `path('${path}')`,
            background: t.front,
            backdropFilter: 'blur(22px) saturate(150%)',
            WebkitBackdropFilter: 'blur(22px) saturate(150%)',
          }}
        >
          <div className="absolute inset-0" style={{ background: t.innerGlow }} />
        </div>

        {/* crisp 1px outline that follows the folder silhouette */}
        <svg
          className="pointer-events-none absolute inset-0"
          width={width}
          height={flapH}
          viewBox={`0 0 ${width} ${flapH}`}
          fill="none"
        >
          <path d={path} stroke={t.stroke} strokeWidth={1.25} />
        </svg>

        {/* labels + action */}
        <div
          className={`absolute inset-x-0 bottom-0 flex items-end gap-4 ${
            align === 'right' ? 'flex-row-reverse' : 'justify-between'
          }`}
          style={{ padding: '0 22px 22px' }}
        >
          <div className={`pb-1 ${align === 'right' ? 'text-right' : ''}`}>
            <div className={`text-[17px] font-medium tracking-tight ${t.title}`}>{title}</div>
            {subtitle && (
              <div className={`mt-1 font-mono text-[13px] tracking-tight ${t.subtitle}`}>
                {subtitle}
              </div>
            )}
          </div>
          {action}
        </div>
      </div>
    </div>
  );
}
