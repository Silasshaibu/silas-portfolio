'use client';

import { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { gsap } from 'gsap';
import SectionLabel from '@/components/ui/SectionLabel';
import ProjectCard from '@/components/ui/ProjectCard';
import ScrollReveal from '@/components/animations/ScrollReveal';
import type { Project, ProjectCategory } from '@/types';

type FilterCategory = 'all' | ProjectCategory;

const tabs: { label: string; value: FilterCategory }[] = [
  { label: 'All', value: 'all' },
  { label: 'Industrial & Engineering', value: 'industrial' },
  { label: 'Product Visualization', value: 'product' },
  { label: 'Stylized / Creative', value: 'stylized' },
  { label: 'Medical & Dental', value: 'medical' },
];

export default function ProjectsClient({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<FilterCategory>('all');
  const tabsRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);

  const filtered = active === 'all' ? projects : projects.filter((p) => p.category === active);

  const handleTabClick = (value: FilterCategory, el: HTMLButtonElement) => {
    setActive(value);
    const indicator = indicatorRef.current;
    if (!indicator) return;
    gsap.to(indicator, {
      left: el.offsetLeft,
      width: el.offsetWidth,
      duration: 0.3,
      ease: 'power3.out',
    });
  };

  return (
    <section id="projects" className="section-padding bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal className="mb-4 md:mb-12">
          <SectionLabel text="Work" />
          <h2 className="font-grotesk font-bold text-[clamp(1.8rem,4vw,3rem)] text-[var(--text-primary)]">
            Selected Projects
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1} className="mb-0 md:mb-10">
          <div
            ref={tabsRef}
            className="relative flex gap-2 overflow-x-auto lg:overflow-visible lg:gap-0 lg:inline-flex border border-[var(--glass-border)] rounded-xl p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <span
              ref={indicatorRef}
              className="hidden lg:block absolute top-1 bottom-1 rounded-lg bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.2)] transition-none"
              style={{ left: 4, width: 48 }}
            />
            {tabs.map((tab) => (
              <button
                type="button"
                key={tab.value}
                onClick={(e) => handleTabClick(tab.value, e.currentTarget)}
                className={`relative z-10 flex-shrink-0 px-4 py-2 text-sm rounded-lg transition-colors duration-200 whitespace-nowrap ${
                  active === tab.value
                    ? 'text-[var(--accent-primary)] font-medium'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </ScrollReveal>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
