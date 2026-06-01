import SectionLabel from '@/components/ui/SectionLabel';
import ServiceCard from '@/components/ui/ServiceCard';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { dbGetPublicServices } from '@/lib/admin-db';
import { services as fallback } from '@/lib/services';

export default async function Services() {
  let items = [];
  try {
    const rows = await dbGetPublicServices();
    items = rows.length > 0
      ? rows.map((r: Record<string, unknown>) => ({ id: String(r.id), icon: String(r.icon ?? ''), title: String(r.title ?? ''), description: String(r.description ?? '') }))
      : fallback;
  } catch {
    items = fallback;
  }

  return (
    <section id="services" className="section-padding bg-[var(--bg-secondary)] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-[var(--accent-primary)] opacity-[0.03] blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <ScrollReveal className="text-center mb-14">
          <SectionLabel text="What I Do" />
          <h2 className="font-grotesk font-bold text-[clamp(1.8rem,4vw,3rem)] text-[var(--text-primary)]">
            Services Built Around Your Vision
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(items as { id: string; icon: string; title: string; description: string }[]).map((service, i) => (
            <ScrollReveal key={service.id} delay={i * 0.1}>
              <ServiceCard service={service} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
