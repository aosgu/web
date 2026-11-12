export type Cup = { id: number; t: number; mg: number };

export const HALF_LIFE = 5; // hours
export const ABSORB = 0.75; // hours to full absorption
export const DOSE = 95;
export const THRESHOLD = 50;

const smooth = (x: number) => {
  const c = Math.min(1, Math.max(0, x));
  return c * c * (3 - 2 * c);
};

/** caffeine (mg) contributed by one cup at time t (hours) */
export function cupLevel(cup: Cup, t: number): number {
  const age = t - cup.t;
  if (age <= 0) return 0;
  const ramp = age < ABSORB ? smooth(age / ABSORB) : 1;
  return cup.mg * ramp * Math.pow(0.5, age / HALF_LIFE);
}

export function totalLevel(cups: Cup[], t: number): number {
  let s = 0;
  for (const c of cups) s += cupLevel(c, t);
  return s;
}

export function fmtTime(t: number): string {
  let mins = Math.round(t * 60);
  mins = ((mins % 1440) + 1440) % 1440;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/**
 * Latest time the final cup can be taken so that the level at bedtime
 * stays at or under THRESHOLD, keeping all earlier cups as they are.
 */
export function lastCupBy(cups: Cup[], bed: number): number | null {
  const sorted = [...cups].sort((a, b) => a.t - b.t);
  const others = sorted.slice(0, -1);
  const base = totalLevel(others, bed);
  const budget = THRESHOLD - base;
  if (budget <= 0) return null;
  const dose = sorted.length ? sorted[sorted.length - 1].mg : DOSE;
  if (budget >= dose) return bed;
  const hours = HALF_LIFE * Math.log2(dose / budget);
  const t = bed - hours;
  return t < 0 ? null : t;
}
