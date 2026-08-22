import { useState } from "react";
import { geoNodes } from "../data/flow";

export default function Geography() {
  const [id, setId] = useState("tw");
  const node = geoNodes.find((n) => n.id === id) ?? geoNodes[0];

  return (
    <section id="map" className="px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[11px] tracking-[0.4em] text-gold uppercase">05 / Geography</p>
        <h2 className="mt-3 font-serif text-4xl font-bold md:text-6xl">
          钱有国籍。
          <span className="gold-text">热没有。</span>
        </h2>
        <p className="mt-5 max-w-2xl text-paper-dim">
          利润喜欢待在加州、台湾、荷兰与韩国。矿坑、水和废热喜欢待在地图上不发光的地方。点亮一个节点。
        </p>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="card-glass relative aspect-[16/10] overflow-hidden rounded-[28px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_40%,rgba(212,175,55,0.08),transparent_25%),radial-gradient(circle_at_78%_46%,rgba(94,234,212,0.1),transparent_22%),radial-gradient(circle_at_50%_70%,rgba(232,93,4,0.08),transparent_28%)]" />
            <svg viewBox="0 0 100 62" className="absolute inset-0 h-full w-full">
              <path
                d="M8 22 C 16 14, 24 16, 28 24 C 30 30, 22 36, 18 40 C 12 46, 8 38, 8 32 Z"
                fill="none"
                stroke="#ebe4d422"
                strokeWidth="0.3"
              />
              <path
                d="M26 48 C 30 54, 32 70, 28 78"
                fill="none"
                stroke="#ebe4d422"
                strokeWidth="0.3"
              />
              <path
                d="M44 18 C 50 16, 56 20, 58 28 C 60 36, 54 42, 48 38 C 42 30, 42 22, 44 18 Z"
                fill="none"
                stroke="#ebe4d422"
                strokeWidth="0.3"
              />
              <path
                d="M50 48 C 54 52, 58 68, 54 74 C 50 70, 48 58, 50 48 Z"
                fill="none"
                stroke="#ebe4d422"
                strokeWidth="0.3"
              />
              <path
                d="M68 28 C 74 20, 86 22, 90 32 C 92 40, 86 48, 78 50 C 70 46, 66 36, 68 28 Z"
                fill="none"
                stroke="#ebe4d422"
                strokeWidth="0.3"
              />
              <path
                d="M80 68 C 86 66, 92 72, 90 80 C 84 82, 78 76, 80 68 Z"
                fill="none"
                stroke="#ebe4d422"
                strokeWidth="0.3"
              />
              {geoNodes.map((n) => (
                <g key={n.id} onClick={() => setId(n.id)} className="cursor-pointer">
                  <circle
                    cx={n.x}
                    cy={n.y * 0.62}
                    r={id === n.id ? 1.8 : 1.1}
                    fill={id === n.id ? "#d4af37" : "#5eead4"}
                    opacity={0.4 + n.heat * 0.6}
                  />
                  <circle
                    cx={n.x}
                    cy={n.y * 0.62}
                    r={3.4 + n.heat * 2}
                    fill="none"
                    stroke={id === n.id ? "#d4af37" : "#5eead455"}
                    strokeWidth="0.2"
                    className={id === n.id ? "flow-line" : ""}
                  />
                </g>
              ))}
            </svg>
            <div className="absolute bottom-4 left-4 font-mono text-[10px] tracking-widest text-mute">
              SCHEMATIC · NOT TO SCALE
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-[28px] border border-white/10 p-7">
            <div>
              <div className="font-mono text-[10px] tracking-[0.3em] text-gold-2 uppercase">{node.en}</div>
              <h3 className="mt-2 font-serif text-3xl">{node.name}</h3>
              <div className="mt-4 text-sm text-mute">{node.role}</div>
              <p className="mt-5 text-base leading-8 text-paper-dim">{node.take}</p>
            </div>
            <div className="mt-8">
              <div className="mb-2 flex justify-between font-mono text-[10px] tracking-widest text-mute">
                <span>STRATEGIC HEAT</span>
                <span>{Math.round(node.heat * 100)}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full bg-gradient-to-r from-gold to-ember" style={{ width: `${node.heat * 100}%` }} />
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {geoNodes.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => setId(n.id)}
                    className={`rounded-full px-3 py-1 font-mono text-[10px] tracking-wider ${
                      id === n.id ? "bg-gold text-ink" : "bg-white/5 text-mute hover:text-paper"
                    }`}
                  >
                    {n.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
