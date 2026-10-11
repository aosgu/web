import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { variability } from '../data/study';
import type { PlaySound } from '../hooks/useSound';
import Icon from './Icon';

export default function Variability({ playSound }: { playSound: PlaySound }) {
  const [index, setIndex] = useState(0);
  const item = variability[index];
  const reducedMotion = useReducedMotion();
  const x = (value: number) => 12 + (value / 30) * 458;
  const transition = reducedMotion ? { duration: 0 } : { type: 'spring' as const, stiffness: 70, damping: 21 };

  return (
    <section className="individuality" aria-labelledby="individuality-heading">
      <div className="section-shell individuality-inner">
        <div className="individuality-copy">
          <div className="section-kicker"><span><span className="section-number">03</span> / THE HUMAN VARIABLE</span></div>
          <motion.h2 id="individuality-heading" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true, amount: 0.4 }}>The biggest<br />variable is <em>you.</em></motion.h2>
          <p>Muscle growth varied more between people than within the same person. Your response was more consistent than your training load might suggest.</p>
        </div>
        <div className="variability-visual">
          <div className="variability-topline"><label htmlFor="variability-metric">A CLOSER LOOK AT VARIABILITY</label><span>FIG. 03</span></div>
          <div className="variability-select-wrap"><select id="variability-metric" value={index} onChange={(event) => { setIndex(Number(event.target.value)); playSound(); }}>{variability.map((metric, metricIndex) => <option key={metric.label} value={metricIndex}>{metric.label}</option>)}</select><Icon name="chevron-down" size={17} /></div>
          <svg viewBox="0 0 535 248" className="variability-svg" role="img" aria-label={`${item.label}: between-participant coefficient of variation ${item.between} percent, within-participant coefficient of variation ${item.within} percent. This is variability, not percentage muscle growth.`}>
            {[0, 5, 10, 15, 20, 25, 30].map((tick) => <g key={tick}><line x1={x(tick)} x2={x(tick)} y1="39" y2="204" stroke="#8ca1f4" strokeWidth="0.6" opacity="0.3" strokeDasharray="2 5" /><text x={x(tick)} y="228" textAnchor="middle" fill="#a5b9ff" className="svg-axis-label">{tick}%</text></g>)}
            {[
              { label: 'Between people', value: item.between, color: '#f3f5ff', y: 76 },
              { label: 'Within a person', value: item.within, color: '#98afff', y: 171 },
            ].map((row) => <g key={row.label}>
              <text x="12" y={row.y - 24} fill={row.color} className="variability-row-label">{row.label}</text>
              <motion.line initial={{ x2: 12 }} whileInView={{ x2: x(row.value) }} x1="12" y1={row.y} y2={row.y} stroke={row.color} strokeWidth="5" transition={transition} viewport={{ once: true }} />
              <motion.circle initial={{ cx: 12 }} whileInView={{ cx: x(row.value) }} cy={row.y} r="5" fill={row.color} transition={transition} viewport={{ once: true }} />
              <text x="529" y={row.y + 7} textAnchor="end" fill={row.color} className="variability-value">{row.value.toFixed(1)}<tspan fontSize="14">%</tspan></text>
            </g>)}
          </svg>
          <p className="variability-note">Coefficient of variation (%CV), not percentage growth.<br />{item.note} Source: Table 2.</p>
        </div>
      </div>
    </section>
  );
}