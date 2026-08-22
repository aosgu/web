import { motion } from "framer-motion";

const mono = { fontFamily: "JetBrains Mono, monospace" };

const nodes = [
  { x: 130, y: 120, label: "Cognition", color: "#a78bfa", emoji: "🧠" },
  { x: 400, y: 120, label: "Mood", color: "#38bdf8", emoji: "💭" },
  { x: 110, y: 360, label: "Balance", color: "#fbbf24", emoji: "⚖️" },
  { x: 420, y: 360, label: "Heart", color: "#fb7185", emoji: "❤️" },
  { x: 265, y: 70, label: "Isolation", color: "#2dd4bf", emoji: "👤" },
];

/* Hub-and-spoke: the inner ear as the origin of systemic disease */
export function CascadeDiagram() {
  const cx = 265;
  const cy = 250;
  return (
    <svg viewBox="0 0 530 440" className="h-full w-full" fill="none">
      <defs>
        <radialGradient id="hub" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* radiating spokes */}
      {nodes.map((n, i) => (
        <g key={n.label}>
          <motion.line
            x1={cx}
            y1={cy}
            x2={n.x}
            y2={n.y}
            stroke={n.color}
            strokeWidth="1.5"
            opacity="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.5 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 + i * 0.15 }}
          />
          {/* travelling signal */}
          <motion.circle
            r={3}
            fill={n.color}
            animate={{ cx: [cx, n.x], cy: [cy, n.y], opacity: [0, 1, 0] }}
            transition={{ duration: 2.2, delay: i * 0.4, repeat: Infinity, repeatDelay: 0.5 }}
          />
        </g>
      ))}

      {/* central inner ear (cochlea spiral) */}
      <circle cx={cx} cy={cy} r={66} fill="url(#hub)" />
      <motion.circle
        cx={cx}
        cy={cy}
        r={46}
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.25"
        animate={{ r: [46, 58, 46], strokeOpacity: [0.3, 0.05, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <g transform={`translate(${cx} ${cy})`} stroke="#ffffff" strokeWidth="2.4" fill="none">
        <motion.path
          d="M 0 -28 a 28 28 0 1 1 -26 18 a 19 19 0 1 1 19 -9 a 10 10 0 1 1 -10 4 a 4 4 0 1 1 4 -2"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "center" }}
        />
      </g>
      <text x={cx} y={cy + 78} fill="#e7e7ea" fontSize={12} textAnchor="middle" style={mono} letterSpacing="0.06em">
        INNER EAR
      </text>

      {/* peripheral nodes */}
      {nodes.map((n, i) => (
        <motion.g
          key={n.label}
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 + i * 0.15 }}
        >
          <circle cx={n.x} cy={n.y} r={30} fill="#080808" stroke={n.color} strokeWidth="1.5" />
          <circle cx={n.x} cy={n.y} r={30} fill={n.color} fillOpacity="0.08" />
          <text x={n.x} y={n.y + 6} fontSize={22} textAnchor="middle">
            {n.emoji}
          </text>
          <text x={n.x} y={n.y + 48} fill="#8a8a92" fontSize={10} textAnchor="middle" style={mono} letterSpacing="0.04em">
            {n.label}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}
