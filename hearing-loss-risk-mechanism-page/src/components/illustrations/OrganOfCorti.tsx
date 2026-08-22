import { motion } from "framer-motion";

/* ----------------------------------------------------------------
   Shared helpers
----------------------------------------------------------------- */

type IllusProps = { color: string; soft: string };

const mono = {
  fontFamily: "JetBrains Mono, monospace",
};

function Label({
  x,
  y,
  children,
  anchor = "start",
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <text
      x={x}
      y={y}
      fill="#8a8a92"
      fontSize={9}
      style={mono}
      textAnchor={anchor}
      letterSpacing="0.04em"
    >
      {children}
    </text>
  );
}

function Dot({ x, y, c }: { x: number; y: number; c: string }) {
  return <circle cx={x} cy={y} r={2} fill={c} />;
}

/* ----------------------------------------------------------------
   ORGAN OF CORTI — the cellular basis of hearing loss
----------------------------------------------------------------- */
export function OrganOfCorti({ color, soft }: IllusProps) {
  return (
    <svg viewBox="0 0 460 380" className="h-full w-full" fill="none">
      <defs>
        <linearGradient id="cortiMembrane" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.55" />
          <stop offset="1" stopColor={color} stopOpacity="0.1" />
        </linearGradient>
        <radialGradient id="cortiGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={color} stopOpacity="0.18" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="230" cy="180" rx="220" ry="170" fill="url(#cortiGlow)" />

      {/* incoming sound waves */}
      <g stroke={color} strokeWidth="1.4" opacity="0.5">
        {[0, 1, 2, 3].map((i) => (
          <motion.path
            key={i}
            d={`M 20 ${60 + i * 12} q 20 -10 40 0 t 40 0 t 40 0`}
            animate={{ opacity: [0.15, 0.6, 0.15] }}
            transition={{ duration: 2.4, delay: i * 0.3, repeat: Infinity }}
          />
        ))}
      </g>
      <Label x={20} y={48}>incoming sound →</Label>

      {/* Tectorial membrane */}
      <path
        d="M 90 150 Q 230 120 400 165"
        stroke={color}
        strokeWidth="2"
        fill="url(#cortiMembrane)"
      />
      <Label x={300} y={150}>tectorial membrane</Label>

      {/* Inner hair cell + stereocilia */}
      <g>
        {/* stereocilia */}
        <path d="M 168 165 l 4 -22 M 174 165 l 0 -26 M 180 165 l -4 -22" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <path d="M 170 168 C 166 200, 166 210, 170 235 C 174 210, 174 200, 174 168 Z" fill={soft} stroke={color} strokeWidth="1.6" />
        <Line x1={172} y1={235} x2={172} y2={285} color={color} />
        <Dot x={172} y={290} c={color} />
      </g>
      <Label x={172} y={250} anchor="middle">inner hair cell</Label>

      {/* Outer hair cells (3) */}
      {[0, 1, 2].map((i) => {
        const x = 215 + i * 30;
        return (
          <g key={i}>
            <path d={`M ${x - 6} 170 l 8 -14 M ${x} 170 l 0 -18 M ${x + 6} 170 l -8 -14`} stroke={color} strokeWidth="1.8" strokeLinecap="round" />
            <path d={`M ${x - 7} 172 C ${x - 10} 200, ${x - 10} 212, ${x - 5} 235 C ${x + 4} 212, ${x + 4} 200, ${x + 7} 172 Z`} fill={soft} stroke={color} strokeWidth="1.4" />
            <line x1={x} y1={235} x2={x} y2={285} stroke={color} strokeWidth="1" opacity="0.5" />
          </g>
        );
      })}
      <Label x={255} y={255} anchor="middle">outer hair cells</Label>

      {/* Damaged cell (collapsed) for contrast */}
      <g opacity="0.85">
        <path d="M 360 232 C 354 230 352 226 356 222 C 362 220 370 222 372 228 C 374 234 366 236 360 232 Z" fill={soft} stroke="#fb7185" strokeWidth="1.4" strokeDasharray="2 2" />
        <path d="M 360 232 l -2 -10 M 362 232 l 0 -8" stroke="#fb7185" strokeWidth="1.2" opacity="0.6" />
        <Label x={372} y={250}>✕ damaged</Label>
      </g>

      {/* Basilar membrane */}
      <path d="M 60 295 L 400 295" stroke={color} strokeWidth="2.5" />
      <path d="M 60 300 L 400 300" stroke={color} strokeWidth="1" opacity="0.4" />
      <Label x={60} y={318}>basilar membrane</Label>

      {/* auditory nerve fibers bundling */}
      <motion.path
        d="M 172 295 C 172 320, 150 340, 110 350"
        stroke={color}
        strokeWidth="2"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {[0, 1, 2].map((i) => (
        <line key={i} x1={215 + i * 30} y1={295} x2={150 + i * 6} y2={350} stroke={color} strokeWidth="1" opacity="0.4" />
      ))}
      <Label x={150} y={370}>→ cochlear nerve (Type I afferents)</Label>

      {/* ion channel spark */}
      <motion.circle
        cx={172}
        cy={158}
        r={3}
        fill={color}
        animate={{ opacity: [0, 1, 0], scale: [0.5, 1.6, 0.5] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      />
    </svg>
  );
}

function Line({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1" opacity="0.5" />;
}
