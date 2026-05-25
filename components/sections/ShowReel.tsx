import SectionLabel from '@/components/ui/SectionLabel';
import VideoEmbed from '@/components/ui/VideoEmbed';
import ScrollReveal from '@/components/animations/ScrollReveal';

export default function ShowReel() {
  return (
    <section id="showreel" className="section-padding bg-[var(--bg-secondary)]">
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal className="text-center mb-12">
          <SectionLabel text="Selected Reel" />
          <h2 className="font-grotesk font-bold text-[clamp(1.8rem,4vw,3rem)] text-[var(--text-primary)]">
            Watch the Work Speak
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <VideoEmbed
            vimeoId="placeholder"
            title="Silas Shaibu — 3D Visualization Reel"
          />
        </ScrollReveal>

        <ScrollReveal delay={0.2} className="mt-10">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {['30+ Industrial Projects', 'Product Visualization', 'CGI & Motion'].map((stat) => (
              <span
                key={stat}
                className="px-5 py-2.5 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] text-sm font-mono text-[var(--text-secondary)]"
              >
                {stat}
              </span>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
