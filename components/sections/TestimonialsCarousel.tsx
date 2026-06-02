'use client';

import { useState, useRef, useEffect } from 'react';
import { Star, ChevronDown, ChevronUp } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import ScrollReveal from '@/components/animations/ScrollReveal';
import type { Testimonial } from '@/types';

const STEP = 3;

const countryCodeMap: Record<string, string> = {
  'Switzerland': 'ch',
  'United States': 'us',
  'Israel': 'il',
  'United Kingdom': 'gb',
  'Nigeria': 'ng',
  'Saudi Arabia': 'sa',
  'Turkey': 'tr',
  'Germany': 'de',
  'Canada': 'ca',
  'Oman': 'om',
  'France': 'fr',
  'Morocco': 'ma',
  'India': 'in',
  'Australia': 'au',
};

function parseCompany(company: string): { service: string; country: string; flagCode: string } {
  const parts = company.split(' · ');
  if (parts.length < 2) return { service: company, country: '', flagCode: '' };
  const country = parts[parts.length - 1].trim();
  return { service: parts[0].trim(), country, flagCode: countryCodeMap[country] ?? '' };
}

const platformColors: Record<string, string> = {
  Fiverr: 'bg-[rgba(29,191,115,0.1)] text-[#1dbf73]',
  LinkedIn: 'bg-[rgba(10,102,194,0.1)] text-[#0a66c2]',
  Direct: 'bg-[rgba(0,212,255,0.1)] text-[var(--accent-primary)]',
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1 mb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < Math.round(rating) ? 'fill-[var(--accent-primary)] text-[var(--accent-primary)]' : 'text-[var(--text-muted)]'}`}
        />
      ))}
    </div>
  );
}

function ReviewCard({ t }: { t: Testimonial }) {
  const [expanded, setExpanded] = useState(false);
  const [clamped, setClamped] = useState(false);
  const pRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = pRef.current;
    if (el) setClamped(el.scrollHeight > el.clientHeight + 1);
  }, []);

  const { service, country, flagCode } = parseCompany(t.company);

  return (
    <div className="glass-card rounded-xl p-6 mb-6 break-inside-avoid">
      <StarRating rating={t.rating} />
      <p
        ref={pRef}
        className={`text-sm text-[var(--text-secondary)] leading-relaxed ${expanded ? '' : 'line-clamp-4'}`}
      >
        &ldquo;{t.quote}&rdquo;
      </p>
      {clamped && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="text-xs font-mono text-[var(--accent-primary)] hover:underline mt-1.5"
        >
          {expanded ? 'Read less' : 'Read more'}
        </button>
      )}
      <div className="flex items-center justify-between mt-6">
        <div>
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-medium text-[var(--text-primary)]">{t.name}</p>
            {flagCode && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`https://flagcdn.com/w20/${flagCode}.png`}
                srcSet={`https://flagcdn.com/w40/${flagCode}.png 2x`}
                alt={country}
                loading="lazy"
                className="rounded-sm object-cover flex-shrink-0 h-[13px] w-auto"
              />
            )}
          </div>
          <p className="text-xs text-[var(--text-muted)]">{service}{country ? ` · ${country}` : ''}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-mono ${platformColors[t.platform]}`}>
          {t.platform}
        </span>
      </div>
    </div>
  );
}

export default function TestimonialsCarousel({ items }: { items: Testimonial[] }) {
  const [count, setCount] = useState(STEP);
  const visible = items.slice(0, count);
  const canShowMore = count < items.length;
  const canShowLess = count > STEP;

  return (
    <section className="section-padding bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal className="text-center mb-4 md:mb-14">
          <SectionLabel text="Social Proof" />
          <h2 className="font-grotesk font-bold text-[clamp(1.8rem,4vw,3rem)] text-[var(--text-primary)]">
            Trusted by Clients Globally
          </h2>
          <p className="text-sm text-[var(--text-muted)] mt-2">{items.length} verified Fiverr reviews</p>
        </ScrollReveal>

        {/* Cards — masonry on desktop via CSS columns */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 mb-8">
          {visible.map((t) => (
            <ReviewCard key={t.id} t={t} />
          ))}
        </div>

        {/* View more / less */}
        {(canShowMore || canShowLess) && (
          <div className="flex items-center justify-center gap-3 mb-14">
            {canShowMore && (
              <button
                type="button"
                onClick={() => setCount((c) => Math.min(items.length, c + STEP))}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card text-sm text-[var(--text-primary)] hover:text-[var(--accent-primary)] hover:border-[rgba(0,212,255,0.3)] transition-colors"
              >
                View More <ChevronDown className="w-4 h-4" />
              </button>
            )}
            {canShowLess && (
              <button
                type="button"
                onClick={() => setCount(STEP)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:border-[rgba(0,212,255,0.3)] transition-colors"
              >
                View Less <ChevronUp className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        <ScrollReveal delay={0.3}>
          <div className="glass-card rounded-xl p-6 text-center">
            <div className="flex flex-wrap items-center justify-center gap-6 mb-4">
              {['50+ Projects', '5-Star Reviews', 'Fiverr Level Seller', 'Featured on Client YouTube Channels'].map(
                (metric) => (
                  <span key={metric} className="text-sm font-mono text-[var(--accent-primary)]">
                    · {metric}
                  </span>
                )
              )}
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Selected works featured on client YouTube channels and internal marketing materials.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
