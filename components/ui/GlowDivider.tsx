interface GlowDividerProps {
  className?: string;
}

export default function GlowDivider({ className = '' }: GlowDividerProps) {
  return (
    <div className={`relative h-px w-full ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent blur-sm opacity-20" />
    </div>
  );
}
