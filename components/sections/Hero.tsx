'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ChevronDown } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const overlineRef = useRef<HTMLSpanElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from(overlineRef.current, { opacity: 0, y: 20, duration: 0.6 }, 0.3)
        .from(subtextRef.current, { opacity: 0, y: 20, duration: 0.6 }, 0.8)
        .from(ctaRef.current, { opacity: 0, scale: 0.95, duration: 0.5 }, 1.0)
        .from(
          statsRef.current?.children ?? [],
          { opacity: 0, x: -20, stagger: 0.1, duration: 0.5 },
          1.2
        )
        .from(scrollRef.current, { opacity: 0, duration: 0.5 }, 1.5);

      // H1 word split
      const h1 = heroRef.current?.querySelector('.hero-h1') as HTMLElement;
      if (h1) {
        const words = h1.innerText.split(' ');
        h1.innerHTML = words
          .map(
            (w) =>
              `<span style="display:inline-block;overflow:hidden;vertical-align:bottom;margin-right:0.3em"><span class="h1-word" style="display:inline-block">${w}</span></span>`
          )
          .join('');
        tl.from('.h1-word', { opacity: 0, y: 60, stagger: 0.05, duration: 0.7 }, 0.5);
      }
    },
    { scope: heroRef }
  );

  return (
    <section ref={heroRef} className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden mesh-bg">
      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-[var(--accent-primary)] opacity-[0.04] blur-[100px] animate-float pointer-events-none" />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[var(--accent-secondary)] opacity-[0.04] blur-[120px] animate-float pointer-events-none"
        style={{ animationDelay: '2s' }}
      />
      <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full bg-[var(--accent-primary)] opacity-[0.03] blur-[80px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-24 pb-16">
        <span
          ref={overlineRef}
          className="inline-block font-mono text-xs tracking-[0.3em] text-[var(--text-secondary)] mb-6"
        >
          [ 3D VISUALIZATION · MOTION DESIGN · ENGINEERING ]
        </span>

        <h1 className="hero-h1 font-grotesk font-bold leading-[1.1] mb-6 text-[clamp(2.5rem,6vw,4.5rem)] text-[var(--text-primary)]">
          Bringing Engineering &amp; Products to Life in 3D
        </h1>

        <p
          ref={subtextRef}
          className="text-[clamp(1rem,2vw,1.2rem)] text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          I design cinematic 3D animations and product visuals that help manufacturers, brands, and
          engineering firms communicate complex ideas with clarity.
        </p>

        <div ref={ctaRef} className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <Button variant="primary" href="#projects">
            View Projects
          </Button>
          <Button variant="outline" href="#showreel">
            Watch Reel
          </Button>
        </div>

        <div ref={statsRef} className="flex flex-wrap items-center justify-center gap-3">
          {['50+ Projects', '5 Years Experience', 'Industrial & Medical Specialist'].map((stat) => (
            <span
              key={stat}
              className="px-4 py-2 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] text-sm text-[var(--text-secondary)] font-mono"
            >
              {stat}
            </span>
          ))}
        </div>
      </div>

      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce-arrow"
      >
        <span className="text-xs font-mono text-[var(--text-muted)] tracking-widest">SCROLL</span>
        <ChevronDown className="w-5 h-5 text-[var(--text-muted)]" />
      </div>
    </section>
  );
}
