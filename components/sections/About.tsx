import Image from 'next/image';
import SectionLabel from '@/components/ui/SectionLabel';
import Button from '@/components/ui/Button';
import ScrollReveal from '@/components/animations/ScrollReveal';

const DEFAULT_SKILLS = ['Blender', 'After Effects', 'Product Visualization', 'Industrial Animation', 'Medical Animation', 'Motion Graphics'];

interface AboutProps {
  headline?: string;
  bio1?: string;
  bio2?: string;
  bio3?: string;
  skills?: string[];
  pdfUrl?: string;
  profilePhoto?: string;
}

export default function About({ headline, bio1, bio2, bio3, skills, pdfUrl, profilePhoto }: AboutProps) {
  const displayHeadline = headline || 'Engineering Thinking. Cinematic Vision.';
  const displayBio1 = bio1 || "I'm Silas Shaibu — a 3D visualization artist who sits at the intersection of technical understanding and creative storytelling. I specialize in helping manufacturers, engineering firms, and product brands communicate complex ideas through high-end animation and CGI.";
  const displayBio2 = bio2 || "With deep expertise in Blender and an engineering-informed workflow, I bring industrial accuracy to every frame — whether it's a conveyor system animation, a product launch reveal, or a medical explainer.";
  const displayBio3 = bio3 || 'My background in dental studies adds a unique edge in medical visualization — an increasingly high-value niche in the 3D world.';
  const displaySkills = (skills && skills.length > 0) ? skills : DEFAULT_SKILLS;
  const displayPdfUrl = pdfUrl || '/api/portfolio-pdf';

  const [headlineMain, headlineAccent] = displayHeadline.includes('.')
    ? [displayHeadline.split('.')[0].trim() + '.', displayHeadline.split('.').slice(1).join('.').trim()]
    : [displayHeadline, ''];

  return (
    <section id="about" className="section-padding bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal>
            <SectionLabel text="About" />
            <h2 className="font-grotesk font-bold text-[clamp(1.8rem,4vw,3rem)] text-[var(--text-primary)] mb-6 leading-tight">
              {headlineMain}{' '}
              {headlineAccent && <span className="gradient-text">{headlineAccent}</span>}
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed mb-8">
              {displayBio1 && <p>{displayBio1}</p>}
              {displayBio2 && <p>{displayBio2}</p>}
              {displayBio3 && <p>{displayBio3}</p>}
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {displaySkills.map((skill) => (
                <span key={skill} className="px-3 py-1.5 text-xs font-mono rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--text-secondary)]">
                  {skill}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Button variant="outline" href={displayPdfUrl}>Download Portfolio PDF</Button>
              <Button variant="primary" href="#projects">View All Projects</Button>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2} className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-72 h-80 rounded-2xl bg-[var(--bg-card)] border border-[var(--glass-border)] overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-[rgba(0,212,255,0.1)] border-2 border-[rgba(0,212,255,0.3)] mx-auto mb-4 overflow-hidden flex items-center justify-center relative">
                      <span className="font-grotesk font-bold text-2xl text-[var(--accent-primary)] absolute select-none">SS</span>
                      <Image
                        src={profilePhoto || '/profile.jpg'}
                        alt="Silas Shaibu"
                        fill
                        className="object-cover object-top relative"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                    <p className="font-grotesk font-semibold text-[var(--text-primary)]">Silas Shaibu</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1">3D Visualization Artist</p>
                  </div>
                </div>
              </div>
              <div className="absolute -inset-1 rounded-2xl border border-[rgba(0,212,255,0.2)] animate-pulse-glow pointer-events-none" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full bg-[var(--accent-secondary)] opacity-10 blur-3xl pointer-events-none" />
              <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-[var(--accent-primary)] opacity-10 blur-2xl pointer-events-none" />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
