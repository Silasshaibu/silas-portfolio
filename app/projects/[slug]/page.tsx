import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react';
import { projects, getProjectBySlug, getAdjacentProjects } from '@/lib/projects';
import VideoEmbed from '@/components/ui/VideoEmbed';
import ComparisonSlider from '@/components/ui/ComparisonSlider';
import Button from '@/components/ui/Button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const project = getProjectBySlug(params.slug);
  if (!project) return {};
  return {
    title: `${project.title} | Silas Shaibu`,
    description: project.description,
  };
}

const processSteps = [
  'Concept',
  'Modeling',
  'Texturing',
  'Animation',
  'Rendering',
  'Delivery',
];

const categoryLabels: Record<string, string> = {
  industrial: 'Industrial & Engineering',
  product: 'Product Visualization',
  stylized: 'Stylized / Creative',
  medical: 'Medical & Dental',
};

const placeholderGradients: Record<string, string> = {
  industrial: 'linear-gradient(135deg, #0a1628 0%, #0d2137 50%, #091520 100%)',
  product: 'linear-gradient(135deg, #120a28 0%, #1e1037 50%, #0a0915 100%)',
  stylized: 'linear-gradient(135deg, #281a08 0%, #372510 50%, #150e04 100%)',
  medical: 'linear-gradient(135deg, #0a2818 0%, #0d3720 50%, #091508 100%)',
};

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = getProjectBySlug(params.slug);
  if (!project) notFound();

  const { prev, next } = getAdjacentProjects(params.slug);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[var(--bg-primary)] pt-16">
        {/* Hero */}
        <div
          className="relative h-[60vh] flex items-end overflow-hidden"
          style={{
            background: project.thumbnail
              ? `url(${project.thumbnail}) center/cover no-repeat`
              : placeholderGradients[project.category],
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/50 to-transparent" />
          <div className="relative z-10 max-w-5xl mx-auto px-6 pb-12 w-full">
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Projects
            </Link>
            <span className="inline-block px-3 py-1 text-xs font-mono rounded-full bg-[rgba(0,212,255,0.15)] text-[var(--accent-primary)] mb-3">
              {categoryLabels[project.category]}
            </span>
            <h1 className="font-grotesk font-bold text-[clamp(1.8rem,4vw,3rem)] text-white">
              {project.title}
            </h1>
            <p className="text-[var(--text-secondary)] mt-2">{project.client}</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-16 space-y-16">
          {/* Description */}
          <section>
            <p className="text-[var(--text-secondary)] text-lg leading-relaxed">{project.description}</p>
          </section>

          {/* Wireframe vs Render comparison slider */}
          {(project.wireframeUrl || project.renderUrl) && (
            <section>
              <ComparisonSlider
                wireframeUrl={project.wireframeUrl ?? ''}
                renderUrl={project.renderUrl ?? ''}
                title={project.title}
              />
            </section>
          )}

          {/* Challenge & Solution */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card rounded-xl p-6">
              <h2 className="font-grotesk font-semibold text-[var(--accent-primary)] text-sm font-mono tracking-widest uppercase mb-4">
                The Challenge
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">{project.challenge}</p>
            </div>
            <div className="glass-card rounded-xl p-6">
              <h2 className="font-grotesk font-semibold text-[var(--accent-primary)] text-sm font-mono tracking-widest uppercase mb-4">
                The Solution
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">{project.solution}</p>
            </div>
          </section>

          {/* Process timeline */}
          <section>
            <h2 className="font-grotesk font-bold text-xl text-[var(--text-primary)] mb-8">Process</h2>
            <div className="flex flex-wrap md:flex-nowrap items-center gap-2">
              {processSteps.map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full border border-[rgba(0,212,255,0.4)] bg-[rgba(0,212,255,0.08)] flex items-center justify-center">
                      <span className="text-xs font-mono text-[var(--accent-primary)]">{i + 1}</span>
                    </div>
                    <span className="text-xs text-[var(--text-muted)] mt-1 whitespace-nowrap">{step}</span>
                  </div>
                  {i < processSteps.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-[var(--text-muted)] mb-4 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Video */}
          {project.videoUrl && (
            <section>
              <h2 className="font-grotesk font-bold text-xl text-[var(--text-primary)] mb-6">
                Project Video
              </h2>
              <VideoEmbed vimeoId="placeholder" title={project.title} />
            </section>
          )}

          {/* Tools */}
          <section>
            <h2 className="font-grotesk font-bold text-xl text-[var(--text-primary)] mb-6">
              Tools Used
            </h2>
            <div className="flex flex-wrap gap-3">
              {project.tools.map((tool) => (
                <span
                  key={tool}
                  className="px-4 py-2 text-sm font-mono rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--text-secondary)]"
                >
                  {tool}
                </span>
              ))}
            </div>
          </section>

          {/* Result */}
          <section className="glass-card rounded-xl p-8">
            <h2 className="font-grotesk font-semibold text-[var(--accent-primary)] text-sm font-mono tracking-widest uppercase mb-4">
              The Result
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed text-lg">{project.result}</p>
          </section>

          {/* Prev / Next navigation */}
          <nav className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prev ? (
              <Link
                href={`/projects/${prev.slug}`}
                className="glass-card rounded-xl p-5 hover:border-[rgba(0,212,255,0.2)] transition-all duration-200 group"
              >
                <p className="text-xs font-mono text-[var(--text-muted)] mb-1">← Previous</p>
                <p className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                  {prev.title}
                </p>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                href={`/projects/${next.slug}`}
                className="glass-card rounded-xl p-5 hover:border-[rgba(0,212,255,0.2)] transition-all duration-200 group text-right"
              >
                <p className="text-xs font-mono text-[var(--text-muted)] mb-1">Next →</p>
                <p className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                  {next.title}
                </p>
              </Link>
            ) : (
              <div />
            )}
          </nav>

          {/* Bottom CTA */}
          <section className="text-center py-8">
            <h2 className="font-grotesk font-bold text-2xl text-[var(--text-primary)] mb-4">
              Like this work? Let&apos;s talk.
            </h2>
            <Button variant="primary" href="/#contact">
              Start a Project
            </Button>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
