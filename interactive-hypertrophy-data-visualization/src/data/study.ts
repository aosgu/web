export type Region = 'upper' | 'lower';
export type Outcome = 'hypertrophy' | 'strength' | 'synthesis';
export type Condition = 'high' | 'low';

export interface Measurement {
  mean: number;
  sd: number;
}

export interface Metric {
  id: string;
  label: string;
  shortLabel: string;
  tissue: string;
  region: Region;
  outcome: Exclude<Outcome, 'synthesis'>;
  unit: string;
  precision: number;
  high: Measurement;
  low: Measurement;
  p: string;
}

export const study = {
  title: 'Resistance training load does not determine resistance training-induced hypertrophy across upper and lower limbs in healthy young males',
  authors: 'Lees MJ, Mcleod JC, Morton RW, et al.',
  journal: 'The Journal of Physiology',
  date: '31 December 2025',
  doi: '10.1113/JP289684',
  url: 'https://doi.org/10.1113/JP289684',
};

// Reported changes from baseline, mean +/- SD, from the paper's Table 3.
// Fibre subtypes with different sample sizes are intentionally not included.
export const metrics: Metric[] = [
  {
    id: 'arm-csa', label: 'Muscle cross-sectional area', shortLabel: 'Cross-sectional area',
    tissue: 'Biceps brachii', region: 'upper', outcome: 'hypertrophy', unit: 'cm\u00b2', precision: 2,
    high: { mean: 1.2, sd: 0.92 }, low: { mean: 1.39, sd: 0.98 }, p: '0.518',
  },
  {
    id: 'arm-thickness', label: 'Muscle thickness', shortLabel: 'Muscle thickness',
    tissue: 'Biceps brachii', region: 'upper', outcome: 'hypertrophy', unit: 'cm', precision: 2,
    high: { mean: 0.14, sd: 0.23 }, low: { mean: 0.18, sd: 0.17 }, p: '0.556',
  },
  {
    id: 'arm-mass', label: 'Fat- and bone-free mass', shortLabel: 'Lean mass (DXA)',
    tissue: 'Arm', region: 'upper', outcome: 'hypertrophy', unit: 'kg', precision: 2,
    high: { mean: 0.17, sd: 0.11 }, low: { mean: 0.18, sd: 0.18 }, p: '0.778',
  },
  {
    id: 'leg-csa', label: 'Muscle cross-sectional area', shortLabel: 'Cross-sectional area',
    tissue: 'Vastus lateralis', region: 'lower', outcome: 'hypertrophy', unit: 'cm\u00b2', precision: 2,
    high: { mean: 0.69, sd: 2.73 }, low: { mean: 0.75, sd: 2.43 }, p: '0.932',
  },
  {
    id: 'leg-thickness', label: 'Muscle thickness', shortLabel: 'Muscle thickness',
    tissue: 'Vastus lateralis', region: 'lower', outcome: 'hypertrophy', unit: 'cm', precision: 2,
    high: { mean: 0.18, sd: 0.23 }, low: { mean: 0.09, sd: 0.28 }, p: '0.312',
  },
  {
    id: 'leg-mass', label: 'Fat- and bone-free mass', shortLabel: 'Lean mass (DXA)',
    tissue: 'Leg', region: 'lower', outcome: 'hypertrophy', unit: 'kg', precision: 2,
    high: { mean: 0.29, sd: 0.32 }, low: { mean: 0.32, sd: 0.29 }, p: '0.766',
  },
  {
    id: 'fibre-one', label: 'Type I muscle fibre area', shortLabel: 'Type I fibre area',
    tissue: 'Vastus lateralis biopsy', region: 'lower', outcome: 'hypertrophy', unit: '\u00b5m\u00b2', precision: 0,
    high: { mean: 495, sd: 1244 }, low: { mean: 602, sd: 1537 }, p: '0.726',
  },
  {
    id: 'fibre-two', label: 'Type II muscle fibre area', shortLabel: 'Type II fibre area',
    tissue: 'Vastus lateralis biopsy', region: 'lower', outcome: 'hypertrophy', unit: '\u00b5m\u00b2', precision: 0,
    high: { mean: 811, sd: 1746 }, low: { mean: 712, sd: 1756 }, p: '0.815',
  },
  {
    id: 'arm-1rm', label: 'Biceps curl one-repetition maximum', shortLabel: 'One-rep max (1RM)',
    tissue: 'Biceps curl', region: 'upper', outcome: 'strength', unit: 'kg', precision: 1,
    high: { mean: 3.8, sd: 4.3 }, low: { mean: 3.2, sd: 4.8 }, p: '0.230',
  },
  {
    id: 'arm-mvc', label: 'Elbow flexion maximal voluntary contraction', shortLabel: 'Maximal contraction',
    tissue: 'Elbow flexion', region: 'upper', outcome: 'strength', unit: 'N m', precision: 0,
    high: { mean: 11, sd: 10 }, low: { mean: 12, sd: 15 }, p: '0.680',
  },
  {
    id: 'leg-1rm', label: 'Knee extension one-repetition maximum', shortLabel: 'One-rep max (1RM)',
    tissue: 'Knee extension', region: 'lower', outcome: 'strength', unit: 'kg', precision: 0,
    high: { mean: 24, sd: 11 }, low: { mean: 22, sd: 9 }, p: '0.125',
  },
  {
    id: 'leg-mvc', label: 'Knee extension maximal voluntary contraction', shortLabel: 'Maximal contraction',
    tissue: 'Knee extension', region: 'lower', outcome: 'strength', unit: 'N m', precision: 0,
    high: { mean: 38, sd: 53 }, low: { mean: 42, sd: 51 }, p: '0.590',
  },
];

