import { useMemo, useState } from "react";

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  c: string;
}

const nodes: Node[] = [
  { id: "you", label: "你的账单", x: 6, y: 50, c: "#f0d78c" },
  { id: "lab", label: "模型公司", x: 22, y: 28, c: "#d4af37" },
  { id: "talent", label: "人才", x: 40, y: 12, c: "#c4b5a0" },
  { id: "cloud", label: "云巨头", x: 40, y: 42, c: "#5eead4" },
  { id: "opex", label: "销售法务", x: 40, y: 22, c: "#9a9184" },
  { id: "nvda", label: "NVIDIA", x: 58, y: 36, c: "#76b900" },
  { id: "power", label: "电力", x: 58, y: 58, c: "#e85d04" },
  { id: "dc", label: "机房土木", x: 58, y: 72, c: "#c4b5a0" },
  { id: "hbm", label: "HBM", x: 74, y: 24, c: "#5eead4" },
  { id: "tsmc", label: "台积电", x: 74, y: 40, c: "#f0d78c" },
  { id: "asml", label: "ASML/蔡司", x: 88, y: 32, c: "#e85d04" },
  { id: "mat", label: "材料", x: 88, y: 48, c: "#c4b5a0" },
  { id: "mine", label: "矿山", x: 88, y: 68, c: "#8a7340" },
  { id: "heat", label: "废热", x: 88, y: 86, c: "#e85d04" },
];

const edges: [string, string, number][] = [
  ["you", "lab", 10],
  ["lab", "talent", 3],
  ["lab", "opex", 2],
  ["lab", "cloud", 8],
  ["cloud", "nvda", 7],
  ["cloud", "power", 4],
  ["cloud", "dc", 3],
  ["nvda", "hbm", 3],
  ["nvda", "tsmc", 5],
  ["tsmc", "asml", 4],
  ["tsmc", "mat", 3],
  ["power", "mine", 3],
  ["dc", "mine", 2],
  ["power", "heat", 5],
  ["nvda", "heat", 3],
  ["asml", "mat", 2],
  ["mat", "mine", 3],
  ["mine", "heat", 4],
];

function pos(id: string) {
  return nodes.find((n) => n.id === id)!;
}

export default function Sankey() {
  const [hover, setHover] = useState<string | null>(null);

  const related = useMemo(() => {
    if (!hover) return new Set<string>();
    const s = new Set<string>([hover]);
    edges.forEach(([a, b]) => {
      if (a === hover || b === hover) {
        s.add(a);
        s.add(b);
      }
    });
    return s;
  }, [hover]);

  return (
    <section className="px-6 py-16 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[11px] tracking-[0.4em] text-gold uppercase">04 / Conduit</p>
            <h2 className="mt-3 font-serif text-3xl font-bold md:text-5xl">
              一张会呼吸的流向图
            </h2>
          </div>
          <p className="hidden max-w-sm text-right text-sm text-mute md:block">
            悬停任一节点。金色是入口，青绿是云与存储，赤橙是电与热。河不会回流到你。
          </p>
        </div>

        <div className="card-glass overflow-hidden rounded-[28px] p-3 md:p-6">
          <svg viewBox="0 0 100 100" className="h-auto w-full" preserveAspectRatio="xMidYMid meet">
            {edges.map(([a, b, w]) => {
              const A = pos(a);
              const B = pos(b);
              const on = !hover || related.has(a) || related.has(b);
              const midX = (A.x + B.x) / 2;
              return (
                <path
                  key={`${a}-${b}`}
                  d={`M ${A.x} ${A.y} C ${midX} ${A.y}, ${midX} ${B.y}, ${B.x} ${B.y}`}
                  fill="none"
                  stroke={on ? B.c : "#ffffff14"}
                  strokeWidth={w * 0.18}
                  className={on && hover ? "flow-line" : ""}
                  opacity={on ? 0.85 : 0.18}
                />
              );
            })}
            {nodes.map((n) => {
              const on = !hover || related.has(n.id);
              return (
                <g
                  key={n.id}
                  onMouseEnter={() => setHover(n.id)}
                  onMouseLeave={() => setHover(null)}
                  className="cursor-pointer"
                >
                  <circle cx={n.x} cy={n.y} r={hover === n.id ? 3.2 : 2.3} fill={n.c} opacity={on ? 1 : 0.25} />
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={5}
                    fill="transparent"
                    stroke={n.c}
                    strokeOpacity={hover === n.id ? 0.6 : 0}
                  />
                  <text
                    x={n.x}
                    y={n.y - 4.2}
                    textAnchor="middle"
                    fill={on ? "#ebe4d4" : "#9a918466"}
                    fontSize="2.4"
                    fontFamily="Noto Serif SC, serif"
                  >
                    {n.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </section>
  );
}
