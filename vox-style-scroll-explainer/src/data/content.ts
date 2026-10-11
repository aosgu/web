export const IMG = {
  port: "https://images.pexels.com/photos/15527228/pexels-photo-15527228.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
  thessaloniki:
    "https://images.pexels.com/photos/37845001/pexels-photo-37845001.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
  istanbul:
    "https://images.pexels.com/photos/29565335/pexels-photo-29565335.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
  bwPort:
    "https://images.pexels.com/photos/36023369/pexels-photo-36023369.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
  script:
    "https://images.pexels.com/photos/2355408/pexels-photo-2355408.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
  oldmap:
    "https://images.pexels.com/photos/14436283/pexels-photo-14436283.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
  archive:
    "https://images.pexels.com/photos/39047634/pexels-photo-39047634.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
};

export type Chapter = { n: string; kicker: string; title: string; id: string };

export const CHAPTERS: Chapter[] = [
  { n: "00", kicker: "COLD OPEN", title: "One dot, one line", id: "open" },
  { n: "01", kicker: "THE ROUTE", title: "How an idea walked 4,000 miles", id: "route" },
  { n: "02", kicker: "THE SAND TABLE", title: "Nine days on one front", id: "sand" },
  { n: "03", kicker: "THE DOCUMENT", title: "The sentence that carries the argument", id: "doc" },
  { n: "04", kicker: "THE RACE", title: "Who was producing what", id: "bars" },
  { n: "05", kicker: "THE CURVE", title: "One line, three centuries", id: "curve" },
  { n: "06", kicker: "THE MULTIPLES", title: "The same story, nine ways", id: "multiples" },
  { n: "07", kicker: "THE QUOTE", title: "Typography only, four seconds", id: "quote" },
  { n: "08", kicker: "THE COLLAGE", title: "Everything, at once", id: "collage" },
  { n: "09", kicker: "THE TIMELINE", title: "Then, and then, and then", id: "timeline" },
  { n: "10", kicker: "THE NUMBERS", title: "Five figures worth memorising", id: "numbers" },
  { n: "11", kicker: "THE COMPARE", title: "Same place, 150 years apart", id: "compare" },
];

/* ---------------- bar race ---------------- */

export const BAR_STAGES = ["1000 CE", "1200 CE", "1400 CE", "1600 CE", "1800 CE"];

export type BarItem = { name: string; color: string; values: number[] };

export const BARS: BarItem[] = [
  { name: "SOUTH ASIA", color: "#ea3b24", values: [28, 26, 25, 24, 19] },
  { name: "EAST ASIA", color: "#ffd400", values: [22, 25, 26, 25, 23] },
  { name: "SUB-SAHARAN AFRICA", color: "#0f9d63", values: [12, 11, 10, 8, 7] },
  { name: "WESTERN EUROPE", color: "#4d6bff", values: [9, 10, 13, 17, 24] },
  { name: "MIDDLE EAST", color: "#f28c28", values: [9, 8, 7, 6, 5] },
  { name: "EASTERN EUROPE", color: "#c8b6ff", values: [5, 6, 7, 7, 9] },
  { name: "THE AMERICAS", color: "#7ad0e6", values: [5, 5, 4, 3, 8] },
];

/* ---------------- line chart ---------------- */

export const CURVE_YEARS = [
  1450, 1475, 1500, 1525, 1550, 1575, 1600, 1625, 1650, 1675, 1700, 1725, 1750, 1775, 1800,
];
export const CURVE_PRINT = [0.02, 0.09, 0.35, 0.7, 1.1, 1.6, 2.0, 2.4, 3.1, 4.0, 5.2, 6.8, 9.5, 14, 20];
export const CURVE_SCRIPT = [0.1, 0.12, 0.14, 0.15, 0.15, 0.16, 0.16, 0.17, 0.17, 0.18, 0.18, 0.19, 0.19, 0.2, 0.2];

export const CURVE_NOTES = [
  { year: 1500, text: "Fifty years of presses\nand output is already 17×" },
  { year: 1650, text: "The first dailies:\na standing order for paper" },
  { year: 1800, text: "Steam, and the curve\nstops being a curve" },
];

/* ---------------- timeline ---------------- */

export type Event = {
  year: string;
  pos: number;
  title: string;
  body: string;
  color: string;
  up: boolean;
};

export const EVENTS: Event[] = [
  { year: "105", pos: 0.04, title: "First dated sheet", body: "A court record describes bark and rag pulp pressed into a flat, writeable surface.", color: "#ffd400", up: true },
  { year: "751", pos: 0.17, title: "The river crossing", body: "A skirmish on a Central Asian river moves the craft out of one empire and into another.", color: "#ea3b24", up: false },
  { year: "794", pos: 0.28, title: "Mill on the Tigris", body: "The first state-run mill outside East Asia. Ledger entries survive; the building does not.", color: "#4d6bff", up: true },
  { year: "1150", pos: 0.44, title: "Iberia", body: "Water power arrives in Europe through a peninsula that had been trading east for four centuries.", color: "#0f9d63", up: false },
  { year: "1260", pos: 0.56, title: "Fabriano", body: "Sizing, watermarking, and the stamping mill: three improvements nobody asked a kingdom for.", color: "#f28c28", up: true },
  { year: "1440", pos: 0.72, title: "Movable type", body: "A press without cheap paper is a very expensive paperweight. The two arrive together.", color: "#ffd400", up: false },
  { year: "1803", pos: 0.9, title: "Endless roll", body: "Continuous production replaces the sheet. Output per worker rises by a factor nobody had a word for.", color: "#7ad0e6", up: true },
];

/* ---------------- big numbers ---------------- */