export const synthesis = {
  first: { mean: 0.27, sd: 0.11, p: '< 0.0001' },
  last: { mean: 0.1, sd: 0.14, p: '= 0.009' },
  difference: { mean: 0.16, sd: 0.18, p: '< 0.001' },
};

// Table 2. CV is variability, not the percentage of muscle gained.
export const variability = [
  { label: 'Cross-sectional area', between: 27.8, within: 7.7, note: 'Ultrasound; mean of arm and leg CVs.' },
  { label: 'Lean mass', between: 20.1, within: 3.1, note: 'DXA; mean of arm and leg CVs.' },
  { label: 'Muscle thickness', between: 17.9, within: 5.9, note: 'Ultrasound; mean of arm and leg CVs.' },
  { label: 'Muscle fibre area', between: 18.2, within: 14.7, note: 'Biopsy; mean of type I and type II CVs.' },
];

export function formatValue(value: number, precision: number) {
  return value.toLocaleString('en-US', { minimumFractionDigits: precision, maximumFractionDigits: precision });
}

function csvCell(value: string | number) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

export function downloadData() {
  const rows: (string | number)[][] = [
    ['Source', study.title],
    ['DOI', study.doi],
    ['Data note', 'Selected Table 3 outcomes. Changes from baseline after 10 weeks; mean and SD; n=20 per load.'],
    [],
    ['Outcome', 'Limb', 'Measure', 'Unit', 'High-load mean', 'High-load SD', 'Low-load mean', 'Low-load SD', 'P (between loads)'],
    ...metrics.map((metric) => [metric.outcome, metric.region, metric.label, metric.unit, metric.high.mean, metric.high.sd, metric.low.mean, metric.low.sd, metric.p]),
    [],
    ['Protein synthesis: change relative to rest', 'Unit', 'Mean', 'SD', 'P (vs rest)'],
    ['Week 1', '%/day', synthesis.first.mean, synthesis.first.sd, synthesis.first.p],
    ['Week 10', '%/day', synthesis.last.mean, synthesis.last.sd, synthesis.last.p],
    [],
    ['Protein synthesis: paired difference', 'Unit', 'Mean', 'SD', 'P (week 1 vs week 10)'],
    ['Week 1 minus Week 10 (reported paired difference)', '%/day', synthesis.difference.mean, synthesis.difference.sd, synthesis.difference.p],
    [],
    ['Table 2 variability', 'Between-participant CV (%)', 'Within-participant CV (%)', 'Note'],
    ...variability.map((item) => [item.label, item.between, item.within, item.note]),
  ];
  const csv = rows.map((row) => row.map(csvCell).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8;' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'load-paradox-lees-2025.csv';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}