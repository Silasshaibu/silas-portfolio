import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { projects, getProjectBySlug, getAdjacentProjects } from '@/lib/projects';
import { dbGetProjectBySlug, dbGetProjects, mapDbProject } from '@/lib/admin-db';
import ProjectVisuals from '@/components/ui/ProjectVisuals';
import Button from '@/components/ui/Button';
import Navbar from '@/components/layout/Navbar';
import type { Project } from '@/types';

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

// DB-first with static fallback.
async function loadProject(slug: string): Promise<Project | null> {
  try {
    const row = await dbGetProjectBySlug(slug);
    if (row) return mapDbProject(row as Record<string, unknown>);
  } catch { /* fall back */ }
  return getProjectBySlug(slug) ?? null;
}

async function loadAdjacent(slug: string): Promise<{ prev: Project | null; next: Project | null }> {
  try {
    const rows = await dbGetProjects();
    if (rows.length > 0) {
      const list = rows.map((r) => mapDbProject(r as Record<string, unknown>));
      const i = list.findIndex((p) => p.slug === slug);
      if (i !== -1) return { prev: i > 0 ? list[i - 1] : null, next: i < list.length - 1 ? list[i + 1] : null };
    }
  } catch { /* fall back */ }
  return getAdjacentProjects(slug);
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = await loadProject(params.slug);
  if (!project) return {};
  return {
    title: `${project.title} | Silas Shaibu`,
    description: project.description,
  };
}

const processSteps = ['Concept', 'Modeling', 'Texturing', 'Animation', 'Rendering', 'Delivery'];

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

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await loadProject(params.slug);
  if (!project) notFound();

  const { prev, next } = await loadAdjacent(params.slug);
  // Hide draft gallery items from the live site.
  const publicGallery = (project.gallery ?? []).filter((item) => !item.draft);

  return (
    <>
      <Navbar />
      <main className="bg-[var(--bg-primary)] pt-16 lg:h-screen lg:flex lg:flex-col lg:overflow-hidden">

        {/* ── Top bar: Back (left) + Prev/Next (right) ── */}
        <div className="flex-shrink-0 border-b border-[var(--border-subtle)] px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back To Projects
            </Link>
            <nav className="flex gap-3">
              {prev ? (
                <Link
                  href={`/projects/${prev.slug}`}
                  className="glass-card rounded-xl px-4 py-2 w-44 sm:w-52 hover:border-[rgba(0,212,255,0.2)] transition-all duration-200 group"
                >
                  <p className="text-[10px] font-mono text-[var(--text-muted)]">← Previous</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors truncate">
                    {prev.title}
                  </p>
                </Link>
              ) : <div />}
              {next ? (
                <Link
                  href={`/projects/${next.slug}`}
                  className="glass-card rounded-xl px-4 py-2 w-44 sm:w-52 hover:border-[rgba(0,212,255,0.2)] transition-all duration-200 group text-right"
                >
                  <p className="text-[10px] font-mono text-[var(--text-muted)]">Next →</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors truncate">
                    {next.title}
                  </p>
                </Link>
              ) : <div />}
            </nav>
          </div>
        </div>

        {/* Two-column layout — each panel scrolls independently */}
        <div className="flex flex-col lg:flex-row lg:flex-1 lg:min-h-0">

          {/* ── Left sidebar: text & metadata ── */}
          <aside data-lenis-prevent className="lg:w-[28%] lg:h-full lg:overflow-y-auto border-b lg:border-b-0 lg:border-r border-[var(--border-subtle)] order-2 lg:order-1">
            <div className="p-6 space-y-6">

              {/* Category */}
              <div className="space-y-3">
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

              {/* Process */}
              <div className="space-y-3">
                <h2 className="text-xs font-mono text-[var(--text-muted)] tracking-widest uppercase">Process</h2>
                <ol className="space-y-3">
                  {processSteps.map((step, i) => (
                    <li key={step} className="flex items-center gap-3">
                      <span className="w-6 h-6 flex-shrink-0 rounded-full border border-[rgba(0,212,255,0.4)] bg-[rgba(0,212,255,0.08)] flex items-center justify-center text-xs font-mono text-[var(--accent-primary)]">
                        {i + 1}
                      </span>
                      <span className="text-sm text-[var(--text-secondary)]">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </aside>

          {/* ── Right panel: visuals ── */}
          <div data-lenis-prevent className="lg:w-[72%] lg:h-full lg:overflow-y-auto order-1 lg:order-2">
            <div className="p-6 space-y-6">

              {/* Visuals (slider + video) with fullscreen lightbox */}
              <ProjectVisuals
                wireframeUrl={project.wireframeUrl}
                renderUrl={project.renderUrl}
                videoUrl={project.videoUrl}
                gallery={publicGallery}
                title={project.title}
              />

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
