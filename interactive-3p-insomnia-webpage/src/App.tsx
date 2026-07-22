import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

type StageId = "predisposing" | "precipitating" | "perpetuating";

type Stage = {
  id: StageId;
  index: string;
  name: string;
  role: string;
  headline: string;
  description: string;
  examples: string;
  color: string;
};

const stages: Stage[] = [
  {
    id: "predisposing",
    index: "P1",
    name: "Predisposing",
    role: "The terrain",
    headline: "What makes sleep more vulnerable?",
    description:
      "Long-standing traits can lower the amount of stress needed to disrupt sleep. They create susceptibility, not certainty.",
    examples:
      "Hyperarousal / genetic tendency / anxious temperament / circadian sensitivity",
    color: "#C9A7FF",
  },
  {
    id: "precipitating",
    index: "P2",
    name: "Precipitating",
    role: "The spark",
    headline: "What starts the sleepless period?",
    description:
      "A new event raises arousal or disturbs timing. The original trigger may be intense, temporary, and completely understandable.",
    examples: "Illness / loss / work pressure / pain / travel / a major life change",
    color: "#FF7B5C",
  },
  {
    id: "perpetuating",
    index: "P3",
    name: "Perpetuating",
    role: "The loop",
    headline: "What teaches insomnia to remain?",
    description:
      "Protective responses can accidentally weaken sleep drive and pair bed with alertness, even after the first trigger has faded.",
    examples:
      "More time in bed / irregular rising / naps / clock-watching / trying hard to sleep",
    color: "#C7FF4A",
  },
];

const treatments = [
  {
    label: "Consolidate",
    title: "Make sleep pressure count.",
    body: "Match time in bed more closely to actual sleep, using a structured plan. This strengthens sleep drive and reduces long, wakeful stretches in bed.",
    note: "Sleep restriction or compression",
  },
  {
    label: "Anchor",
    title: "Give the body clock one clear signal.",
    body: "A stable wake time and well-timed light help the circadian system predict when wakefulness ends and sleep begins.",
    note: "Consistent timing",
  },
  {
    label: "Reassociate",
    title: "Let the bed mean sleep again.",
    body: "Stimulus control reduces the learned link between bed and struggle by moving prolonged wakefulness elsewhere until sleepiness returns.",
    note: "Stimulus control",
  },
  {
    label: "Disarm",
    title: "Stop treating sleep like a test.",
    body: "Cognitive and attentional strategies soften clock-watching, catastrophic predictions, and the effortful monitoring that keeps arousal online.",
    note: "Cognitive work",
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

function ArrowDown() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M12 3v17M5 13l7 7 7-7" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ArrowUpRight() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M6 18 18 6M8 6h10v10" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function SectionIntro({
  number,
  eyebrow,
  title,
  body,
}: {
  number: string;
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <motion.div
      className="section-intro"
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 0.75, ease }}
    >
      <div className="section-kicker">
        <span>{number}</span>
        <span>{eyebrow}</span>
      </div>
      <h2>{title}</h2>
      <p>{body}</p>
    </motion.div>
  );
}

