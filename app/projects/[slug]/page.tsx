import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { projects, getProjectBySlug, getAdjacentProjects } from '@/lib/projects';
import VideoEmbed from '@/components/ui/VideoEmbed';
import ComparisonSlider from '@/components/ui/ComparisonSlider';
import Button from '@/components/ui/Button';
import Navbar from '@/components/layout/Navbar';

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = getProjectBySlug(params.slug);
  if (!project) return {};
  return {
    title: `${project.title} | Silas Shaibu`,
    description: project.description,
  };
}

const categoryLabels: Record<string, string> = {
  industrial: 'Industrial & Engineering',
  product: 'Product Visualization',
  stylized: 'Stylized / Creative',
  medical: 'Medical & Dental',
};

const categoryColors: Record<string, string> = {
  industrial: 'bg-[rgba(0,212,255,0.15)] text-[var(--accent-primary)]',
  product: 'bg-[rgba(123,47,247,0.15)] text-[#a78bfa]',
  stylized: 'bg-[rgba(255,165,0,0.15)] text-orange-400',
  medical: 'bg-[rgba(34,197,94,0.15)] text-emerald-400',
};

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = getProjectBySlug(params.slug);
  if (!project) notFound();

  const { prev, next } = getAdjacentProjects(params.slug);
  const hasVisuals = project.wireframeUrl || project.renderUrl || project.videoUrl;

  return (
    <>
      <Navbar />
      <main className="bg-[var(--bg-primary)] pt-16 lg:overflow-hidden">

        {/* Two-column layout — each panel scrolls independently */}
        <div className="flex flex-col lg:flex-row lg:h-[calc(100vh-4rem)]">

          {/* ── Left sidebar: text & metadata ── */}
          <aside data-lenis-prevent className="lg:w-[28%] lg:h-full lg:overflow-y-auto border-b lg:border-b-0 lg:border-r border-[var(--border-subtle)] order-2 lg:order-1">
            <div className="p-6 space-y-6">

              {/* Back + category */}
              <div className="space-y-3">
                <Link
                  href="/#projects"
                  className="inline-flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back To Projects
                </Link>
                <div>
                  <span className={`text-xs font-mono px-2 py-1 rounded-full ${categoryColors[project.category]}`}>
                    {categoryLabels[project.category]}
                  </span>
                </div>
                <h1 className="font-grotesk font-bold text-xl text-[var(--text-primary)] leading-tight">
                  {project.title}
                </h1>
                <p className="text-xs text-[var(--text-muted)] font-mono">{project.client}</p>
              </div>

              {/* Description */}
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {project.description}
              </p>

              <div className="border-t border-[var(--border-subtle)]" />

              {/* Challenge */}
              {project.challenge && (
                <div className="border border-dashed border-[var(--glass-border)] rounded-xl p-4 space-y-2">
                  <h2 className="text-xs font-mono text-[var(--accent-primary)] tracking-widest uppercase">
                    The Challenge
                  </h2>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{project.challenge}</p>
                </div>
              )}

              {/* Solution */}
              {project.solution && (
                <div className="border border-dashed border-[var(--glass-border)] rounded-xl p-4 space-y-2">
                  <h2 className="text-xs font-mono text-[var(--accent-primary)] tracking-widest uppercase">
                    The Solution
                  </h2>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{project.solution}</p>
                </div>
              )}

              {/* Result */}
              {project.result && (
                <div className="border border-dashed border-[var(--glass-border)] rounded-xl p-4 space-y-2">
                  <h2 className="text-xs font-mono text-[var(--accent-primary)] tracking-widest uppercase">
                    The Result
                  </h2>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{project.result}</p>
                </div>
              )}

              {/* Tools */}
              {project.tools.length > 0 && (
                <div className="space-y-2">
                  <h2 className="text-xs font-mono text-[var(--text-muted)] tracking-widest uppercase">Tools</h2>
                  <div className="flex flex-wrap gap-2">
                    {project.tools.map((tool) => (
                      <span
                        key={tool}
                        className="px-2.5 py-1 text-xs font-mono rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--text-secondary)]"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* ── Right panel: visuals ── */}
          <div data-lenis-prevent className="lg:w-[72%] lg:h-full lg:overflow-y-auto order-1 lg:order-2">
            <div className="p-6 space-y-6">

              {/* Comparison slider */}
              {(project.wireframeUrl && project.renderUrl) && (
                <ComparisonSlider
                  wireframeUrl={project.wireframeUrl}
                  renderUrl={project.renderUrl}
                  title={project.title}
                />
              )}

              {/* Video */}
              {project.videoUrl && (
                <VideoEmbed vimeoId={project.videoUrl.split('/').pop() ?? ''} title={project.title} />
              )}

              {/* Placeholder if no visuals yet */}
              {!hasVisuals && (
                <div className="flex items-center justify-center aspect-video rounded-xl border border-dashed border-[var(--glass-border)] bg-[var(--bg-card)]">
                  <p className="text-sm text-[var(--text-muted)] font-mono">Visuals coming soon</p>
                </div>
              )}

              {/* Up Next nav */}
              <nav className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
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
                ) : <div />}
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
                ) : <div />}
              </nav>

              {/* CTA */}
              <div className="text-center py-8 border-t border-[var(--border-subtle)]">
                <h2 className="font-grotesk font-bold text-2xl text-[var(--text-primary)] mb-4">
                  Like this work? Let&apos;s talk.
                </h2>
                <Button variant="primary" href="/#contact">Start a Project</Button>
              </div>

              {/* Minimal footer */}
              <p className="text-center text-xs text-[var(--text-muted)] font-mono pb-2">
                © {new Date().getFullYear()} Silas Shaibu. All rights reserved.
              </p>
            </div>
          </div>
        </div>

      </main>
    </>
  );
}
