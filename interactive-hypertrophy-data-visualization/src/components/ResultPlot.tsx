import { useId, useLayoutEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { formatValue, type Measurement } from '../data/study';
import type { PlaySound } from '../hooks/useSound';

export interface PlotRow {
  id: 'high' | 'low';
  label: string;
  detail: string;
  measurement: Measurement;
}

interface ResultPlotProps {
  rows: PlotRow[];
  unit: string;
  precision: number;
  showSd: boolean;
  focus: 'both' | 'high' | 'low';
  playSound: PlaySound;
  label: string;
  baseline: 'rest' | 'baseline';
}

function getScale(rows: PlotRow[]) {
  const min = Math.min(0, ...rows.map((row) => row.measurement.mean - row.measurement.sd));
  const max = Math.max(...rows.map((row) => row.measurement.mean + row.measurement.sd));
  const rawStep = (max - min) / 4;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep || 1)));
  const normalized = rawStep / magnitude;
  const step = (normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 2.5 ? 2.5 : normalized <= 5 ? 5 : 10) * magnitude;
  const lower = Math.floor(min / step) * step;
  const upper = Math.ceil(max / step) * step;
  const ticks = Array.from({ length: Math.round((upper - lower) / step) + 1 }, (_, index) => Number((lower + step * index).toPrecision(10)));
  return { lower, upper, ticks, step };
}