export const NUMBERS = [
  { value: 4000, suffix: " MI", label: "MILES TRAVELLED", note: "overland + by sea, end to end", color: "#ffd400", decimals: 0 },
  { value: 751, suffix: "", label: "THE YEAR IT TURNED", note: "one river, one skirmish, one craft", color: "#ea3b24", decimals: 0 },
  { value: 18, suffix: " MO", label: "CARAVAN TIME", note: "east gate to west gate, no delays", color: "#4d6bff", decimals: 0 },
  { value: 900, suffix: "×", label: "OUTPUT PER SCRIBE", note: "comparing 1400 to 1800, per head", color: "#0f9d63", decimals: 0 },
  { value: 2.4, suffix: " M", label: "SHEETS / YEAR", note: "one mill, one river, one century later", color: "#f28c28", decimals: 1 },
];

/* ---------------- sand table ---------------- */

export type Unit = {
  id: string;
  side: "a" | "b";
  kind: "inf" | "arm" | "arty";
  label: string;
  /** positions at each of the 5 keyframes, in a 1000×600 box */
  track: number[][];
  size?: number;
};

export const UNITS: Unit[] = [
  { id: "a1", side: "a", kind: "arm", label: "4 AR", track: [[120, 150], [215, 150], [300, 148], [360, 145], [405, 143]], size: 1.15 },
  { id: "a2", side: "a", kind: "inf", label: "9 INF", track: [[110, 300], [190, 296], [268, 300], [330, 296], [372, 292]], size: 1 },
  { id: "a3", side: "a", kind: "inf", label: "2 INF", track: [[130, 452], [200, 448], [272, 452], [326, 447], [365, 444]], size: 1 },
  { id: "a4", side: "a", kind: "arty", label: "ARTY", track: [[60, 380], [128, 378], [196, 380], [250, 376], [292, 374]], size: 0.9 },
  { id: "b1", side: "b", kind: "inf", label: "7 GD", track: [[640, 130], [606, 132], [548, 130], [492, 128], [440, 126]], size: 1.1 },
  { id: "b2", side: "b", kind: "arm", label: "1 PZ", track: [[660, 268], [612, 272], [556, 268], [500, 272], [452, 268]], size: 1.15 },
  { id: "b3", side: "b", kind: "inf", label: "3 INF", track: [[648, 420], [600, 424], [540, 420], [486, 424], [438, 418]], size: 1 },
  { id: "b4", side: "b", kind: "inf", label: "5 INF", track: [[700, 520], [652, 522], [596, 518], [542, 522], [496, 516]], size: 0.95 },
];

/** front-line x positions at 9 fixed y values, one row per keyframe */
export const FRONT_KEYS = [
  [640, 610, 645, 620, 600, 630, 615, 640, 625],
  [600, 560, 600, 575, 520, 560, 545, 590, 570],
  [545, 505, 520, 480, 455, 500, 470, 520, 495],
  [480, 430, 470, 405, 410, 440, 400, 455, 430],
  [420, 370, 400, 350, 360, 385, 345, 390, 370],
];

export const FRONT_DAYS = ["DAY 0", "DAY 2", "DAY 4", "DAY 6", "DAY 9"];
export const FRONT_NOTES = [
  "Contact along the ridge line. Both sides dug in, neither committed.",
  "Armour finds the gap at the river bend. The northern hinge starts to fold.",
  "The salient is 40 km deep and 12 km wide — a shape logisticians hate.",
  "Counter-attack fails. Two divisions withdraw across the second river.",
  "The line stabilises on ground that was the objective on day one.",
];

/* ---------------- document ---------------- */

export const DOC_PARAS = [
  {
    text: [
      "By the middle of the ninth century the state was already issuing paper in quantities",
      { hl: "hl-a", t: " that no scribal office could have matched" },
      ", and the ledger entries that survive describe a supply chain rather than a workshop.",
    ],
  },
  {
    text: [
      "What changed was not the recipe. It was the distance the recipe was allowed to travel:",
      { hl: "hl-b", t: " craft moved along the same roads as tax grain" },
      ", and it moved at the speed of a caravan, which is to say at the speed of water.",
    ],
  },
  {
    text: [
      { hl: "hl-c", t: "Every subsequent acceleration in European output is downstream of that fact." },
      " The press did not create the demand for cheap surfaces; it inherited one that had been",
      " building for six hundred years, and it arrived roughly two centuries early by accident.",
    ],
  },
];

export const DOC_NOTES = [
  { at: 0.18, x: 4, y: 21, text: "SOURCE: treasury rolls,\nvol. iv, folio 212" },
  { at: 0.44, x: 4, y: 47, text: "the argument\nlives here →" },
  { at: 0.72, x: 62, y: 74, text: "cited 4,100 times.\nnever once checked." },
];

/* ---------------- collage ---------------- */

export const COLLAGE = [
  { src: IMG.port, cap: "THE PORT, PRESENT DAY", rot: -4, x: 2, y: 6, w: 44, z: 2, tag: "FIG. 1" },
  { src: IMG.script, cap: "HAND, 19TH C.", rot: 5, x: 50, y: 2, w: 34, z: 3, tag: "FIG. 2" },
  { src: IMG.istanbul, cap: "STRAIT FROM ABOVE", rot: 2.5, x: 22, y: 46, w: 40, z: 4, tag: "FIG. 3" },
  { src: IMG.oldmap, cap: "THE SAME COAST, CHARTED", rot: -6, x: 64, y: 40, w: 33, z: 2, tag: "FIG. 4" },
  { src: IMG.bwPort, cap: "ARCHIVE PLATE 88", rot: 7, x: 6, y: 66, w: 26, z: 3, tag: "FIG. 5" },
  { src: IMG.thessaloniki, cap: "DENSITY, UNPLANNED", rot: -2, x: 40, y: 76, w: 38, z: 1, tag: "FIG. 6" },
];
