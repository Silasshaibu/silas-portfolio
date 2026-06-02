'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type ContactLink = { label: string; value: string; href: string };

export default function Footer() {
  const [links, setLinks] = useState<ContactLink[]>([]);

  useEffect(() => {
    fetch('/api/admin/settings', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        try { setLinks(JSON.parse(data.contact_links ?? '[]')); } catch { /* keep empty */ }
      })
      .catch(() => { /* keep empty */ });
  }, []);

  const externalLinks = links.filter(l => !l.href.startsWith('mailto'));

  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto px-6 py-6 md:py-12">
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

          {externalLinks.length > 0 && (
            <div className="flex items-center gap-4">
              {externalLinks.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
                  aria-label={link.label}
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
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
