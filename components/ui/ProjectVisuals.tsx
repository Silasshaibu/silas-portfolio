'use client';

import { useState, useEffect } from 'react';
import { Maximize2, X } from 'lucide-react';
import ComparisonSlider from '@/components/ui/ComparisonSlider';
import VideoEmbed from '@/components/ui/VideoEmbed';
import type { GalleryItem } from '@/types';

interface Props {
  wireframeUrl?: string;
  renderUrl?: string;
  videoUrl?: string;
  gallery?: GalleryItem[];
  title: string;
}

function parseVideo(url: string): { vimeoId?: string; youtubeId?: string; thumbnailUrl?: string } {
  if (/youtu\.?be/.test(url)) {
    const id = url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/)?.[1] ?? '';
    return { youtubeId: id, thumbnailUrl: id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : undefined };
  }
  return { vimeoId: url.split('/').pop() ?? '' };
}

function PlaceholderBox({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center aspect-video rounded-xl border border-dashed border-[var(--glass-border)] bg-[var(--bg-card)]">
      <p className="text-sm text-[var(--text-muted)] font-mono">{label}</p>
    </div>
  );
}

export default function ProjectVisuals({ wireframeUrl, renderUrl, videoUrl, gallery, title }: Props) {
  const [open, setOpen] = useState(false);
  const hasVisuals = Boolean((wireframeUrl && renderUrl) || videoUrl || (gallery && gallery.length > 0));

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
      {wireframeUrl && renderUrl && (
        <ComparisonSlider wireframeUrl={wireframeUrl} renderUrl={renderUrl} title={title} />
      )}
      {videoUrl && (
        <VideoEmbed {...parseVideo(videoUrl)} title={title} />
      )}

      {/* Extra gallery sections (images + videos + comparisons) */}
      {gallery?.map((item, i) => {
        if (item.type === 'compare') {
          return item.url && item.urlB
            ? <ComparisonSlider key={i} wireframeUrl={item.url} renderUrl={item.urlB} title={item.label ?? title} heading={item.label} leftLabel={item.leftLabel} rightLabel={item.rightLabel} />
            : <PlaceholderBox key={i} label={item.label ?? 'Comparison coming soon'} />;
        }
        if (item.type === 'video') {
          return item.url
            ? <VideoEmbed key={i} {...parseVideo(item.url)} title={item.label ?? title} />
            : <PlaceholderBox key={i} label={item.label ?? 'Video coming soon'} />;
        }
        return item.url
          // eslint-disable-next-line @next/next/no-img-element
          ? <img key={i} src={item.url} alt={item.label ?? title} className="w-full rounded-xl border border-[var(--glass-border)]" />
          : <PlaceholderBox key={i} label={item.label ?? 'Image coming soon'} />;
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
