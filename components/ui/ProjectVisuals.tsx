'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Maximize2, X } from 'lucide-react';
import ComparisonSlider from '@/components/ui/ComparisonSlider';
import VideoEmbed from '@/components/ui/VideoEmbed';
import { parseVideo } from '@/lib/parseVideo';
import type { GalleryItem } from '@/types';

interface Props {
  gallery?: GalleryItem[];
  title: string;
}

function PlaceholderBox({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center aspect-video rounded-xl border border-dashed border-[var(--glass-border)] bg-[var(--bg-card)]">
      <p className="text-sm text-[var(--text-muted)] font-mono">{label}</p>
    </div>
  );
}

export default function ProjectVisuals({ gallery, title }: Props) {
  const [open, setOpen] = useState(false);
  const hasVisuals = Boolean(gallery && gallery.length > 0);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const visuals = (
    <>
      {gallery?.map((item, i) => {
        let media: React.ReactNode;
        if (item.type === 'compare') {
          media = item.url && item.urlB
            ? <ComparisonSlider wireframeUrl={item.url} renderUrl={item.urlB} title={item.label ?? title} heading={item.label} leftLabel={item.leftLabel} rightLabel={item.rightLabel} priority={i === 0} />
            : <PlaceholderBox label={item.label ?? 'Comparison coming soon'} />;
        } else if (item.type === 'video') {
          media = item.url
            ? <VideoEmbed {...parseVideo(item.url)} title={item.label ?? title} />
            : <PlaceholderBox label={item.label ?? 'Video coming soon'} />;
        } else {
          media = item.url
            ? (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[var(--glass-border)]">
                <Image src={item.url} alt={item.label ?? title} fill priority={i === 0} sizes="(max-width: 1024px) 100vw, 72vw" className="object-cover" />
              </div>
            )
            : <PlaceholderBox label={item.label ?? 'Image coming soon'} />;
        }
        const desc = item.caption ?? item.label;
        return (
          <figure key={i} className="space-y-2">
            {media}
            {desc && <figcaption className="text-xs text-[var(--text-muted)] leading-relaxed">{desc}</figcaption>}
          </figure>
        );
      })}

      {!hasVisuals && <PlaceholderBox label="Visuals coming soon" />}
    </>
  );

  return (
    <div className="relative">
      {hasVisuals && (
        <div className="sticky top-6 z-50 flex justify-end h-0">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Maximize visuals"
            title="View fullscreen"
            className="h-fit min-h-[32px] p-2 rounded-lg bg-[var(--bg-card)]/90 border border-[var(--glass-border)] backdrop-blur-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:border-[rgba(0,212,255,0.3)] transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      )}
      <div className="space-y-6">
        {visuals}
      </div>

      {open && (
        <div
          data-lenis-prevent
          className="fixed inset-0 z-[100] bg-black/95 overflow-y-auto"
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close fullscreen"
            title="Close (Esc)"
            className="fixed top-4 right-4 z-[110] p-2.5 rounded-lg glass-card text-white hover:text-[var(--accent-primary)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="min-h-screen flex flex-col justify-center max-w-6xl mx-auto p-6 gap-6">
            {visuals}
          </div>
        </div>
      )}
    </div>
  );
}
