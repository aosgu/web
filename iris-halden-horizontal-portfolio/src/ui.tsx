import type { ReactNode } from "react";

/* ── sheet registry ──────────────────────────────────────────────── */
export const SHEETS = [
  { id: "cover", nav: "00 · COVER", tag: "Sheet 00 — Cover", title: "Title Sheet" },
  { id: "statement", nav: "01 · Statement", tag: "Sheet 01 — Statement", title: "Statement of Intent" },
  { id: "work", nav: "02 · Work", tag: "Sheet 02 — Selected Work", title: "Selected Work 2023–26" },
  { id: "capability", nav: "03 · Capability", tag: "Sheet 03 — Capability", title: "Capability Index" },
  { id: "record", nav: "04 · Record", tag: "Sheet 04 — Record", title: "Recognition & Record" },
  { id: "contact", nav: "05 · Contact", tag: "Sheet 05 — Contact", title: "Contact / Colophon" },
];

export const pad2 = (n: number) => String(n).padStart(2, "0");

/* ── annotation primitives ────────────────────────────────────────── */
export function Eyebrow({
  children,
  tone = "pen",
}: {
  children: ReactNode;
  tone?: "pen" | "cobalt" | "ash";
}) {
  const sq = tone === "pen" ? "bg-pen" : tone === "cobalt" ? "bg-cobalt" : "bg-ash";
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase leading-none tracking-[0.22em] text-ash">
      <span aria-hidden className={`inline-block h-[7px] w-[7px] ${sq}`} />
      {children}
    </span>
  );
}

export function SectionHead({
  num,
  title,
  right,
}: {
  num: string;
  title: ReactNode;
  right?: string;
}) {
  return (
    <div
      data-rise
      className="mb-7 flex flex-wrap items-baseline gap-x-5 gap-y-2 border-b border-ink pb-3"
    >
      <span className="font-mono text-[11px] font-medium tracking-[0.2em] text-pen">§ {num}</span>
      <h2 className="expanded font-display text-[clamp(1.5rem,3vw,2.75rem)] font-black uppercase leading-none tracking-[-0.035em]">
        {title}
      </h2>
      {right ? (
        <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.2em] text-ash">
          {right}
        </span>
      ) : null}
    </div>
  );
}

export function SheetTag({ label }: { label: string }) {
  return (
    <div className="pointer-events-none absolute left-4 top-1/2 hidden -translate-y-1/2 xl:block">
      <span
        className="font-mono text-[10px] uppercase tracking-[0.34em] text-ash"
        style={{ writingMode: "vertical-rl" }}
      >
        {label}
      </span>
      <span aria-hidden className="absolute -left-3 top-1/2 h-8 w-px -translate-y-1/2 bg-rule" />
    </div>
  );
}

export function Spec({ rows }: { rows: readonly (readonly [string, string])[] }) {
  return (
    <dl className="border-t border-rule">
      {rows.map(([k, v]) => (
        <div key={k} className="flex gap-4 border-b border-rule py-2">
          <dt className="w-[86px] shrink-0 font-mono text-[9px] uppercase leading-5 tracking-[0.2em] text-ash">
            {k}
          </dt>
          <dd className="font-mono text-[11px] leading-5 tracking-[0.02em] text-ink">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ── drawn marks ─────────────────────────────────────────────────── */
export function Monogram({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden focusable="false">
      <circle cx="20" cy="20" r="17.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M20 2.5V37.5M2.5 20H37.5" stroke="currentColor" strokeWidth="0.6" opacity="0.45" />
      <path d="M11 13.5V26.5M29 13.5V26.5M11 20H29" stroke="#0A7A52" strokeWidth="2.2" fill="none" />
      <circle cx="20" cy="20" r="2.4" fill="#123C8C" />
    </svg>
  );
}

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 12" className={className} aria-hidden focusable="false">
      <path d="M0 6H22M16 1l6 5-6 5" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