function ModelOrbit({ active }: { active: StageId }) {
  return (
    <div className="model-orbit" aria-hidden="true">
      <div className="orbit-center">
        <span>INSOMNIA</span>
        <small>OVER TIME</small>
      </div>
      {stages.map((stage, index) => (
        <motion.div
          className={`orbit-ring orbit-ring-${index + 1}`}
          key={stage.id}
          animate={{
            opacity: active === stage.id ? 1 : 0.24,
            scale: active === stage.id ? 1.015 : 1,
          }}
          transition={{ duration: 0.55, ease }}
          style={{ borderColor: stage.color }}
        >
          <span className="orbit-dot" style={{ background: stage.color }} />
          <span className="orbit-name" style={{ color: stage.color }}>
            {stage.index}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

function ModelSection() {
  const [active, setActive] = useState<StageId>("predisposing");

  return (
    <section className="model-section" id="model">
      <SectionIntro
        number="01"
        eyebrow="THE ARCHITECTURE"
        title="Insomnia is not one thing."
        body="The 3P Model follows a sequence: the terrain beneath sleep, the event that disrupts it, and the responses that can keep disruption alive."
      />

      <div className="model-composition">
        <div className="model-sticky">
          <ModelOrbit active={active} />
          <p className="orbit-caption">
            Select each P to isolate its role. In real life, all three can overlap.
          </p>
        </div>

        <div className="stage-list">
          {stages.map((stage) => {
            const isActive = active === stage.id;
            return (
              <motion.button
                type="button"
                className={`stage-row ${isActive ? "is-active" : ""}`}
                key={stage.id}
                onClick={() => setActive(stage.id)}
                onMouseEnter={() => setActive(stage.id)}
                aria-expanded={isActive}
                whileTap={{ scale: 0.99 }}
              >
                <span className="stage-index" style={{ color: stage.color }}>
                  {stage.index}
                </span>
                <span className="stage-name-wrap">
                  <span className="stage-role">{stage.role}</span>
                  <span className="stage-name">{stage.name}</span>
                </span>
                <span className="stage-plus" style={{ color: stage.color }}>
                  {isActive ? "-" : "+"}
                </span>

                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.span
                      className="stage-detail"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease }}
                    >
                      <strong>{stage.headline}</strong>
                      <span>{stage.description}</span>
                      <small>{stage.examples}</small>
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function makeLinePath(values: number[], maxValue = 140) {
  const width = 800;
  const top = 24;
  const bottom = 322;
  return values
    .map((value, index) => {
      const x = 18 + (index / (values.length - 1)) * (width - 36);
      const y = bottom - (Math.min(value, maxValue) / maxValue) * (bottom - top);
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

function ThresholdLab() {
  const [predisposition, setPredisposition] = useState(38);
  const [trigger, setTrigger] = useState(62);
  const [loop, setLoop] = useState(52);

  const chart = useMemo(() => {
    const base: number[] = [];
    const spark: number[] = [];
    const habit: number[] = [];
    const total: number[] = [];

    for (let i = 0; i <= 64; i += 1) {
      const day = (i / 64) * 12;
      const baseValue = predisposition * 0.72 + Math.sin(day * 1.3) * 1.4;
      const sparkValue = trigger * 0.86 * Math.exp(-Math.pow(day - 3.4, 2) / 4.5);
      const loopValue =
        day < 3 ? 0 : loop * 0.86 * (1 - Math.exp(-(day - 3) / 2.2));
      base.push(baseValue);
      spark.push(sparkValue);
      habit.push(loopValue);
      total.push(baseValue + sparkValue + loopValue);
    }

    const peak = Math.max(...total);
    const late = total[total.length - 1];
    const threshold = 72;
    const state =
      late >= threshold
        ? {
            label: "THE LOOP IS CARRYING IT",
            copy: "The trigger has faded, but perpetuating pressure keeps the pattern above the illustrative threshold.",
            color: "#C7FF4A",
          }
        : peak >= threshold
          ? {
              label: "A SHORT-TERM CROSSING",
              copy: "The spark briefly pushes sleep beyond the threshold, then pressure settles as the trigger recedes.",
              color: "#FF7B5C",
            }
          : {
              label: "BELOW THE THRESHOLD",
              copy: "The combined pressures remain below the model's illustrative insomnia threshold.",
              color: "#C9A7FF",
            };

    return {
      base: makeLinePath(base),
      spark: makeLinePath(spark),
      habit: makeLinePath(habit),
      total: makeLinePath(total),
      endX: 782,
      endY: 322 - (Math.min(late, 140) / 140) * 298,
      state,
    };
  }, [predisposition, trigger, loop]);

  return (
    <section className="lab-section" id="lab">
      <SectionIntro
        number="02"
        eyebrow="THRESHOLD LAB"
        title="Build a sleepless pattern."
        body="Adjust the three pressures. Watch how a temporary spike can become a lasting pattern when the third P remains high."
      />

      <motion.div
        className="lab"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.8, ease }}
      >
        <div className="lab-controls">
          <p className="lab-label">Drag to change the model</p>
          <Slider
            color={stages[0].color}
            label="Predisposition"
            value={predisposition}
            onChange={setPredisposition}
          />
          <Slider
            color={stages[1].color}
            label="Trigger intensity"
            value={trigger}
            onChange={setTrigger}
          />
          <Slider
            color={stages[2].color}
            label="Perpetuating load"
            value={loop}
            onChange={setLoop}
          />

          <div className="lab-result" aria-live="polite">
            <span className="result-signal" style={{ background: chart.state.color }} />
            <strong style={{ color: chart.state.color }}>{chart.state.label}</strong>
            <p>{chart.state.copy}</p>
          </div>
        </div>

        <div className="chart-wrap">
          <div className="chart-legend" aria-hidden="true">
            {stages.map((stage) => (
              <span key={stage.id}>
                <i style={{ background: stage.color }} />
                {stage.name}
              </span>
            ))}
            <span>
              <i className="total-key" />Total pressure
            </span>
          </div>
          <svg
            className="threshold-chart"
            viewBox="0 0 800 360"
            role="img"
            aria-label="An interactive graph showing the three factors combining across time"
          >
            <defs>
              <linearGradient id="pressureFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor={chart.state.color} stopOpacity="0.24" />
                <stop offset="1" stopColor={chart.state.color} stopOpacity="0" />
              </linearGradient>
              <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <g className="chart-grid">
              <line x1="18" x2="782" y1="93" y2="93" />
              <line x1="18" x2="782" y1="172" y2="172" />
              <line x1="18" x2="782" y1="251" y2="251" />
            </g>
            <line className="threshold-line" x1="18" x2="782" y1="169" y2="169" />
            <text className="threshold-text" x="28" y="158">
              ILLUSTRATIVE THRESHOLD
            </text>
            <path d={`${chart.total} L782,322 L18,322 Z`} fill="url(#pressureFill)" />
            <motion.path
              className="component-line"
              animate={{ d: chart.base }}
              stroke={stages[0].color}
              transition={{ duration: 0.45, ease }}
            />
            <motion.path
              className="component-line"
              animate={{ d: chart.spark }}
              stroke={stages[1].color}
              transition={{ duration: 0.45, ease }}
            />
            <motion.path
              className="component-line"
              animate={{ d: chart.habit }}
              stroke={stages[2].color}
              transition={{ duration: 0.45, ease }}
            />
            <motion.path
              className="total-line"
              animate={{ d: chart.total }}
              transition={{ duration: 0.45, ease }}
            />
            <motion.circle
              className="chart-endpoint"
              animate={{ cx: chart.endX, cy: chart.endY }}
              r="5"
              fill={chart.state.color}
              filter="url(#softGlow)"
              transition={{ duration: 0.45, ease }}
            />
            <text className="axis-text" x="18" y="349">
              TRIGGER ARRIVES
            </text>
            <text className="axis-text" x="782" y="349" textAnchor="end">
              TIME PASSES
            </text>
          </svg>
          <p className="chart-note">
            A conceptual illustration, not a diagnostic calculator. Real insomnia is shaped by
            biology, context, health, and time.
          </p>
        </div>
      </motion.div>
    </section>
  );
}

function Slider({
  color,
  label,
  value,
  onChange,
}: {
  color: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="slider-field">
      <span>
        <strong>{label}</strong>
        <b style={{ color }}>{value}</b>
      </span>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        style={{ accentColor: color }}
      />
    </label>
  );
}

function TreatmentSection() {
  const [active, setActive] = useState(0);
  const treatment = treatments[active];

  return (
    <section className="treatment-section" id="treatment">
      <SectionIntro
        number="03"
        eyebrow="THE EXIT"
        title="Break the third loop."
        body="The original trigger cannot always be removed. Treatment can still change the learned cycle that keeps insomnia going."
      />

      <div className="treatment-composition">
        <motion.div
          className="loop-visual"
          initial={{ opacity: 0, scale: 0.86 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.9, ease }}
          aria-hidden="true"
        >
          <div className="loop-copy loop-copy-1">WAKEFUL NIGHT</div>
          <div className="loop-copy loop-copy-2">MORE TIME IN BED</div>
          <div className="loop-copy loop-copy-3">LESS SLEEP DRIVE</div>
          <div className="loop-copy loop-copy-4">MORE SLEEP EFFORT</div>
          <div className="loop-ring" />
          <motion.div
            className="loop-break"
            animate={{ rotate: active * 90 }}
            transition={{ duration: 0.65, ease }}
          >
            <span />
          </motion.div>
          <div className="loop-center">
            <span>CBT-I</span>
            <small>CHANGES THE CYCLE</small>
          </div>
        </motion.div>

        <div className="treatment-panel">
          <div className="treatment-tabs" role="tablist" aria-label="CBT-I strategies">
            {treatments.map((item, index) => (
              <button
                type="button"
                role="tab"
                aria-selected={active === index}
                key={item.label}
                className={active === index ? "is-active" : ""}
                onClick={() => setActive(index)}
              >
                <span>0{index + 1}</span>
                {item.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              className="treatment-detail"
              key={treatment.label}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease }}
            >
              <span>{treatment.note}</span>
              <h3>{treatment.title}</h3>
              <p>{treatment.body}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <p className="treatment-note">
        Cognitive behavioral therapy for insomnia (CBT-I) is the recommended first-line treatment
        for chronic insomnia. A trained clinician can tailor it for medical and psychiatric needs.
      </p>
    </section>
  );
}

function App() {
  const appRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroImageY = useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : 130]);
  const heroTextY = useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : -70]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.82], [1, 0.12]);

  useEffect(() => {
    const node = appRef.current;
    if (!node) return;

    const moveGlow = (event: PointerEvent) => {
      node.style.setProperty("--pointer-x", `${event.clientX}px`);
      node.style.setProperty("--pointer-y", `${event.clientY}px`);
    };
    window.addEventListener("pointermove", moveGlow, { passive: true });
    return () => window.removeEventListener("pointermove", moveGlow);
  }, []);

  return (
    <div className="app-shell" ref={appRef}>
      <div className="ambient-glow" aria-hidden="true" />
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="3P Sleep Medicine home">
          <span>3P</span>
          <small>SLEEP MEDICINE</small>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#model">The model</a>
          <a href="#lab">Threshold lab</a>
          <a href="#treatment">Treatment</a>
        </nav>
        <a className="header-index" href="#sources">
          <span>INDEX</span>
          <ArrowUpRight />
        </a>
      </header>

      <main>
        <section className="hero" id="top" ref={heroRef}>
          <motion.div className="hero-image-plane" style={{ y: heroImageY }}>
            <img
              src="/images/insomnia-hero.jpg"
              alt="A person lying awake in a dark bed at night"
            />
          </motion.div>
          <div className="hero-shade" />
          <svg
            className="hero-signals"
            viewBox="0 0 1600 900"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {[
              {
                d: "M-50 670 C260 475 455 795 740 565 S1250 365 1680 545",
                color: stages[0].color,
                delay: 0.2,
              },
              {
                d: "M-80 735 C270 555 445 845 795 630 S1260 405 1680 620",
                color: stages[1].color,
                delay: 0.42,
              },
              {
                d: "M-80 805 C280 640 500 885 835 700 S1270 515 1680 690",
                color: stages[2].color,
                delay: 0.64,
              },
            ].map((signal) => (
              <motion.path
                key={signal.color}
                d={signal.d}
                stroke={signal.color}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.76 }}
                transition={{ duration: reducedMotion ? 0 : 1.8, delay: signal.delay, ease }}
              />
            ))}
          </svg>

          <motion.div className="hero-content" style={{ y: heroTextY, opacity: heroOpacity }}>
            <motion.p
              className="hero-eyebrow"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7, ease }}
            >
              A VISUAL FIELD GUIDE TO INSOMNIA
            </motion.p>
            <h1>
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.12, duration: 0.9, ease }}
              >
                THE 3P
              </motion.span>
              <motion.span
                className="hero-model"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.27, duration: 0.9, ease }}
              >
                MODEL
              </motion.span>
            </h1>
            <motion.div
              className="hero-bottom"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              <p>
                Why sleeplessness starts,
                <br />
                catches fire, and learns to stay.
              </p>
              <a href="#model" className="enter-link">
                <span>ENTER THE MODEL</span>
                <i>
                  <ArrowDown />
                </i>
              </a>
            </motion.div>
          </motion.div>
        </section>

        <section className="thesis" aria-label="The model in one sentence">
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.9, ease }}
          >
            Vulnerability sets the stage. <em>A trigger starts the night.</em> Response decides
            what happens next.
          </motion.p>
        </section>

        <ModelSection />
        <ThresholdLab />
        <TreatmentSection />

        <section className="takeaway">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 1 }}
          >
            <p>REMEMBER THIS</p>
            <h2>
              The first two Ps can start insomnia.
              <br />
              <em>The third is where it learns to stay.</em>
            </h2>
            <a href="#top">
              REPLAY FROM THE TOP <ArrowUpRight />
            </a>
          </motion.div>
        </section>
      </main>

      <footer id="sources">
        <div className="footer-mark">
          <span>3P</span>
          <p>A clearer way to see a restless night.</p>
        </div>
        <div className="footer-sources">
          <strong>SOURCE NOTE</strong>
          <p>
            Based on the behavioral 3P Model described by Spielman, Caruso, and Glovinsky in
            <cite>A Behavioral Perspective on Insomnia Treatment</cite> (1987).
          </p>
          <a
            href="https://pubmed.ncbi.nlm.nih.gov/3332317/"
            target="_blank"
            rel="noreferrer"
          >
            VIEW REFERENCE <ArrowUpRight />
          </a>
        </div>
        <div className="footer-disclaimer">
          <strong>MEDICAL NOTE</strong>
          <p>
            Educational only. Persistent sleep difficulty deserves assessment by a qualified
            health professional. Seek urgent care for immediate safety concerns.
          </p>
        </div>
        <div className="footer-bottom">
          <span>AN INTERACTIVE SLEEP MEDICINE EXPLAINER</span>
          <span>END / 03</span>
        </div>
      </footer>
    </div>
  );
}

export default App;