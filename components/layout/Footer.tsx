import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2 font-grotesk font-bold text-lg tracking-tight">
            SILAS SHAIBU
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
          </Link>

          <nav className="flex flex-wrap items-center gap-6">
            {['Work', 'Services', 'About', 'Contact'].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                {item}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a
              href="https://fiverr.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
              aria-label="Fiverr"
            >
              Fiverr
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
              aria-label="LinkedIn"
            >
              LinkedIn
            </a>
            <a
              href="https://artstation.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
              aria-label="ArtStation"
            >
              ArtStation
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-[var(--border-subtle)] text-center">
          <p className="text-xs text-[var(--text-muted)]">
            © {new Date().getFullYear()} Silas Shaibu. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
