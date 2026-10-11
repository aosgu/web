import { CITATION, COHORT } from "../lib/data";

const METHOD = [
  ["Design", "Retrospective pooling of ten supervised resistance-training interventions run between 1996 and 2011."],
  ["Training", "Periodized whole-body programme, two supervised sessions a week for 20–24 weeks, at least 90% attendance."],
  ["Muscle size", "Quadriceps cross-sectional area (ultrasound or MRI), vastus lateralis thickness, or leg lean mass (DXA)."],
  ["Strength", "Bilateral leg-press one-repetition maximum (1RM), also expressed relative to body mass."],
];

const DEFINITIONS = [
  ["High responder", "A gain more than 1 SD above the training group's mean. For size that threshold is +10.85%; about 12% of trainees cleared it for both traits."],
  ["Low responder", "A gain below the upper 95% limit of the non-training controls: +1.6% for muscle size and +5.0% for strength."],
  ["Responder cells", "Each cell is a sex × age band from Table 1 of the paper, with group means and standard deviations."],
];

export default function Colophon() {
  return (
    <footer id="source" data-section className="relative overflow-hidden border-t border-white/10 px-6 pb-16 pt-28 md:px-16 lg:px-24">
      <div className="blob -bottom-60 left-1/3 h-[36rem] w-[36rem] opacity-25" />

      <div className="relative grid gap-14 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="kicker flex items-center gap-4">
            <span className="font-mono text-[var(--ice)]">07</span>
            <span className="h-px w-14 bg-[var(--klein-glow)]/60" />
            <span>Source &amp; method</span>
          </div>
          <h2 className="h2 mt-6">
            The paper, <em>plainly</em>.
          </h2>

          <blockquote className="card mt-10 p-7">
            <p className="font-display text-2xl leading-snug text-white">{CITATION.title}.</p>
            <p className="body mt-4 text-sm">{CITATION.authors}.</p>
            <p className="font-mono mt-4 text-[12px] text-[var(--klein-glow)]">
              {CITATION.journal} {CITATION.volume}:{CITATION.article} ({CITATION.year}) · doi:{CITATION.doi}
            </p>
          </blockquote>

          <dl className="mt-10 space-y-5">
            {METHOD.map(([k, v]) => (
              <div key={k} className="grid gap-2 border-t border-white/10 pt-5 md:grid-cols-[9rem_1fr]">
                <dt className="kicker text-[10px]">{k}</dt>
                <dd className="body text-sm">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="space-y-5 lg:pt-24">
          <div className="kicker">Definitions</div>
          {DEFINITIONS.map(([k, v]) => (
            <div key={k} className="card p-6">
              <div className="font-display text-2xl text-white">{k}</div>
              <p className="body mt-3 text-sm">{v}</p>
            </div>
          ))}
          <div className="card p-6">
            <div className="font-display text-2xl text-white">Cohort</div>
            <p className="body mt-3 text-sm">
              {COHORT.trainees} trainees ({COHORT.trainingMen} men, {COHORT.trainingWomen} women), aged {COHORT.ageMin} to{" "}
              {COHORT.ageMax}, plus {COHORT.controls} non-training controls ({COHORT.controlMen} men,{" "}
              {COHORT.controlWomen} women).
            </p>
          </div>
        </div>
      </div>

      <p className="relative mt-20 border-t border-white/10 pt-8 font-mono text-[11px] leading-relaxed tracking-wide text-[var(--mist)]">
        Figures are hand-coded SVG. Means, SDs, ranges, counts and percentages come from the paper. The scatter in the
        opening section is simulated from those summary values and is illustrative only.
      </p>
    </footer>
  );
}
