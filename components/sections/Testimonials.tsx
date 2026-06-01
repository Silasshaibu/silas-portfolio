import { Star } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import ScrollReveal from '@/components/animations/ScrollReveal';
import type { Testimonial } from '@/types';

const testimonials: Testimonial[] = [
  {
    id: '1',
    quote:
      "Silas did an OUTSTANDING job with the character modeling — his professionalism and attention to detail truly stood out. Working with him was a breeze thanks to his deep understanding, proactive communication, and seamless cooperation. Highly recommend!",
    name: 'rawnugget',
    company: 'Character Modeling · Switzerland',
    platform: 'Fiverr',
    rating: 5,
  },
  {
    id: '2',
    quote:
      "Silas met and exceeded all expectations. His communication and patience was well and he actively followed up to clarify and make changes. It was a complex project that he handled with great diligence. I would highly recommend Silas as he has done an excellent job and delivers great value at a very reasonable price point to help advance my ideas to reality.",
    name: 'aameko',
    company: 'Character Modeling · United States',
    platform: 'Fiverr',
    rating: 5,
  },
  {
    id: '3',
    quote:
      "Silas is a very patient person — he did an amazing job, well beyond what I expected. He changed the design twice and even made a video to describe how to work with the file and measurements. If you have an idea and need to see it work, this is the guy, no doubts!",
    name: 'omriliberman',
    company: '3D Product Animation · Israel',
    platform: 'Fiverr',
    rating: 5,
  },
];

const platformColors: Record<string, string> = {
  Fiverr: 'bg-[rgba(29,191,115,0.1)] text-[#1dbf73]',
  LinkedIn: 'bg-[rgba(10,102,194,0.1)] text-[#0a66c2]',
  Direct: 'bg-[rgba(0,212,255,0.1)] text-[var(--accent-primary)]',
};

export default function Testimonials() {
  return (
    <section className="section-padding bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal className="text-center mb-14">
          <SectionLabel text="Social Proof" />
          <h2 className="font-grotesk font-bold text-[clamp(1.8rem,4vw,3rem)] text-[var(--text-primary)]">
            Trusted by Clients Globally
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.id} delay={i * 0.1}>
              <div className="glass-card rounded-xl p-6 h-full flex flex-col">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[var(--accent-primary)] text-[var(--accent-primary)]" />
                  ))}
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed flex-1 mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{t.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{t.company}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-mono ${platformColors[t.platform]}`}>
                    {t.platform}
                  </span>
                </div>
              </div>
            </ScrollReveal>
          ))}
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
