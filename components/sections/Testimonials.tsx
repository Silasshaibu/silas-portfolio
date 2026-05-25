import { Star } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import ScrollReveal from '@/components/animations/ScrollReveal';
import type { Testimonial } from '@/types';

const testimonials: Testimonial[] = [
  {
    id: '1',
    quote:
      "Silas delivered exactly what we needed — a complex conveyor animation that made our pitch instantly understandable. The quality was on par with much larger studios. We ordered two more projects right away.",
    name: 'Thomas K.',
    company: 'Manufacturing Client, Germany',
    platform: 'Fiverr',
    rating: 5,
  },
  {
    id: '2',
    quote:
      "The dental implant animation reduced our patient cancellation rate significantly. Patients now come in better informed and less anxious. Exceptional attention to anatomical detail.",
    name: 'Dr. Sarah M.',
    company: 'Dental Clinic Group, UAE',
    platform: 'Direct',
    rating: 5,
  },
  {
    id: '3',
    quote:
      "Our Kickstarter product CGI looked better than anything I've seen at this funding stage. Silas understood the brief immediately and delivered a cinematic reveal that blew past our funding goal.",
    name: 'James R.',
    company: 'Tech Startup, USA',
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
