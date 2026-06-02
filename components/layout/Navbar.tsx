'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const navLinks = [
  { label: 'Work', hash: '#projects' },
  { label: 'Services', hash: '#services' },
  { label: 'About', hash: '#about' },
  { label: 'Contact', hash: '#contact' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const base = pathname === '/' ? '' : '/';

  useGSAP(
    () => {
      const nav = navRef.current;
      if (!nav) return;

      ScrollTrigger.create({
        start: 'top -80',
        onEnter: () => nav.classList.add('nav-blurred'),
        onLeaveBack: () => nav.classList.remove('nav-blurred'),
      });
    },
    { scope: navRef }
  );

  useGSAP(
    () => {
      const menu = menuRef.current;
      if (!menu) return;

      if (menuOpen) {
        gsap.fromTo(
          menu,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.3, ease: 'power3.out' }
        );
        const links = menu.querySelectorAll('.mobile-link');
        gsap.fromTo(
          links,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: 0.07, duration: 0.4, delay: 0.1, ease: 'power3.out' }
        );
      }
    },
    { dependencies: [menuOpen] }
  );

  return (
    <>
      <style>{`
        .nav-blurred {
          background: rgba(8,8,8,0.85) !important;
          backdrop-filter: blur(20px) !important;
          -webkit-backdrop-filter: blur(20px) !important;
          border-bottom: 1px solid var(--border-subtle) !important;
        }
      `}</style>

      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{ background: 'transparent' }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-grotesk font-bold text-lg tracking-tight">
            SILAS SHAIBU
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] animate-pulse-glow" />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={`${base}${link.hash}`}
                className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[var(--accent-primary)] group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
            <Link
              href={`${base}#contact`}
              className="px-4 py-2 text-sm font-medium border border-[var(--accent-primary)] text-[var(--accent-primary)] rounded-lg hover:bg-[rgba(0,212,255,0.08)] hover:shadow-[0_0_20px_rgba(0,212,255,0.2)] transition-all duration-300"
            >
              Hire Me
            </Link>
          </div>

          <button
            className="md:hidden text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          ref={menuRef}
          className="fixed inset-0 z-40 bg-[#080808]/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden"
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={`${base}${link.hash}`}
              onClick={() => setMenuOpen(false)}
              className="mobile-link font-grotesk font-semibold text-3xl text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={`${base}#contact`}
            onClick={() => setMenuOpen(false)}
            className="mobile-link mt-4 px-8 py-3 border border-[var(--accent-primary)] text-[var(--accent-primary)] rounded-lg text-lg font-medium hover:bg-[rgba(0,212,255,0.08)] transition-all duration-300"
          >
            Hire Me
          </Link>
        </div>
      )}
    </>
  );
}
