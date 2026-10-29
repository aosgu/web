interface SectionLabelProps {
  index: string;
  title: string;
  invert?: boolean;
}

/** Small mono header used at the top of each section. */
export default function SectionLabel({ index, title, invert = false }: SectionLabelProps) {
  return (
    <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-[0.2em]">
      <span className={`inline-block h-px w-10 ${invert ? "bg-paper" : "bg-ink"}`} />
      <span>{index}</span>
      <span className="opacity-50">/ {title}</span>
    </div>
  );
}
