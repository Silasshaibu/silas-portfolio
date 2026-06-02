'use client';

import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import ScrollReveal from '@/components/animations/ScrollReveal';
import type { Testimonial } from '@/types';

const PER_PAGE = 3;

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

export default function TestimonialsCarousel({ items }: { items: Testimonial[] }) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(items.length / PER_PAGE);
  const visible = items.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  return (
    <section className="section-padding bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal className="text-center mb-14">
          <SectionLabel text="Social Proof" />
          <h2 className="font-grotesk font-bold text-[clamp(1.8rem,4vw,3rem)] text-[var(--text-primary)]">
            Trusted by Clients Globally
          </h2>
          <p className="text-sm text-[var(--text-muted)] mt-2">{items.length} verified Fiverr reviews</p>
        </ScrollReveal>

        {/* Cards + side arrows */}
        <div className="relative mb-8">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            aria-label="Previous"
            className={`absolute -left-5 top-1/2 -translate-y-1/2 p-2 rounded-full glass-card hover:text-[var(--accent-primary)] transition-colors z-10 ${page === 0 ? 'invisible' : ''}`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((t, i) => (
              <ScrollReveal key={t.id} delay={i * 0.1}>
                <div className="glass-card rounded-xl p-6 h-full flex flex-col">
                  <StarRating rating={t.rating} />
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed flex-1 mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  {(() => { const { service, country, flagCode } = parseCompany(t.company); return (
                  <div className="flex items-center justify-between">
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
                  ); })()}
                </div>
              </ScrollReveal>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            aria-label="Next"
            className={`absolute -right-5 top-1/2 -translate-y-1/2 p-2 rounded-full glass-card hover:text-[var(--accent-primary)] transition-colors z-10 ${page === totalPages - 1 ? 'invisible' : ''}`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* 3 dots — active pill grows/shrinks with CSS transition */}
        <div className="flex items-center justify-center gap-2 mb-14">
          {[0, 1, 2].map((dot) => {
            const activeDot =
              page === 0 ? 0 :
              page === totalPages - 1 ? 2 :
              1;
            const isActive = dot === activeDot;
            return (
              <span
                key={dot}
                className={`h-2 rounded-full transition-all duration-300 ease-in-out ${isActive ? 'w-5 bg-[var(--accent-primary)]' : 'w-2 bg-[var(--text-muted)]'}`}
              />
            );
          })}
        </div>

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
