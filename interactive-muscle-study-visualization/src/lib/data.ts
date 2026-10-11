// Source: Ahtiainen JP, Walker S, Peltonen H, et al. (2016) AGE 38:10
// doi:10.1007/s11357-015-9870-1 — values transcribed from the paper's text and Table 1.

export const KLEIN = "#002FA7";

export const CITATION = {
  authors:
    "Juha P. Ahtiainen, Simon Walker, Heikki Peltonen, Jarkko Holviala, Elina Sillanpää, Laura Karavirta, Janne Sallinen, Jussi Mikkola, Heli Valkeinen, Antti Mero, Juha J. Hulmi, Keijo Häkkinen",
  title:
    "Heterogeneity in resistance training-induced muscle strength and mass responses in men and women of different ages",
  journal: "AGE",
  volume: "38",
  article: "10",
  year: 2016,
  doi: "10.1007/s11357-015-9870-1",
};

export const COHORT = {
  trainees: 287,
  trainingMen: 183,
  trainingWomen: 104,
  controls: 72,
  controlMen: 53,
  controlWomen: 19,
  ageMin: 19,
  ageMax: 78,
};

export const SIZE_STATS = {
  mean: 4.8,
  sd: 6.1,
  min: -11,
  max: 30,
  n: 287,
  lowCut: 1.6,
  lowN: 84,
  lowPct: 29.3,
  highPct: 12.2,
  highN: 35,
  zeroOrNegN: 39,
  zeroOrNegPct: 14.6,
};

export const STRENGTH_STATS = {
  mean: 21.1,
  sd: 11.5,
  min: -8,
  max: 60,
  n: 283,
  lowCut: 5.0,
  lowN: 19,
  lowPct: 6.7,
  highPct: 12,
  controlMin: -10,
  controlMax: 18,
};

export const BOTH_LOW = { n: 9, of: 283, pct: 3.2 };

export const LOW_SIZE = SIZE_STATS.lowCut;
export const LOW_STRENGTH = STRENGTH_STATS.lowCut;
export const SIZE_DOMAIN: [number, number] = [-12, 31];
export const STRENGTH_DOMAIN: [number, number] = [-10, 62];

export type Sex = "M" | "F";
export type Band = "<45" | "45–60" | ">60" | "Control";

export interface Group {
  id: string;
  sex: Sex;
  band: Band;
  n: number;
  age: number;
  ageSd: number;
  bm: [number, number]; // body mass kg, pre → post
  rm: [number, number]; // leg-press 1RM kg, pre → post
  rel: [number, number]; // 1RM / body mass, pre → post
  gain: number; // mean individual % change in 1RM
  gainSd: number | null;
}

// Table 1 (group means ± SD) and the per-group 1RM % change reported in the Results text.
export const GROUPS: Group[] = [
  { id: "m1", sex: "M", band: "<45", n: 61, age: 31.2, ageSd: 7.3, bm: [78.0, 79.0], rm: [169.3, 200.5], rel: [2.2, 2.6], gain: 19.0, gainSd: 8.6 },
  { id: "m2", sex: "M", band: "45–60", n: 55, age: 53.8, ageSd: 5.0, bm: [81.0, 80.7], rm: [161.7, 192.2], rel: [2.0, 2.4], gain: 19.4, gainSd: 9.0 },
  { id: "m3", sex: "M", band: ">60", n: 67, age: 66.1, ageSd: 4.0, bm: [79.2, 79.3], rm: [140.4, 167.0], rel: [1.8, 2.1], gain: 19.7, gainSd: 10.8 },
  { id: "f1", sex: "F", band: "<45", n: 27, age: 38.7, ageSd: 4.6, bm: [64.1, 64.8], rm: [107.1, 135.2], rel: [1.7, 2.1], gain: 26.7, gainSd: 13.9 },
  { id: "f2", sex: "F", band: "45–60", n: 41, age: 53.0, ageSd: 4.5, bm: [67.3, 66.6], rm: [105.5, 126.3], rel: [1.6, 1.9], gain: 20.0, gainSd: 12.7 },
  { id: "f3", sex: "F", band: ">60", n: 36, age: 65.2, ageSd: 3.1, bm: [68.6, 67.9], rm: [93.6, 117.9], rel: [1.4, 1.7], gain: 27.0, gainSd: 14.1 },
];

// Non-training controls. Gains are computed from the Table 1 means (no SD reported).
export const CONTROLS: Group[] = [
  { id: "cm", sex: "M", band: "Control", n: 53, age: 49.8, ageSd: 16.9, bm: [79.0, 78.8], rm: [155.1, 161.7], rel: [2.0, 2.0], gain: 4.3, gainSd: null },
  { id: "cf", sex: "F", band: "Control", n: 19, age: 52.3, ageSd: 7.4, bm: [66.9, 66.6], rm: [91.6, 92.8], rel: [1.4, 1.4], gain: 1.3, gainSd: null },
];

export const GROUP_COLOR: Record<string, string> = {
  m1: "#9db4ff",
  m2: "#3d63ff",
  m3: "#1d43d6",
  f1: "#ffffff",
  f2: "#c9d6ff",
  f3: "#7f93d6",
  cm: "#5b6590",
  cf: "#8a90b0",
};

export const SEX_GAIN = {
  men: { mean: 19.4, sd: 9.5 },
  women: { mean: 24.2, sd: 13.8 },
};

export const sexName = (s: Sex) => (s === "M" ? "Men" : "Women");

export const groupName = (g: Group) =>
  g.band === "Control" ? `${sexName(g.sex)} controls` : `${sexName(g.sex)} ${g.band}`;

export const pct = (v: number, digits = 1) =>
  `${v > 0 ? "+" : v < 0 ? "−" : ""}${Math.abs(v).toFixed(digits)}%`;

// ---------- Simulated individual trainees (seeded, for the hero dot field) ----------

export interface Person {
  id: number;
  sex: Sex;
  band: Band;
  size: number;
  strength: number;
}

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function rand() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussian(rand: () => number) {
  const u = Math.max(rand(), 1e-9);
  const v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function truncNormal(rand: () => number, mean: number, sd: number, lo: number, hi: number) {
  for (let i = 0; i < 200; i++) {
    const x = mean + gaussian(rand) * sd;
    if (x >= lo && x <= hi) return x;
  }
  return Math.min(hi, Math.max(lo, mean));
}

/** 287 simulated trainees with the paper's sex/age cell sizes and reported mean ± SD ranges. */
export function makePeople(): Person[] {
  const rand = mulberry32(2016);
  const plan: [Band, Sex, number][] = [
    ["<45", "M", 61],
    ["<45", "F", 27],
    ["45–60", "M", 55],
    ["45–60", "F", 41],
    [">60", "M", 67],
    [">60", "F", 36],
  ];
  const out: Person[] = [];
  for (const [band, sex, n] of plan) {
    for (let i = 0; i < n; i++) {
      out.push({
        id: 0,
        sex,
        band,
        size: truncNormal(rand, SIZE_STATS.mean, SIZE_STATS.sd, SIZE_STATS.min, SIZE_STATS.max),
        strength: truncNormal(rand, STRENGTH_STATS.mean, STRENGTH_STATS.sd, STRENGTH_STATS.min, STRENGTH_STATS.max),
      });
    }
  }
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  out.forEach((p, i) => (p.id = i));
  return out;
}
