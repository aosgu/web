export type Pathway = {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  accent: string;
  accentSoft: string;
  glow: string;
  icon: string;
  stat: { value: string; label: string };
  mechanisms: {
    name: string;
    tag: string;
    detail: string;
  }[];
  takeaway: string;
};

export const pathways: Pathway[] = [
  {
    id: "cognition",
    index: "01",
    title: "Cognitive Decline & Dementia",
    subtitle: "The Auditory Cortex",
    accent: "#a78bfa",
    accentSoft: "rgba(167,139,250,0.12)",
    glow: "rgba(167,139,250,0.45)",
    icon: "brain",
    stat: { value: "5×", label: "dementia risk with severe hearing loss" },
    mechanisms: [
      {
        name: "Cognitive Load Hypothesis",
        tag: "Resource Reallocation",
        detail:
          "A degraded auditory signal forces the brain to over-recruit frontal and parietal regions just to decode speech. This 'listening effort' cannibalizes working memory and executive capacity that would otherwise encode experience into long-term memory.",
      },
      {
        name: "Sensory-Driven Brain Atrophy",
        tag: "Structural Change",
        detail:
          "Chronic deprivation accelerates gray-matter volume loss in the temporal lobes and hippocampus. MRI studies show faster whole-brain atrophy in adults with untreated hearing loss — the brain literally shrinks where input is withdrawn.",
      },
      {
        name: "Isolation Cascade",
        tag: "Disuse Acceleration",
        detail:
          "Reduced conversational engagement withdraws the daily cognitive stimulation that builds cognitive reserve. Less stimulation means faster decline along an already loaded system.",
      },
    ],
    takeaway:
      "The 2020 Lancet Commission named untreated hearing loss the single largest modifiable risk factor for dementia — accounting for roughly 8% of cases worldwide.",
  },
  {
    id: "depression",
    index: "02",
    title: "Depression & Anxiety",
    subtitle: "The Limbic System",
    accent: "#38bdf8",
    accentSoft: "rgba(56,189,248,0.12)",
    glow: "rgba(56,189,248,0.4)",
    icon: "limbic",
    stat: { value: "1.9×", label: "odds of clinically significant depression" },
    mechanisms: [
      {
        name: "HPA-Axis Dysregulation",
        tag: "Chronic Stress",
        detail:
          "Constant, exhausting listening effort and social strain keep the hypothalamic–pituitary–adrenal axis activated. Sustained cortisol elevation remodels the amygdala and prefrontal cortex, lowering the threshold for anxiety and low mood.",
      },
      {
        name: "Reward-Circuit Withdrawal",
        tag: "Monoamine Shift",
        detail:
          "As conversation becomes effortful, rewarding social interaction drops off. Reduced dopaminergic and serotonergic tone in the mesolimbic pathway dulls motivation — the neurochemistry of anhedonia.",
      },
      {
        name: "Communication Breakdown",
        tag: "Relational Strain",
        detail:
          "Mishearings seed embarrassment, withdrawal, and paranoia in relationships. The resulting loss of social support is itself a powerful, measurable driver of depressive illness.",
      },
    ],
    takeaway:
      "Large cohort studies link hearing loss to nearly double the odds of depression in older adults — an effect that persists after controlling for age, sex, and socioeconomic status.",
  },
  {
    id: "falls",
    index: "03",
    title: "Falls & Balance Failure",
    subtitle: "The Vestibular Labyrinth",
    accent: "#fbbf24",
    accentSoft: "rgba(251,191,36,0.12)",
    glow: "rgba(251,191,36,0.4)",
    icon: "vestibular",
    stat: { value: "1.4×", label: "fall risk for every additional 10 dB lost" },
    mechanisms: [
      {
        name: "Shared Inner-Ear Architecture",
        tag: "Anatomy",
        detail:
          "The cochlea and the balance organs — utricle, saccule, and three semicircular canals — share one bony labyrinth, one endolymph fluid, and a single blood supply. Damage to hearing hair cells frequently damages vestibular hair cells too.",
      },
      {
        name: "Lost Spatial Cues",
        tag: "Awareness",
        detail:
          "Sound reflections give the brain subconscious spatial awareness of surfaces, openings, and hazards. Removing this auditory map degrades postural orientation and increases sway, especially in low light.",
      },
      {
        name: "Attention Diversion",
        tag: "Dual-Task Cost",
        detail:
          "When cognitive bandwidth is consumed by decoding speech, less remains for the real-time postural control and gait regulation that prevent a stumble. The result is measurable instability.",
      },
    ],
    takeaway:
      "In a landmark study, each 10 dB of hearing loss raised the odds of a serious fall by 40% — and even mild loss roughly tripled fall risk. Falls remain the leading cause of injury death in older adults.",
  },
  {
    id: "cardiovascular",
    index: "04",
    title: "Cardiovascular Disease",
    subtitle: "The Cochlear Microvasculature",
    accent: "#fb7185",
    accentSoft: "rgba(251,113,133,0.12)",
    glow: "rgba(251,113,133,0.4)",
    icon: "heart",
    stat: { value: "2×", label: "hearing-loss risk in patients with diabetes" },
    mechanisms: [
      {
        name: "The End-Artery Vulnerability",
        tag: "Ischemia",
        detail:
          "The inner ear is fed by the labyrinthine artery — a terminal end artery with no collateral circulation. Its hair cells and stria vascularis are extraordinarily oxygen-hungry, so any drop in microvascular flow causes immediate, permanent damage.",
      },
      {
        name: "Stria Vascularis Failure",
        tag: "Endocochlear Potential",
        detail:
          "Hypertension, diabetes, and atherosclerosis injure the capillary network of the stria vascularis, which generates the +80 mV endocochlear potential powering transduction. As the stria fails, the ear's amplifier collapses.",
      },
      {
        name: "Shared Systemic Disease",
        tag: "Canary in the Coal Mine",
        detail:
          "Because the cochlear vasculature mirrors the body's microcirculation, a hearing-loss pattern can be an early warning sign of broader endothelial dysfunction and coronary artery disease.",
      },
    ],
    takeaway:
      "Cardiovascular risk factors damage the ear's fragile blood supply — and conversely, unusual hearing-loss patterns can flag occult vascular disease. The heart and the inner ear age on a shared timeline.",
  },
  {
    id: "isolation",
    index: "05",
    title: "Social Isolation & Loneliness",
    subtitle: "The Systemic Inflammation Response",
    accent: "#2dd4bf",
    accentSoft: "rgba(45,212,191,0.12)",
    glow: "rgba(45,212,191,0.4)",
    icon: "network",
    stat: { value: "32%", label: "higher all-cause mortality from chronic loneliness" },
    mechanisms: [
      {
        name: "Broken Social Graph",
        tag: "Behavioral",
        detail:
          "When understanding a group conversation demands effort, people withdraw — declining dinners, meetings, and calls. The social network that supports health quietly collapses node by node.",
      },
      {
        name: "Inflammatory Re-Education",
        tag: "Immune Shift",
        detail:
          "Perceived loneliness activates a conserved threat program: elevated C-reactive protein, interleukin-6, and fibrinogen. This low-grade, chronic inflammation quietly fuels atherosclerosis and neurodegeneration.",
      },
      {
        name: "Accelerated Cellular Aging",
        tag: "Telomere Erosion",
        detail:
          "Chronic loneliness shortens leukocyte telomeres and alters gene expression in a way that resembles accelerated aging — compounding the toll of every other pathway on this list.",
      },
    ],
    takeaway:
      "Chronic loneliness rivals smoking as a mortality risk — yet the link from hearing loss to isolation is one of the most overlooked drivers of premature death. Hearing is social, and social is biological.",
  },
];
