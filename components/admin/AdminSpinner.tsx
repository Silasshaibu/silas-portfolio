export default function AdminSpinner({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-8 h-8 rounded-full border-2 border-[var(--glass-border)] border-t-[var(--accent-primary)] animate-spin" />
      <p className="text-xs font-mono text-[var(--text-muted)]">{label}</p>
    </div>
  );
}
