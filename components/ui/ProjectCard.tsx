'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ArrowRight } from 'lucide-react';
import type { Project } from '@/types';

const categoryColors: Record<string, string> = {
  industrial: 'bg-[rgba(0,212,255,0.15)] text-[var(--accent-primary)]',
  product: 'bg-[rgba(123,47,247,0.15)] text-[#a78bfa]',
  stylized: 'bg-[rgba(255,165,0,0.15)] text-orange-400',
  medical: 'bg-[rgba(34,197,94,0.15)] text-emerald-400',
};

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

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const staticTitleRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const card = cardRef.current;
      const overlay = overlayRef.current;
      if (!card || !overlay) return;

      const onEnter = () => {
        gsap.to(overlay, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' });
        gsap.to(card, { scale: 1.03, duration: 0.3, ease: 'power2.out' });
        gsap.to(staticTitleRef.current, { opacity: 0, duration: 0.2 });
      };
      const onLeave = () => {
        gsap.to(overlay, { opacity: 0, y: 10, duration: 0.2 });
        gsap.to(card, { scale: 1, duration: 0.3, ease: 'power2.out' });
        gsap.to(staticTitleRef.current, { opacity: 1, duration: 0.2 });
      };

      card.addEventListener('mouseenter', onEnter);
      card.addEventListener('mouseleave', onLeave);

      return () => {
        card.removeEventListener('mouseenter', onEnter);
        card.removeEventListener('mouseleave', onLeave);
      };
    },
    { scope: cardRef }
  );

  return (
    <Link
      ref={cardRef}
      href={`/projects/${project.slug}`}
      className="relative rounded-xl overflow-hidden cursor-pointer aspect-[4/3] block"
      style={{ willChange: 'transform' }}
    >
      {project.thumbnail ? (
        <Image
          src={project.thumbnail}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0" style={{ background: placeholderGradients[project.category] }} />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      <div
        ref={overlayRef}
        className="absolute inset-0 glass-card flex flex-col justify-end p-6 opacity-0"
        style={{ transform: 'translateY(10px)' }}
      >
        <span
          className={`text-xs font-mono px-2 py-1 rounded-full w-fit mb-3 ${categoryColors[project.category]}`}
        >
          {categoryLabels[project.category]}
        </span>
        <h3 className="font-grotesk font-semibold text-lg text-white mb-1">{project.title}</h3>
        <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2">
          {project.description}
        </p>
        <span className="inline-flex items-center gap-2 text-sm text-[var(--accent-primary)] group-hover:gap-3 transition-all duration-200">
          View Case Study <ArrowRight className="w-4 h-4" />
        </span>
      </div>

      <div ref={staticTitleRef} className="absolute bottom-4 left-4">
        <h3 className="font-grotesk font-semibold text-sm text-white/80">{project.title}</h3>
      </div>
    </Link>
  );
}