export default function ResultPlot({ rows, unit, precision, showSd, focus, playSound, label, baseline }: ResultPlotProps) {
  const uid = useId().replace(/:/g, '');
  const container = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(820);
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();
  const compact = width < 600;
  const viewWidth = compact ? Math.max(280, width) : 820;
  const { lower, upper, ticks, step } = getScale(rows);
  const startX = compact ? 14 : 171;
  const endX = compact ? viewWidth - 18 : 663;
  const valueX = compact ? viewWidth - 3 : 805;
  const axisY = compact ? 260 : 206;
  const scale = (value: number) => startX + ((value - lower) / (upper - lower || 1)) * (endX - startX);
  const activeId = hovered || pinned;
  const transition = reducedMotion ? { duration: 0 } : { type: 'spring' as const, stiffness: 100, damping: 22 };

  useLayoutEffect(() => {
    const element = container.current;
    if (!element) return;
    setWidth(Math.round(element.clientWidth));
    const observer = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`plot-scroll ${compact ? 'is-compact' : ''}`} ref={container}>
      <svg className="result-plot" viewBox={`0 0 ${viewWidth} ${compact ? 328 : 263}`} role="group" aria-label={`${label}. Mean changes relative to ${baseline}${showSd ? ', with plus or minus one standard deviation' : ''}. Activate a point for details.`}>
        <defs>
          <linearGradient id={`${uid}-high-range`} gradientUnits="userSpaceOnUse" x1={startX} y1="0" x2={endX} y2="0"><stop stopColor="#3157ff" stopOpacity="0.35" /><stop offset="0.5" stopColor="#3157ff" /><stop offset="1" stopColor="#3157ff" stopOpacity="0.35" /></linearGradient>
          <linearGradient id={`${uid}-low-range`} gradientUnits="userSpaceOnUse" x1={startX} y1="0" x2={endX} y2="0"><stop stopColor="#b7c7df" stopOpacity="0.35" /><stop offset="0.5" stopColor="#b7c7df" /><stop offset="1" stopColor="#b7c7df" stopOpacity="0.35" /></linearGradient>
        </defs>

        <text x="0" y="20" className="svg-micro" fill="#777e8b">{baseline === 'rest' ? 'TRAINING PHASE' : 'TRAINING CONDITION'}</text>
        <text x={valueX} y="20" className="svg-micro" fill="#777e8b" textAnchor="end">MEAN CHANGE</text>
        {ticks.map((tick) => (
          <g key={tick}>
            {(compact ? [[88, 119], [203, 235]] : [[40, 205]]).map(([top, bottom]) => <line key={top} x1={scale(tick)} y1={top} x2={scale(tick)} y2={bottom} stroke={tick === 0 ? '#49505f' : '#222630'} strokeWidth={tick === 0 ? 1 : 0.7} strokeDasharray={tick === 0 ? '3 4' : undefined} />)}
            <text x={scale(tick)} y={axisY + 23} textAnchor="middle" fill="#7d8492" className="svg-axis-label">
              {formatValue(tick, step >= 1 ? 0 : Math.min(3, Math.max(1, Math.ceil(-Math.log10(step)) + (String(step).includes('25') ? 1 : 0))))}
            </text>
          </g>
        ))}
        <line x1={startX} y1={axisY} x2={endX} y2={axisY} stroke="#2a2e38" strokeWidth="0.8" />
        <text x={(startX + endX) / 2} y={compact ? 313 : 255} textAnchor="middle" fill="#727a8b" className="svg-axis-label">Change from {baseline} ({unit})</text>

        {rows.map((row, index) => {
          const y = compact ? 103 + index * 115 : 77 + index * 84;
          const color = row.id === 'high' ? '#4063ff' : '#bdcce2';
          const x = scale(row.measurement.mean);
          const isActive = activeId === row.id;
          const tooltipX = Math.min(endX - 172, Math.max(startX, x - 78));
          const tooltipY = compact && index === 1 ? y - 93 : y + 20;
          return (
            <motion.g key={row.id} animate={{ opacity: focus === 'both' || focus === row.id ? 1 : 0.22 }} transition={{ duration: 0.25 }}>
              <rect x="0" y={y - (compact ? 55 : 7)} width="4" height="26" fill={color} />
              <text x="17" y={y + (compact ? -45 : 2)} fill="#eceef4" className="svg-row-title">{row.label}</text>
              <text x="17" y={y + (compact ? -25 : 22)} fill="#777e8c" className="svg-row-detail">{row.detail}</text>

              <motion.g animate={{ opacity: showSd ? 1 : 0 }} transition={{ duration: 0.3 }}>
                <motion.line initial={{ x1: scale(0), x2: scale(0) }} animate={{ x1: scale(row.measurement.mean - row.measurement.sd), x2: scale(row.measurement.mean + row.measurement.sd) }} y1={y} y2={y} stroke={`url(#${uid}-${row.id}-range)`} strokeWidth="2" transition={transition} />
                <motion.line initial={{ x1: scale(0), x2: scale(0) }} animate={{ x1: scale(row.measurement.mean - row.measurement.sd), x2: scale(row.measurement.mean - row.measurement.sd) }} y1={y - 7} y2={y + 7} stroke={color} strokeWidth="1.3" transition={transition} />
                <motion.line initial={{ x1: scale(0), x2: scale(0) }} animate={{ x1: scale(row.measurement.mean + row.measurement.sd), x2: scale(row.measurement.mean + row.measurement.sd) }} y1={y - 7} y2={y + 7} stroke={color} strokeWidth="1.3" transition={transition} />
              </motion.g>

              <motion.circle initial={{ cx: scale(0), r: 17 }} animate={{ cx: x, r: isActive ? 24 : 17 }} cy={y} fill={color} opacity="0.06" transition={transition} />
              <motion.circle initial={{ cx: scale(0), r: 11 }} animate={{ cx: x, r: isActive ? 15 : 11 }} cy={y} fill="none" stroke={color} strokeWidth="0.65" opacity="0.4" transition={transition} />
              <motion.circle initial={{ cx: scale(0) }} animate={{ cx: x }} cy={y} r="5.5" fill={color} transition={transition} />
              <motion.circle
                initial={{ cx: scale(0) }} animate={{ cx: x }} cy={y} r="22" fill="transparent" transition={transition}
                role="button" tabIndex={0} className="plot-point"
                aria-label={`${row.label}: mean increase ${formatValue(row.measurement.mean, precision)} ${unit}, standard deviation ${formatValue(row.measurement.sd, precision)} ${unit}. ${pinned === row.id ? 'Unpin' : 'Pin'} details.`}
                aria-pressed={pinned === row.id}
                onPointerEnter={() => { setHovered(row.id); playSound('hover'); }} onPointerLeave={() => setHovered(null)}
                onFocus={() => setHovered(row.id)} onBlur={() => setHovered(null)}
                onClick={() => { setPinned(pinned === row.id ? null : row.id); playSound(); }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setPinned(pinned === row.id ? null : row.id); playSound(); }
                  if (event.key === 'Escape') { setPinned(null); setHovered(null); }
                }}
              />

              <text x={valueX} y={y + (compact ? -40 : 5)} textAnchor="end" fill={color} className="svg-result-value">+{formatValue(row.measurement.mean, precision)}</text>
              <text x={valueX} y={y + (compact ? -20 : 25)} textAnchor="end" fill="#747c8d" className="svg-row-detail">{unit}</text>

              {isActive && (
                <g className="plot-tooltip" pointerEvents="none">
                  <rect x={tooltipX} y={tooltipY} width="172" height="44" rx="3" fill="#161b26" stroke="#343e54" />
                  <circle cx={tooltipX + 13} cy={tooltipY + 14} r="2.5" fill={color} />
                  <text x={tooltipX + 22} y={tooltipY + 18} fill="#e8edf7" fontSize="10" className="svg-axis-label">{row.label}</text>
                  <text x={tooltipX + 12} y={tooltipY + 34} fill="#aab3c6" fontSize="10" className="svg-axis-label">{formatValue(row.measurement.mean, precision)} &plusmn; {formatValue(row.measurement.sd, precision)} {unit} (SD)</text>
                </g>
              )}
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}