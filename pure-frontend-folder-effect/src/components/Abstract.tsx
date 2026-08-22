type Blob = {
  color: string;
  /** css values */
  w: string;
  h: string;
  top: string;
  left: string;
  rotate: number;
  blur: number;
  opacity?: number;
};

export type AbstractVariant = 'aurora' | 'ember' | 'plum' | 'ink';

const PRESETS: Record<AbstractVariant, { base: string; blobs: Blob[] }> = {
  aurora: {
    base: 'linear-gradient(120deg,#e7ebf2 0%,#c8d2e2 35%,#8fa2c0 60%,#3f4a63 100%)',
    blobs: [
      { color: '#1d3f7a', w: '75%', h: '190%', top: '-45%', left: '38%', rotate: 28, blur: 26 },
      { color: '#0b1220', w: '38%', h: '190%', top: '-45%', left: '26%', rotate: 28, blur: 22 },
      { color: '#d64b3c', w: '40%', h: '180%', top: '-40%', left: '-6%', rotate: 28, blur: 26 },
      { color: '#6f8bd6', w: '46%', h: '170%', top: '-35%', left: '62%', rotate: 28, blur: 30, opacity: 0.9 },
      { color: '#f5f7fb', w: '55%', h: '120%', top: '30%', left: '-14%', rotate: 20, blur: 34 },
    ],
  },
  ember: {
    base: 'linear-gradient(115deg,#0d2b33 0%,#123039 30%,#2a1414 62%,#0a0a0c 100%)',
    blobs: [
      { color: '#0f5a63', w: '70%', h: '150%', top: '-30%', left: '-16%', rotate: -18, blur: 26 },
      { color: '#ff3b21', w: '52%', h: '150%', top: '-25%', left: '46%', rotate: -22, blur: 24 },
      { color: '#8c1409', w: '60%', h: '120%', top: '35%', left: '18%', rotate: 12, blur: 30 },
      { color: '#050506', w: '85%', h: '90%', top: '52%', left: '-6%', rotate: 6, blur: 32 },
      { color: '#f06a4b', w: '26%', h: '90%', top: '-10%', left: '32%', rotate: -30, blur: 20, opacity: 0.75 },
    ],
  },
  plum: {
    base: 'linear-gradient(140deg,#3a2b4d 0%,#6b5570 40%,#a6474a 70%,#2a1620 100%)',
    blobs: [
      { color: '#5b3f7a', w: '90%', h: '120%', top: '-20%', left: '-20%', rotate: 14, blur: 24 },
      { color: '#c1443c', w: '70%', h: '130%', top: '-10%', left: '40%', rotate: -10, blur: 26 },
      { color: '#20121c', w: '80%', h: '80%', top: '55%', left: '10%', rotate: 4, blur: 28 },
      { color: '#e2a08c', w: '40%', h: '60%', top: '10%', left: '5%', rotate: 20, blur: 26, opacity: 0.7 },
    ],
  },
  ink: {
    base: 'linear-gradient(130deg,#dfe4ec 0%,#aab4c6 45%,#5b6376 75%,#1b1f28 100%)',
    blobs: [
      { color: '#2c3d63', w: '60%', h: '160%', top: '-30%', left: '45%', rotate: 24, blur: 26 },
      { color: '#ffffff', w: '60%', h: '120%', top: '20%', left: '-18%', rotate: 18, blur: 30 },
      { color: '#b5453b', w: '30%', h: '150%', top: '-25%', left: '10%', rotate: 24, blur: 24, opacity: 0.85 },
    ],
  },
};

export default function Abstract({
  variant,
  className = '',
}: {
  variant: AbstractVariant;
  className?: string;
}) {
  const preset = PRESETS[variant];
  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ background: preset.base }}
    >
      {preset.blobs.map((b, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            width: b.w,
            height: b.h,
            top: b.top,
            left: b.left,
            opacity: b.opacity ?? 1,
            transform: `rotate(${b.rotate}deg)`,
            filter: `blur(${b.blur}px)`,
            background: `radial-gradient(closest-side, ${b.color} 0%, ${b.color}cc 55%, transparent 100%)`,
          }}
        />
      ))}
      {/* subtle grain / sheen */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(200deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 38%, rgba(0,0,0,0.18) 100%)',
        }}
      />
    </div>
  );
}
