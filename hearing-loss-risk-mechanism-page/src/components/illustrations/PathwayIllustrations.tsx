import { motion } from "framer-motion";

type IllusProps = { color: string; soft: string };
const mono = { fontFamily: "JetBrains Mono, monospace" };

function Label({
  x,
  y,
  children,
  anchor = "start",
  color = "#8a8a92",
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  anchor?: "start" | "middle" | "end";
  color?: string;
}) {
  return (
    <text x={x} y={y} fill={color} fontSize={8.5} style={mono} textAnchor={anchor} letterSpacing="0.04em">
      {children}
    </text>
  );
}

function GlowDefs({ id, color }: { id: string; color: string }) {
  return (
    <defs>
      <radialGradient id={`${id}-g`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor={color} stopOpacity="0.16" />
        <stop offset="1" stopColor={color} stopOpacity="0" />
      </radialGradient>
      <filter id={`${id}-blur`} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" />
      </filter>
    </defs>
  );
}

/* ============================== COGNITION ============================== */
/* Lateral brain: auditory cortex overloaded, hippocampus shrinking */
export function BrainIllustration({ color, soft }: IllusProps) {
  return (
    <svg viewBox="0 0 460 380" className="h-full w-full" fill="none">
      <GlowDefs id="brain" color={color} />
      <ellipse cx="230" cy="180" rx="200" ry="160" fill="url(#brain-g)" />

      {/* Brain outline (lateral, left-facing) */}
      <path
        d="M 360 150
           C 380 120 360 80 320 75
           C 310 50 270 45 250 60
           C 235 40 190 45 180 70
           C 140 65 105 95 110 130
           C 85 145 80 195 110 215
           C 100 250 135 285 175 280
           C 195 305 245 305 265 285
           C 320 295 360 255 350 220
           C 375 200 375 170 360 150 Z"
        stroke={color}
        strokeWidth="2"
        fill={soft}
      />
      {/* gyri / sulci */}
      <g stroke={color} strokeWidth="1" opacity="0.45" fill="none">
        <path d="M 150 120 q 40 -10 70 0" />
        <path d="M 135 160 q 50 -12 90 0" />
        <path d="M 140 200 q 55 -10 95 0" />
        <path d="M 170 240 q 40 -8 70 0" />
        <path d="M 250 90 q 30 30 10 60" />
        <path d="M 300 110 q 25 25 5 55" />
      </g>

      {/* Highlighted auditory cortex (temporal) */}
      <motion.path
        d="M 120 200 C 120 175 160 170 190 180 C 220 190 230 220 205 235 C 175 250 125 235 120 200 Z"
        fill={color}
        fillOpacity="0.25"
        stroke={color}
        strokeWidth="1.5"
        animate={{ fillOpacity: [0.15, 0.4, 0.15] }}
        transition={{ duration: 2.4, repeat: Infinity }}
      />
      <Label x={150} y={300}>auditory cortex</Label>

      {/* Hippocampus (memory) — shrinking */}
      <motion.ellipse
        cx={300}
        cy={205}
        rx={18}
        ry={12}
        fill="none"
        stroke="#fb7185"
        strokeWidth="1.5"
        strokeDasharray="2 2"
        animate={{ rx: [18, 14, 18], ry: [12, 9, 12] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <Label x={300} y={235} anchor="middle" color="#fb7185">hippocampus ↓</Label>

      {/* Resource reallocation arrow: from memory region to perception */}
      <motion.g
        stroke={color}
        strokeWidth="1.5"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <path d="M 280 200 C 250 195 220 195 200 200" fill="none" markerEnd="url(#brainArrow)" />
      </motion.g>
      <defs>
        <marker id="brainArrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={color} />
        </marker>
      </defs>
      <Label x={232} y={178}>listening effort</Label>

      {/* neural sparks in auditory cortex */}
      {[0, 1, 2, 3].map((i) => (
        <motion.circle
          key={i}
          cx={140 + i * 16}
          cy={190 + (i % 2) * 22}
          r={1.6}
          fill={color}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.4, delay: i * 0.35, repeat: Infinity }}
        />
      ))}
    </svg>
  );
}

/* ============================== DEPRESSION / LIMBIC ============================== */
/* HPA axis: Hypothalamus → Pituitary → Adrenal → Cortisol */
export function LimbicIllustration({ color, soft }: IllusProps) {
  const nodes = [
    { x: 90, y: 150, label: "hypothalamus" },
    { x: 230, y: 80, label: "pituitary" },
    { x: 370, y: 150, label: "adrenal" },
  ];
  return (
    <svg viewBox="0 0 460 380" className="h-full w-full" fill="none">
      <GlowDefs id="limbic" color={color} />
      <ellipse cx="230" cy="180" rx="200" ry="150" fill="url(#limbic-g)" />

      {/* limbic brain silhouette (medial) */}
      <path
        d="M 80 150 C 70 110 110 70 170 70 C 230 55 320 70 360 110 C 395 145 390 210 350 240 C 300 275 200 275 150 255 C 105 235 85 195 80 150 Z"
        stroke={color}
        strokeWidth="2"
        fill={soft}
        opacity="0.6"
      />
      {/* amygdala */}
      <ellipse cx={150} cy={175} rx={14} ry={10} fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.4" />
      <Label x={150} y={200} anchor="middle">amygdala</Label>

      {/* HPA axis nodes + flowing signal */}
      {nodes.map((n, i) => (
        <g key={n.label}>
          <motion.circle
            cx={n.x}
            cy={n.y}
            r={20}
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            animate={{ strokeOpacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
          />
          <circle cx={n.x} cy={n.y} r={10} fill={color} fillOpacity="0.25" stroke={color} strokeWidth="1" />
          <Label x={n.x} y={n.y + 34} anchor="middle">
            {n.label}
          </Label>
        </g>
      ))}

      {/* connecting arrows */}
      <path d="M 108 142 L 212 92" stroke={color} strokeWidth="1.4" className="animate-flow" markerEnd="url(#hpaArrow)" />
      <path d="M 248 92 L 352 142" stroke={color} strokeWidth="1.4" className="animate-flow" markerEnd="url(#hpaArrow)" />
      <defs>
        <marker id="hpaArrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={color} />
        </marker>
      </defs>

      {/* cortisol output */}
      <motion.path
        d="M 370 170 L 370 250"
        stroke={color}
        strokeWidth="1.6"
        markerEnd="url(#hpaArrow)"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      />
      <rect x={330} y={255} width={80} height={26} rx={6} fill={soft} stroke={color} strokeWidth="1.4" />
      <Label x={370} y={272} anchor="middle" color="#e7e7ea">↑ cortisol</Label>

      {/* serotonin / dopamine low indicator */}
      <g opacity="0.8">
        <circle cx={150} cy={175} r={3} fill="#fb7185" opacity="0.6" />
        <Label x={92} y={150} color="#fb7185">5-HT / DA ↓</Label>
      </g>
    </svg>
  );
}

/* ============================== VESTIBULAR ============================== */
/* Cochlea + 3 semicircular canals sharing one labyrinth */
export function VestibularIllustration({ color, soft }: IllusProps) {
  return (
    <svg viewBox="0 0 460 400" className="h-full w-full" fill="none">
      <GlowDefs id="vest" color={color} />
      <ellipse cx="230" cy="180" rx="200" ry="160" fill="url(#vest-g)" />

      {/* 3 semicircular canals */}
      <g stroke={color} strokeWidth="3" fill="none">
        <path d="M 200 150 C 150 70 290 70 250 150" />
        <path d="M 200 150 C 110 100 330 100 250 150" />
        <path d="M 205 150 C 140 120 300 120 248 150" />
      </g>
      {/* ampullae */}
      {[150, 110, 140].map((y, i) => (
        <circle key={i} cx={i === 0 ? 200 : i === 1 ? 200 : 250} cy={y} r={4} fill={color} />
      ))}
      <Label x={180} y={56}>semicircular canals</Label>

      {/* vestibule */}
      <ellipse cx={225} cy={158} rx={18} ry={12} fill={soft} stroke={color} strokeWidth="1.8" />
      <Label x={262} y={150}>vestibule</Label>

      {/* cochlea spiral */}
      <g transform="translate(225 165)">
        <motion.path
          d="M 0 0
             a 38 38 0 1 1 -36 24
             a 26 26 0 1 1 26 -12
             a 14 14 0 1 1 -14 6
             a 6 6 0 1 1 6 -3"
          stroke={color}
          strokeWidth="3"
          fill="none"
        />
      </g>
      <Label x={270} y={250}>cochlea (shared fluid)</Label>

      {/* shared endolymph label / bracket */}
      <path d="M 120 150 q -30 30 -10 90" stroke={color} strokeWidth="1" opacity="0.4" />
      <Label x={70} y={210}>one bony labyrinth</Label>
      <Label x={70} y={223}>one endolymph</Label>

      {/* balance silhouette showing sway */}
      <g transform="translate(360 250)">
        <motion.g
          animate={{ rotate: [-7, 7, -7] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "0px 70px" }}
        >
          <circle cx={0} cy={0} r={9} fill="none" stroke={color} strokeWidth="2" />
          <line x1={0} y1={9} x2={0} y2={55} stroke={color} strokeWidth="2" />
          <line x1={0} y1={20} x2={-14} y2={40} stroke={color} strokeWidth="2" />
          <line x1={0} y1={20} x2={14} y2={40} stroke={color} strokeWidth="2" />
          <line x1={0} y1={55} x2={-12} y2={78} stroke={color} strokeWidth="2" />
          <line x1={0} y1={55} x2={12} y2={78} stroke={color} strokeWidth="2" />
        </motion.g>
        {/* base / ground */}
        <line x1={-40} y1={130} x2={40} y2={130} stroke={color} strokeWidth="1.5" opacity="0.5" />
      </g>
      <Label x={360} y={395} anchor="middle">loss of balance</Label>
    </svg>
  );
}

/* ============================== CARDIOVASCULAR ============================== */
/* Heart → labyrinthine artery → stria vascularis */
export function HeartIllustration({ color, soft }: IllusProps) {
  return (
    <svg viewBox="0 0 460 380" className="h-full w-full" fill="none">
      <GlowDefs id="heart" color={color} />
      <ellipse cx="230" cy="190" rx="200" ry="160" fill="url(#heart-g)" />

      {/* beating heart */}
      <motion.g
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "150px 160px" }}
      >
        <path
          d="M 150 120
             C 120 90 70 110 80 160
             C 88 205 150 240 150 240
             C 150 240 215 205 220 160
             C 228 110 180 90 150 120 Z"
          fill={soft}
          stroke={color}
          strokeWidth="2.5"
        />
      </motion.g>
      {/* coronary vessels */}
      <g stroke={color} strokeWidth="1.4" fill="none" opacity="0.7">
        <path d="M 150 130 C 130 160 135 200 165 225" />
        <path d="M 165 130 C 175 165 185 195 165 225" />
        <path d="M 120 175 L 185 175" />
      </g>
      <Label x={150} y={262} anchor="middle">heart</Label>

      {/* labyrinthine artery (end artery, no collaterals) */}
      <motion.path
        d="M 210 175 C 270 160 300 120 330 110"
        stroke={color}
        strokeWidth="2.4"
        className="animate-flow"
        markerEnd="url(#heartArrow)"
      />
      {/* pulsing blood cells */}
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={i}
          r={3}
          fill={color}
          animate={{
            cx: [210, 270, 300, 330],
            cy: [175, 160, 130, 110],
            opacity: [0, 1, 1, 0],
          }}
          transition={{ duration: 2.4, delay: i * 0.8, repeat: Infinity }}
        />
      ))}
      <defs>
        <marker id="heartArrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={color} />
        </marker>
      </defs>
      <Label x={260} y={140}>labyrinthine artery (end artery)</Label>

      {/* stria vascularis capillary bed */}
      <g transform="translate(330 90)">
        <rect x={-30} y={-10} width={60} height={40} rx={6} fill={soft} stroke={color} strokeWidth="1.4" />
        <g stroke={color} strokeWidth="1" opacity="0.7">
          <path d="M -22 -2 C -10 6 10 -6 22 2" />
          <path d="M -22 8 C -10 16 10 4 22 12" />
          <path d="M -22 18 C -10 26 10 14 22 22" />
        </g>
      </g>
      <Label x={330} y={70} anchor="middle">stria vascularis</Label>

      {/* occlusion warning */}
      <g>
        <motion.circle cx={285} cy={140} r={6} fill="#fb7185" animate={{ opacity: [0.2, 0.9, 0.2] }} transition={{ duration: 1.6, repeat: Infinity }} />
        <Label x={285} y={170} anchor="middle" color="#fb7185">↓ flow → cell death</Label>
      </g>
    </svg>
  );
}

