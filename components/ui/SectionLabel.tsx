interface SectionLabelProps {
  text: string;
  className?: string;
}

export default function SectionLabel({ text, className = '' }: SectionLabelProps) {
  return (
    <span
      className={`inline-block font-mono text-xs tracking-[0.25em] text-[var(--text-secondary)] uppercase mb-4 ${className}`}
    >
      [ {text} ]
    </span>
  );
}