/* ============================== SOCIAL NETWORK ============================== */
/* Nodes breaking, inflammatory markers spreading */
export function NetworkIllustration({ color, soft }: IllusProps) {
  const nodes = [
    { x: 230, y: 110 },
    { x: 120, y: 180 },
    { x: 340, y: 180 },
    { x: 170, y: 290 },
    { x: 300, y: 290 },
    { x: 230, y: 200 },
  ];
  const links: [number, number][] = [
    [0, 5],
    [5, 1],
    [5, 2],
    [5, 3],
    [5, 4],
    [1, 3],
    [2, 4],
  ];
  return (
    <svg viewBox="0 0 460 380" className="h-full w-full" fill="none">
      <GlowDefs id="net" color={color} />
      <ellipse cx="230" cy="200" rx="200" ry="160" fill="url(#net-g)" />

      {/* links, some breaking */}
      {links.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke={color}
          strokeWidth="1.2"
          opacity={0.5}
          strokeDasharray={i % 2 ? "3 5" : "0"}
          animate={{ opacity: [0.5, 0.12, 0.5] }}
          transition={{ duration: 3, delay: i * 0.4, repeat: Infinity }}
        />
      ))}

      {/* nodes */}
      {nodes.map((n, i) => (
        <g key={i}>
          <motion.circle
            cx={n.x}
            cy={n.y}
            r={i === 5 ? 16 : 11}
            fill={soft}
            stroke={color}
            strokeWidth="1.8"
            animate={i === 5 ? { scale: [1, 1.08, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
            style={i === 5 ? { transformOrigin: `${n.x}px ${n.y}px` } : {}}
          />
          {i === 5 && <circle cx={n.x} cy={n.y} r={6} fill={color} />}
        </g>
      ))}

      {/* spreading inflammatory markers */}
      {[
        { x: 170, y: 290 },
        { x: 300, y: 290 },
        { x: 120, y: 180 },
        { x: 340, y: 180 },
      ].map((m, i) => (
        <motion.g key={i} animate={{ opacity: [0, 1, 0], scale: [0.5, 1.3, 0.5] }} transition={{ duration: 2.6, delay: i * 0.5, repeat: Infinity }} style={{ transformOrigin: `${m.x}px ${m.y}px` }}>
          <text x={m.x} y={m.y - 16} fill="#fb7185" fontSize={11} textAnchor="middle"> inflamm. </text>
        </motion.g>
      ))}

      <Label x={230} y={75} anchor="middle">social network fragmenting</Label>
      <Label x={230} y={345} anchor="middle">→ CRP · IL-6 · fibrinogen rise</Label>
    </svg>
  );
}

/* ============================== MAP: pathway icon router ============================== */
export function PathwayIllustration({ icon, color, soft }: { icon: string } & IllusProps) {
  switch (icon) {
    case "brain":
      return <BrainIllustration color={color} soft={soft} />;
    case "limbic":
      return <LimbicIllustration color={color} soft={soft} />;
    case "vestibular":
      return <VestibularIllustration color={color} soft={soft} />;
    case "heart":
      return <HeartIllustration color={color} soft={soft} />;
    case "network":
      return <NetworkIllustration color={color} soft={soft} />;
    default:
      return null;
  }
}
